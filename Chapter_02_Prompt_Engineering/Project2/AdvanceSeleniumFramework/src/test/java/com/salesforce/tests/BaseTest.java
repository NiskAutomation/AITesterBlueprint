package com.salesforce.tests;

import org.openqa.selenium.WebDriver;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.AfterTest;
import com.salesforce.utilities.DriverManager;
import com.salesforce.pages.LoginPage;

public class BaseTest {

    protected WebDriver driver;
    protected LoginPage loginPage;

    @BeforeTest
    public void setUp() {
        try {
            driver = DriverManager.initializeDriver();
            loginPage = new LoginPage(driver);
            loginPage.navigateToLoginPage();
        } catch (Exception e) {
            throw new RuntimeException("Setup failed: " + e.getMessage());
        }
    }

    @AfterTest
    public void tearDown() {
        try {
            DriverManager.quitDriver();
        } catch (Exception e) {
            System.err.println("Teardown error: " + e.getMessage());
        }
    }
}
