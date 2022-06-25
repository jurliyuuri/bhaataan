"use strict";
exports.__esModule = true;
var fs = require("fs");
var dictionary = JSON.parse(fs.readFileSync('bhat.json', { encoding: 'utf8', flag: 'r' }));
var dictionary_eng = JSON.parse(fs.readFileSync('bhat-to-eng.json', { encoding: 'utf8', flag: 'r' }));
console.log(dictionary.words);
