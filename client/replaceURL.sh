#!/bin/sh

for file in $(find . \( -name '*.tsx' \))
do
    sed -i 's|${process.env.NEXT_PUBLIC_API_URL}|'$1'|g' $file
done