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