# puppeteer-cucumber-example
Building a Puppeteer Cucumber test from scratch - step by step

This example was adapted from Anephenix's article at medium:

https://medium.com/@anephenix/end-to-end-testing-single-page-apps-and-node-js-apis-with-cucumber-js-and-puppeteer-ad5a519ace0


## Windows Install

These instructions will work on a brand new OS install.


1. Open up an administrator command prompt and install Chocolatey
```batch
@"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"
```

2. Install or upgrade node.js
```batch
choco install nodejs
```
```batch
choco upgrade nodejs
```

3. Install Visual Studio Code
```batch
choco install vscode
```

4. Close command prompt then open a fresh command prompt (it does not have to be administrator)

5. Create the required folders for this example project
```batch
mkdir \code
mkdir \code\pc-demo
cd /code/pc-demo
```

6. Check node and npm versions
```batch
node -v
npm -v
```

At time of writing
```
C:\code\pc-demo>node -v
v11.8.0

C:\code\pc-demo>npm -v
6.4.1
```


## After install, create a Cucumber test

1. Create a package.json file

```batch
npm init
```
Accept all defaults.

2. Install Cucumber as a development dependency
```batch
npm install --save-dev cucumber
```

3. Create a feature file

```
code features/search.feature
```

Copy-paste and save
```cucumber
Feature: Keyword search
    In order to find employment
    As a jobseeker
    I want to be able to perform a keyword search

    Scenario: Successfully perform a keyword search
        Given I am an anonymous jobseeker
        When I navigate to the totaljobs home page
        And I fill in the keyword field with "Automation Test Engineer"
        When I click on Search
        Then I should see search results
```

4. See which steps have not been implemented yet (all of them!)

```
npx cucumber-js
```

The output should be similar to this
```javascript
C:\code\pc-demo>npx cucumber-js
UUUUU

Warnings:

1) Scenario: Successfully perform a keyword search # features\search.feature:6
   ? Given I am an anonymous jobseeker
       Undefined. Implement with the following snippet:

         Given('I am an anonymous jobseeker', function () {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

   ? When I navigate to the totaljobs home page
       Undefined. Implement with the following snippet:

         When('I navigate to the totaljobs home page', function () {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

   ? And I fill in the keyword field with "Automation Test Engineer"
       Undefined. Implement with the following snippet:

         When('I fill in the keyword field with {string}', function (string) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

   ? When I click on Search
       Undefined. Implement with the following snippet:

         When('I click on Search', function () {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

   ? Then I should see search results
       Undefined. Implement with the following snippet:

         Then('I should see search results', function () {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });


1 scenario (1 undefined)
5 steps (5 undefined)
0m00.000s

C:\code\pc-demo>
```

5. Create the step definitions JavaScript shell

```batch
code features/step_definitions/search_steps.js
npx cucumber-js | code -
```

Now copy the piped text to `search_steps.js`.

Add this line at the start
```javascript
const { Given, When, Then } = require('cucumber');
```

Then remove all the English text so you are only left with JavaScript code.
Fix the indenting of the code.

You will end up with something like
```javascript
// features/step_definitions/search_steps.js

const { Given, When, Then } = require('cucumber');

Given('I am an anonymous jobseeker', function () {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
});

When('I navigate to the totaljobs home page', function () {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
});

When('I fill in the keyword field with {string}', function (string) {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
});

When('I click on Search', function () {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
});

Then('I should see search results', function () {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
});

```

6. Run Cucumber again

```
npx cucumber-js
```

The output should change to like
```cucumber
C:\code\pc-demo>npx cucumber-js
P----

Warnings:

1) Scenario: Successfully perform a keyword search # features\search.feature:6
   ? Given I am an anonymous jobseeker # features\step_definitions\search_steps.js:3
       Pending
   - When I navigate to the totaljobs home page # features\step_definitions\search_steps.js:8
   - And I fill in the keyword field with "Automation Test Engineer" # features\step_definitions\search_steps.js:13
   - When I click on Search # features\step_definitions\search_steps.js:18
   - Then I should see search results # features\step_definitions\search_steps.js:23

1 scenario (1 pending)
5 steps (1 pending, 4 skipped)
0m00.001s

C:\code\pc-demo>
```


