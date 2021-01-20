#!/bin/bash

go build -ldflags '-w -s -linkmode "external" -extldflags "-static-libgcc"'
