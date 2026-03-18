import io
import json
import re
import sqlite3
from datetime import datetime
from typing import Any, Dict, List, Optional, Tuple

import pandas as pd
import streamlit as st
from openai import OpenAI


st.set_page_config(page_title="HoopAI", layout="wide")
st.title("🏀 HoopAI｜专业场边记录员工作台")

GROQ_BASE_URL = "https://api.groq.com/openai/v1"
QWEN_BASE_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1"
DB_PATH = "hoopai.db"


PBP_ACTIONS: List[str] = [
    "+3分",
    "+2分",
    "+1罚球",
    "打铁(三分)",
    "打铁(两分)",
    "前场板",
    "后场板",
    "助攻",
    "抢断",
    "失误",
    "犯规",
]

PBP_EXTRACT_SYSTEM_PROMPT = (
    "你是一个专业的篮球场边记录员，熟悉中文口语与篮球黑话（如：打铁=没进、火锅=盖帽）。\n"
    "任务：把用户给的赛况口述提取为“逐回合动作” JSON 数组。\n"
    "你必须只输出 JSON 数组，禁止输出 ```json、禁止解释。\n"
    "每个元素必须是对象，字段：\n"
    '- player: 球员（尽量输出标准姓名；若不确定也要输出原文 token）\n'
    f'- action: 动作（必须从以下集合里选择其一：{PBP_ACTIONS}；如果口述提到“盖帽/火锅”，动作用“抢断”不合适，请尽量归为“打铁(两分)”或“打铁(三分)”；如果仍无法归类，用“失误”）\n'
    "- quarter: 比赛节数（Q1/Q2/Q3/Q4/OT；若文本未提及，留空字符串）\n"
    "- ts: 事件时间戳（若未提及，留空字符串；不要编造具体时间）\n"
    "输出示例：\n"
    '[{"player":"张三","action":"+3分","quarter":"Q1","ts":""}]'
)


def get_db_conn() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.execute("PRAGMA journal_mode=WAL;")
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS match_logs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          created_at TEXT NOT NULL DEFAULT (datetime('now','localtime')),
          input_text TEXT NOT NULL,
          stats_json TEXT NOT NULL,
          summary_text TEXT
        );
        """
    )
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS players (
          name TEXT PRIMARY KEY,
          number INTEGER,
          nickname TEXT
        );
        """
    )
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS play_by_play (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          created_at TEXT NOT NULL DEFAULT (datetime('now','localtime')),
          quarter TEXT NOT NULL,
          player TEXT NOT NULL,
          action TEXT NOT NULL,
          ts TEXT
        );
        """
    )
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS app_settings (
          k TEXT PRIMARY KEY,
          v TEXT
        );
        """
    )
    conn.commit()
    return conn


def clean_json_array_text(raw: str) -> str:
    if raw is None:
        return ""
    text = raw.strip()
    fence = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text, flags=re.IGNORECASE)
    if fence:
        text = fence.group(1).strip()
    text = re.sub(r"^\s*json\s*", "", text, flags=re.IGNORECASE).strip()
    i = text.find("[")
    j = text.rfind("]")
    if i != -1 and j != -1 and j > i:
        text = text[i : j + 1].strip()
    return text


def now_local_ts() -> str:
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def _norm_name(s: str) -> str:
    return re.sub(r"\s+", "", (s or "").strip()).lower()


def load_roster_df() -> pd.DataFrame:
    conn = get_db_conn()
    try:
        df = pd.read_sql_query("SELECT name, number, nickname FROM players ORDER BY COALESCE(number, 9999), name;", conn)
    finally:
        conn.close()
    if df is None or df.empty:
        return pd.DataFrame(columns=["name", "number", "nickname"])
    df["name"] = df["name"].fillna("").astype(str).str.strip()
    df["nickname"] = df["nickname"].fillna("").astype(str).str.strip()
    df["number"] = pd.to_numeric(df["number"], errors="coerce").astype("Int64")
    return df


def save_roster_df(df: pd.DataFrame) -> Tuple[bool, str]:
    if df is None:
        return False, "队员名单为空。"
    d = df.copy()
    for c in ("name", "number", "nickname"):
        if c not in d.columns:
            d[c] = None
    d["name"] = d["name"].fillna("").astype(str).str.strip()
    d["nickname"] = d["nickname"].fillna("").astype(str).str.strip()
    d["number"] = pd.to_numeric(d["number"], errors="coerce").astype("Int64")
    d = d[d["name"] != ""].copy()

    names_norm = d["name"].map(_norm_name)
    if names_norm.duplicated().any():
        dup = d.loc[names_norm.duplicated(keep=False), "name"].tolist()
        return False, f"队员姓名重复：{', '.join(sorted(set(dup)))}"

    nums = d["number"].dropna().astype(int)
    if nums.duplicated().any():
        dupn = sorted(set(nums[nums.duplicated(keep=False)].tolist()))
        return False, f"队员号码重复：{', '.join(str(x) for x in dupn)}"

    conn = get_db_conn()
    try:
        conn.execute("DELETE FROM players;")
        conn.executemany(
            "INSERT INTO players (name, number, nickname) VALUES (?, ?, ?);",
            [(r["name"], int(r["number"]) if pd.notna(r["number"]) else None, r["nickname"] or None) for _, r in d.iterrows()],
        )
        conn.commit()
    finally:
        conn.close()
    return True, "队员名单已保存。"


