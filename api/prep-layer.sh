#!/usr/bin/env bash
cp package.json node-modules-layer/nodejs/package.json
cd node-modules-layer/nodejs
npm install --omit=dev