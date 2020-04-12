"use strict";
var bhat_list = ["i", "a", "u", "á", "í", "ú", "o", "e", "-", "ai",
    "au", "t", "x", "d", "h", "c", "m", "z", "k", "s",
    "w", "r", "g", "l", "j", "p", "b", "n", "ṭ", "dh",
    "ḍ", "ṣ", "gh", "ḷ", "y", "ph", "bh", "ṇ", "kh", ",",
    "quote", "ququ", "question", "it", "at", "ut", "aut", "_", " ", "period"];
var single_char = ["i", "a", "u", "á", "í", "ú", "o", "e", "-", "ä",
    "å", "t", "x", "d", "h", "c", "m", "z", "k", "s",
    "w", "r", "g", "l", "j", "p", "b", "n", "ṭ", "D",
    "ḍ", "ṣ", "G", "ḷ", "y", "P", "B", "ṇ", "K", ",",
    "\"", "Q", "?", "I", "A", "U", "Å", "_", " ", "."];
function printBhat(gefak, size) {
    size = size || 60;
    for (var i = 0; i < gefak.length; i++) {
        document.write('<img src="bhat_font/bhat_' + gefak[i] + '.png" height="' + size + '" />');
    }
}
function printBhat2(fistir, size) {
    printBhat(fistir.split("").map(a => bhat_list[single_char.indexOf(a)]), size);
}
