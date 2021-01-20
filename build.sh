#!/bin/bash

go build -ldflags '-w -s -linkmode "external" -extldflags "-static-libgcc"' -o sviraf

if [[ $1 == "upx" ]]; then
    upx --best sviraf
fi
