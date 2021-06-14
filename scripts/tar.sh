#!/bin/bash

cd config
tar -czf rki-mirror-1.0.0-config.tar.gz *

cd ../target/quarkus-app
tar -czf rki-mirror-1.0.0.tar.gz *