## Begin implemenation - reference Puppeteer and implement Before and After

1. Install Puppeteer to the project

```
npm --save-dev install puppeteer expect-puppeteer
```

2. Create a `world.js` file

```
code features/world.js
```

Copy-paste and save
```javascript
const { setWorldConstructor } = require('cucumber');
const puppeteer = require('puppeteer');
const scope = require('./support/scope');

const World = function() {
  scope.driver = puppeteer;
  scope.context = {};
};

setWorldConstructor(World);
```

3. Create a `scope.js` file

```
code features/support/scope.js
```

Copy-paste and save
```javascript
module.exports = {};
```

4. Create a `hooks.js` file

```
code features/hooks.js
```

Copy-paste and save
```javascript
const { After, Before, AfterAll } = require('cucumber');
const scope = require('./support/scope');

Before(async () => {
  // Before each scenario
});

After(async () => {
  // After each scenario
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
```

5. Run Cucumber to see that Before and After is now implemented

```
npx cucumber-js
```

Example output
```cucumber
C:\code\pc-demo>npx cucumber-js
.P----.

Warnings:

1) Scenario: Successfully perform a keyword search # features\search.feature:6
   √ Before # features\hooks.js:4
   ? Given I am an anonymous jobseeker # features\step_definitions\search_steps.js:3
       Pending
   - When I navigate to the totaljobs home page # features\step_definitions\search_steps.js:8
   - And I fill in the keyword field with "Automation Test Engineer" # features\step_definitions\search_steps.js:13
   - When I click on "Search" # features\step_definitions\search_steps.js:18
   - Then I should see search results # features\step_definitions\search_steps.js:23
   √ After # features\hooks.js:8

1 scenario (1 pending)
5 steps (1 pending, 4 skipped)
0m00.005s

C:\code\pc-demo>
```


## Implement the first two steps

The first step does not do anything in this example. If we have no cookies,
then we are an anonymous jobseeker.

The After method removes all cookies after a scenario, so we don't have to worry
about scenario state 'bleed over'.

The second step navigates to the homepage.

Create the `common.js` file that holds the 'menu' of implemented actions
```
code features/step_definitions/common.js
```

Copy-paste save
```javascript
// features/step_defintions/common.js

const { Given, When, Then } = require('cucumber');

var {setDefaultTimeout} = require('cucumber');
setDefaultTimeout(60 * 1000);

const {
    anonymousJobseeker,
    visitTotaljobsHomepage
} = require('../support/actions');

Given('I am an anonymous jobseeker', anonymousJobseeker);

When('I navigate to the totaljobs home page', visitTotaljobsHomepage);
```

Create the `actions.js` file that contains the implemented actions 
```
code features/support/actions.js
```

Copy-paste save
```javascript
const assert = require('assert');

const scope = require('./scope');

let headless = false;
let slowMo = 5;

const anonymousJobseeker = async () => {
    // You are an anonymous Jobseeker by default when there are no cookies
    return;
};

const visitTotaljobsHomepage = async () => {
	if (!scope.browser)
		scope.browser = await scope.driver.launch({ headless, slowMo });
	scope.context.currentPage = await scope.browser.newPage();
	scope.context.currentPage.setViewport({ width: 1280, height: 1024 });
	const url = 'https://www.totaljobs.com';
    const visit = await scope.context.currentPage.goto(url, {
		waitUntil: 'networkidle2'
	});
	return visit;
};

const pending = callback => {
	callback(null, 'pending');
};

module.exports = {
    anonymousJobseeker,
    visitTotaljobsHomepage
}
```

We are not quite ready to run just yet. We now have duplicate definitions for
- 'I am an anonymous jobseeker'
- 'I navigate to the totaljobs home page'

These need to be removed from `search_steps.js`. It becomes
```javascript
// features/step_definitions/search_steps.js

const { Given, When, Then } = require('cucumber');

When('I fill in the keyword field with {string}', function (string) {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
});

When('I click on Search', function () {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
});

Then('I should see search results', function () {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
});
```

