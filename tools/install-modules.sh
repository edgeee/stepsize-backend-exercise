#!/usr/bin/env bash
for d in ../services/*/ ; do
    (cd $d && yarn)
done
echo "Dependencies Installed!"
