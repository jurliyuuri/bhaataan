"use strict";
/*
 lexNautu("nauṭu") // ['n', 'au', 'ṭ', 'u']
 lexNautu("gháwanúnímaṣ") // ['gh', 'á', 'w', 'a', 'n', 'ú', 'n', 'í', 'm', 'a', 'ṣ']
 lexNautu("heyákáṣlo") // ['h', 'e', 'y', 'á', 'k', 'á', 'ṣ', 'l', 'o']
 lexNautu("accabát") // ['a', 'c', 'c', 'a', 'b', 'á', 't']
 */
const lexNautu = (word) => {
    word = word.normalize("NFC");
    const ans = [];
    for (let i = 0; i < word.length; i++) {
        const c = word[i];
        switch (c) {
            case "i":
            case "u":
            case "e":
            case "o":
            case "t":
            case "m":
            case "n":
            case "l":
            case "c":
            case "s":
            case "y":
            case "j":
            case "w":
            case "x":
            case "z":
            case "ṭ":
            case "ḍ":
            case "h":
            case "ḷ":
            case "ṇ":
            case "á":
            case "í":
            case "ú":
            case "ṣ":
            case "r":
                ans.push(c);
                break;
            case "p":
            case "b":
            case "d":
            case "k":
            case "g":
                if (word[i + 1] === "h") {
                    ans.push((c + "h"));
                    i++;
                }
                else {
                    ans.push(c);
                }
                break;
            case "a":
                if (word[i + 1] === "i" || word[i + 1] === "u") {
                    ans.push((c + word[i + 1]));
                    i++;
                }
                else {
                    ans.push(c);
                }
                break;
            default:
                console.error(`Unexpected character ${c}, ${JSON.stringify([...c])}`);
        }
    }
    return ans;
};
// JSON.stringify(syllabifyBaani(lexNautu("accabát"))) === '[["∅","aQ"],["c","a"],["b","á"],["t","ъ"]]'
// JSON.stringify(syllabifyBaani(lexNautu("juecleone"))) === '[["j","u"],["∅","e"],["c","ъ"],["l","e"],["∅","o"],["n","e"]]'
// JSON.stringify(syllabifyBaani(lexNautu("ghitto"))) === '[["gh","iQ"],["t","o"]]'
const syllabifyBaani = (tokens) => {
    const ans = [];
    let onset = null;
    for (let i = 0; i < tokens.length; i++) {
        const t = tokens[i];
        if (!onset) { // consonant is expected
            if (t === "i" || t === "u" || t === "e" || t === "o"
                || t === "á" || t === "í" || t === "ú"
                || t === "a" || t === "ai" || t === "au") {
                onset = "∅";
                // Expect a vowel and retry
                i--;
            }
            else {
                onset = t;
            }
        }
        else { // vowel is expected
            if (t === "i" || t === "u" || t === "e" || t === "o"
                || t === "á" || t === "í" || t === "ú"
                || t === "a" || t === "ai" || t === "au") {
                // geminate consonant
                if (tokens[i + 1] && tokens[i + 2] && tokens[i + 1] === tokens[i + 2]) {
                    const geminate = {
                        "i": "iQ", "u": "uQ", "e": "eQ", "a": "aQ", "á": "áQ",
                        "ú": "úQ", "ai": "aiQ", "au": "auQ", "o": "oQ", "í": "íQ"
                    };
                    ans.push([onset, geminate[t]]);
                    i++; // skip one of the geminate consonants
                    onset = null; // The next iteration of the loop should supply the onset
                }
                else {
                    ans.push([onset, t]);
                    onset = null;
                }
            }
            else {
                // The old onset should be pushed with an accompanying "ъ"
                ans.push([onset, "ъ"]);
                // And the onset itself should be updated
                onset = t;
            }
        }
    }
    if (onset !== null) {
        ans.push([onset, "ъ"]);
    }
    return ans;
};
function compare_syllable(s1, s2) {
    const consonant_index = {
        p: 0, ph: 1,
        b: 10, bh: 11,
        m: 20,
        c: 30, ṣ: 31,
        s: 40,
        x: 50,
        z: 60,
        t: 70, ṭ: 71,
        d: 80, dh: 81, ḍ: 82,
        n: 90, ṇ: 91,
        l: 100, ḷ: 101,
        r: 110,
        k: 120, kh: 121,
        g: 130, gh: 131,
        h: 140,
        j: 150, y: 151,
        w: 160,
        "∅": 170,
    };
    if (consonant_index[s1[0]] - consonant_index[s2[0]] >= 5) {
        return "clearly later than";
    }
    else if (consonant_index[s1[0]] - consonant_index[s2[0]] <= -5) {
        return "clearly earlier than";
    }
    else {
        // The consonant is a tie; compare the vowels
        const vowel_index = {
            "a": 0, "ъ": 1, "aQ": 2,
            "á": 10, "áQ": 11,
            "e": 20, "eQ": 21,
            "i": 30, "iQ": 31,
            "í": 40, "íQ": 41,
            "u": 50, "uQ": 51,
            "ú": 60, "úQ": 61,
            "o": 70, "oQ": 71,
            "ai": 80, "aiQ": 81,
            "au": 90, "auQ": 91,
        };
        if (vowel_index[s1[1]] - vowel_index[s2[1]] >= 5) {
            return "clearly later than";
        }
        else if (vowel_index[s1[1]] - vowel_index[s2[1]] <= -5) {
            return "clearly earlier than";
        }
        else {
            // both the consonants and the vowels give a tie when we ignore the diacritics. 
            // Hence the difference is marginal.
            if (consonant_index[s1[0]] > consonant_index[s2[0]]) {
                return "marginally later than";
            }
            else if (consonant_index[s1[0]] < consonant_index[s2[0]]) {
                return "marginally earlier than";
            }
            else {
                // consonants are truly equal
                if (vowel_index[s1[1]] > vowel_index[s2[1]]) {
                    return "marginally later than";
                }
                else if (vowel_index[s1[1]] < vowel_index[s2[1]]) {
                    return "marginally earlier than";
                }
                else {
                    // s1[0] === s2[0] && s1[1] === s2[1]
                    return "exactly equal to";
                }
            }
        }
    }
}
function compBhat(w1, w2) {
    const s1 = syllabifyBaani(lexNautu(w1));
    const s2 = syllabifyBaani(lexNautu(w2));
    // First check if there is any clear difference
    for (let i = 0; i < s2.length; i++) {
        // s1 ran out; then s1 is listed first
        if (!s1[i]) {
            return -1;
        }
        else {
            const comp = compare_syllable(s1[i], s2[i]);
            if (comp === "clearly earlier than") {
                return -1;
            }
            else if (comp === "clearly later than") {
                return 1;
            }
        }
    }
    // If the control flow reaches here, a significant difference was not noted in the first s2.length syllables
    // Did s2 run out?
    if (s1.length > s2.length) {
        return 1;
    }
    // Tie; rerun the loop, but this time also take into the marginal difference
    for (let i = 0; i < s2.length; i++) {
        const comp = compare_syllable(s1[i], s2[i]);
        if (comp === "marginally earlier than") {
            return -1;
        }
        else if (comp === "marginally later than") {
            return 1;
        }
    }
    // No difference found
    return 0;
}