Now when we run we see browser pop up and navigate to the home page.
```
npx cucumber-js
```

Example output
```cucumber
C:\code\pc-demo>npx cucumber-js
...P--.

Warnings:

1) Scenario: Successfully perform a keyword search # features\search.feature:6
   √ Before # features\hooks.js:4
   √ Given I am an anonymous jobseeker # features\step_definitions\common.js:11
   √ When I navigate to the totaljobs home page # features\step_definitions\common.js:13
   ? And I fill in the keyword field with "Automation Test Engineer" # features\step_definitions\search_steps.js:3
       Pending
   - When I click on Search # features\step_definitions\search_steps.js:8
   - Then I should see search results # features\step_definitions\search_steps.js:13
   √ After # features\hooks.js:8

1 scenario (1 pending)
5 steps (1 pending, 2 skipped, 2 passed)
0m04.537s

C:\code\pc-demo>
```

## Implement the remaining three steps

Update `common.js` menu of supported steps to include the remaining three steps
```javascript
// features/step_defintions/common.js

const { Given, When, Then } = require('cucumber');

var {setDefaultTimeout} = require('cucumber');
setDefaultTimeout(60 * 1000);

const {
    anonymousJobseeker,
    visitTotaljobsHomepage,
    fillInKeyword,
    clickSearch,
    assertSearchResults
} = require('../support/actions');

Given('I am an anonymous jobseeker', anonymousJobseeker);

When('I navigate to the totaljobs home page', visitTotaljobsHomepage);

When('I fill in the keyword field with {string}', fillInKeyword);

When('I click on Search', clickSearch);

Then('I should see search results', assertSearchResults);
```

At this point we should delete `search_steps.js` since all steps are now in `common.js`

_Windows_
```
del features\step_definitions\search_steps.js
```
_Linux_
```
rm features/step_definitions/search_steps.js
```

Update `actions.js` with the implementations

```javascript
// features/support/actions.js

const expect = require('expect-puppeteer');
const assert = require('assert');

//const pages = require('./pages');
//const selectors = require('./selectors');
const scope = require('./scope');

let headless = false;
let slowMo = 5;

const anonymousJobseeker = async () => {
    // You are an anonymous Jobseeker by default when there are no cookies
    return;
};

const visitTotaljobsHomepage = async () => {
	if (!scope.browser)
		scope.browser = await scope.driver.launch({ headless, slowMo });
	scope.context.currentPage = await scope.browser.newPage();
	scope.context.currentPage.setViewport({ width: 1280, height: 1024 });
//	const url = scope.host + pages.home;
	const url = 'https://www.totaljobs.com';
    const visit = await scope.context.currentPage.goto(url, {
		waitUntil: 'networkidle2'
	});
	return visit;
};

const fillInKeyword = async (keyword) => {
    await expect(scope.context.currentPage).toFillForm('form[action="/onsitesearch"]', {
        Keywords: keyword
    });
};

const clickSearch = async () => {
    await expect(scope.context.currentPage).toClick('input[type="submit"]');
};

const assertSearchResults = async () => {
    await scope.context.currentPage.waitForNavigation({ waitUntil: 'domcontentloaded' });
    await expect(scope.context.currentPage).toMatch('Explore results');
};

module.exports = {
    anonymousJobseeker,
    visitTotaljobsHomepage,
    fillInKeyword,
    clickSearch,
    assertSearchResults
}
```

Now the full scenario should run
```
npx cucumber-js
```

Example output
```
C:\code\pc-demo>npx cucumber-js
.......

1 scenario (1 passed)
5 steps (5 passed)
0m06.928s

C:\code\pc-demo>
```

## Add an another feature - advanced search

```
code features/advanced_search.feature
```

