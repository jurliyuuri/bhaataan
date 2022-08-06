import * as fs from 'fs';
import * as jsdom from 'jsdom';
import { Doc, HTMLSidenote, LeipzigJsGlossedText, PlainTextSidenote, Section, BoxForInadequate, Sidenote, Box, Elem, Metadata } from './corpus_type';

const corpus: Doc[] = JSON.parse(fs.readFileSync('corpus/index.corpus.json', { encoding: 'utf8', flag: 'r' }));

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

for (let ind = 0; ind < corpus.length; ++ind) {
	const doc = corpus[ind];
	if (doc.title !== corpus[ind - 1]?.title) {
		document.getElementById("main_content")?.append(...serializeDoc(document, doc,  { show_title: true }));
	} else {
		document.getElementById("main_content")?.append(...serializeDoc(document, doc,  { show_title: false }));
	}
}

function chooseAdequateColsRows(txt: string): { cols: number, rows: number } {
	const cols = Math.max(...txt.split("\n").map(line => line.length));
	if (cols > 100) {
		return { cols: 100, rows: txt.length / 70 };
	} else {
		return { cols, rows: txt.split("\n").length };
	}
}

function serializeGlossList(content: LeipzigJsGlossedText[], o: { poisoned: boolean }): (HTMLElement | string)[] {
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

function createTagFromTitleAndMetadata(tagname: string, c: { title: string, metadata?: Metadata }) {
	const title = document.createElement(tagname);
	title.textContent = c.title.trim() === "" ? "" : `${c.title}：`;
	if (c.metadata?.src_link) {
		const a = document.createElement("a");
		a.href = c.metadata?.src_link;
		a.textContent = `${c.title}`;
		title.textContent = ``;
		title.appendChild(a);
	}
	return title;
}

function serializeElems(content: Elem<LeipzigJsGlossedText>[]): (HTMLElement | string)[] {
	let ans: (HTMLElement | string)[] = [];
	for (const c of content) {
		if (c.type === "section") {
			ans = [...ans, "\n", createTagFromTitleAndMetadata("p", c), "\n", ...serializeElems(c.content), "\n"];
		} else if (c.type === "box") {
			ans = [...ans, "\n", createTagFromTitleAndMetadata("p", c), "\n", ...serializeGlossList(c.lines, { poisoned: false }), "\n"];
		} else if (c.type === "box_for_inadequate") {
			ans = [...ans, "\n", createTagFromTitleAndMetadata("p", c), "\n", ...serializeGlossList(c.lines, { poisoned: true }), "\n"];
		} else if (c.type === "plaintext-sidenote") {
			const title_and_sidenote = document.createElement("p");
			title_and_sidenote.textContent = c.title === "" ? c.sidenote : `${c.title}：${c.sidenote}`;
			ans = [...ans, "\n", title_and_sidenote];
		} else if (c.type === "html-sidenote") {
			const title = document.createElement("p");
			title.textContent = c.title;
			const sidenote = document.createElement("div");
			sidenote.innerHTML = c.sidenote;
			ans = [...ans, "\n", title, "\n", sidenote];
		} else {
			let _: never = c;
			console.log(c);
			throw new Error(`Unexpected "type" found within serializeNestedContent`);
		}
	}
	return ans;
}

function serializeDoc(document: Document, doc: Readonly<Doc>, o: { show_title: boolean }): (HTMLElement | string)[] {
	if (doc.type === "raw-text-doc") {
		let title = document.createElement("h3");
		title.textContent = `${doc.title}`;
		const textarea = document.createElement("textarea");
		const { cols, rows } = chooseAdequateColsRows(doc.text);
		textarea.setAttribute("cols", `${cols}`);
		textarea.setAttribute("rows", `${rows}`);
		textarea.textContent = doc.text;
		if (!o.show_title) { title = document.createElement("p"); title.textContent = "単純テキスト："; }
		return [title, "\n", textarea, "\n"];
	} else if (doc.type === "leipzigjs-glossed-doc") {
		let title = createTagFromTitleAndMetadata("h3", doc);
		const elems = serializeElems(doc.content);
		if (!o.show_title) { title = document.createElement("p"); title.textContent = "単純テキスト："; }
		return [title, "\n", ...elems, "\n"];
	} else {
		let _: never = doc;
		console.log(doc);
		throw new Error(`Unexpected "type" found for a Doc: expected 'raw-text-doc' or 'leipzigjs-glossed-doc' but got '${(doc as any).type}'`);
	}
}

fs.writeFileSync("corpus/index.html", dom.serialize());
