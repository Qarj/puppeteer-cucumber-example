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