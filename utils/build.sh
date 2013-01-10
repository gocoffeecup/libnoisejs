FILE=includes/all.js
OUT=../build/libnoise.js

echo "" > $OUT

while read CMD; do
    cat ../"$CMD" >> $OUT
    echo "" >> $OUT
done < "$FILE"