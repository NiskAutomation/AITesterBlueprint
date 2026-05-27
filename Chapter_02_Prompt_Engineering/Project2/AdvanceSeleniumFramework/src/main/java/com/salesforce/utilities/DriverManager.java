package com.salesforce.utilities;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.remote.RemoteWebDriver;
import io.github.bonigarcia.wdm.WebDriverManager;
import com.salesforce.config.Config;
import java.util.concurrent.TimeUnit;

public class DriverManager {

    private static ThreadLocal<WebDriver> driver = new ThreadLocal<>();

    public static WebDriver initializeDriver() {
        if (driver.get() == null) {
            try {
                String browser = Config.BROWSER.toLowerCase();

                if (browser.equals("chrome")) {
                    WebDriverManager.chromedriver().setup();
                    driver.set(new ChromeDriver());
                } else if (browser.equals("firefox")) {
                    WebDriverManager.firefoxdriver().setup();
                    driver.set(new FirefoxDriver());
                } else {
                    throw new IllegalArgumentException("Unsupported browser: " + browser);
                }

                WebDriver webDriver = driver.get();
                webDriver.manage().window().maximize();
                webDriver.manage().timeouts().implicitlyWait(Config.IMPLICIT_WAIT, TimeUnit.SECONDS);
                webDriver.manage().timeouts().pageLoadTimeout(Config.PAGE_LOAD_TIMEOUT, TimeUnit.SECONDS);

            } catch (Exception e) {
                throw new RuntimeException("Failed to initialize WebDriver: " + e.getMessage());
            }
        }
        return driver.get();
    }

    public static WebDriver getDriver() {
        if (driver.get() == null) {
            initializeDriver();
        }
        return driver.get();
    }

    public static void quitDriver() {
        try {
            WebDriver webDriver = driver.get();
            if (webDriver != null) {
                webDriver.quit();
                driver.remove();
            }
        } catch (Exception e) {
            System.err.println("Error while closing driver: " + e.getMessage());
        }
    }
}
