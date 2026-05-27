package com.salesforce.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import com.salesforce.utilities.WaitUtils;
import com.salesforce.config.Config;

public class LoginPage {

    private WebDriver driver;
    private WaitUtils waitUtils;

    @FindBy(xpath = "//input[@id='username']")
    private WebElement usernameField;

    @FindBy(xpath = "//input[@id='password']")
    private WebElement passwordField;

    @FindBy(xpath = "//input[@id='Login']")
    private WebElement loginButton;

    @FindBy(xpath = "//input[@id='rememberUn']")
    private WebElement rememberMeCheckbox;

    @FindBy(xpath = "//div[@id='error']//li/label")
    private WebElement errorMessage;

    @FindBy(xpath = "//a[contains(text(),'Forgot Your Password')]")
    private WebElement forgotPasswordLink;

    @FindBy(xpath = "//div[@class='loginAttemptMsg']")
    private WebElement loginAttemptError;

    public LoginPage(WebDriver driver) {
        this.driver = driver;
        this.waitUtils = new WaitUtils(driver);
        PageFactory.initElements(driver, this);
    }

    public void navigateToLoginPage() {
        try {
            driver.navigate().to(Config.BASE_URL);
        } catch (Exception e) {
            throw new RuntimeException("Failed to navigate to login page: " + e.getMessage());
        }
    }

    public void enterUsername(String username) {
        try {
            WebElement element = waitUtils.waitForElementVisibility(By.xpath("//input[@id='username']"));
            element.clear();
            element.sendKeys(username);
        } catch (Exception e) {
            throw new RuntimeException("Failed to enter username: " + e.getMessage());
        }
    }

    public void enterPassword(String password) {
        try {
            WebElement element = waitUtils.waitForElementVisibility(By.xpath("//input[@id='password']"));
            element.clear();
            element.sendKeys(password);
        } catch (Exception e) {
            throw new RuntimeException("Failed to enter password: " + e.getMessage());
        }
    }

    public void clickLoginButton() {
        try {
            WebElement element = waitUtils.waitForElementClickable(By.xpath("//input[@id='Login']"));
            element.click();
        } catch (Exception e) {
            throw new RuntimeException("Failed to click login button: " + e.getMessage());
        }
    }

    public void clickRememberMeCheckbox() {
        try {
            WebElement element = waitUtils.waitForElementClickable(By.xpath("//input[@id='rememberUn']"));
            if (!element.isSelected()) {
                element.click();
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to click remember me checkbox: " + e.getMessage());
        }
    }

    public String getErrorMessage() {
        try {
            WebElement element = waitUtils.waitForElementVisibility(By.xpath("//div[@id='error']//li/label"));
            return element.getText();
        } catch (Exception e) {
            return "Error message not found";
        }
    }

    public boolean isErrorMessageDisplayed() {
        try {
            return waitUtils.isElementPresent(By.xpath("//div[@id='error']//li/label"));
        } catch (Exception e) {
            return false;
        }
    }

    public void performLogin(String username, String password) {
        try {
            enterUsername(username);
            enterPassword(password);
            clickLoginButton();
        } catch (Exception e) {
            throw new RuntimeException("Failed to perform login: " + e.getMessage());
        }
    }

    public void clearAllFields() {
        try {
            waitUtils.waitForElementVisibility(By.xpath("//input[@id='username']")).clear();
            waitUtils.waitForElementVisibility(By.xpath("//input[@id='password']")).clear();
        } catch (Exception e) {
            throw new RuntimeException("Failed to clear fields: " + e.getMessage());
        }
    }

    public boolean isLoginButtonEnabled() {
        try {
            return waitUtils.waitForElementPresence(By.xpath("//input[@id='Login']")).isEnabled();
        } catch (Exception e) {
            return false;
        }
    }

    public String getCurrentPageTitle() {
        try {
            return driver.getTitle();
        } catch (Exception e) {
            throw new RuntimeException("Failed to get page title: " + e.getMessage());
        }
    }

    public String getCurrentPageUrl() {
        try {
            return driver.getCurrentUrl();
        } catch (Exception e) {
            throw new RuntimeException("Failed to get current URL: " + e.getMessage());
        }
    }

    public boolean isLoginPageDisplayed() {
        try {
            return waitUtils.isElementPresent(By.xpath("//input[@id='username']")) &&
                   waitUtils.isElementPresent(By.xpath("//input[@id='password']")) &&
                   waitUtils.isElementPresent(By.xpath("//input[@id='Login']"));
        } catch (Exception e) {
            return false;
        }
    }
}
