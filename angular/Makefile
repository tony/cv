clean:
	rm -rf node_modules/

install:
	npm install $(args)

distclean:
	rm -rf dist/

npm_outdated:
	npm outdated

npm_update:
	npm update

ncu:
	npx ncu $(args)

lint:
	npm run lint

build:
	ng build

start:
	ng serve --host $(ip addr show eth0 | grep -Po "inet \K[\d.]+") --disableHostCheck
