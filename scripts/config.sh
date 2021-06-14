#!/bin/bash

mkdir -p target/config
rsync -a config/* target/config
