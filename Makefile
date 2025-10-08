.PHONY: perms install init up migration-create migration-run migration-revert format-check format-fix lint-check lint-fix import-dump import-dump-fresh

perms:
	chmod +x .husky/pre-commit

install:
	npm i

init:
	make install
	make perms

up:
	docker-compose -f docker-compose.yml up