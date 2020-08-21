clean_system:
	rm -rf ~/.cache/typescript; yarn cache clean

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
	yarn install $(args)

install_angular:
	$(MAKE) -C angular install args=$(args)

install_react:
	$(MAKE) -C react install args=$(args)

install_vue:
	$(MAKE) -C vue install args=$(args)

install:
	$(MAKE) install_local install_angular install_react install_vue

yarn_outdated_local:
	yarn outdated

yarn_outdated_angular:
	$(MAKE) -C angular yarn_outdated

yarn_outdated_react:
	$(MAKE) -C react yarn_outdated

yarn_outdated_vue:
	$(MAKE) -C vue yarn_outdated

yarn_outdated:
	$(MAKE) yarn_outdated_local yarn_outdated_angular yarn_outdated_react yarn_outdated_vue

yarn_upgrade_local:
	yarn upgrade

yarn_upgrade_angular:
	$(MAKE) -C angular yarn_upgrade

yarn_upgrade_react:
	$(MAKE) -C react yarn_upgrade

yarn_upgrade_vue:
	$(MAKE) -C vue yarn_upgrade

yarn_upgrade:
	$(MAKE) yarn_upgrade_local yarn_upgrade_angular yarn_upgrade_react yarn_upgrade_vue

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
	yarn run lint

lint:
	$(MAKE) -j lint_angular lint_react lint_vue

prettier:
	$(MAKE) -j prettier_local prettier_angular prettier_react prettier_vue

prettier_local:
	yarn run prettier

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

sync_packages:
	$(MAKE) ncu_update install yarn_upgrade
