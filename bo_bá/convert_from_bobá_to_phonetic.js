////////////////////////////////////////
/// Chapter 2. handling bo_bá (hard) ///
////////////////////////////////////////

/////// The function in its entirety, split into eight stages ///////
function convert_from_bobá_to_phonetic(bo_bá) {
    const original_input = bo_bá;

    // stage 1. Remove the colons denoting borrowed words
    bo_bá = bo_bá.replaceAll(":","");

    // stage 2. Handle diacritics and brackets
    bo_bá = stage2_handle_diacritics(bo_bá);
    bo_bá = stage2_handle_brackets(bo_bá);
    const after_stage_2 = bo_bá;

    // 3. "Q" makes the following consonant long
    bo_bá = bo_bá.replaceAll(/Q(.)/g, "$1Ъ$1")

    // 4. Adjustments 
    // 4-1. adjustments regarding auxiliary symbol ʕ
    bo_bá = bo_bá.replaceAll("ÁʕЪ", "á");
    bo_bá = bo_bá.replaceAll("IʕÍ", "Í");
    bo_bá = bo_bá.replaceAll("ʕЪ", "á"); // TODO: must check that the preceding letter is not a vowel
    // 4-2. adjustments regarding -w
    bo_bá = bo_bá.replaceAll(/[VW]Ъ/g, "wЪ");
    // 4-3. adjustments regarding -u + stray Ъ (suúḷ)
    bo_bá = bo_bá.replaceAll(/UЪ/g, "U");
    const after_stage_4 = bo_bá;

    // 5. Split into superficial syllables
    const split = stage5_to_superficial_syllables(bo_bá);
    if (split[0] !== "|") throw new Error(`The input “${original_input}” did not begin with a consonantal letter`);
    const after_stage_5 = split;
    
    // 6. Simplify each superficial syllables
    let simplified = split.slice(1).split("|").map(stage6_simplify_superficial_syllable).join("=");
    const after_stage_6 = simplified;

    // 7. context-dependent replacements (such as those regarding jЪ, wЪ, L)
    simplified = stage7_context_dependent_replacements(simplified);
    const after_stage_7 = simplified;

    // 8. avoid forbidden syllables
    let permissible = simplified.split("=").map(s => stage8_to_permissible(s, original_input)).join(".");

    return {
        after_stage_2,
        after_stage_4,
        after_stage_5,
        after_stage_6,
        after_stage_7,
        after_stage_8: permissible
    };
}

/////// The rest are the smaller functions handling each stage ///////

function stage2_handle_diacritics(bo_bá) {
    const strong = { 
        diacritic: "\u0348", 
        table:
        [
            ["M", "b"],
            ["W", "w"],
            ["H", "w"],
            ["J", "y"],

            ["B", "b"],
            ["D", "d"],
            ["G", "g"],

            ["R", "ṣ"],

            ["P", "ᵽ"],
            ["F", "ᵽ"],
            ["K", "ꝁ"],

            ["ʔ", "h"],
        ]
    };

    const retract = {
        diacritic: "\u0320",
        table: [
            ["D", "ḍ"],
            ["T", "ṭ"],
            ["C", "ṣ"],
            ["N", "ṇ"],
            ["B", "D"],
            //-------
            ["I", "ɨ"],
            ["Í", "★"] // ɨ́
        ]
    };

    const lower = {
        diacritic: "\u031E",
        table: [
            ["É", "á"],
            ["È", "á"],
            ["Ò", "á"],
            ["Ó", "á"],
            ["Ú", "o"],
            ["Í", "e"],
            //-------
            ["L", "w"],
        ]
    };

    const advance = {
        diacritic: "\u031F",
        table: [
            ["V", "y"],
            ["W", "y"],
            ["L", "j"],
            ["H", "j"],
            ["Ɲ", "n"],
            //-------
            ["U", "ɨ"],
        ]
    };

    const weak = {
        diacritic: "\u0349",
        table: [
            ["Ú", "á"],
            ["U", "a"],
            ["Ó", "wЪ"],
            ["Í", "jЪ"],
            //-------
            ["L", "ʕ"],
            ["B", "h"],
            ["G", "ʕ"],
            ["W", ""], /* disappears without trace */ 
            ["ʔ", ""], /* disappears without trace */
            
        ]
    };

    bo_bá = apply(strong, bo_bá);
    bo_bá = apply(retract, bo_bá);
    bo_bá = apply(lower, bo_bá);
    bo_bá = apply(advance, bo_bá);
    bo_bá = apply(weak, bo_bá);
    
    function apply(rule, input) {
        rule.table.forEach(([before, after]) => {
            input = input.replaceAll(before + rule.diacritic, after);
        });
        return input;
    }

    return bo_bá;

}

function stage2_handle_brackets(bo_bá) {
    /*----------
      nasal brackets 
     ----------*/
    // double
    bo_bá = bo_bá.replaceAll(/〚[TNM]Ъ[MB]〛/g, "mЪm");
    bo_bá = bo_bá.replaceAll(/〚[TN]Ъ[NLD]〛/g, "nЪn");
    bo_bá = bo_bá.replaceAll(/〚[TNMŊ]Ъ[ƝJK]〛/g, "ṇЪṇ");

    // single
    bo_bá = bo_bá.replaceAll(/\[[TNM]Ъ[MB]\]/g, "m");
    bo_bá = bo_bá.replaceAll(/\[[TN]Ъ[NLD]\]/g, "n");
    bo_bá = bo_bá.replaceAll(/\[[TNMŊ]Ъ[ƝJK]\]/g, "ṇ");

    /*--------
      liquid double braces 
      -------*/
    
    bo_bá = bo_bá.replaceAll(/⧚WЪL⧛/g, "lЪl");
    bo_bá = bo_bá.replaceAll(/⧚RЪṣ⧛/g, "r"); // r is long
    bo_bá = bo_bá.replaceAll(/⧚MЪC⧛/g, "r"); // r is long

    /*--------
      liquid single braces 
      -------*/
    bo_bá = bo_bá.replaceAll(/⧘[ṣX]Ъ[ṣWR]⧙/g, "ṣ");

    return bo_bá;
}

