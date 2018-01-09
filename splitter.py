# python3
from matplotlib.image import imread
import matplotlib.pyplot as plt
import numpy as np
bhat_list = ["i" ,"a" ,"u" ,"á" ,"í" ,"ú" ,"o" ,"e" ,"-" ,"ai",
	"au","t" ,"x" ,"d" ,"h" ,"c" ,"m" ,"z" ,"k" ,"s" ,
	"w" ,"r" ,"g" ,"l" ,"j" ,"p" ,"b" ,"n" ,"ṭ" ,"dh",
	"ḍ" ,"ṣ" ,"gh","ḷ" ,"y" ,"ph","bh","ṇ","kh", ",",
	"quote","ququ","question", "it", "at", "ut", "aut", "_"," ","period"]


def main():
	A = imread('bhat_bitmap_nonborder.png')
	for i in range(len(bhat_list)):
		save(A,int(i/10),i%10,bhat_list[i]);


# ith row, jth column
def save(A,i,j,name):
	B = A[i*16:(i+1)*16,j*8:(j+1)*8]
	plt.imsave('bhat_font/bhat_'+name + '.png', B)

if __name__ == '__main__':
    main()