```cucumber
Feature: Advanced search
    In order to find employment
    As a jobseeker
    I want to be able to perform an advanced search

    Scenario: Successfully perform an advanced search
        Given I am an anonymous jobseeker
        When I navigate to the totaljobs home page
        And I fill in the keyword field with "Automation Test Engineer"
        And I fill in the location field with "London"
        And I select a radius of "0" miles
        And I click on Show more options
        And I select an "Hourly" rate of "50" pounds
        And I select a "Contract" job type
        And I select a recruiter type of "Agency"
        When I click on Search
        Then I should see search results
```

Now run that specific feature
```
npx cucumber-js features/advanced_search.feature
```

You'll see that the feature will start to run since Cucumber knows how to perform some of
the steps - they are common to the first feature. However some of the steps are not defined.
So you'll see output like this
```cucumber
C:\code\pc-demo>npx cucumber-js features/advanced_search.feature
....UUUUUU--.

Warnings:

1) Scenario: Successfully perform an advanced search # features\advanced_search.feature:6
   √ Before # features\hooks.js:4
   √ Given I am an anonymous jobseeker # features\step_definitions\common.js:16
   √ When I navigate to the totaljobs home page # features\step_definitions\common.js:18
   √ And I fill in the keyword field with "Automation Test Engineer" # features\step_definitions\common.js:20
   ? And I fill in the location field with "London"
       Undefined. Implement with the following snippet:

         When('I fill in the location field with {string}', function (string) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

   ? And I select a radius of "0" miles
       Undefined. Implement with the following snippet:

         When('I select a radius of {string} miles', function (string) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

   ? And I click on Show more options
       Undefined. Implement with the following snippet:

         When('I click on Show more options', function () {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

   ? And I select an "Hourly" rate of "50" pounds
       Undefined. Implement with the following snippet:

         When('I select an {string} rate of {string} pounds', function (string, string2) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

   ? And I select a "Contract" job type
       Undefined. Implement with the following snippet:

         When('I select a {string} job type', function (string) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

   ? And I select a recruiter type of "Agency"
       Undefined. Implement with the following snippet:

         When('I select a recruiter type of {string}', function (string) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

   - When I click on Search # features\step_definitions\common.js:22
   - Then I should see search results # features\step_definitions\common.js:24
   √ After # features\hooks.js:8

1 scenario (1 undefined)
11 steps (6 undefined, 2 skipped, 3 passed)
0m05.208s

C:\code\pc-demo>
```

Add the missing steps to `common.js` by copying and pasting the undefined output,
editing, then updating the constant list.
```javascript
// features/step_defintions/common.js

const { Given, When, Then } = require('cucumber');

var {setDefaultTimeout} = require('cucumber');
setDefaultTimeout(60 * 1000);

const {
    anonymousJobseeker,
    visitTotaljobsHomepage,
    fillInKeyword,
    clickSearch,
    assertSearchResults,
    fillInLocation,
    selectRadius,
    clickShowMoreOptions,
    selectSalary,
    selectJobType,
    selectRecruiterType
} = require('../support/actions');

Given('I am an anonymous jobseeker', anonymousJobseeker);

When('I navigate to the totaljobs home page', visitTotaljobsHomepage);

When('I fill in the keyword field with {string}', fillInKeyword);

When('I click on Search', clickSearch);

Then('I should see search results', assertSearchResults);

When('I fill in the location field with {string}', fillInLocation);

When('I select a radius of {string} miles', selectRadius);

When('I click on Show more options', clickShowMoreOptions);

When('I select an {string} rate of {string} pounds', selectSalary);

When('I select a {string} job type', selectJobType);

When('I select a recruiter type of {string}', selectRecruiterType);
```

Now update `actions.js` with the implementation detail.

