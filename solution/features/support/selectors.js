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
