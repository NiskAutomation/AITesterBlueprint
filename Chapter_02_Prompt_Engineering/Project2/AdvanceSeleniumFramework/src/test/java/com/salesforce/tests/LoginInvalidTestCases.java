package com.salesforce.tests;

import org.testng.annotations.Test;
import org.testng.Assert;
import com.salesforce.config.Config;

public class LoginInvalidTestCases extends BaseTest {

    @Test(priority = 1, description = "TC101 - Login with empty username and valid password")
    public void testLoginWithEmptyUsername() {
        try {
            Assert.assertTrue(loginPage.isLoginPageDisplayed(), "Login page not displayed");
            loginPage.enterUsername(Config.EMPTY_STRING);
            loginPage.enterPassword(Config.VALID_PASSWORD);
            loginPage.clickLoginButton();
            Thread.sleep(2000);
            Assert.assertTrue(loginPage.isErrorMessageDisplayed() || loginPage.getCurrentPageUrl().equals(Config.BASE_URL), 
                "Error should be displayed or user should remain on login page");
        } catch (Exception e) {
            Assert.fail("Test failed: " + e.getMessage());
        }
    }

    @Test(priority = 2, description = "TC102 - Login with valid username and empty password")
    public void testLoginWithEmptyPassword() {
        try {
            Assert.assertTrue(loginPage.isLoginPageDisplayed(), "Login page not displayed");
            loginPage.enterUsername(Config.VALID_USERNAME);
            loginPage.enterPassword(Config.EMPTY_STRING);
            loginPage.clickLoginButton();
            Thread.sleep(2000);
            Assert.assertTrue(loginPage.isErrorMessageDisplayed() || loginPage.getCurrentPageUrl().equals(Config.BASE_URL), 
                "Error should be displayed or user should remain on login page");
        } catch (Exception e) {
            Assert.fail("Test failed: " + e.getMessage());
        }
    }

    @Test(priority = 3, description = "TC103 - Login with both username and password empty")
    public void testLoginWithBothFieldsEmpty() {
        try {
            Assert.assertTrue(loginPage.isLoginPageDisplayed(), "Login page not displayed");
            loginPage.enterUsername(Config.EMPTY_STRING);
            loginPage.enterPassword(Config.EMPTY_STRING);
            loginPage.clickLoginButton();
            Thread.sleep(2000);
            Assert.assertTrue(loginPage.isErrorMessageDisplayed() || loginPage.getCurrentPageUrl().equals(Config.BASE_URL), 
                "Error should be displayed or user should remain on login page");
        } catch (Exception e) {
            Assert.fail("Test failed: " + e.getMessage());
        }
    }

    @Test(priority = 4, description = "TC104 - Login with invalid username")
    public void testLoginWithInvalidUsername() {
        try {
            Assert.assertTrue(loginPage.isLoginPageDisplayed(), "Login page not displayed");
            loginPage.performLogin(Config.INVALID_USERNAME, Config.VALID_PASSWORD);
            Thread.sleep(2000);
            Assert.assertTrue(loginPage.isErrorMessageDisplayed() || loginPage.getCurrentPageUrl().equals(Config.BASE_URL), 
                "Error should be displayed for invalid username");
        } catch (Exception e) {
            Assert.fail("Test failed: " + e.getMessage());
        }
    }

    @Test(priority = 5, description = "TC105 - Login with invalid password")
    public void testLoginWithInvalidPassword() {
        try {
            Assert.assertTrue(loginPage.isLoginPageDisplayed(), "Login page not displayed");
            loginPage.performLogin(Config.VALID_USERNAME, Config.INVALID_PASSWORD);
            Thread.sleep(2000);
            Assert.assertTrue(loginPage.isErrorMessageDisplayed() || loginPage.getCurrentPageUrl().equals(Config.BASE_URL), 
                "Error should be displayed for invalid password");
        } catch (Exception e) {
            Assert.fail("Test failed: " + e.getMessage());
        }
    }

    @Test(priority = 6, description = "TC106 - Login with special characters in username")
    public void testLoginWithSpecialCharactersInUsername() {
        try {
            Assert.assertTrue(loginPage.isLoginPageDisplayed(), "Login page not displayed");
            loginPage.performLogin(Config.SPECIAL_CHARACTERS, Config.VALID_PASSWORD);
            Thread.sleep(2000);
            Assert.assertTrue(loginPage.isErrorMessageDisplayed() || loginPage.getCurrentPageUrl().equals(Config.BASE_URL), 
                "Error should be displayed for special characters in username");
        } catch (Exception e) {
            Assert.fail("Test failed: " + e.getMessage());
        }
    }

    @Test(priority = 7, description = "TC107 - Multiple invalid login attempts")
    public void testMultipleInvalidLoginAttempts() {
        try {
            Assert.assertTrue(loginPage.isLoginPageDisplayed(), "Login page not displayed");
            for (int i = 0; i < 3; i++) {
                loginPage.clearAllFields();
                loginPage.performLogin(Config.INVALID_USERNAME, Config.INVALID_PASSWORD);
                Thread.sleep(1500);
            }
            Assert.assertTrue(loginPage.getCurrentPageUrl().equals(Config.BASE_URL) || 
                             loginPage.isErrorMessageDisplayed(), 
                "User should remain on login page after multiple failed attempts");
        } catch (Exception e) {
            Assert.fail("Test failed: " + e.getMessage());
        }
    }
}
