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

function train(kanas) {
  const randomized = shuffleKanas(kanas);
  console.log({randomized}); // eslint-disable-line no-console
  let disableSubmit = false;

  const form = document.createElement("form");
  const largeKana = document.createElement("span");
  const message = document.createElement("span");
  const answer = document.createElement("input");

  const correct = {};
  const wrong = {};

  form.className = "training";
  largeKana.className = "large-kana";
  message.className = "message";
  answer.type = "text";
  answer.className = "answer";
  form.onsubmit = () => {
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
        drawKana(kanas, correct, wrong);
      }
    } catch (e) {
      console.log({e}); // eslint-disable-line no-console
    }

    return false;
  };

  form.appendChild(largeKana);
  form.appendChild(message);
  form.appendChild(answer);

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
  const table = document.createElement("table");
  const header = document.createElement("tr");
  header.appendChild(document.createElement("th"));

  vowels.forEach((vowel) => {
    const cell = document.createElement("th");
    cell.innerText = vowel;
    header.appendChild(cell);
  });

  table.appendChild(header);

  consonants.forEach((consonant) => {
    const row = document.createElement("tr");
    const rowHeader = document.createElement("th");

    rowHeader.innerText = consonant.toLowerCase();
    row.appendChild(rowHeader);

    if (typeof kanas[consonant] === "object") {
      vowels.forEach((vowel) => {
        const kana = kanas[consonant][vowel];
        const cell = document.createElement("td");

        if (kana) {
          cell.innerText = kana;
          if (correct[consonant + vowel]) {
            cell.className = "correct";
          } else if (wrong[consonant + vowel]) {
            cell.className = "wrong";
          }
        }

        row.appendChild(cell);
      });
    } else {
      const cell = document.createElement("td");
      cell.textContent = kanas[consonant];

      if (correct[consonant]) {
        cell.className = "correct";
      } else if (wrong[consonant]) {
        cell.className = "wrong";
      }
      row.appendChild(cell);
    }

    table.appendChild(row);
  });

  drawMain(table);
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

train(hiragana);
