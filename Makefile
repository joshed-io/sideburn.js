all: optimizer
  
optimizer: clean
	cp src/sideburn.js build/sideburn.js
	uglifyjs -o build/sideburn.min.js src/sideburn.js

clean:
	mkdir -p build; rm -rf build/*
