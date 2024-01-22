jq --help > NUL
if errorlevel 1 goto ERROR


jq -f cross_reference\extract.jq bhat.json > cross_reference\from-ja.json
jq -f cross_reference\extract.jq bhat-to-eng.json > cross_reference\bhat-to-eng.json
jq -f cross_reference\extract.jq bhat-to-lineparine.json > cross_reference\bhat-to-lineparine.json

jq -f cross_reference\eng-to-ja.jq cross_reference\bhat-to-eng.json > cross_reference\from-eng.json
jq -f cross_reference\lineparine-to-ja.jq cross_reference\bhat-to-lineparine.json > cross_reference\from-lineparine.json

goto EOF 
:ERROR
echo Please install jq before running this script.
start "" https://jqlang.github.io/jq/download/
pause
exit
:EOF 