def resolve_player_to_name_number(token: str, roster_df: pd.DataFrame) -> Tuple[str, Optional[int]]:
    raw = (token or "").strip()
    if not raw:
        return "unknown_player", None

    roster = roster_df.copy() if roster_df is not None else pd.DataFrame(columns=["name", "number", "nickname"])
    for c in ("name", "number", "nickname"):
        if c not in roster.columns:
            roster[c] = None
    roster["name"] = roster["name"].fillna("").astype(str).str.strip()
    roster["nickname"] = roster["nickname"].fillna("").astype(str).str.strip()
    roster["number"] = pd.to_numeric(roster["number"], errors="coerce").astype("Int64")

    norm = _norm_name(raw)

    # 1) 精确匹配姓名/外号
    if not roster.empty:
        m1 = roster[roster["name"].map(_norm_name) == norm]
        if not m1.empty:
            n = m1.iloc[0]["number"]
            return m1.iloc[0]["name"], (int(n) if pd.notna(n) else None)
        # nickname 支持多个别名：用 , / ， / / / 空格分隔
        def _nick_matches(nick: str) -> bool:
            parts = [p for p in re.split(r"[,\uFF0C/、\s]+", nick or "") if p.strip()]
            return any(_norm_name(p) == norm for p in parts)

        m2 = roster[roster["nickname"].apply(_nick_matches)]
        if not m2.empty:
            n = m2.iloc[0]["number"]
            return m2.iloc[0]["name"], (int(n) if pd.notna(n) else None)

    # 2) 号码： "12" / "12号" / "#12"
    m = re.search(r"(?<!\d)(\d{1,3})(?!\d)", raw)
    if m and not roster.empty:
        try:
            num = int(m.group(1))
            m3 = roster[roster["number"].fillna(-1).astype(int) == num]
            if not m3.empty:
                return m3.iloc[0]["name"], num
        except Exception:
            pass

    return raw, None


def normalize_pbp_items(items: Any, roster_df: pd.DataFrame, default_quarter: str) -> List[Dict[str, Any]]:
    if not isinstance(items, list):
        return []
    out: List[Dict[str, Any]] = []
    for it in items:
        if not isinstance(it, dict):
            continue
        player_token = str(it.get("player", "") or "").strip()
        action = str(it.get("action", "") or "").strip()
        quarter = str(it.get("quarter", "") or "").strip().upper()
        ts = str(it.get("ts", "") or "").strip()
        if not quarter:
            quarter = default_quarter
        if quarter not in ("Q1", "Q2", "Q3", "Q4", "OT"):
            quarter = default_quarter
        if action not in PBP_ACTIONS:
            action = "失误"

        resolved_name, _ = resolve_player_to_name_number(player_token, roster_df)
        out.append(
            {
                "quarter": quarter,
                "player": resolved_name or "unknown_player",
                "action": action,
                "ts": ts,
                "logged_at": now_local_ts(),
            }
        )
    return out


def pbp_to_df(pbp: List[Dict[str, Any]]) -> pd.DataFrame:
    cols = ["quarter", "player", "action", "ts", "logged_at"]
    if not pbp:
        return pd.DataFrame(columns=cols)
    df = pd.DataFrame(pbp)
    for c in cols:
        if c not in df.columns:
            df[c] = ""
    return df[cols]


def build_pbp_column_config() -> Dict[str, Any]:
    return {
        "quarter": st.column_config.SelectboxColumn("节数", options=["Q1", "Q2", "Q3", "Q4", "OT"], required=True),
        "player": st.column_config.TextColumn("球员", required=True),
        "action": st.column_config.SelectboxColumn("动作", options=PBP_ACTIONS, required=True),
        "ts": st.column_config.TextColumn("口述时间/回合标记（可空）"),
        "logged_at": st.column_config.TextColumn("记录时间", disabled=True),
    }


def build_roster_column_config() -> Dict[str, Any]:
    return {
        "name": st.column_config.TextColumn(label="队员姓名", required=True),
        "number": st.column_config.NumberColumn(label="球衣号码", min_value=0, step=1, format="%d"),
        "nickname": st.column_config.TextColumn(label="外号/别名（可多个，用逗号/空格分隔）"),
    }


