# Advance Selenium Framework

An **enterprise-grade Java automation framework** built with [Selenium WebDriver](https://www.selenium.dev/), [TestNG](https://testng.org/), and [WebDriverManager](https://github.com/bonigarcia/webdrivermanager). Designed for Salesforce login testing and extensible to other web applications.

## Tech Stack

- **Java 8**
- **Selenium** 3.141.59
- **TestNG** 6.14.3
- **WebDriverManager** 5.6.3
- **Log4j2** 2.20.0
- **Maven** (build tool)

## Project Structure

```
AdvanceSeleniumFramework/
├── pom.xml                     # Maven build configuration
├── src/
│   ├── main/java/              # Page Object Models & utilities
│   └── test/java/              # TestNG test classes
│   └── test/resources/
│       └── testng.xml          # TestNG suite definition
```

## Getting Started

### Prerequisites
- Java 8 JDK installed
- Maven installed
- Chrome / Firefox / Edge browser installed

### Build & Run

```bash
# Compile the project
mvn clean compile

# Run tests via Maven
mvn clean test

# Or run a specific TestNG suite
mvn test -DsuiteXmlFile=src/test/resources/testng.xml
```

## Key Features

- **Page Object Model (POM)** for maintainable test code
- **WebDriverManager** for automatic driver management
- **TestNG** for flexible test execution and reporting
- **Log4j2** for structured logging

---
*Part of the AITesterBlueprint repository — Chapter 02: Prompt Engineering.*
