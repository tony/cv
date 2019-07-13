clean_system:
	rm -rf ~/.cache/typescript ~/.npm

clean_local:
	rm -rf node_modules

clean_angular:
	rm -rf angular/node_modules/

clean_react:
	rm -rf react/node_modules/

clean_vue:
	rm -rf vue/node_modules/

clean:
	$(MAKE) clean_system clean_local clean_angular clean_react clean_vue

install_local:
	npm install --no-save

install_angular:
	cd angular/ && npm install --no-save

install_react:
	cd react/ && npm install --no-save

install_vue:
	cd vue/ && npm install --no-save

install:
	$(MAKE) install_local install_angular install_react install_vue

distclean_angular:
	rm -rf angular/dist/

distclean_react:
	rm -rf react/dist/

distclean_vue:
	rm -rf vue/dist/

distclean:
	$(MAKE) distclean_angular distclean_react distclean_vue

build_angular:
	cd angular/ && ng build

build_react:
	cd react/ && npm run build

build_vue:
	cd vue/ && npm run build

build:
	$(MAKE) build_angular build_react build_vue

npm_outdated_local:
	npm outdated

npm_outdated_angular:
	cd angular/ && npm outdated

npm_outdated_react:
	cd react/ && npm outdated

npm_outdated_vue:
	cd vue/ && npm outdated

npm_outdated:
	$(MAKE) npm_outdated_local npm_outdated_angular npm_outdated_react npm_outdated_vue

npm_update_local:
	npm update

npm_update_angular:
	cd angular/ && npm update

npm_update_react:
	cd react/ && npm update

npm_update_vue:
	cd vue/ && npm update

npm_update:
	$(MAKE) npm_update_local npm_outdated_angular npm_outdated_react npm_outdated_vue