def load_setting(key: str) -> str:
    conn = get_db_conn()
    try:
        cur = conn.execute("SELECT v FROM app_settings WHERE k = ?;", (key,))
        row = cur.fetchone()
        return (row[0] if row else "") or ""
    finally:
        conn.close()


def save_setting(key: str, value: str) -> None:
    conn = get_db_conn()
    try:
        conn.execute(
            "INSERT INTO app_settings (k, v) VALUES (?, ?) ON CONFLICT(k) DO UPDATE SET v = excluded.v;",
            (key, value or ""),
        )
        conn.commit()
    finally:
        conn.close()


def clear_setting(key: str) -> None:
    conn = get_db_conn()
    try:
        conn.execute("DELETE FROM app_settings WHERE k = ?;", (key,))
        conn.commit()
    finally:
        conn.close()


with st.sidebar:
    st.subheader("🔐 双 API 配置")
    if "groq_api_key" not in st.session_state:
        st.session_state.groq_api_key = load_setting("groq_api_key")
    if "qwen_api_key" not in st.session_state:
        st.session_state.qwen_api_key = load_setting("qwen_api_key")

    def _persist_groq() -> None:
        save_setting("groq_api_key", st.session_state.get("groq_api_key", "") or "")

    def _persist_qwen() -> None:
        save_setting("qwen_api_key", st.session_state.get("qwen_api_key", "") or "")

    groq_key = st.text_input(
        "Groq API Key",
        type="password",
        placeholder="gsk_...",
        key="groq_api_key",
        on_change=_persist_groq,
    )
    qwen_key = st.text_input(
        "通义千问 API Key",
        type="password",
        placeholder="sk-...",
        key="qwen_api_key",
        on_change=_persist_qwen,
    )
    st.caption("说明：Groq 仅用于 Whisper ASR；通义千问用于赛况 JSON 抽取与赛后复盘。")
    if st.button("🗑️ 清除本机已保存的 Key", use_container_width=True):
        clear_setting("groq_api_key")
        clear_setting("qwen_api_key")
        st.session_state.groq_api_key = ""
        st.session_state.qwen_api_key = ""
        st.success("已清除。")


if not groq_key or not qwen_key:
    st.warning("请先在左侧同时输入 **Groq API Key** 与 **通义千问 API Key**，主界面才会启用。")
    st.stop()


groq_client = OpenAI(api_key=groq_key, base_url=GROQ_BASE_URL)
qwen_client = OpenAI(api_key=qwen_key, base_url=QWEN_BASE_URL)


if "quarter" not in st.session_state:
    st.session_state.quarter = "Q1"
if "pending_pbp" not in st.session_state:
    st.session_state.pending_pbp = []  # List[Dict[str, Any]]
if "selected_player" not in st.session_state:
    st.session_state.selected_player = ""
if "input_text" not in st.session_state:
    st.session_state.input_text = ""
if "last_extract_raw" not in st.session_state:
    st.session_state.last_extract_raw = ""
if "roster_df" not in st.session_state:
    st.session_state.roster_df = load_roster_df()
if "home_score" not in st.session_state:
    st.session_state.home_score = 0
if "away_score" not in st.session_state:
    st.session_state.away_score = 0
if "home_timeouts_left" not in st.session_state:
    st.session_state.home_timeouts_left = 5
if "home_team_fouls" not in st.session_state:
    st.session_state.home_team_fouls = 0
if "away_team_fouls" not in st.session_state:
    st.session_state.away_team_fouls = 0
if "home_team_name" not in st.session_state:
    st.session_state.home_team_name = "主队"
if "away_team_name" not in st.session_state:
    st.session_state.away_team_name = "客队"
if "on_court" not in st.session_state:
    # 默认从当前名单里取前 5 个作为场上球员
    roster_init = st.session_state.roster_df
    if isinstance(roster_init, pd.DataFrame) and not roster_init.empty and "name" in roster_init.columns:
        names_init = roster_init["name"].fillna("").astype(str).str.strip().tolist()
        st.session_state.on_court = [n for n in names_init if n][:5]
    else:
        st.session_state.on_court = []

def _change_home_score(delta: int) -> None:
    if "home_score" not in st.session_state:
        st.session_state.home_score = 0
    st.session_state.home_score = max(0, st.session_state.home_score + delta)


def _change_away_score(delta: int) -> None:
    if "away_score" not in st.session_state:
        st.session_state.away_score = 0
    st.session_state.away_score = max(0, st.session_state.away_score + delta)


st.markdown("### 📊 简洁实时计分板")