function stage5_to_superficial_syllables(bo_bá) {
    let buffer = "";
    for (let i = 0; i < bo_bá.length; i++) {
        if (!"ÁÍÚAIUÉÓÈÒЪaiueoáíúɨ★".includes(bo_bá[i])) {
            buffer += "|";
        }
        buffer += bo_bá[i];
    }
    return buffer;
}

function stage6_simplify_superficial_syllable(s) {
    // replace vowels
    s = s.replaceAll("Á", "á");
    s = s.replaceAll("Í", "í");
    s = s.replaceAll("Ó", "o");
    s = s.replaceAll("É", "e");
    s = s.replaceAll("Ú", "ú");
    s = s.replaceAll("I", "i");
    s = s.replaceAll("U", "u");

    // replace consonants
    s = s.replaceAll("R", "r");
    s = s.replaceAll("T", "t");
    s = s.replaceAll("H", "h");
    s = s.replaceAll("N", "n");
    s = s.replaceAll("M", "m");
    s = s.replaceAll("K", "k");
    s = s.replaceAll("J", "j");
    s = s.replaceAll("S", "s");
    s = s.replaceAll("C", "c");
    s = s.replaceAll("P", "p"); 
    s = s.replaceAll("Z", "z"); 
    s = s.replaceAll("X", "x");
    s = s.replaceAll("W", "h"); // nontrivial
    s = s.replaceAll("V", "bh"); // nontrivial
    s = s.replaceAll("ꝁ", "kh"); // nontrivial
    s = s.replaceAll("ᵽ", "ph"); // nontrivial
    s = s.replaceAll("B", "bh"); // nontrivial
    s = s.replaceAll("D", "dh"); // nontrivial
    s = s.replaceAll("G", "gh"); // nontrivial
    s = s.replaceAll("F", "p"); // nontrivial
    s = s.replaceAll("Ɲ", "ṇ"); // nontrivial
    s = s.replaceAll("Ŋ", "ṇ"); // nontrivial

    // add inherent "a"s where needed
    if (!"áíúÈÒaiueoɨ★Ъ".includes(s[s.length - 1])) {
        s += "a";
    }

    // special syllables
    if (s === "ghiá") return "já";

    return s;
}

function stage7_context_dependent_replacements(u) {
    // 7-1. remove "=jЪ" 
    u = u.replaceAll("a=jЪ", "È");
    u = u.replaceAll("á=jЪ", "á");
    u = u.replaceAll("i=jЪ", "í");
    u = u.replaceAll("u=jЪ", "ú");

    // 7-2. remove "=wЪ"
    u = u.replaceAll("a=wЪ", "Ò");
    u = u.replaceAll("á=wЪ", "Ò");
    u = u.replaceAll("ú=wЪ", "ú");
    u = u.replaceAll("o=wЪ", "o");

    // 7-3. choose l vs. ḷ
    u = u.replaceAll(/LЪ=L/g, "lЪ=l");
    u = u.replaceAll(/cЪ=L/g, "cЪ=l");
    u = u.replaceAll(/(?<=xe)=L/g, "=ḷ"); // lexeḷ
    u = u.replaceAll(/(?<=[iíe])=L/g, "=l");
    u = u.replaceAll(/=L(?=[iíe])/g, "=l");
    u = u.replaceAll(/^L/g, "l");
    u = u.replaceAll(/L/g, "ḷ");

    // 7-4. "È=j" or "È=y"  is "á=j", except ṣibhaijoṇu
    u = u.replaceAll(/(?<!ṣɨ=bh)È=[jy]/g, "á=j");

    // 7-5. "Ò=w" is "á=w"
    u = u.replaceAll("Ò=w", "á=w");

    // 7-6. "ʔЪ=ʔ" is spelled as "tЪ=t"
    u = u.replaceAll("ʔЪ=ʔ", "tЪ=t");

    // 7-7. "xЪ=ṣ" is "ṣЪ=ṣ"
    u = u.replaceAll("xЪ=ṣ", "ṣЪ=ṣ");

    // 7-8. "kЪ=h" is "kh"
    u = u.replaceAll("kЪ=h", "kh");
    return u;
}

function stage8_to_permissible(s, original_input) {
    if (["yi", "ji", "ʔi"].includes(s)) return "ghi";
    if (s === "wu") return "ʔu";
    if (s === "wú") return "ʔú";
    if (s === "je") return "ʔe";
    if (s === "yЪ") return "jЪ"; // indestructible jЪ (e.g. phettuj)

    // check that retroflex are never followed by "i" or "í"
    if (/[ṣṭḍṇḷ][ií]/.test(s)) {
        throw new Error(`The input “${original_input}” has a retroflex followed by a non-retroflex i/í`)
    }

    // after checking, we can use the usual spelling
    if ("ṣṭḍṇḷ".includes(s[0]) && s[1] === "ɨ") return s[0]+"i";
    if ("ṣṭḍṇḷ".includes(s[0]) && s[1] === "★") return s[0]+"í";

    // Do we have any stray "ɨ" or "★"?
    if (/[ɨ★]/.test(s)) {
        throw new Error(`The input “${original_input}” has a stray retroflex vowel after a non-retroflex consonant`);
    }

    // Finally, replace the "È" and "Ò"
    return s.replaceAll("È", "ai").replaceAll("Ò", "au");
}