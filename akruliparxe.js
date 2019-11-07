"use strict";
const map = {
    " ": " ", ".": ".", ",": ",", "a": "a", "ai": "ai", "au": "au",
    "b": "b", "bh": "bh", "c": "c", "d": "d", "dh": "dh",
    "e": "er", "g": "g", "gh": "gh", "h": "kh", "i": "i",
    "j": "j", "k": "k", "kh": "kkh", "l": "l", "m": "m",
    "n": "n", "o": "or", "p": "p", "ph": "ph", "r": "r",
    "s": "s", "t": "t", "u": "u", "w": "vh", "x": "x",
    "y": "y", "z": "ch", "á": "ar", "í": "ir", "ú": "ur",
    "ḍ": "d\u036F", "ḷ": "l\u036F", "ṇ": "n\u036F", "ṣ": "c\u036F", "ṭ": "t\u036F",
    "\t": " ", "\n": "\n"
};
function akruliparxe(input) {
    let index = 0;
    let result = "";
    while (true) {
        if (input.length == index) {
            break;
        }
        else if (input.length == index - 1) { // only one left
            let res = map[input[index]];
            if (res === undefined) {
                alert(`invalid character "${input[index]}" in input`);
                result += "■";
                index++;
            }
            else {
                result += res; // FIXME: r
                index++;
            }
        }
        else {
            let res1 = map[input[index] + input[index + 1]]; // try munching two
            if (res1 !== undefined) {
                result += res1;
                index += 2;
                continue;
            }
            let res = map[input[index]]; // munch one
            if (res === undefined) {
                alert(`invalid character "${input[index]}" in input`);
                result += "■";
                index++;
            }
            else {
                result += res; // FIXME: r
                index++;
            }
        }
    }
    return result;
}