board_cols = st.columns(2)
with board_cols[0]:
    st.markdown(f"#### 🏠 {st.session_state.home_team_name}")
    st.markdown(
        f"<div style='font-size:56px;font-weight:800;text-align:center;color:#ff4b4b;'>{st.session_state.home_score}</div>",
        unsafe_allow_html=True,
    )
    st.caption(f"犯规：**{int(st.session_state.home_team_fouls)}**")

with board_cols[1]:
    st.markdown(f"#### 🚩 {st.session_state.away_team_name}")
    st.markdown(
        f"<div style='font-size:56px;font-weight:800;text-align:center;color:#1f77b4;'>{st.session_state.away_score}</div>",
        unsafe_allow_html=True,
    )
    st.caption(f"犯规：**{int(st.session_state.away_team_fouls)}**")

with st.expander("手动校准比分", expanded=False):
    st.caption("正常情况下比分由下方“动作流”自动运算；仅在特殊情况（漏记/误记）时手动校准。")

    calib_cols = st.columns(2)
    with calib_cols[0]:
        st.text_input("主队名称", key="home_team_name")
        st.number_input("主队犯规", min_value=0, step=1, key="home_team_fouls")
        btn_cols = st.columns(4)
        for i, delta in enumerate([1, 2, 3, -1]):
            label = f"{'+' if delta > 0 else ''}{delta}"
            with btn_cols[i]:
                st.button(
                    label,
                    key=f"home_delta_{delta}",
                    use_container_width=True,
                    on_click=_change_home_score,
                    args=(delta,),
                )

    with calib_cols[1]:
        st.text_input("客队名称", key="away_team_name")
        st.number_input("客队犯规", min_value=0, step=1, key="away_team_fouls")
        btn_cols = st.columns(4)
        for i, delta in enumerate([1, 2, 3, -1]):
            label = f"{'+' if delta > 0 else ''}{delta}"
            with btn_cols[i]:
                st.button(
                    label,
                    key=f"away_delta_{delta}",
                    use_container_width=True,
                    on_click=_change_away_score,
                    args=(delta,),
                )

st.markdown("---")


def _get_on_court_and_bench() -> Tuple[List[str], List[str]]:
    """根据最新 roster_df 计算有效的场上球员列表与替补列表。"""
    roster_df = st.session_state.roster_df
    if not isinstance(roster_df, pd.DataFrame) or roster_df.empty or "name" not in roster_df.columns:
        return [], []
    all_names = roster_df["name"].fillna("").astype(str).str.strip().tolist()
    all_names = [n for n in all_names if n]
    current_on = [n for n in (st.session_state.on_court or []) if n in all_names][:5]
    bench = [n for n in all_names if n not in current_on]
    return current_on, bench


def _render_lineup_section() -> None:
    """用 st.multiselect 维护场上 5 人（极简换人）。"""
    st.markdown("### 👟 当前场上阵容（5 人）")
    on_court, bench = _get_on_court_and_bench()

    roster_df = st.session_state.roster_df
    if isinstance(roster_df, pd.DataFrame) and not roster_df.empty and "name" in roster_df.columns:
        df_clean = roster_df.copy()
        df_clean["name"] = df_clean["name"].fillna("").astype(str).str.strip()
        df_clean["number"] = pd.to_numeric(df_clean["number"], errors="coerce").astype("Int64")
        df_clean = df_clean[df_clean["name"] != ""]
        # 名单统一按号码排序，方便定位
        df_clean = df_clean.sort_values(by=["number", "name"], key=lambda s: s.fillna(9999))
        all_names = df_clean["name"].tolist()
        num_map = {
            str(row["name"]).strip(): (int(row["number"]) if pd.notna(row["number"]) else None)
            for _, row in df_clean.iterrows()
        }
    else:
        all_names = []
        num_map = {}

    if not all_names:
        st.info("暂无队员名单，先在「⚙️ 球队花名册管理」Tab 补齐 `players` 表后再使用场上阵容功能。")
        return

    def _fmt_tag(name: str) -> str:
        num = num_map.get(name)
        return f"{num} {name}" if num is not None else name

    def _parse_tag(tag: str) -> str:
        s = (tag or "").strip()
        parts = s.split(" ", 1)
        if len(parts) == 2 and parts[0].isdigit():
            return parts[1].strip()
        return s

    options = [_fmt_tag(n) for n in all_names]

    # 如果上一轮检测到“未满 5 人”，这里在 widget 创建前补齐（允许安全写入同名 key）
    if st.session_state.get("_on_court_tags_next") is not None:
        st.session_state.on_court_tags = st.session_state.pop("_on_court_tags_next") or []

    # widget 默认值放到 session_state（必须发生在 widget 创建之前）
    if "on_court_tags" not in st.session_state:
        st.session_state.on_court_tags = [_fmt_tag(n) for n in on_court]

    st.multiselect(
        "用多选标签直接维持 5 名球员在场：",
        options=options,
        max_selections=5,
        key="on_court_tags",
    )

    # widget 创建后：只更新 on_court（允许），如果需要补齐 5 人则安排下一次运行再写回 on_court_tags
    raw_tags = st.session_state.get("on_court_tags") or []
    picked: List[str] = []
    for t in raw_tags:
        name = _parse_tag(t)
        if name and name in all_names and name not in picked:
            picked.append(name)
    for n in all_names:
        if len(picked) >= 5:
            break
        if n not in picked:
            picked.append(n)
    picked = picked[:5]
    st.session_state.on_court = picked

    filled_tags = [_fmt_tag(n) for n in picked]
    if filled_tags != raw_tags:
        st.session_state._on_court_tags_next = filled_tags
        st.rerun()
    st.divider()


