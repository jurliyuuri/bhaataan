const fs = require("fs");
const tsv = fs.readFileSync("coin5-true-emergency - Sheet1.tsv", "utf-8")
    .split(/\r?\n/)
    .map(row => row.split("\t"));

const dict_ja = tsv.map(([
    id, form, part_of_speech, tag, etymology, meaning
]) => ({
    "entry": {
        id: Number(id), form
    }, "translations" : [
        {
            "title": part_of_speech,
            "forms": [meaning]
        }   
    ], 
    "tags": tag === "" ? [] : [tag],
     "contents" : etymology === "" ? [] : [ {
        "title" : "同根語",
        "text" : etymology
    } ]
}));

fs.writeFileSync(".bhat-ja-addition.json", JSON.stringify(dict_ja, null, 2));