// deno run noun_scansion.ts

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
import { tokenize_into_phonemes } from "./tokenize";
const dict: Dict = dictionary as Dict;
const nouns = dict.words.filter(word => word.translations.some(translation => translation.title === "母音幹名詞" || translation.title === "子音幹名詞"));

const nouns_stripped = nouns.map(noun => noun.entry.form);

const single_nouns = nouns_stripped.filter(noun => !(noun.includes(" ") || noun.includes("_")));
const scansions: [string, string][] = single_nouns.map(w => {
    const phonemes = tokenize_into_phonemes(w);


    function to_value(phoneme: string): string {
        if (["ai", "au", "aj", "ij", "á", "í", "ú", "e", "o"].includes(phoneme)) {
            return "VV";
        }
        if (["a", "i", "u", "ŏ"].includes(phoneme)) {
            return "V";
        }
        return "C";
    }

    const values: string[] = [];

    // When two equal consonants are adjacent, the first one is transcribed as a Q and the second one as a C.
    for (let i = 0; i < phonemes.length; i++) {
        const current_phoneme = phonemes[i];
        if (to_value(current_phoneme) !== "C") {
            values.push(to_value(current_phoneme));
            continue;
        }

        if (i === phonemes.length - 1) {
            values.push(to_value(current_phoneme));
            continue;
        }

        const next_phoneme = phonemes[i + 1];
        if (current_phoneme === next_phoneme) {
            values.push("Q");
            continue;
        }

        values.push(to_value(current_phoneme));
    }

    const scansion = values.join(",").replaceAll(/C,V/g, "CV").replaceAll(/V,C(,|$)/g, "VC$1").replaceAll(/V,Q(,|$)/g, "VQ$1").replace(/^CV/, "(C)V").replace(/^V/, "(C)V").replaceAll(/,/g, "|");

    return [scansion, w];
});

const nouns_grouped_by_scansion: [string, string[]][] =
    [...Map.groupBy(scansions, ([scansion, _]) => scansion)].map(([scansion, words]) => [scansion, words.map(([_, word]) => word)])
    ;

nouns_grouped_by_scansion.sort((a, b) => - a[1].length + b[1].length);

Deno.writeTextFileSync("noun_scansion.html", `
<!DOCTYPE html>
<meta charset="utf-8">
Deno を入れ、手動で scansion/gen_scansion.bat を走らせて都度更新すること。
<h2>まとめ</h2>
<table cellpadding="5" cellspacing="0" border="1">
    <tr><th>scansion</th><th>数</th><th>単語</th></tr>
    ${nouns_grouped_by_scansion.map(([scansion, words]) => `<tr><td>${scansion}</td><td>${words.length}</td><td>${words.join(", ")}</td></tr>`).join("\n")}
</table>
<h2>個別</h2>
${nouns_grouped_by_scansion.map(
    ([scansion, words]) =>
        `<h3>${scansion}: ${words.length}</h3>
        <ul>${words.map((word) => `<li>${word}</li>`).join("\n")}</ul>`
).join("\n")
    }
`);

console.log(nouns_grouped_by_scansion)