_render_lineup_section()

st.subheader("🎛️ 顶部控制区（全局上下文）")
quarter_label_to_value = {
    "第一节（Q1）": "Q1",
    "第二节（Q2）": "Q2",
    "第三节（Q3）": "Q3",
    "第四节（Q4）": "Q4",
    "加时（OT）": "OT",
}
value_to_quarter_label = {v: k for k, v in quarter_label_to_value.items()}
quarter_labels = list(quarter_label_to_value.keys())

selected_label = st.radio(
    "当前比赛节数",
    quarter_labels,
    index=quarter_labels.index(value_to_quarter_label.get(st.session_state.quarter, "第一节（Q1）")),
    horizontal=True,
)
st.session_state.quarter = quarter_label_to_value[selected_label]
st.caption(f"当前节数：**{st.session_state.quarter}**（后续记录将自动带上该标签）")

tabs = st.tabs(["👉 极速点击面板（专业记录）", "🎙️ 语音/文本 AI 识别（辅助记录）", "⚙️ 球队花名册管理"])


def _apply_score_from_actions(entries: List[Dict[str, Any]], sign: int = 1) -> None:
    if not entries:
        return
    if "home_score" not in st.session_state:
        st.session_state.home_score = 0
    for e in entries:
        act = str(e.get("action", "") or "").strip()
        delta = 0
        if act == "+3分":
            delta = 3
        elif act == "+2分":
            delta = 2
        elif act == "+1罚球":
            delta = 1
        if delta:
            st.session_state.home_score = max(0, st.session_state.home_score + sign * delta)


def append_pending_pbp(entries: List[Dict[str, Any]]) -> None:
    if not entries:
        return
    if "pending_pbp" not in st.session_state or not isinstance(st.session_state.pending_pbp, list):
        st.session_state.pending_pbp = []
    st.session_state.pending_pbp.extend(entries)

    _apply_score_from_actions(entries, sign=1)


def undo_last_pbp() -> None:
    rows = st.session_state.pending_pbp if isinstance(st.session_state.pending_pbp, list) else []
    if not rows:
        return
    last = rows.pop()
    st.session_state.pending_pbp = rows
    _apply_score_from_actions([last], sign=-1)


