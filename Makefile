MOCHA_PATH=./node_modules/.bin/_mocha

install-test-dependencies:
	@npm install --save-dev mocha should

# 单元测试
test:
	@NODE_ENV=test $(MOCHA_PATH) test/**/*.spec.js


.PHONY: install-test-dependencies test
