import fs from "node:fs";
import vm from "node:vm";

const code_handling_bobá = fs.readFileSync("./convert_from_bobá_to_phonetic.js", "utf8");
const legacy1 = {};
vm.createContext(legacy1);
vm.runInContext(code_handling_bobá, legacy1);

const code_handling_current = fs.readFileSync("./split_from_current_orthography_to_phonetic.js", "utf8");
const legacy2 = {};
vm.createContext(legacy2);
vm.runInContext(code_handling_current, legacy2);


const response = await fetch("https://docs.google.com/spreadsheets/d/1odYB4YYWNUTc2-L2yRouVrBOf3QYTzSTmdRhRSe8V9M/export?format=tsv&gid=837480255");

if (!response.ok) {
  throw new Error(`HTTP ${response.status}: ${response.statusText}`);
}

const data = await response.text();
fs.writeFileSync("debug/downloaded.tsv", data, "utf-8");
const tsv = 
    data.split(/\r?\n/).map(u=>u.split("\t"));

const result = tsv.map(
    (
        [_comment, bo_bá, current, id, ja]
    ) => 
        [
            legacy1.convert_from_bobá_to_phonetic(bo_bá).after_stage_8, 
            legacy2.split_from_current_to_phonetic(current.replaceAll("_", " ")), 
            id,
            ja
        ]
    );

const same = result.filter(a => a[0] === a[1]);
const differ = result.filter(a => a[0] !== a[1]);

fs.writeFileSync("debug/compare.tsv", result.map(arr => arr.join("\t")).join("\n"), "utf-8");
fs.writeFileSync("debug/same.tsv", same.map(arr => arr.join("\t")).join("\n"), "utf-8");
fs.writeFileSync("debug/differ.tsv", differ.map(arr => arr.join("\t")).join("\n"), "utf-8");

console.log(result);

//------------

// intermediate output files provided to make sense of the intermediate stages


for (const n of [2,/*4,*/5,6,/*7,*/8]) {
    fs.writeFileSync(`debug/after_stage${n}.tsv`, tsv.map(
        (
            [comment, bo_bá, current, id, ja]
        ) => 
            [
                comment,
                legacy1.convert_from_bobá_to_phonetic(bo_bá)["after_stage_" + n], 
                current, 
                id,
                ja
            ].join("\t")
        ).join("\n"), "utf-8");
}

