
export function tokenize_into_phonetic_phonemes(input: string): Phoneme[] {
    const tokens = raw_tokenize(input);

    const result: Phoneme[] = [];

    // replace ["a", "j"] with ["aj"] when not followed by a vowel
    // replace ["i", "j"] with ["ij"] when not followed by a vowel
    for (let i = 0; i < tokens.length; i++) {
        if ((tokens[i] === "a" || tokens[i] === "i") && tokens[i + 1] === "j") {
            if (i + 2 === tokens.length || !["ai", "au", "á", "í", "ú", "e", "o", "a", "i", "u"].includes(tokens[i + 2])) {
                result.push(tokens[i] === "a" ? "aj" : "ij");
                i++;
                continue;
            }
        }
        result.push(tokens[i]);
    }
    return result;
}

export type Phoneme = "ai" | "au" |
    "ŏ" |
    "á" | "í" | "ú" | "e" | "o" |
    "a" | "i" | "u" |
    "ph" | "bh" | "dh" | "kh" | "gh" | "ṣl" |
    "p" | "b" | "m" | "w" | "n" | "t" | "d" | "c" | "s" | "l" | "r" | "ṇ" | "ṭ" | "ḍ" | "ṣ" | "ḷ" | "k" | "h" | "g" | "x" | "z" | "j" | "y" |
    "aj" | "ij" /*| "uj"*/;

export function raw_tokenize(input: string): Phoneme[] {
    if (input === "") {
        return [];
    }

    if (input === "bhoman") {
        return ["bh", "ŏ", "m", "a", "n"];
    }

    // searched from the first, so the order matters
    const phonemes: Phoneme[] = [
        "ai", "au", "á", "í", "ú", "e", "o", /* heavy vowels */
        "a", "i", "u", /* light vowels */
        "ph", "bh", "dh", "kh", "gh", "ṣl",
        "p", "b", "m", "w", "n", "t", "d", "c", "s", "l", "r", "ṇ", "ṭ", "ḍ", "ṣ", "ḷ", "k", "h", "g", "x", "z", "j", "y"
    ];

    let remaining = input;
    const result: Phoneme[] = [];

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

