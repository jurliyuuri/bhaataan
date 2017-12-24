var bhat_list = ["i" ,"a" ,"u" ,"á" ,"í" ,"ú" ,"o" ,"e" ,"-" ,"ai",
	"au","t" ,"x" ,"d" ,"h" ,"c" ,"m" ,"z" ,"k" ,"s" ,
	"w" ,"r" ,"g" ,"l" ,"j" ,"p" ,"b" ,"n" ,"ṭ" ,"dh",
	"ḍ" ,"ṣ" ,"gh","ḷ" ,"y" ,"ph","bh","ṇ","kh", ",",
	"quote","ququ","question", "it", "at", "ut", "aut", " "]

var single_char = ["i","a","u","á","í","ú","o","e","-","ä",
"å","t","x","d","h","c","m","z","k","s",
"w","r","g","l","j","p","b","n","ṭ","đ",
"ḍ","ṣ","ǵ","ḷ","y","ṕ","ƀ","ṇ","ḱ",",",
"\"","Q","?","I","A","U","Å"," "]


function printBhat(gefak){
	for(var i=0;i<gefak.length;i++){
		document.write('<img src="bhat_font/bhat_'+gefak[i]+'.png" height="60" />')
	}
}
