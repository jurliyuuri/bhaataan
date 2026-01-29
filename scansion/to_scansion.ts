import { Phoneme, tokenize_into_phonetic_phonemes } from "./tokenize.ts";

export function to_scansion(w: string): string {
    const phonemes = tokenize_into_phonetic_phonemes(w);

    function to_value(phoneme: Phoneme): string {
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
    return scansion;
}