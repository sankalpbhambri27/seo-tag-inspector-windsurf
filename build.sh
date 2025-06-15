#!/bin/bash

# Install dependencies
npm install

# Build the frontend
cd frontend
npm install
npm run build

# Move the built files to the root dist directory
mv dist ..

# Go back to root directory
cd ..
