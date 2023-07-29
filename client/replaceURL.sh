#!/bin/sh

for file in $(find . \( -name '*.tsx' \))
do
    echo $file $1
    sed -i 's|${process.env.NEXT_PUBLIC_API_URL}|'$1'|g' $file
done