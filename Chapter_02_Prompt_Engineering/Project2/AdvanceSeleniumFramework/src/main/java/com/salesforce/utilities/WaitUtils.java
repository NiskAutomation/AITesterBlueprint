package com.salesforce.utilities;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import com.salesforce.config.Config;
import java.util.concurrent.TimeUnit;

public class WaitUtils {

    private WebDriver driver;
    private WebDriverWait wait;

    public WaitUtils(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Config.EXPLICIT_WAIT);
    }

    public WebElement waitForElementPresence(By locator) {
        try {
            return wait.until(ExpectedConditions.presenceOfElementLocated(locator));
        } catch (Exception e) {
            throw new RuntimeException("Element not found within " + Config.EXPLICIT_WAIT + " seconds: " + locator);
        }
    }

    public WebElement waitForElementVisibility(By locator) {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(locator));
        } catch (Exception e) {
            throw new RuntimeException("Element not visible within " + Config.EXPLICIT_WAIT + " seconds: " + locator);
        }
    }

    public WebElement waitForElementClickable(By locator) {
        try {
            return wait.until(ExpectedConditions.elementToBeClickable(locator));
        } catch (Exception e) {
            throw new RuntimeException("Element not clickable within " + Config.EXPLICIT_WAIT + " seconds: " + locator);
        }
    }

    public boolean waitForElementInvisibility(By locator) {
        try {
            return wait.until(ExpectedConditions.invisibilityOfElementLocated(locator));
        } catch (Exception e) {
            return false;
        }
    }

    public boolean waitForTextInElement(By locator, String text) {
        try {
            return wait.until(ExpectedConditions.textToBePresentInElementLocated(locator, text));
        } catch (Exception e) {
            throw new RuntimeException("Text '" + text + "' not found in element within " + Config.EXPLICIT_WAIT + " seconds");
        }
    }

    public boolean isElementPresent(By locator) {
        try {
            WebDriverWait shortWait = new WebDriverWait(driver, 3);
            shortWait.until(ExpectedConditions.presenceOfElementLocated(locator));
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