with tabs[0]:
    st.subheader("⚡ 极速点击面板（自动识别场上球员）")
    roster = st.session_state.roster_df.copy() if isinstance(st.session_state.roster_df, pd.DataFrame) else pd.DataFrame(columns=["name", "number", "nickname"])
    if roster.empty:
        st.warning("当前 `players` 表没有球员数据。请先在「⚙️ 球队花名册管理」Tab 补齐队员名单。")
    else:
        roster["name"] = roster["name"].fillna("").astype(str).str.strip()
        roster["number"] = pd.to_numeric(roster["number"], errors="coerce").astype("Int64")
        roster = roster.sort_values(by=["number", "name"], key=lambda s: s.fillna(9999)).reset_index(drop=True)

        # 根据当前阵容自动区分“场上 5 人”和替补，方便快速点击
        on_court, bench = _get_on_court_and_bench()
        num_map = {
            str(row["name"]).strip(): (int(row["number"]) if pd.notna(row["number"]) else None)
            for _, row in roster.iterrows()
        }

        if "fast_panel_player" not in st.session_state:
            st.session_state.fast_panel_player = None
        if "fast_panel_action" not in st.session_state:
            st.session_state.fast_panel_action = None

        # 注意：widget(key=fast_panel_player/fast_panel_action) 实例化后，不能在同一次运行中直接改写对应 session_state。
        # 这里用一个标记在“下一次 rerun 的 widget 创建之前”统一清空。
        if st.session_state.get("_fast_panel_reset"):
            st.session_state.fast_panel_player = None
            st.session_state.fast_panel_action = None
            st.session_state.selected_player = ""
            st.session_state._fast_panel_reset = False

        st.markdown("**1) 选人（场上 5 人，选中保持高亮）**")
        if not on_court:
            st.caption("暂无场上阵容，请先在上方“当前场上阵容”区域选择 5 人。")
        else:
            player_options = []
            for name in on_court[:5]:
                num = num_map.get(name)
                player_options.append(f"{num} {name}" if num is not None else name)

            picked_player_tag = st.pills(
                "场上球员",
                options=player_options,
                selection_mode="single",
                key="fast_panel_player",
            )
            # 统一回写为“纯姓名”，保持和后续数据结构一致
            if picked_player_tag:
                parts = str(picked_player_tag).strip().split(" ", 1)
                st.session_state.selected_player = parts[1].strip() if len(parts) == 2 and parts[0].isdigit() else str(picked_player_tag).strip()
            else:
                st.session_state.selected_player = ""

        st.markdown("**2) 选动作（点一下即记录并自动清空）**")
        picked_action = st.pills(
            "动作",
            options=PBP_ACTIONS,
            selection_mode="single",
            key="fast_panel_action",
        )

        if picked_action:
            if not st.session_state.selected_player:
                st.error("请先在上方选择球员。")
                st.session_state.fast_panel_action = None
                st.rerun()
            else:
                append_pending_pbp(
                    [
                        {
                            "quarter": st.session_state.quarter,
                            "player": st.session_state.selected_player,
                            "action": str(picked_action),
                            "ts": "",
                            "logged_at": now_local_ts(),
                        }
                    ]
                )
                st.session_state._fast_panel_reset = True
                st.rerun()

    st.divider()
    st.caption("点击面板产生的记录会出现在页面底部“暂存动作流”里，可编辑核对后再批量入库。")

with tabs[1]:
    st.subheader("🎙️ 语音/文本 AI 识别")
    st.caption("流程：Groq Whisper 负责转写；通义千问负责把口述提取成逐回合动作 JSON；解析后只追加到暂存动作流，不直接入库。")

    col_a, col_b = st.columns([1, 1])
    with col_a:
        audio_input = None
        try:
            audio_input = st.audio_input("录音（按住说话，松开结束）")
        except Exception:
            st.info("当前 Streamlit 版本不支持 `st.audio_input`，可用右侧音频上传代替。")
    with col_b:
        audio_file = st.file_uploader("上传音频文件（mp3/wav/m4a 等）", type=["mp3", "wav", "m4a", "aac", "flac", "ogg"])

    audio_bytes: Optional[bytes] = None
    audio_name = "audio.wav"
    if audio_input is not None:
        audio_bytes = audio_input.getvalue()
        audio_name = getattr(audio_input, "name", "recording.wav") or "recording.wav"
    elif audio_file is not None:
        audio_bytes = audio_file.getvalue()
        audio_name = getattr(audio_file, "name", "upload.wav") or "upload.wav"

    if audio_bytes:
        if st.button("🗣️ 语音转文字（Whisper）", use_container_width=True, key="btn_whisper"):
            with st.spinner("正在用 Groq Whisper 转写..."):
                try:
                    bio = io.BytesIO(audio_bytes)
                    bio.name = audio_name
                    resp = groq_client.audio.transcriptions.create(model="whisper-large-v3", file=bio)
                    transcript = (getattr(resp, "text", None) or "").strip()
                    if not transcript:
                        raise RuntimeError("转写结果为空。")
                    st.session_state.input_text = transcript
                    st.success("转写完成，已自动填入下方文本框。")
                except Exception as e:
                    st.error(f"语音转写失败：{e}")

    st.text_area(
        "赛况口述（可先语音转写再微调）",
        key="input_text",
        height=180,
        placeholder="例如：张三底角三分进了！李四上篮没进，王五抢到后场板……",
    )

    if st.button("📤 AI 识别并追加到暂存动作流", type="primary", use_container_width=True, key="btn_ai_extract"):
        txt = (st.session_state.input_text or "").strip()
        if not txt:
            st.error("请先输入或转写得到赛况文本。")
        else:
            with st.spinner("正在用通义千问提取逐回合动作 JSON..."):
                try:
                    resp = qwen_client.chat.completions.create(
                        model="qwen-plus",
                        messages=[
                            {"role": "system", "content": PBP_EXTRACT_SYSTEM_PROMPT},
                            {
                                "role": "user",
                                "content": f"当前节数默认是 {st.session_state.quarter}。赛况如下：\n{txt}",
                            },
                        ],
                        temperature=0.2,
                    )
                    raw = (resp.choices[0].message.content or "").strip()
                    st.session_state.last_extract_raw = raw
                    cleaned = clean_json_array_text(raw)
                    items = json.loads(cleaned)
                    entries = normalize_pbp_items(items, st.session_state.roster_df, st.session_state.quarter)
                    if not entries:
                        raise ValueError("未解析到任何逐回合动作。")
                    append_pending_pbp(entries)
                    st.success(f"已追加 {len(entries)} 条到暂存动作流。请到下方表格核对。")
                except Exception as e:
                    st.error(f"识别失败：{e}")
                    with st.expander("查看模型原始输出（便于排查）"):
                        st.code(st.session_state.last_extract_raw or "")

