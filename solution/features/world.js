// features/world.js

const { setWorldConstructor } = require('cucumber');
const puppeteer = require('puppeteer');
const scope = require('./support/scope');

const development_env = require('../development');
const production_env = require('../production');

let env = production_env;
if (process.env.TEST_ENV === 'development') {
    env = development_env;
}

var fs = require('fs');
if (!fs.existsSync('./test_output')){ fs.mkdirSync('test_output'); }

const World = function() {
  scope.driver = puppeteer;
  scope.context = {};
  scope.env = env;
};

setWorldConstructor(World);