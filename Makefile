#!/bin/bash

DEPS = $(wildcard ./src/*.cpp)

build: $(DEPS)
	@emcc \
		-lembind \
		--extern-post-js ./dist/export-es6.js \
		-s EXPORT_NAME='WASMProcessor' \
		-s ENVIRONMENT=shell \
		-s SINGLE_FILE=1 \
		-s WASM_ASYNC_COMPILATION=0 \
		-s MODULARIZE=1 \
		-o ./dist/wasm_processor.js \
		./src/worklet.cpp $(DEPS)

	@echo "Build complete: ./dist/wasm_processor.js"