#!/bin/bash

cd config
tar -czf $1-config.tar.gz *

cd ../target/quarkus-app
tar -czf $1.tar.gz *

cd ..
mv quarkus-app/$1.tar.gz ../config/$1-config.tar.gz .
