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
const dict: Dict = dictionary as Dict;
const nouns = dict.words.filter(word => word.translations.some(translation => translation.title === "母音幹名詞" || translation.title === "子音幹名詞"));

((words: Word[], filepath: string) => {
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
})(nouns, "noun_scansion.html");