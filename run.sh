#!/bin/bash

export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:`pwd`/../../cxx/irafl/build/install/lib

./sviraf
#go run main.go
