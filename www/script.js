"use strict";

// 		a		i		u		e		o
// 		あ	い	う	え	お
// k	か	き	く	け	こ
// s	さ	し	す	せ	そ
// t	た	ち	つ	て	と
// n	な	に	ぬ	ね	の
// h	は	ひ	ふ	へ	ほ
// m	ま	み	む	め	も
// y	や			ゆ			よ
// r	ら	り	る	れ	ろ
// w	わ							を

const main = document.getElementsByTagName("main")[0];
const vowels = [ "a", "i", "u", "e", "o" ];
const consonants = [ "", "k", "s", "t", "n", "h", "m", "y", "r", "w", "N" ];
const hiragana = {
  "": {		a: "あ", i: "い", u: "う", e: "え", o: "お" },
  "k": { 	a: "か", i: "き", u: "く", e: "け", o: "こ" },
  "s": {	a: "さ", i: "し", u: "す", e: "せ", o: "そ" },
  "t": {	a: "た", i: "ち", u: "つ", e: "て", o: "と" },
  "n": {	a: "な", i: "に", u: "ぬ", e: "ね", o: "の" },
  "h": {	a: "は", i: "ひ", u: "ふ", e: "へ", o: "ほ" },
  "m": {	a: "ま", i: "み", u: "む", e: "め", o: "も" },
  "y": {	a: "や", /*    */ u: "ゆ", /*    */ o: "よ" },
  "r": {	a: "ら", i: "り", u: "る", e: "れ", o: "ろ" },
  "w": {	a: "わ", /*                      */ o: "を" },
  "N": "ん",
};


function drawWelcome() {
  drawMain(createElement("div", { className: "welcome" }, [
    createElement("h1", { textContent: "Kana" }),
    createElement("button", {
      textContent: "ひらがな",
      onclick() {
        drawKana(hiragana);
      },
    }),
    createElement("button", {
      textContent: "Train",
      onclick() {
        train(hiragana);
      },
    }),
  ]));
}


function train(kanas, filterList) {
  const randomized = shuffleKanas(kanas)
    .filter((kana) => {
      if (!filterList) return true;
      return filterList[kana.name];
    });

  console.log({randomized}); // eslint-disable-line no-console
  let disableSubmit = false;

  const largeKana = createElement("span", { className: "large-kana" });
  const message = createElement("span", { className: "message" });
  const answer = createElement("input", {
    type: "text",
    className: "answer",
  });

  const correct = {};
  const wrong = {};

  const form = createElement("form", {
    className: "training",
    onsubmit: () => {
      if (disableSubmit) return false;
      disableSubmit = true;

      try {
        const key = substituteSound(answer.name, true);
        const name = answer.name.toLowerCase();

        if (answer.value.toLowerCase() === name) {
          correct[key] = true;
          message.textContent = `${name}`;
          message.classList.add("message--correct");
          console.log("correct"); // eslint-disable-line no-console
        } else {
          message.textContent = `${name}`;
          message.classList.add("message--wrong");
          wrong[key] = true;
          console.log(`WRONG – "${answer.value}" should have been "${answer.name}"`); // eslint-disable-line no-console
        }

        if (randomized.length > 0) {
          setTimeout(() => {
            drawFoo(randomized.pop());
            disableSubmit = false;
          }, 1000);
        } else {
          setTimeout(() => {
            drawKana(kanas, correct, wrong);
          }, 1000);
        }
      } catch (e) {
        console.log({e}); // eslint-disable-line no-console
      }

      return false;
    },
  },
  [
    largeKana,
    message,
    answer,
  ]);

  drawMain(form);
  drawFoo(randomized.pop());

  function drawFoo({ name, kana }) {
    largeKana.textContent = kana;
    message.textContent = "";
    message.classList.remove("message--correct", "message--wrong");
    answer.name = name;
    answer.value = "";
    answer.focus();
  }
}


function drawKana(kanas, correct = {}, wrong = {}) {
  console.log({correct, wrong}); // eslint-disable-line no-console
  const table = createElement("table", null, [
    createElement("tr", null, [
      createElement("th"),
      ...vowels.map((vowel) => createElement("th", { textContent: vowel })),
    ]),
  ]);

  consonants.forEach((consonant) => {
    const row = createElement("tr");
    const rowHeader = createElement("th", { textContent: consonant.toLowerCase() });

    row.appendChild(rowHeader);

    if (typeof kanas[consonant] === "object") {
      vowels.forEach((vowel) => {
        const kana = kanas[consonant][vowel];
        const cell = createElement("td", { textContent: kana || "" });

        if (kana) {
          if (correct[consonant + vowel]) {
            cell.className = "correct";
          } else if (wrong[consonant + vowel]) {
            cell.className = "wrong";
          }
        }

        row.appendChild(cell);
      });
    } else {
      const cell = createElement("td", { textContent: kanas[consonant] });

      if (correct[consonant]) {
        cell.className = "correct";
      } else if (wrong[consonant]) {
        cell.className = "wrong";
      }
      row.appendChild(cell);
    }

    table.appendChild(row);
  });

  const children = [
    table,
    createElement("button", {
      textContent: "Back",
      onclick: drawWelcome,
    }),
  ];

  if (Object.keys(wrong).length > 0) {
    children.push(createElement("button", {
      textContent: "Continue",
      onclick() {
        train(hiragana, wrong);
      },
    }));
  }

  drawMain(createElement("div", null, children));
}


function drawMain(element) {
  while (main.lastElementChild) {
    main.removeChild(main.lastElementChild);
  }

  main.appendChild(element);
}


function shuffleKanas(kanas) {
  const result = [];
  const flatKanas = [];
  const rows = Object.keys(kanas);

  rows.forEach((row) => {
    const current = kanas[row];

    if (typeof current === "object") {
      const cols = Object.entries(current);
      cols.forEach(([vowel, kana]) => {
        flatKanas.push({
          name: substituteSound(row + vowel),
          kana,
        });
      });
    } else {
      flatKanas.push({
        name: row,
        kana: current,
      });
    }
  });

  while (flatKanas.length > 0) {
    const randomIndex = Math.floor(Math.random() * flatKanas.length);
    const [item] = flatKanas.splice(randomIndex, 1);
    result.push(item);
  }

  return result;
}

function substituteSound(kana, reverse = false) {
  const substitituions = {
    "si": "shi",
    "ti": "chi",
    "tu": "tsu",
    "hu": "fu",
  };

  if (reverse) {
    return Object.entries(substitituions).find(([, val]) => val === kana)?.[0] || kana;
  } else {
    return substitituions[kana] || kana;
  }
}

function createElement(tagName, options, children = []) {
  const element = document.createElement(tagName);
  Object.entries(options ?? {}).forEach(([key, value]) => {
    if (value) {
      element[key] = value;
    }
  });

  children.forEach((child) => {
    element.appendChild(child);
  });

  return element;
}

drawWelcome();
