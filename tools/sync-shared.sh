#!/usr/bin/env bash
for d in ../services/*/ ; do
    rm -r $d/shared/
    cp -r ../shared/ $d/shared/
done
echo "Shared Directories Synced!"
