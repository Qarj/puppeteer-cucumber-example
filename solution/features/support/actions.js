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