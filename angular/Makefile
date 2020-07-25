clean:
	rm -rf node_modules/

install:
	yarn install $(args)

distclean:
	rm -rf dist/

yarn_outdated:
	yarn outdated

yarn_upgrade:
	$(MAKE) ng_update; yarn upgrade

ncu:
	npx ncu $(args)

ng_update:
	ng update

lint:
	yarn run lint

build:
	ng build

start:
	ng serve --host $(ip addr show eth0 | grep -Po "inet \K[\d.]+") --disableHostCheck

prettier:
	yarn run prettier
