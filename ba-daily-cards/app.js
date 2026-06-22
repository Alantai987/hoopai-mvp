const decks = [
  {
    id: "d1",
    date: "2026-06-22",
    name: "D1 框架",
    topic: "商务分析、大数据、CRISP-DM",
    cards: [
      ["flash", "先建立地图", "今天只求过线，最应该先抓住哪条主线？", "业务问题 -> 数据 -> 方法/模型 -> 指标评估 -> 管理行动。简答、应用、论述都可以往这条线靠。"],
      ["choice", "商务分析", "商务分析最核心的目标是什么？", ["把所有工作自动化", "把数据转化为信息和知识，支持管理决策", "只做图表和汇报", "只训练复杂算法"], 1, "关键词：数据管理、分析与挖掘、信息和知识、管理决策。"],
      ["choice", "大数据 4V", "下面哪组是本课程中的大数据 4V？", ["规模、速度、多样性、价值", "准确、完整、及时、便宜", "可见、可控、可用、可复制", "分类、聚类、回归、推荐"], 0, "Volume、Velocity、Variety、Value。"],
      ["flash", "思维变化", "大数据时代的思维变化怎么写？", "从随机样本到全体数据；从追求精确到接受混杂性；从只看因果到重视相关关系。补一句：相关关系能支持预测，但不等于因果。"],
      ["flash", "默写卡", "闭眼默写 CRISP-DM 六阶段，然后点开检查。", "商业理解 -> 数据理解 -> 数据准备 -> 建立模型 -> 模型评估 -> 结果部署。阶段之间可以反复迭代。"],
      ["write", "小练习", "用 4-6 句话解释什么是商务分析，并说明它为什么能帮助企业决策。", "结构：定义 -> 数据转化 -> 方法 -> 决策价值 -> 例子。"]
    ]
  },
  {
    id: "d2",
    date: "2026-06-23",
    name: "D2 数据",
    topic: "数据探索、质量、预处理",
    cards: [
      ["flash", "今天目标", "数据探索这章考试最爱问什么？", "数据质量问题有哪些、数据准备做什么、为什么预处理会影响模型效果。不背代码，背任务和业务意义。"],
      ["choice", "数据质量", "下面哪一个不是常见数据质量问题？", ["缺失值", "异常值", "编码不一致", "模型部署"], 3, "模型部署属于 CRISP-DM 最后阶段，不是数据质量问题。"],
      ["choice", "预处理", "把不同来源的销售额单位统一成元，属于哪类处理？", ["数据转换", "模型评估", "网络密度", "提升度计算"], 0, "统一单位、格式、编码属于清洗/转换。"],
      ["flash", "答题模板", "“为什么数据准备影响建模效果？”怎么答？", "原始数据常有缺失、异常、噪声、不一致和重复。不处理会让模型学到错误规律；清洗、集成、转换、归约和特征构建能提高数据可用性。"],
      ["choice", "特征构建", "由身份证推导出生日期、性别、籍贯，属于什么？", ["创建新变量/特征构建", "交叉验证", "K-means", "Lift"], 0, "从已有字段生成有业务意义的新字段，就是特征构建。"],
      ["write", "小练习", "列出 5 类数据质量问题，并说明任选 2 类如何处理。", "缺失、异常、噪声、不一致、重复。处理方法写均值填补、删除、统一编码、去重等即可。"]
    ]
  },
  {
    id: "d3",
    date: "2026-06-24",
    name: "D3 关联",
    topic: "Support、Confidence、Lift",
    cards: [
      ["flash", "今天目标", "关联规则只求及格要掌握什么？", "会解释购物篮分析，会算 Support、Confidence、Lift，会说明 Lift > 1 才表示真正有提升价值。"],
      ["choice", "场景判断", "“买了咖啡的人也常买蛋糕”最适合用哪种方法？", ["关联规则", "聚类", "文本分词", "接近中心性"], 0, "这是共现关系，适合关联规则和购物篮分析。"],
      ["choice", "Support", "1000 人中 120 人同时买 A 和 B，Support(A -> B) 是？", ["12%", "40%", "50%", "1.67"], 0, "Support 是 A 和 B 同时出现的比例：120/1000=12%。"],
      ["choice", "Confidence", "1000 人中 300 人买 A，120 人同时买 A 和 B，Confidence(A -> B) 是？", ["12%", "24%", "40%", "60%"], 2, "Confidence=P(B|A)=120/300=40%。"],
      ["choice", "Lift", "如果 P(B|A)=40%，P(B)=24%，Lift 约等于？", ["0.6", "1", "1.67", "2.4"], 2, "Lift=0.40/0.24≈1.67，大于 1，说明 A 提高了 B 出现概率。"],
      ["flash", "易错点", "为什么高 Confidence 不一定说明规则有用？", "因为后件本来就可能很常见。比如 80% 的人本来就买牛奶，薯片 -> 牛奶 的置信度 80% 不代表薯片带来了提升，要看 Lift。"],
      ["write", "小练习", "解释 Support、Confidence、Lift 的含义，并说明 Lift=1、>1、<1 分别代表什么。", "Lift=1 独立；>1 正关联/有提升；<1 负关联/降低概率。"]
    ]
  },
  {
    id: "d4",
    date: "2026-06-25",
    name: "D4 分类",
    topic: "分类方法与混淆矩阵",
    cards: [
      ["flash", "今天目标", "分类这章及格重点是什么？", "分类解决预测离散标签；知道 KNN/决策树/朴素贝叶斯大意；会算混淆矩阵指标。"],
      ["choice", "方法判断", "预测用户是否会流失，最像哪类问题？", ["分类", "关联规则", "无监督聚类", "网络密度"], 0, "是否流失是离散标签，属于分类问题。"],
      ["choice", "Precision", "TP=40，FP=10，Precision 是？", ["0.50", "0.67", "0.80", "0.90"], 2, "Precision=TP/(TP+FP)=40/(40+10)=0.80。"],
      ["choice", "Recall", "TP=40，FN=20，Recall 是？", ["0.50", "0.67", "0.80", "0.90"], 1, "Recall=TP/(TP+FN)=40/(40+20)=0.67。"],
      ["choice", "Specificity", "TN=30，FP=10，Specificity 是？", ["0.60", "0.75", "0.80", "0.90"], 1, "Specificity=TN/(TN+FP)=30/(30+10)=0.75。"],
      ["flash", "答题点", "为什么类别不平衡时 Accuracy 不够好？", "多数类占比很高时，模型全预测多数类也可能有高 Accuracy，但对少数类没有识别能力。欺诈检测、流失预警都要看 Precision、Recall、F1。"],
      ["write", "小练习", "用自己的话解释 Precision 和 Recall 的区别，并举一个业务例子。", "Precision 看预测为正的有多少是真的；Recall 看真实为正的找回了多少。"]
    ]
  },
  {
    id: "d5",
    date: "2026-06-26",
    name: "D5 聚类",
    topic: "聚类与三类方法对比",
    cards: [
      ["flash", "今天目标", "聚类这章怎么用做题记住？", "抓两个句子：无预设类别，按相似性分组；类内相似、类间差异。"],
      ["choice", "聚类判断", "没有客户标签，只想按行为把客户分群，适合用什么？", ["聚类", "分类", "关联规则", "朴素贝叶斯"], 0, "没有预设类别，就是聚类的典型场景。"],
      ["choice", "K-means", "K-means 的一个明显限制是？", ["必须提前指定 k", "只能分析文本", "不能处理数值", "只能做有向网络"], 0, "K-means 通常需要提前指定聚类数 k，并且对初始中心和噪声敏感。"],
      ["choice", "DBSCAN", "更适合发现噪声点和非规则形状簇的方法是？", ["DBSCAN", "朴素贝叶斯", "Apriori", "TF-IDF"], 0, "DBSCAN 是基于密度的聚类方法，可识别噪声点。"],
      ["flash", "三类方法", "关联规则、分类、聚类一句话怎么区分？", "关联规则：发现共现关系；分类：根据已知标签预测新对象类别；聚类：没有预设标签，按相似性自动分群。"],
      ["choice", "场景选择", "购物篮交叉销售、信用风险预测、市场细分，分别对应？", ["关联规则、分类、聚类", "分类、聚类、关联规则", "聚类、关联规则、分类", "关联规则、聚类、分类"], 0, "这是应用题选方法的核心。"],
      ["write", "小练习", "做一张三列表：关联规则、分类、聚类分别解决什么问题，各举一个业务场景。", "这是非常值得背下来的及格题。"]
    ]
  },
  {
    id: "d6",
    date: "2026-06-29",
    name: "D6 文本/SNA",
    topic: "文本挖掘与社交网络",
    cards: [
      ["flash", "今天目标", "文本挖掘和 SNA 怎么复习才不累？", "文本挖掘背流程和用途；SNA 背网络构成、密度和三个中心性。"],
      ["choice", "文本流程", "下面哪项属于文本挖掘预处理？", ["分词和去停用词", "网络直径", "Lift", "K-means 初始中心"], 0, "文本预处理包括分词、去停用词、词干提取、词性标注等。"],
      ["choice", "TF-IDF", "TF-IDF 主要衡量什么？", ["词对文档的重要性", "节点的桥接能力", "规则的提升价值", "分类模型准确率"], 0, "TF-IDF 用词频和逆文档频率衡量词的重要性。"],
      ["choice", "网络密度", "无向网络 5 个节点、6 条边，密度是？", ["0.4", "0.5", "0.6", "0.75"], 2, "最多边数=5*4/2=10，密度=6/10=0.6。"],
      ["choice", "中心性", "一个节点连接很多其他节点，通常说明它什么中心性高？", ["度中心性", "中间中心性", "接近中心性", "余弦相似度"], 0, "度中心性看直接连接数量，可解释为活跃度、受欢迎程度或局部影响力。"],
      ["flash", "中心性速记", "三个中心性怎么快速记？", "度中心性：连接多；中间中心性：桥梁/中介，控制信息流；接近中心性：到别人距离短，传播效率高。"],
      ["write", "小练习", "解释度中心性、中间中心性、接近中心性，并各写一句业务含义。", "用关键用户、桥接节点、快速传播这三个词组织答案。"]
    ]
  },
  {
    id: "d7",
    date: "2026-06-30",
    name: "D7 AI/深度",
    topic: "深度学习与 AI 管理挑战",
    cards: [
      ["flash", "今天目标", "深度学习只求及格要背什么？", "背定义、和传统机器学习的区别、CNN/RNN 用途，以及 AI 时代管理挑战。"],
      ["choice", "深度学习", "深度学习的核心特征是？", ["多层神经网络自动学习特征表示", "只适合小数据", "完全可解释", "只能做关联规则"], 0, "深度学习依赖多层神经网络进行特征表示学习。"],
      ["choice", "CNN/RNN", "CNN 和 RNN 更典型的应用分别是？", ["图像、序列", "序列、购物篮", "网络密度、文本停用词", "信用风险、Lift"], 0, "CNN 常用于图像特征提取；RNN 常用于序列数据。"],
      ["choice", "管理挑战", "AI 用于招聘或信贷时可能产生对某些群体不公，属于什么挑战？", ["算法公平", "网络直径", "支持度", "数据降维"], 0, "算法公平、透明度和隐私伦理是 AI 时代管理挑战高频点。"],
      ["flash", "论述模板", "AI 与商务分析论述题怎么写？", "AI 带来生成性、对话性、自主性、多模态能力 -> 提升分析和决策效率 -> 同时带来数据质量、隐私伦理、算法公平、决策透明度、组织能力、人类控制权挑战。"],
      ["write", "小练习", "用 6-8 句话说明 AI 时代商务分析的机会和风险。", "机会写效率、自动化、个性化；风险写隐私、公平、透明、过度依赖。"]
    ]
  },
  {
    id: "d8",
    date: "2026-07-01",
    name: "D8 冲刺",
    topic: "混合模拟与模板",
    cards: [
      ["flash", "今天目标", "考前最后一天不要干什么？", "不要再大范围看新内容。只刷错题、公式、CRISP-DM、三类方法对比和论述模板。"],
      ["choice", "方法选择", "用户流失预警、购物篮组合推荐、用户画像分群分别对应？", ["分类、关联规则、聚类", "聚类、分类、关联规则", "关联规则、聚类、分类", "分类、聚类、关联规则"], 0, "这是应用题最常见的选方法判断。"],
      ["choice", "公式混合", "TP=30，FP=10，FN=15，Precision 是？", ["0.50", "0.67", "0.75", "0.80"], 2, "Precision=30/(30+10)=0.75。"],
      ["choice", "Lift 判断", "某规则 Lift=1，说明什么？", ["前件和后件基本独立", "规则强烈有效", "前件降低后件概率", "支持度为 100%"], 0, "Lift=1 表示 X 没有改变 Y 的发生概率，二者近似独立。"],
      ["flash", "应用题模板", "应用题万能结构是什么？", "套 CRISP-DM：业务目标 -> 数据需求和理解 -> 数据准备 -> 选择模型/方法 -> 指标评估 -> 部署和业务行动。写完一定要回到业务目标。"],
      ["flash", "考前清单", "最后检查你是否会这些。", "CRISP-DM 六阶段；Support/Confidence/Lift；Accuracy/Precision/Recall/Specificity/F1；关联规则/分类/聚类区别；数据质量问题；SNA 三中心性；AI 管理挑战。"],
      ["write", "模拟应用", "某电商希望提高交叉销售额，请用 CRISP-DM 设计一个分析方案。", "写业务目标、数据、预处理、关联规则/推荐、Support/Confidence/Lift 或点击/转化指标、部署到推荐模块。"]
    ]
  }
];

