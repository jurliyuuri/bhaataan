"use strict";
exports.__esModule = true;
var fs = require("fs");
var dictionary = JSON.parse(fs.readFileSync('bhat.json', { encoding: 'utf8', flag: 'r' }));
var dictionary_eng = JSON.parse(fs.readFileSync('bhat-to-eng.json', { encoding: 'utf8', flag: 'r' }));
// console.log(dictionary.words);
console.log(get_duplicates(["1", "2", "1"]));
console.log(get_duplicates(dictionary.words.map(function (e) { return e.entry.form; })));
function get_duplicates(arrs) {
    var counted = arrs.map(function (name) { return ({ count: 1, name: name }); })
        .reduce(function (result, b) {
        result.set(b.name, (result.get(b.name) || 0) + b.count);
        return result;
    }, new Map());
    // console.log(counted);
    var ans = [];
    counted.forEach(function (value, key) {
        if (value > 1) {
            ans.push(key);
        }
    });
    return ans;
}
