#!/usr/bin/env -S deno run --allow-write
type Dict = {
    words: Word[],
    zpdic: unknown,
    snoj: unknown
};
type Word = {
    entry: { id: number, form: string },
    translations: Translation[],
    tags: Tag[],
    contents: Content[],
    variations: [],
    relations: [],
};

export type Tag = string;
export type Translation = { title: string, forms: string[] };
export type Content = { title: string, text: string };

import dictionary from "../bhat.json" with { type: "json" };
import { to_scansion } from "./to_scansion.ts";

function gen_scansion(words: Word[], filepath: string, title: string): void {
    const stripped = words.map(w => w.entry.form);
    const multiword_excluded = stripped.filter(w => !(w.includes(" ") || w.includes("_")));
    const scansions: [string, string][] = multiword_excluded.map(w => [to_scansion(w), w]);
    const grouped_by_scansion: [string, string[]][] =
        [...Map.groupBy(scansions, ([scansion, _]) => scansion)].map(([scansion, words]) => [scansion, words.map(([_, word]) => word)])
        ;

    // order by frequency
    grouped_by_scansion.sort((a, b) => - a[1].length + b[1].length);

    Deno.writeTextFileSync(filepath, `
<!DOCTYPE html>
<meta charset="utf-8">
<a href="./index.html">scansion 一覧に戻る</a>
<h1>${title}</h1>
Deno を入れ、手動で scansion/gen_scansion.bat を走らせて都度更新すること。
<h2>まとめ</h2>
<table cellpadding="5" cellspacing="0" border="1">
    <tr><th>scansion</th><th>数</th><th>単語</th></tr>
    ${grouped_by_scansion.map(([scansion, words]) => `<tr><td>${scansion}</td><td>${words.length}</td><td>${words.join(", ")}</td></tr>`).join("\n")}
</table>
<h2>個別</h2>
${grouped_by_scansion.map(
        ([scansion, words]) =>
            `<h3>${scansion}: ${words.length}</h3>
        <ul>${words.map((word) => `<li>${word}</li>`).join("\n")}</ul>`
    ).join("\n")
        }
`);

    console.log(grouped_by_scansion)
};


function filter_by_parts_of_speech(dict: Dict, parts_of_speech: string[]): Word[] {
    return dict.words.filter(word => word.translations.some(translation => parts_of_speech.includes(translation.title)));
}

const dict: Dict = dictionary as Dict;
const nouns = filter_by_parts_of_speech(dict, ["母音幹名詞", "子音幹名詞"]);
const verbs = filter_by_parts_of_speech(dict, ["動詞", "状態動詞", "動作動詞", "瞬間動詞"]);
const advs = filter_by_parts_of_speech(dict, ["副詞"]);
const prenominals = filter_by_parts_of_speech(dict, ["連体詞"]);


gen_scansion(nouns, "noun_scansion.html", "名詞の scansion");
gen_scansion(verbs, "verb_scansion.html", "動詞の scansion");
gen_scansion(advs, "adv_scansion.html", "副詞の scansion");
gen_scansion(prenominals, "prenominal_scansion.html", "連体詞の scansion");

Deno.writeTextFileSync("index.html", `
<!DOCTYPE html>
<meta charset="utf-8">
<a href="../index.html">トップに戻る</a>
<h1>scansion 一覧</h1>
<ul>
<li><a href="./noun_scansion.html">名詞の scansion</a></li>
<li><a href="./verb_scansion.html">動詞の scansion</a></li>
<li><a href="./adv_scansion.html">副詞の scansion</a></li>
<li><a href="./prenominal_scansion.html">連体詞の scansion</a></li>
</ul>
`);
