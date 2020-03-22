clean_system:
	rm -rf ~/.cache/typescript ~/.npm

clean_local:
	rm -rf node_modules

clean_angular:
	$(MAKE) -C angular clean

clean_react:
	$(MAKE) -C react clean

clean_vue:
	$(MAKE) -C vue clean

clean:
	$(MAKE) clean_system clean_local clean_angular clean_react clean_vue

distclean_angular:
	rm -rf angular/dist/

distclean_react:
	rm -rf react/dist/

distclean_vue:
	rm -rf vue/dist/

distclean:
	$(MAKE) distclean_angular distclean_react distclean_vue

install_local:
	npm install $(args)

install_angular:
	$(MAKE) -C angular install args=$(args)

install_react:
	$(MAKE) -C react install args=$(args)

install_vue:
	$(MAKE) -C vue install args=$(args)

install:
	$(MAKE) install_local install_angular install_react install_vue

npm_outdated_local:
	npm outdated

npm_outdated_angular:
	$(MAKE) -C angular npm_outdated

npm_outdated_react:
	$(MAKE) -C react npm_outdated

npm_outdated_vue:
	$(MAKE) -C vue npm_outdated

npm_outdated:
	$(MAKE) npm_outdated_local npm_outdated_angular npm_outdated_react npm_outdated_vue

npm_update_local:
	npm update

npm_update_angular:
	$(MAKE) -C angular npm_update

npm_update_react:
	$(MAKE) -C react npm_update

npm_update_vue:
	$(MAKE) -C vue npm_update

npm_update:
	$(MAKE) npm_update_local npm_update_angular npm_update_react npm_update_vue

ncu_local:
	npx ncu $(args)

ncu_angular:
	$(MAKE) -C angular ncu args=$(args)

ncu_react:
	$(MAKE) -C react ncu args=$(args)

ncu_vue:
	$(MAKE) -C vue ncu args=$(args)

ncu:
	$(MAKE) ncu_local ncu_angular ncu_react ncu_vue args=$(args)

ncu_update:
	$(MAKE) ncu_local ncu_angular ncu_react ncu_vue args=-u

lint_angular:
	$(MAKE) -C angular lint

lint_react:
	$(MAKE) -C react lint

lint_vue:
	$(MAKE) -C vue lint

lint_local:
	npm run lint

lint:
	$(MAKE) -j lint_angular lint_react lint_vue

prettier:
	$(MAKE) -j prettier_local prettier_angular prettier_react prettier_vue

prettier_local:
	npm run prettier

prettier_angular:
	$(MAKE) -C angular prettier

prettier_react:
	$(MAKE) -C react prettier

prettier_vue:
	$(MAKE) -C vue prettier

start_angular:
	$(MAKE) -C angular start

start_react:
	$(MAKE) -C react start

start_vue:
	$(MAKE) -C vue start

start:
	$(MAKE) -j start_angular start_react start_vue

build_angular:
	$(MAKE) -C angular build

build_react:
	$(MAKE) -C react build

build_vue:
	$(MAKE) -C vue build

build:
	$(MAKE) build_angular build_react build_vue

test:
	npx jest

test_watch:
	npx jest --watch
