
//////////////////////////////////////////////////////////
/// Chapter 1. handling the current orthography (easy) ///
//////////////////////////////////////////////////////////
function split_from_current_to_phonetic(current) {
    current = current
    .replace(/-$/,"")
    .replaceAll("gán ", "ghán ") // genitive
    .replaceAll("gele ", "ghele ") // accusative
    .replaceAll("tn", "nn")
    .replaceAll("ṣl", "ṣ")
    .replaceAll("tṇ", "ṇṇ");


    let buffer = "";
    for (let i = 0; i < current.length; i++) {
        if (!"aiueoáíúh".includes(current[i])) {
            /* consonant: force split */
            buffer += "|";
        } else if (current[i] === "h" && !"pkbdg".includes(current[i-1])) {
             /* non-aspirate h */
            buffer += "|";
        } else if ("aiueoáíú".includes(current[i]) && "iueoáíú".includes(current[i-1])) {
            /* two consecutive vowels, the first of which is not "a" */
            buffer += "|";
        } else if ("aeoáíú".includes(current[i]) && "a" === current[i-1]) {
            /* "a" + vowel (neither "i" or "u") */
            buffer += "|";
        }
        buffer += current[i];
    }
    return buffer
        .split("|")
        .filter(u => ![" ", "_", ""].includes(u))
        .map(k => {
            k = k.trim();
            if ("aiuáíúeo".includes( k[0])) return "ʔ"+k;
            if (!"aiuáíúeo".includes(k[k.length - 1])) return k+"Ъ"
            return k;
        })
        .join(".")
        .replaceAll("a.jЪ","ai")
        .replaceAll("i.jЪ","í")
        ;
}
