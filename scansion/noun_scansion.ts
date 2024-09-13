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
const dict: Dict = dictionary as Dict;
const nouns = dict.words.filter(word => word.translations.some(translation => translation.title === "母音幹名詞" || translation.title === "子音幹名詞"));

const nouns_stripped = nouns.map(noun => noun.entry.form);

const single_nouns = nouns_stripped.filter(noun => !(noun.includes(" ") || noun.includes("_")));
const scansions: [string, string][] = single_nouns.map(w => [
    tokenize_into_phonemes(w).map(to_value).join(",").replaceAll(/C,V/g, "CV").replaceAll(/V,C(,|$)/g, "VC$1").replace(/^CV/, "(C)V").replace(/^V/, "(C)V").replaceAll(/,/g, "|")
    , w]);

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
${
    nouns_grouped_by_scansion.map(
        ([scansion, words]) => 
        `<h3>${scansion}: ${words.length}</h3>
        <ul>${words.map((word) => `<li>${word}</li>`).join("\n")}</ul>`    
    ).join("\n")
}
`);

console.log(nouns_grouped_by_scansion)

function tokenize_into_phonemes(input: string): string[] {
    const tokens = raw_tokenize(input);

    const result: string[] = [];

    // replace ["a", "j"] with ["aj"] when not followed by a vowel
    // replace ["i", "j"] with ["ij"] when not followed by a vowel
    for (let i = 0; i < tokens.length; i++) {
        if ((tokens[i] === "a" || tokens[i] === "i") && tokens[i + 1] === "j") {
            if (i + 2 === tokens.length || !["ai", "au", "á", "í", "ú", "e", "o", "a", "i", "u"].includes(tokens[i + 2])) {
                result.push(tokens[i] + tokens[i + 1]);
                i++;
                continue;
            }
        }
        result.push(tokens[i]);
    }
    return result;
}

function raw_tokenize(input: string): string[] {
    if (input === "") {
        return [];
    }

    if (input === "bhoman") {
        return ["bh", "ŏ", "m", "a", "n"];
    }

    // searched from the first, so the order matters
    const phonemes = [
        "ai", "au", "á", "í", "ú", "e", "o", /* heavy vowels */
        "a", "i", "u", /* light vowels */
        "ph", "bh", "dh", "kh", "gh", "ṣl",
        "p", "b", "m", "w", "n", "t", "d", "c", "s", "l", "r", "ṇ", "ṭ", "ḍ", "ṣ", "ḷ", "k", "h", "g", "x", "z", "j", "y"
    ];

    let remaining = input;
    const result: string[] = [];

    while (remaining !== "") {
        const phoneme = phonemes.find(phoneme => remaining.startsWith(phoneme));
        if (phoneme === undefined) {
            throw new Error(`Cannot read a valid phoneme at the start of "${remaining}"\nFound while trying to tokenize "${input}"`);
        }
        result.push(phoneme);
        remaining = remaining.slice(phoneme.length);
    }

    return result;
}

function to_value(phoneme: string): string {
    if (["ai", "au", "aj", "ij", "á", "í", "ú", "e", "o"].includes(phoneme)) {
        return "VV";
    }
    if (["a", "i", "u", "ŏ"].includes(phoneme)) {
        return "V";
    }
    return "C";
}