const storeKey = "baDailyCardState";
const state = JSON.parse(localStorage.getItem(storeKey) || "{}");
let deckId = todayDeck();
let idx = 0;

const els = {
  topic: document.querySelector("#topic"),
  count: document.querySelector("#count"),
  bar: document.querySelector("#bar"),
  days: document.querySelector("#days"),
  card: document.querySelector("#card"),
  prev: document.querySelector("#prev"),
  next: document.querySelector("#next"),
  jump: document.querySelector("#jump"),
  sheet: document.querySelector("#sheet"),
  nums: document.querySelector("#nums"),
  close: document.querySelector("#close")
};

function todayDeck() {
  const now = new Date();
  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0")
  ].join("-");
  return (decks.find(d => d.date === today) || decks[0]).id;
}

function deck() {
  return decks.find(d => d.id === deckId) || decks[0];
}

function cardId(cardIndex = idx) {
  return `${deckId}-${cardIndex}`;
}

function save() {
  localStorage.setItem(storeKey, JSON.stringify(state));
}

function normalize(raw) {
  const [type, tag, q, a, b, c] = raw;
  if (type === "choice") return { type, tag, q, options: a, answer: b, explain: c };
  if (type === "flash") return { type, tag, q, answerText: a };
  return { type, tag, q, hint: a };
}

