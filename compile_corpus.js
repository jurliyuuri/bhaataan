"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const jsdom = __importStar(require("jsdom"));
let dictionary = JSON.parse(fs.readFileSync('bhat.json', { encoding: 'utf8', flag: 'r' }));
let dictionary_eng = JSON.parse(fs.readFileSync('bhat-to-eng.json', { encoding: 'utf8', flag: 'r' }));
const corpus = JSON.parse(fs.readFileSync('corpus/index.corpus.json', { encoding: 'utf8', flag: 'r' }));
/*for (let doc of corpus) {
    if (doc.type === "leipzigjs-glossed-doc") {
        for (let i = 0; i < doc.content.length; i++) {
            doc.content[i] = upgradeElem(doc.content[i]);
        }
    }
}

function upgradeElem(elem: Elem<LeipzigJsGlossedText>): Elem<LeipzigJsGlossedText> {
    if (elem.type !== "section") return elem;
    if (isLeipzigJsGlossedText(elem.content[0])) {
        if (elem.metadata) {
            return {
                "type": "section",
                "section_title": "",
                "content": [{
                    "type": "box",
                    "box_title": elem.section_title,
                    "metadata": elem.metadata,
                    "lines": elem.content as LeipzigJsGlossedText[],
                }]
            }
        } else {
            return {
                "type": "section",
                "section_title": "",
                "content": [{
                    "type": "box",
                    "box_title": elem.section_title,
                    "lines": elem.content as LeipzigJsGlossedText[],
                }]
            }
        }
    } else {
        for (let i = 0; i < elem.content.length; i++) {
            elem.content[i] = upgradeElem(elem.content[i] as Elem<LeipzigJsGlossedText>);
        }
        return elem;
    }
}

fs.writeFileSync("corpus/index.corpus_.json", JSON.stringify(corpus, undefined, "\t"));*/
const dom = new jsdom.JSDOM(`<!doctype html>
<html>
<head>
<title>バート語コーパス</title>
<meta charset="UTF-8">
<link rel="stylesheet" href="../common.css">
<link rel="stylesheet" href="../menu.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/leipzig/latest/leipzig.min.css">
<link href="https://fonts.googleapis.com/css?family=Inconsolata" rel="stylesheet" type="text/css">
<link href="https://fonts.googleapis.com/css?family=Space%20Mono" rel="stylesheet" type="text/css">
<link href="https://fonts.googleapis.com/css?family=Noto%20Sans%20Mono" rel="stylesheet" type="text/css">
<style>
.non_starting{background-color: #ffeeee}
.starting{background-color: #eeeeff}
.foreign{background-color: #eeeeee}
textarea { font-family: 'Noto Sans Mono', 'Source Code Pro', 'Inconsolata', 'Space Mono', 'Cousine', 'Overpass Mono', monospace; }
</style>
<style>.vow{color:red}.cons{color:blue}</style>
</head>
<body class="cool" style="font-family: Arial, Helvetica, sans-serif;">
<a href="../index.html">トップに戻る</a>

<p style="font-size: 140%; text-decoration: underline">注意：このページは corpus/index.corpus.json を compile_corpus.js で変換して自動生成しているものです。このページを手で直接編集しないでください。</p>
<p>以下で用いるglossの凡例：</p>
<table border="1" cellspacing="0" cellpadding="3" style="border-collapse:collapse;border-width:1px">
<tr><td>略</td><td>語</td><td>意味</td></tr>
<tr><td>NOM</td><td>nominative</td><td>主格</td></tr>
<tr><td>ZERO</td><td>zero</td><td>無格</td></tr>
<tr><td>ACC</td><td>accusative</td><td>対格</td></tr>
<tr><td>GEN</td><td>genitive</td><td>属格</td></tr>
<tr><td>INS</td><td>instrumental</td><td>具格</td></tr>
<tr><td>POST</td><td>postpositional</td><td>後置格</td></tr>
<tr><td>1</td><td>first person</td><td>一人称</td></tr>
<tr><td>2</td><td>second person</td><td>二人称</td></tr>
<tr><td>3F</td><td>third person feminine</td><td>三人称女性</td></tr>
<tr><td>3M</td><td>third person masculine</td><td>三人称男性</td></tr>
<tr><td>3N</td><td>third person neuter</td><td>三人称中性（「指示・固有」）</td></tr>
<tr><td>INF</td><td>infinitive</td><td>不定詞</td></tr>
<tr><td>REAL</td><td>realis</td><td>終止詞</td></tr>
<tr><td>PST.PTCP</td><td>past participle</td><td>過去分詞</td></tr>
<tr><td>FUT.PTCP</td><td>future participle</td><td>未来分詞</td></tr>
<tr><td>IMP</td><td>imperative</td><td>命令形</td></tr>
<tr><td>PFV</td><td>perfective</td><td>完結相~完了相などを表す無変化動詞hem</td></tr>
<tr><td>REL</td><td>relativizer</td><td>関係詞</td></tr>
<tr><td>NMLZ</td><td>nominalizer</td><td>名詞化第一〜第五接尾辞</td></tr>
<tr><td>PL</td><td>plural</td><td>複数形</td></tr>
<tr><td>IPFV.ADV</td><td>imperfective, adverbial</td><td>非完了の状況副詞化語尾</td></tr>
</table>

<h2>バート語例文</h2>

<div id="main_content"></div>

<div id="menu">読み込み中…</div>
<div id="menuButton" onclick="openClose()">≡</div>

<script src="../header.js" async></script>
<script src="https://cdn.jsdelivr.net/leipzig/latest/leipzig.min.js"></script>
<script>
 document.addEventListener('DOMContentLoaded', function() {
  	var leipzig = Leipzig();
    leipzig.addAbbreviations({REAL:"realis",ZERO:"zero",POST:"postpositional",REL:"relativizer", CF: "counterfactual conditional"/* https://en.wikipedia.org/wiki/Counterfactual_conditional */});
    leipzig.gloss()
  });
</script>
</body>
</html>
`);
const document = dom.window.document;
let counter = 1;
for (let ind = 0; ind < corpus.length; ++ind) {
    const doc = corpus[ind];
    if (doc.document_title !== corpus[ind - 1]?.document_title) {
        document.getElementById("main_content")?.append(...serializeDoc(document, doc, counter, { show_title: true }));
        counter++;
    }
    else {
        document.getElementById("main_content")?.append(...serializeDoc(document, doc, counter, { show_title: false }));
    }
}
function chooseAdequateColsRows(txt) {
    const cols = Math.max(...txt.split("\n").map(line => line.length));
    if (cols > 100) {
        return { cols: 100, rows: txt.length / 70 };
    }
    else {
        return { cols, rows: txt.split("\n").length };
    }
}
function isLeipzigJsGlossedText(a) {
    return a.type === "leipzigjs-glossed-text";
}
function serializeGlossList(content, o) {
    const outer_div = document.createElement("div");
    outer_div.classList.add("box");
    if (o.poisoned) {
        outer_div.style.borderColor = "red";
    }
    for (let i = 0; i < content.length; ++i) {
        if (i !== 0) {
            outer_div.append("\t", document.createElement("hr"));
        }
        const inner_div = document.createElement("div");
        inner_div.setAttribute("data-gloss", "");
        const analyzed_text = document.createElement("p");
        analyzed_text.textContent = content[i].analyzed_text;
        const gloss = document.createElement("p");
        gloss.textContent = content[i].gloss;
        const translation = document.createElement("p");
        translation.textContent = content[i].translation;
        inner_div.append("\n\t\t", analyzed_text, "\n\t\t", gloss, "\n\t\t", translation, "\n\t");
        outer_div.append("\n\t", inner_div, "\n");
    }
    return [outer_div, "\n"];
}
function serializeNestedContent(content) {
    let ans = [];
    for (const c of content) {
        if (c.type === "section") {
            const title = document.createElement("p");
            title.textContent = c.section_title.trim() === "" ? "" : `${c.section_title}：`;
            if (c.metadata?.src_link) {
                const a = document.createElement("a");
                a.href = c.metadata?.src_link;
                a.textContent = `${c.section_title}`;
                title.textContent = ``;
                title.appendChild(a);
            }
            ans = [...ans, "\n", title, "\n", ...serializeContent(c.content, { poisoned: false }), "\n"];
        }
        else if (c.type === "box") {
            const title = document.createElement("p");
            title.textContent = c.box_title.trim() === "" ? "" : `${c.box_title}：`;
            if (c.metadata?.src_link) {
                const a = document.createElement("a");
                a.href = c.metadata?.src_link;
                a.textContent = `${c.box_title}`;
                title.textContent = ``;
                title.appendChild(a);
            }
            ans = [...ans, "\n", title, "\n", ...serializeGlossList(c.lines, { poisoned: false }), "\n"];
        }
        else if (c.type === "box_for_inadequate") {
            const title = document.createElement("p");
            title.textContent = c.box_for_inadequate_title.trim() === "" ? "" : `${c.box_for_inadequate_title}：`;
            if (c.metadata?.src_link) {
                const a = document.createElement("a");
                a.href = c.metadata?.src_link;
                a.textContent = `${c.box_for_inadequate_title}`;
                title.textContent = ``;
                title.appendChild(a);
            }
            ans = [...ans, "\n", title, "\n", ...serializeGlossList(c.lines, { poisoned: true }), "\n"];
        }
        else if (c.type === "plaintext-sidenote") {
            const title_and_sidenote = document.createElement("p");
            title_and_sidenote.textContent = c.sidenote_title === "" ? c.sidenote : `${c.sidenote_title}：${c.sidenote}`;
            ans = [...ans, "\n", title_and_sidenote];
        }
        else if (c.type === "html-sidenote") {
            const title = document.createElement("p");
            title.textContent = c.sidenote_title;
            const sidenote = document.createElement("div");
            sidenote.innerHTML = c.sidenote;
            ans = [...ans, "\n", title, "\n", sidenote];
        }
        else {
            let _ = c;
            console.log(c);
            throw new Error(`Unexpected "type" found within serializeNestedContent`);
        }
    }
    return ans;
}
function serializeContent(content, o) {
    if (isLeipzigJsGlossedText(content[0])) {
        return serializeGlossList(content, o);
    }
    else {
        return serializeNestedContent(content);
    }
}
function serializeDoc(document, doc, ind, o) {
    let title = document.createElement("h3");
    title.textContent = `${ind}. ${doc.document_title}`;
    if (doc.type === "raw-text-doc") {
        const textarea = document.createElement("textarea");
        const { cols, rows } = chooseAdequateColsRows(doc.text);
        textarea.setAttribute("cols", `${cols}`);
        textarea.setAttribute("rows", `${rows}`);
        textarea.textContent = doc.text;
        if (!o.show_title) {
            title = document.createElement("p");
            title.textContent = "単純テキスト：";
        }
        return [title, "\n", textarea, "\n"];
    }
    else if (doc.type === "leipzigjs-glossed-doc") {
        if (doc.metadata?.src_link) {
            const a = document.createElement("a");
            a.href = doc.metadata?.src_link;
            a.textContent = `${doc.document_title}`;
            title.textContent = `${ind}. `;
            title.appendChild(a);
            const elems = serializeNestedContent(doc.content);
            if (!o.show_title) {
                title = document.createElement("p");
                title.textContent = "単純テキスト：";
            }
            return [title, "\n", ...elems, "\n"];
        }
        else {
            const elems = serializeNestedContent(doc.content);
            if (!o.show_title) {
                title = document.createElement("p");
                title.textContent = "単純テキスト：";
            }
            return [title, "\n", ...elems, "\n"];
        }
    }
    else {
        let _ = doc;
        console.log(doc);
        throw new Error(`Unexpected "type" found for a Doc: expected 'raw-text-doc' or 'leipzigjs-glossed-doc' but got '${doc.type}'`);
    }
}
fs.writeFileSync("corpus/index.html", dom.serialize());
// console.log(textContent); // "Hello world"
// console.log(dictionary.words);
// console.log(get_duplicates(["1", "2", "1"]))
// console.log(get_duplicates(dictionary.words.map((e: { entry: { id: number, form: string } }) => e.entry.form)));
function get_duplicates(arrs) {
    const counted = arrs.map((name) => ({ count: 1, name }))
        .reduce((result, b) => {
        result.set(b.name, (result.get(b.name) || 0) + b.count);
        return result;
    }, new Map());
    // console.log(counted);
    const ans = [];
    counted.forEach((value, key) => {
        if (value > 1) {
            ans.push(key);
        }
    });
    return ans;
}