```javascript
// features/support/actions.js

const expect = require('expect-puppeteer');
const assert = require('assert');

//const pages = require('./pages');
//const selectors = require('./selectors');
const scope = require('./scope');

let headless = false;
let slowMo = 5;

const anonymousJobseeker = async () => {
    // You are an anonymous Jobseeker by default when there are no cookies
    return;
};

const visitTotaljobsHomepage = async () => {
	if (!scope.browser)
		scope.browser = await scope.driver.launch({ headless, slowMo });
	scope.context.currentPage = await scope.browser.newPage();
	scope.context.currentPage.setViewport({ width: 1280, height: 1024 });
//	const url = scope.host + pages.home;
	const url = 'https://www.totaljobs.com';
    const visit = await scope.context.currentPage.goto(url, {
		waitUntil: 'networkidle2'
	});
	return visit;
};

const fillInKeyword = async (keyword) => {
    await expect(scope.context.currentPage).toFillForm('form[action="/onsitesearch"]', {
        Keywords: keyword
    });
};

const clickSearch = async () => {
    await scope.context.currentPage.screenshot({path: 'search-form-before-submit.png'});
    await expect(scope.context.currentPage).toClick('input[type="submit"]');
};

const assertSearchResults = async () => {
    await scope.context.currentPage.waitForNavigation({ waitUntil: 'domcontentloaded' });
    await expect(scope.context.currentPage).toMatch('Explore results');
    await scope.context.currentPage.screenshot({path: 'search-results.png'});
};

const fillInLocation = async(location) => {
    await expect(scope.context.currentPage).toFillForm('form[action="/onsitesearch"]', {
        LTxt: location
    });
};

const selectRadius = async(radius) => {
    await scope.context.currentPage.select('select[name="Radius"]', radius);
};

const clickShowMoreOptions = async () => {
    await expect(scope.context.currentPage).toClick('button[id="more-options-toggle"]');
    await scope.context.currentPage.waitForSelector('label[id="salaryButtonHourly"]', {visible: true,});
};

const selectSalary = async(rate_type, rate_value) => {
    await expect(scope.context.currentPage).toClick('label[id="salaryButton' + rate_type + '"]');
    await scope.context.currentPage.select('select[id="salaryRate"]', rate_value);
};

const selectJobType = async(job_type) => {
    let job_type_value = '10'; // Permanent
    if (job_type === 'Contract') { job_type_value = '20'; }
    if (job_type === 'Temporary') { job_type_value = '2'; }
    if (job_type === 'Part Time') { job_type_value = '40'; }
    await scope.context.currentPage.select('select[id="JobType"]', job_type_value);
};

const selectRecruiterType = async(recruiter_type) => {
    await expect(scope.context.currentPage).toClick('label[id="recruiterTypeButton' + recruiter_type + '"]');
};

module.exports = {
    anonymousJobseeker,
    visitTotaljobsHomepage,
    fillInKeyword,
    clickSearch,
    assertSearchResults,
    fillInLocation,
    selectRadius,
    clickShowMoreOptions,
    selectSalary,
    selectJobType,
    selectRecruiterType
}
```

Run the `advanced_search.feature`
```
npx cucumber-js features/advanced_search.feature
```

All the steps should complete OK
```
C:\code\pc-demo>npx cucumber-js features/advanced_search.feature
.............

1 scenario (1 passed)
11 steps (11 passed)
0m09.573s

C:\code\pc-demo>
```

You can find some screen shots in the `pc-demo` folder also.


## Config management and abstraction

Let's say we need to run the tests against the production and development environments.

So let's create some environment definitions as JavaScript so IntelliSense can see it.
```
code production.js
```

Copy-paste save
```
// production.js

const env = {
    hosts: {
        totaljobs: 'https://www.totaljobs.com',
        caterer: 'https://www.caterer.com',
    }
} 

module.exports = env;
```

```
code development.js
```

Copy-paste save
```
// development.js

const env = {
    hosts: {
        totaljobs: 'https://test.totaljobs.com',
        caterer: 'https://test.caterer.com',
    }
} 

module.exports = env;
```

Update `world.js` to default to pointing to production.
If the `TEST_ENV` environment variable is set, we'll use that instead.

At the same time we will create a folder for screen shots and other test output.
```
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
```

Now let's do some abstraction. We'll define some pages.
```
code features/support/pages.js
```

Copy-paste save
```
// features/support/pages.js

const pages = {
    home: '/',
    searchResults: '/jobs/',
    register: '/account/register/',
}

module.exports = pages;
```

Let's define some selectors also. Also for some selectors when clicked,
we want to specify what to wait for before continuing.
```
code features/support/selectors.js
```

