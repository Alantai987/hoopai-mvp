const decks = window.cardDeckParts || [];

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

function doneCount() {
  return deck().cards.filter((_, i) => state[cardId(i)]?.done).length;
}

function sourceHtml(card) {
  return `<div class="source"><strong>查答案：</strong>${card.source}</div>`;
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
  const card = d.cards[idx];
  const record = state[cardId()] || {};
  els.card.innerHTML = `<div class="meta"><span class="tag">${d.name} · ${card.tag}</span><span class="kind">${card.type === "choice" ? "选择题" : card.type === "flash" ? "学习卡" : "写一写"}</span></div><p class="q">${idx + 1}. ${card.q}</p>${sourceHtml(card)}`;

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
  deck().cards.forEach((_, i) => {
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