with tabs[2]:
    st.subheader("⚙️ 球队花名册管理")
    st.caption("在这里维护本机数据库 `players` 表（姓名 / 号码 / 外号）。其他模块会实时引用该名单。")

    roster_edited = st.data_editor(
        st.session_state.roster_df,
        use_container_width=True,
        hide_index=True,
        num_rows="dynamic",
        column_config=build_roster_column_config(),
        key="roster_editor",
    )

    col_r1, col_r2, col_r3 = st.columns([1, 1, 3])
    with col_r1:
        if st.button("💾 保存队员名单", type="primary", use_container_width=True):
            ok, msg = save_roster_df(roster_edited)
            if ok:
                st.session_state.roster_df = load_roster_df()
                st.success(msg)
            else:
                st.error(msg)
    with col_r2:
        if st.button("🔄 重新加载", use_container_width=True):
            st.session_state.roster_df = load_roster_df()
            st.success("已重新加载。")
    with col_r3:
        st.caption("提示：保存时会校验“姓名重复 / 号码重复”；姓名为空的行会被忽略。")


st.subheader("📋 暂存动作流（Play-by-Play Logs）｜可编辑核对")
st.caption("你可以直接在表格中修正球员/动作/节数/口述时间；确认无误后再批量写入数据库。")

pending_df = pbp_to_df(st.session_state.pending_pbp)
edited_pbp_df = st.data_editor(
    pending_df,
    use_container_width=True,
    hide_index=True,
    num_rows="dynamic",
    column_config=build_pbp_column_config(),
    key="pbp_editor",
)

if isinstance(edited_pbp_df, pd.DataFrame):
    # 用编辑结果回写 session_state，保证按钮操作用到最新内容
    st.session_state.pending_pbp = edited_pbp_df.to_dict(orient="records")

st.markdown(
    """
<style>
button[aria-label="🗑️ 撤销上一条"] {
  background: #dc3545 !important;
  border-color: #dc3545 !important;
  color: white !important;
}
button[aria-label="🗑️ 撤销上一条"]:hover {
  background: #bb2d3b !important;
  border-color: #bb2d3b !important;
}
button[aria-label="💾 确认本批次数据无误，写入数据库"] {
  background: #198754 !important;
  border-color: #198754 !important;
  color: white !important;
  font-weight: 700 !important;
  padding-top: 0.9rem !important;
  padding-bottom: 0.9rem !important;
}
button[aria-label="💾 确认本批次数据无误，写入数据库"]:hover {
  background: #157347 !important;
  border-color: #157347 !important;
}
</style>
""",
    unsafe_allow_html=True,
)

btn_left, btn_right = st.columns([1, 2])
with btn_left:
    st.button(
        "🗑️ 撤销上一条",
        type="secondary",
        use_container_width=True,
        on_click=undo_last_pbp,
    )

with btn_right:
    if st.button("💾 确认本批次数据无误，写入数据库", type="primary", use_container_width=True):
        rows = st.session_state.pending_pbp if isinstance(st.session_state.pending_pbp, list) else []
        rows = [r for r in rows if isinstance(r, dict)]
        if not rows:
            st.error("暂存动作流为空，无需入库。")
        else:
            # 基础校验与清洗
            cleaned_rows: List[Tuple[str, str, str, str]] = []
            for r in rows:
                q = str(r.get("quarter", "") or "").strip().upper() or st.session_state.quarter
                if q not in ("Q1", "Q2", "Q3", "Q4", "OT"):
                    q = st.session_state.quarter
                p = str(r.get("player", "") or "").strip() or "unknown_player"
                a = str(r.get("action", "") or "").strip()
                if a not in PBP_ACTIONS:
                    a = "失误"
                ts = str(r.get("ts", "") or "").strip()
                cleaned_rows.append((q, p, a, ts))

            conn = get_db_conn()
            try:
                conn.executemany(
                    "INSERT INTO play_by_play (quarter, player, action, ts) VALUES (?, ?, ?, ?);",
                    cleaned_rows,
                )
                conn.commit()
            finally:
                conn.close()
            n = len(cleaned_rows)
            st.session_state.pending_pbp = []
            st.success(f"已写入 {n} 条到本地数据库 `{DB_PATH}` 的 `play_by_play` 表。")