Copy-paste save
```
// features/support/selectors.js

const click = {
    'Show more options': 'button[id="more-options-toggle"',
    Search: 'input[type="submit"]',
};

const wait_visible = {
    'Show more options': 'label[id="salaryButtonHourly"]',
};

module.exports = { 
    click,
    wait_visible,
};
```

Update `actions.js` to use the abstractions (pages, selectors and environment).

Note that now we have a generic `clickOnItem` instead of hard coded clicks.
```
// features/support/actions.js

const expect = require('expect-puppeteer');

const pages = require('./pages');
const selectors = require('./selectors');
const scope = require('./scope');

let headless = false;
let slowMo = 5;

const anonymousJobseeker = async () => {
    // You are an anonymous Jobseeker by default when there are no cookies
    return;
};

const visitHomepage = async (brand) => {
	if (!scope.browser)
		scope.browser = await scope.driver.launch({ headless, slowMo, args: ['--window-size=1280,1024'] });
	scope.context.currentPage = await scope.browser.newPage();
	scope.context.currentPage.setViewport({ width: 1280, height: 1024 });
    const url = scope.env.hosts[brand] + pages.home;
    const visit = await scope.context.currentPage.goto(url, {
		waitUntil: 'networkidle2'
	});
	return visit;
};

const fillInKeyword = async (keyword) => {
    await expect(scope.context.currentPage).toFillForm('form[action="/onsitesearch"]', {
        Keywords: keyword
    });
};

const assertSearchResults = async () => {
    await scope.context.currentPage.waitForNavigation({ waitUntil: 'domcontentloaded' });
    await expect(scope.context.currentPage).toMatch('Explore results');
    await scope.context.currentPage.screenshot({path: 'test_output/'+scope.context.filename+'_search-results.png'});
};

const fillInLocation = async(location) => {
    await expect(scope.context.currentPage).toFillForm('form[action="/onsitesearch"]', {
        LTxt: location
    });
};

const selectRadius = async(radius) => {
    await scope.context.currentPage.select('select[name="Radius"]', radius);
};

const clickOnItem = async(item) => {
    await expect(scope.context.currentPage).toClick(selectors.click[item]);

    if (selectors.wait_visible[item]) {
        await scope.context.currentPage.waitForSelector(selectors.wait_visible[item], {visible: true,});
    }
};

const selectSalary = async(rate_type, rate_value) => {
    await expect(scope.context.currentPage).toClick('label[id="salaryButton' + rate_type + '"]');
    await scope.context.currentPage.select('select[id="salaryRate"]', rate_value);
};

const selectJobType = async(job_type) => {
    let job_type_value = '10'; // Permanent
    if (job_type === 'Contract') { job_type_value = '20'; }
    if (job_type === 'Temporary') { job_type_value = '2'; }
    if (job_type === 'Part Time') { job_type_value = '40'; }
    await scope.context.currentPage.select('select[id="JobType"]', job_type_value);
};

const selectRecruiterType = async(recruiter_type) => {
    await expect(scope.context.currentPage).toClick('label[id="recruiterTypeButton' + recruiter_type + '"]');
};

module.exports = {
    anonymousJobseeker,
    visitHomepage,
    fillInKeyword,
    assertSearchResults,
    fillInLocation,
    selectRadius,
    clickOnItem,
    selectSalary,
    selectJobType,
    selectRecruiterType
}
```

Update `advanced_search.feature` to use the abstractions
```
Feature: Advanced search
    In order to find employment
    As a jobseeker
    I want to be able to perform an advanced search

    Scenario: Successfully perform an advanced search on totaljobs
        Given I am an anonymous jobseeker
        When I navigate to the "totaljobs" home page
        And I fill in the keyword field with "Automation Test Engineer"
        And I fill in the location field with "London"
        And I select a radius of "0" miles
        And I click on "Show more options"
        And I select an "Hourly" rate of "50" pounds
        And I select a "Contract" job type
        And I select a recruiter type of "Agency"
        When I click on "Search"
        Then I should see search results
```

