// BCP 47 (HTML の lang 属性に用いることができる。) を期待する。
// なお、x- で始まるタグは私用領域として自由に使えることになっているので、例えば "x-qilxaleh" などをここに指定することもできる。
export type BCP47LanguageNameString = string;

// URL として有効な文字列が入ることを期待する
// Expect a string that is valid as a URL.
export type URLString = string;

// Date.prototype.toISOString() などで得ることのできる、ISO 8601 形式の文字列が入ることを期待する
// Expects a string in ISO 8601, which can be obtained by Date.prototype.toISOString(), etc.
export type ISO8601DateString = string;

// コーパスが記述する対象の言語で書かれているテキストを期待する。
// text や analyzed_text といったプロパティにはこれが入る
export type TargetLanguageTextString = string;

export type Translation = string | { 
    "lang": BCP47LanguageNameString, 
    "translation": string 
};

export type LeipzigJsGlossedText = {
    "type": "leipzigjs-glossed-text",
    "text"?: TargetLanguageTextString,
    "analyzed_text": TargetLanguageTextString,
    "gloss": string,
    "translation": string // Translation | Translation[],
};

export type HTMLSidenote = {
    "type": "html-sidenote",
    "title": string,
    "sidenote": string
};

export type PlainTextSidenote = {
    "type": "plaintext-sidenote",
    "title": string,
    "sidenote": string,
};

export type Sidenote = HTMLSidenote | PlainTextSidenote

export type Section<Txt> = {
    "type": "section",
    "metadata"?: Metadata,
    "title": string,

    "content": Elem<Txt>[],
};

// ひとまとまりのテクストを囲むための箱。
// 一段落ぐらいを囲むことを想定している。
// 意味的に関連の薄いテクスト群は箱で囲むべきではない。
export type Box<Txt> = {
    "type": "box",
    "metadata"?: Metadata,
    "title": string,

    "lines": Txt[],
};

export type BoxForInadequate<Txt> = {
    "type": "box_for_inadequate",
    "metadata"?: Metadata,
    "title": string,

    "lines": Txt[],
}

export type Elem<Txt> = Sidenote | Section<Txt> | Box<Txt> | BoxForInadequate<Txt>;

export type Metadata = {
    // "relevant_links"?: URLString[],
    "src_link"?: URLString,
    // "last_modified"?: ISO8601DateString[],
}

export type LeipzigJsGlossedDoc = {
    "type": "leipzigjs-glossed-doc",
    "metadata"?: Metadata,
    "title": string,

    "content": Elem<LeipzigJsGlossedText>[],
};

export type RawTextDoc = {
    "type": "raw-text-doc",
    "metadata"?: Metadata,
    "title": string,

    "text": TargetLanguageTextString,
}

export type Doc = RawTextDoc | LeipzigJsGlossedDoc;

// 画像を埋め込む機能も最初から定義しとこう。実装するかは optional かなぁ
// プレーンテキスト版とグロス版を別 Doc とするのはあんま気に入らないけど、うーん、どうするか
// イメージとして、もうファイルとフォルダの比喩にしてしまって、
// 「普段パソコンを使っているように、コーパスを管理できる」というグラフィカルシェルを提供してしまう、みたいなことをやってみたいんだよな
// その中においては、ちょうど img.svg → img.png をやるのと同様に、「数字が集まり数が成る.glossed」→「数字が集まり数が成る.txt」みたいな比喩、で考えている。
// しかしホンマか？どう設計するのが良いんだ？
// 結局欲しい意味論は「同じ文書の『gloss版』と『プレーンテキスト版』」なのだから、その意味論を表現できないのはよろしくないのでは？


// 「この例文は古いので参考にしないでくれ」マーカー