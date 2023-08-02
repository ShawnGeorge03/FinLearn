#!/bin/sh

SERVER_URL=$1

# Iterates over all the .tsx files
for file in $(find . \( -name '*.tsx' \))
do
    # Replaces ${process.env.NEXT_PUBLIC_API_URL} with $SERVER_URL
    sed -i 's|${process.env.NEXT_PUBLIC_API_URL}|'$SERVER_URL'|g' $file
done