`common.js` should be updated also - we now have the generic `clickOnItem` and `visitHomepage` functions.
```
// features/step_definitions/common.js

const { Given, When, Then } = require('cucumber');

var {setDefaultTimeout} = require('cucumber');
setDefaultTimeout(60 * 1000);

const {
    anonymousJobseeker,
    visitHomepage,
    fillInKeyword,
    assertSearchResults,
    fillInLocation,
    selectRadius,
    clickOnItem,
    selectSalary,
    selectJobType,
    selectRecruiterType
} = require('../support/actions');

Given('I am an anonymous jobseeker', anonymousJobseeker);

When('I navigate to the {string} home page', visitHomepage);

When('I fill in the keyword field with {string}', fillInKeyword);

Then('I should see search results', assertSearchResults);

When('I fill in the location field with {string}', fillInLocation);

When('I select a radius of {string} miles', selectRadius);

When('I click on {string}', clickOnItem);

When('I select an {string} rate of {string} pounds', selectSalary);

When('I select a {string} job type', selectJobType);

When('I select a recruiter type of {string}', selectRecruiterType);
```

Finally, we update `hooks.js` to write out a screenshot and the DOM on failure.

Note that in the `Before` hook we make scenario name, and a filename safe version
of the name available to the shared context.
```
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
```

Now run the `advanced_search.feature` again and check that it still works
```
npx cucumber-js features/advanced_search.feature
```

To point to the development environment, set an environment variable.

_Windows_
```
set TEST_ENV=development
```

If you run the test at this point, you'll see that the test won't run since
the development environment is not available on the internet (and the host names are made up also).

Set the environment back to production.

_Windows_
```
set TEST_ENV=production
```


## Cucumber and abstraction 

Now we can add a different scenario for another brand in the feature file -
and it will work without any further code changes.

Copy-paste this to the end of `advanced_search.feature`
```

    Scenario: Successfully perform an advanced search on caterer
        Given I am an anonymous jobseeker
        When I navigate to the "caterer" home page
        And I fill in the keyword field with "Head Chef"
        And I fill in the location field with "Manchester"
        And I select a radius of "10" miles
        And I click on "Show more options"
        And I select an "Daily" rate of "200" pounds
        And I select a recruiter type of "Employer"
        When I click on "Search"
        Then I should see search results
```

Run the new scenario
```
npx cucumber-js features/advanced_search.feature --name caterer
```

Finally update the original `search.feature` for the new abstractions also
```
Feature: Keyword search
    In order to find employment
    As a jobseeker
    I want to be able to perform a keyword search

    Scenario: Successfully perform a keyword search
        Given I am an anonymous jobseeker
        When I navigate to the "totaljobs" home page
        And I fill in the keyword field with "Automation Test Engineer"
        When I click on "Search"
        Then I should see search results
```

Now all the scenarios can be run
```
npx cucumber-js
```


## Further notes

### Solution
You can find all the files discussed here in the `solution` folder.

You can clone, build and run the solution as follows

_Windows_
```
mkdir \code
cd /code
git clone https://github.com/Qarj/puppeteer-cucumber-example
cd puppeteer-cucumber-example/solution
npm install
npx cucumber-js
```


### Slow Mode
In `actions.js` slowMo is set to 5 to make the tests run more slowly
so it is easier to see what is going on. Set it to 0 make the tests
run faster.



## Ubuntu Install

```bash
sudo apt install curl
```

```bash
curl -sL https://deb.nodesource.com/setup_11.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Create a folder for this example project
```bash
mkdir ~/code
mkdir ~/code/pc-demo
cd ~/code/pc-demo
```

Check node and npm versions
```bash
node -v
npm -v
```


Install Visual Studio Code also if you don't have it already
```bash
curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > ~/microsoft.gpg
sudo install -o root -g root -m 644 ~/microsoft.gpg /etc/apt/trusted.gpg.d/
sudo sh -c 'echo "deb [arch=amd64] https://packages.microsoft.com/repos/vscode stable main" > /etc/apt/sources.list.d/vscode.list'
sudo apt-get install apt-transport-https
sudo apt-get update
sudo apt-get install code
```