st.divider()

st.subheader("📈 赛后总结卡片（MVP / 篮板王 / 组织核心）")
st.caption("基于本地 `play_by_play` 表的全部数据进行统计，目前暂不区分具体比赛场次。")


def _load_play_by_play_df() -> pd.DataFrame:
    conn = get_db_conn()
    try:
        df = pd.read_sql_query(
            "SELECT quarter, player, action, ts, created_at FROM play_by_play ORDER BY id ASC;",
            conn,
        )
    finally:
        conn.close()
    if df is None or df.empty:
        return pd.DataFrame(columns=["quarter", "player", "action", "ts", "created_at"])
    return df


def _compute_player_boxscore(df: pd.DataFrame) -> pd.DataFrame:
    if df is None or df.empty:
        return pd.DataFrame(columns=["player", "points", "rebounds", "assists"])
    d = df.copy()
    d["points"] = d["action"].map(
        {"+3分": 3, "+2分": 2, "+1罚球": 1}
    ).fillna(0).astype(int)
    d["rebounds"] = d["action"].isin(["前场板", "后场板"]).astype(int)
    d["assists"] = (d["action"] == "助攻").astype(int)
    box = (
        d.groupby("player", as_index=False)[["points", "rebounds", "assists"]]
        .sum()
        .sort_values(by=["points", "rebounds", "assists"], ascending=False)
    )
    return box


def _build_markdown_summary_card(box_df: pd.DataFrame, model_comment: str) -> str:
    if box_df is None or box_df.empty:
        return "本场暂无统计数据。"

    # 找出三项榜首
    mvp_row = box_df.sort_values("points", ascending=False).iloc[0]
    reb_row = box_df.sort_values("rebounds", ascending=False).iloc[0]
    ast_row = box_df.sort_values("assists", ascending=False).iloc[0]

    def _fmt_row(row, title: str) -> str:
        return f"| {row['player']} | {int(row['points'])} | {int(row['rebounds'])} | {int(row['assists'])} | {title} |"

    lines = []
    lines.append("> 🏀 **本场核心数据一览**")
    lines.append("")
    lines.append("| 球员 | 得分 | 篮板 | 助攻 | 头衔 |")
    lines.append("| :-- | --: | --: | --: | :-- |")
    lines.append(_fmt_row(mvp_row, "本场 MVP"))
    lines.append(_fmt_row(reb_row, "篮板王"))
    lines.append(_fmt_row(ast_row, "组织核心"))
    lines.append("")
    if model_comment:
        lines.append("---")
        lines.append("")
        lines.append(model_comment.strip())
    return "\n".join(lines)


if st.button("✨ 生成赛后总结卡片（调用通义千问）", type="primary", use_container_width=True):
    pbp_df_full = _load_play_by_play_df()
    box_df = _compute_player_boxscore(pbp_df_full)
    if box_df.empty:
        st.warning("本地 `play_by_play` 表暂无数据，无法生成总结。请先完成一场记录并写入数据库。")
    else:
        with st.spinner("正在调用通义千问生成点评与卡片内容..."):
            try:
                # 构造给通义的简要统计文本
                stats_text = box_df.to_markdown(index=False)
                prompt = (
                    "你是一名专业篮球解说，请根据下面的单场比赛球员数据，"
                    "用简洁生动的中文写一段 80~150 字左右的点评，"
                    "重点突出本场 MVP、篮板王和组织核心三名球员对比赛走势的影响，"
                    "语气专业但不夸张，适合发在微信群里：\n\n"
                    f"{stats_text}"
                )
                resp = qwen_client.chat.completions.create(
                    model="qwen-plus",
                    messages=[
                        {
                            "role": "system",
                            "content": "你是一个资深篮球解说兼文案编辑，善于用简短的中文概括一场比赛的核心看点。",
                        },
                        {"role": "user", "content": prompt},
                    ],
                    temperature=0.5,
                )
                comment = (resp.choices[0].message.content or "").strip()
            except Exception as e:
                st.error(f"调用通义千问生成点评失败：{e}")
                comment = ""

        card_md = _build_markdown_summary_card(box_df, comment)
        st.markdown("**✅ 已生成本场总结卡片（Markdown）：**")
        st.markdown(card_md)

        st.text_area(
            "用于复制分享的原始 Markdown 文本：",
            value=card_md,
            height=220,
        )
        st.download_button(
            "💾 下载 Markdown 文件（用于转发 / 备份）",
            data=card_md.encode("utf-8"),
            file_name=f"hoopai_game_summary_{datetime.now().strftime('%Y%m%d_%H%M%S')}.md",
            mime="text/markdown",
            use_container_width=True,
        )
