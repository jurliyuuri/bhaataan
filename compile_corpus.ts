import * as fs from 'fs'

let dictionary = JSON.parse(fs.readFileSync('bhat.json', { encoding: 'utf8', flag: 'r' }));
let dictionary_eng = JSON.parse(fs.readFileSync('bhat-to-eng.json', { encoding: 'utf8', flag: 'r' }));
console.log(dictionary.words);