function doneCount() {
  return deck().cards.filter((_, i) => state[cardId(i)]?.done).length;
}

function renderDays() {
  els.days.innerHTML = "";
  decks.forEach(d => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = d.id === deckId ? "active" : "";
    b.textContent = d.name;
    b.onclick = () => {
      deckId = d.id;
      idx = 0;
      render();
    };
    els.days.appendChild(b);
  });
}

function renderCard() {
  const d = deck();
  const card = normalize(d.cards[idx]);
  const record = state[cardId()] || {};
  els.card.innerHTML = `<div class="meta"><span class="tag">${d.name} · ${card.tag}</span><span class="kind">${card.type === "choice" ? "选择题" : card.type === "flash" ? "学习卡" : "写一写"}</span></div><p class="q">${idx + 1}. ${card.q}</p>`;

  if (card.type === "flash") {
    els.card.insertAdjacentHTML("beforeend", `<div class="hint">先在心里答一遍，再点开答案。点开后这张卡会记为完成。</div><div class="answer ${record.done ? "show" : ""}">${card.answerText}</div><div class="actions"><button id="show" class="${record.done ? "done" : ""}" type="button">${record.done ? "已掌握" : "看答案"}</button><button id="later" type="button">稍后再练</button></div>`);
    els.card.querySelector("#show").onclick = () => {
      state[cardId()] = { ...record, done: true };
      save();
      render();
    };
    els.card.querySelector("#later").onclick = () => {
      state[cardId()] = { ...record, done: false };
      save();
      render();
    };
  }

  if (card.type === "choice") {
    const options = document.createElement("div");
    options.className = "options";
    card.options.forEach((text, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "option";
      if (record.done && i === card.answer) b.classList.add("correct");
      if (record.done && i === record.selected && i !== card.answer) b.classList.add("wrong");
      b.innerHTML = `<span class="letter">${String.fromCharCode(65 + i)}</span><span>${text}</span>`;
      b.disabled = !!record.done;
      b.onclick = () => {
        state[cardId()] = { done: true, selected: i, correct: i === card.answer };
        save();
        render();
      };
      options.appendChild(b);
    });
    els.card.appendChild(options);
    if (record.done) {
      const good = record.correct;
      els.card.insertAdjacentHTML("beforeend", `<div class="feedback ${good ? "ok" : "bad"}"><strong>${good ? "✓ 正确" : "✕ 错误"}</strong><br>${good ? "" : `正确答案：${String.fromCharCode(65 + card.answer)}. ${card.options[card.answer]}<br>`}${card.explain}</div>`);
    }
  }

  if (card.type === "write") {
    els.card.insertAdjacentHTML("beforeend", `<textarea placeholder="在这里写几句话，写完点标记完成。">${record.text || ""}</textarea><div class="hint">${card.hint}</div><div class="actions"><button id="done" class="${record.done ? "done" : ""}" type="button">${record.done ? "已完成" : "标记完成"}</button><button id="clear" type="button">清空</button></div>`);
    const ta = els.card.querySelector("textarea");
    ta.oninput = () => {
      state[cardId()] = { ...state[cardId()], text: ta.value };
      save();
    };
    els.card.querySelector("#done").onclick = () => {
      state[cardId()] = { ...state[cardId()], done: !state[cardId()]?.done, text: ta.value };
      save();
      render();
    };
    els.card.querySelector("#clear").onclick = () => {
      state[cardId()] = { ...state[cardId()], text: "" };
      save();
      render();
    };
  }
}

