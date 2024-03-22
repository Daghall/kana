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
const consonants = [ "", "k", "s", "t", "n", "h", "m", "y", "r", "w" ];
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


function draw(kanas) {
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

    rowHeader.innerText = consonant;
    row.appendChild(rowHeader);

    vowels.forEach((vowel) => {
      const kana = kanas[consonant][vowel];
      const cell = document.createElement("td");

      if (kana) {
        cell.innerText = kana;
      }

      row.appendChild(cell);
    });

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

draw(hiragana);
