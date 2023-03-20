#!/usr/bin/env bash
cp api/package.json api/node-modules-layer/nodejs/package.json
cd api/node-modules-layer/nodejs
npm remove classic-companion-core
npm install --omit=dev
cd ../../..
cp core/dist api/node-modules-layer/nodejs/node_modules/classic-companion-core -r