function renderNums() {
  els.nums.innerHTML = "";
  deck().cards.forEach((raw, i) => {
    const b = document.createElement("button");
    const rec = state[cardId(i)];
    b.type = "button";
    b.className = i === idx ? "active" : "";
    if (rec?.done) b.classList.add(rec.correct === false ? "bad" : "done");
    b.textContent = i + 1;
    b.onclick = () => {
      idx = i;
      els.sheet.classList.remove("show");
      render();
    };
    els.nums.appendChild(b);
  });
}

function render() {
  const d = deck();
  if (idx >= d.cards.length) idx = d.cards.length - 1;
  els.topic.textContent = d.topic;
  els.count.textContent = `${doneCount()}/${d.cards.length}`;
  els.bar.style.width = `${Math.round((idx + 1) / d.cards.length * 100)}%`;
  els.prev.disabled = idx === 0;
  els.next.disabled = idx === d.cards.length - 1;
  renderDays();
  renderCard();
  renderNums();
}

els.prev.onclick = () => { idx = Math.max(0, idx - 1); render(); };
els.next.onclick = () => { idx = Math.min(deck().cards.length - 1, idx + 1); render(); };
els.jump.onclick = () => els.sheet.classList.add("show");
els.close.onclick = () => els.sheet.classList.remove("show");
els.sheet.onclick = e => { if (e.target === els.sheet) els.sheet.classList.remove("show"); };

render();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
}
