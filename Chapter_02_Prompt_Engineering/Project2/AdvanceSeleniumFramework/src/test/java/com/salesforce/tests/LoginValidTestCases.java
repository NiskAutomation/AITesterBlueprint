package com.salesforce.tests;

import org.testng.annotations.Test;
import org.testng.Assert;
import com.salesforce.config.Config;

public class LoginValidTestCases extends BaseTest {

    @Test(priority = 1, description = "TC001 - Valid username and valid password")
    public void testLoginWithValidCredentials() {
        try {
            Assert.assertTrue(loginPage.isLoginPageDisplayed(), "Login page not displayed");
            loginPage.performLogin(Config.VALID_USERNAME, Config.VALID_PASSWORD);
            Thread.sleep(3000);
            Assert.assertNotEquals(loginPage.getCurrentPageUrl(), Config.BASE_URL, 
                "User should be redirected after successful login");
        } catch (Exception e) {
            Assert.fail("Test failed: " + e.getMessage());
        }
    }

    @Test(priority = 2, description = "TC002 - Login button is enabled with valid credentials")
    public void testLoginButtonEnabledWithValidCredentials() {
        try {
            Assert.assertTrue(loginPage.isLoginPageDisplayed(), "Login page not displayed");
            loginPage.enterUsername(Config.VALID_USERNAME);
            loginPage.enterPassword(Config.VALID_PASSWORD);
            Assert.assertTrue(loginPage.isLoginButtonEnabled(), "Login button should be enabled");
        } catch (Exception e) {
            Assert.fail("Test failed: " + e.getMessage());
        }
    }

    @Test(priority = 3, description = "TC003 - Clear username field successfully")
    public void testClearUsernameField() {
        try {
            Assert.assertTrue(loginPage.isLoginPageDisplayed(), "Login page not displayed");
            loginPage.enterUsername(Config.VALID_USERNAME);
            loginPage.clearAllFields();
            Assert.assertTrue(loginPage.isLoginPageDisplayed(), "Login page should still be displayed");
        } catch (Exception e) {
            Assert.fail("Test failed: " + e.getMessage());
        }
    }

    @Test(priority = 4, description = "TC004 - Remember Me checkbox functionality")
    public void testRememberMeCheckboxFunctionality() {
        try {
            Assert.assertTrue(loginPage.isLoginPageDisplayed(), "Login page not displayed");
            loginPage.clickRememberMeCheckbox();
            loginPage.performLogin(Config.VALID_USERNAME, Config.VALID_PASSWORD);
            Thread.sleep(2000);
            Assert.assertNotEquals(loginPage.getCurrentPageUrl(), Config.BASE_URL, 
                "User should be logged in with Remember Me checkbox");
        } catch (Exception e) {
            Assert.fail("Test failed: " + e.getMessage());
        }
    }

    @Test(priority = 5, description = "TC005 - Login page elements visibility")
    public void testLoginPageElementsVisibility() {
        try {
            Assert.assertTrue(loginPage.isLoginPageDisplayed(), "Login page not displayed");
            Assert.assertTrue(loginPage.isLoginButtonEnabled(), "Login button should be visible");
        } catch (Exception e) {
            Assert.fail("Test failed: " + e.getMessage());
        }
    }

    @Test(priority = 6, description = "TC006 - Page title verification")
    public void testLoginPageTitle() {
        try {
            String pageTitle = loginPage.getCurrentPageTitle();
            Assert.assertNotNull(pageTitle, "Page title should not be null");
            Assert.assertTrue(pageTitle.toLowerCase().contains("salesforce") || 
                             pageTitle.toLowerCase().contains("login"), 
                "Page title should contain Salesforce or Login");
        } catch (Exception e) {
            Assert.fail("Test failed: " + e.getMessage());
        }
    }

    @Test(priority = 7, description = "TC007 - Valid credentials entry without login")
    public void testValidCredentialsEntryWithoutLogin() {
        try {
            Assert.assertTrue(loginPage.isLoginPageDisplayed(), "Login page not displayed");
            loginPage.enterUsername(Config.VALID_USERNAME);
            loginPage.enterPassword(Config.VALID_PASSWORD);
            Assert.assertTrue(loginPage.isLoginButtonEnabled(), "Login button should be enabled after entering credentials");
        } catch (Exception e) {
            Assert.fail("Test failed: " + e.getMessage());
        }
    }
}
