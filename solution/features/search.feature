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