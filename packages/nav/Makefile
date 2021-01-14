WATCH_FILES= find .. -type f -not -path '*/\.*' -and -not -path '*/node_modules.*' | grep -i '.*[.]tsx\?$$\|.*[.].md\|.*[.]json$$\|CHANGES\|TODO' 2> /dev/null


clean:
	rm -rf node_modules/

install:
	yarn install $(args)

distclean:
	rm -rf dist/

yarn_outdated:
	yarn outdated

yarn_upgrade:
	yarn upgrade

ncu:
	npx ncu $(args)

lint:
	yarn run lint

build:
	yarn run build

start:
	yarn run start

prettier:
	yarn run prettier

lint_watch:
	if command -v entr > /dev/null; then ${WATCH_FILES} | entr -c $(MAKE) lint; else $(MAKE) lint; fi
