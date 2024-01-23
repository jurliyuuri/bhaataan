jq --help > NUL
if errorlevel 1 goto ERROR

REM extract relations from the dictionary
jq -f cross_reference\extract.jq bhat.json > cross_reference\from-ja.json
jq -f cross_reference\extract.jq bhat-to-eng.json > cross_reference\from-eng_.json
jq -f cross_reference\extract.jq bhat-to-lineparine.json > cross_reference\from-lineparine_.json

REM translate the labels
jq -f cross_reference\eng-to-ja.jq cross_reference\from-eng_.json > cross_reference\from-eng.json
jq -f cross_reference\lineparine-to-ja.jq cross_reference\from-lineparine_.json > cross_reference\from-lineparine.json

REM convert to JSONL
jq -c ".[]" cross_reference\from-ja.json > cross_reference\from-ja.jsonl
jq -c ".[]" cross_reference\from-eng.json > cross_reference\from-eng.jsonl
jq -c ".[]" cross_reference\from-lineparine.json > cross_reference\from-lineparine.jsonl

REM delete the redundant files
del cross_reference\from-eng_.json 
del cross_reference\from-lineparine_.json 
del cross_reference\from-ja.json
del cross_reference\from-eng.json
del cross_reference\from-lineparine.json

goto EOF 
:ERROR
echo Please install jq before running this script.
start "" https://jqlang.github.io/jq/download/
pause
exit
:EOF 

