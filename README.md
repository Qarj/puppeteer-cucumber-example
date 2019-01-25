# puppeteer-cucumber-example
Building a Puppeteer Cucumber test from scratch


## Windows Install

These instructions will work on a brand new OS install.


1. Open up an administrator command prompt and install Chocolatey
```batch
@"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"
```

2. Install node.js
```batch
choco install nodejs
```

3. Install Visual Studio Code
```batch
choco install vscode
```

4. Close command prompt then open a fresh administrator command prompt

5. Create the required folders for this example project
```batch
mkdir \code
mkdir \code\pc-demo
cd /code/pc-demo
mkdir features
mkdir features\step_definitions
mkdir features\support
```

6. Check node and npm versions
```batch
node -v
npm -v
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

3. Create a folder for our Cucumber features

```batch
mkdir features
```

4. Create a feature file

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
        When I click on "Search"
        Then I should see search results
```

5. See a list of undefined steps

```
npx cucumber-js
```

The ouput should be similar to this
```cucumber
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

   ? When I click on "Search"
       Undefined. Implement with the following snippet:

         When('I click on {string}', function (string) {
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

6. Create the step definitions JavaScript shell

```batch
npx cucumber-js > features/step_definitions/search_steps.js
code features/step_definitions/search_steps.js
```

Add this line at the start
```javascript
const { Given, When, Then } = require('cucumber');
```

Then remove all the English text so you are only left with JavaScript code.
Fix the indenting of the code.

You will end up with something like
```javascript
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

When('I click on {string}', function (string) {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
});

Then('I should see search results', function () {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
});

```

7. Run Cucumber again

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
   - When I click on "Search" # features\step_definitions\search_steps.js:18
   - Then I should see search results # features\step_definitions\search_steps.js:23

1 scenario (1 pending)
5 steps (1 pending, 4 skipped)
0m00.001s

C:\code\pc-demo>
```

## Implement the Cucumber test with Puppeteer

1. Install Puppeteer to the project

```
npm --save-dev install puppeteer
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
code features/support/hooks.js
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

## Ubuntu Install

```
sudo apt install curl
```

```
curl -sL https://deb.nodesource.com/setup_11.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Create a folder for this example project
```batch
mkdir ~/code
mkdir ~/code/pc-demo
cd ~/code/pc-demo
mkdir features
mkdir features/step_definitions
mkdir features/support
```

Check node and npm versions
```batch
node -v
npm -v
```

### Visual Studio Code

```
curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > ~/microsoft.gpg
sudo install -o root -g root -m 644 ~/microsoft.gpg /etc/apt/trusted.gpg.d/
sudo sh -c 'echo "deb [arch=amd64] https://packages.microsoft.com/repos/vscode stable main" > /etc/apt/sources.list.d/vscode.list'
```

```
sudo apt-get install apt-transport-https
sudo apt-get update
sudo apt-get install code
```



# References

https://medium.com/@anephenix/end-to-end-testing-single-page-apps-and-node-js-apis-with-cucumber-js-and-puppeteer-ad5a519ace0
