// features/hooks.js

const { After, Before, AfterAll } = require('cucumber');
const scope = require('./support/scope');
var fs = require('fs');

Before(async (scenario) => {
    // Before each scenario
    scope.context.name = scenario.pickle.name;
    scope.context.filename = scope.context.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
});

After(async (scenario) => {
    // After each scenario

    // Write out the dom and a screenshot if the scenario failed
    if (scenario.result.status === 'failed') {
        await scope.context.currentPage.screenshot({path: 'test_output/failed___'+scope.context.filename+'.png'});
        const dom = await scope.context.currentPage.content();
        fs.writeFileSync('test_output/failed___'+scope.context.filename+'.html', dom);
  }

    if (scope.browser && scope.context.currentPage) {

        // delete cookies
        const cookies = await scope.context.currentPage.cookies();
        if (cookies && cookies.length > 0) {
            await scope.context.currentPage.deleteCookie(...cookies);
        }

        // close web page
        await scope.context.currentPage.close();
        scope.context.currentPage = null;
    }
});

AfterAll(async () => {
    // After all scenarios
    if (scope.browser) await scope.browser.close();
});