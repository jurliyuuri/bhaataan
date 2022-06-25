import * as fs from 'fs'

let dictionary = JSON.parse(fs.readFileSync('bhat.json', { encoding: 'utf8', flag: 'r' }));
let dictionary_eng = JSON.parse(fs.readFileSync('bhat-to-eng.json', { encoding: 'utf8', flag: 'r' }));
// console.log(dictionary.words);

// console.log(get_duplicates(["1", "2", "1"]))
console.log(get_duplicates(dictionary.words.map((e: { entry: { id: number, form: string } }) => e.entry.form)));

function get_duplicates(arrs: ReadonlyArray<string>) {
	type B = { count: number, name: string };
	const counted = arrs.map((name: string) => ({ count: 1, name }))
		.reduce((result: Map<string, number>, b: B) => {
			result.set(b.name, (result.get(b.name) || 0) + b.count);
			return result;
		}, new Map());
	// console.log(counted);
	const ans: string[] = [];
	counted.forEach((value, key) => {
		if (value > 1) {ans.push(key);}
	});
	
	return ans;
}
