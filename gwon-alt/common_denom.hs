a = [0.4754566693, 0.2423494871, 0.1036071766, 0.07892644979, 0.07326065341, 0.02639956382]

cost fl = x * x where x = fl - fromIntegral (round fl) 

main = print [ (n, (/ (n*n)) $ sum $ map (cost . (*n)) a) | n <- [1.0 .. 10000.0]]