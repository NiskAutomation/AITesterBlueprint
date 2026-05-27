package com.salesforce.config;

public class Config {
    
    public static final String BASE_URL = "https://login.salesforce.com/?locale=in";
    
    public static final String BROWSER = "chrome";
    
    public static final int IMPLICIT_WAIT = 10;
    public static final int EXPLICIT_WAIT = 15;
    public static final int PAGE_LOAD_TIMEOUT = 20;
    
    public static final String VALID_USERNAME = "test@salesforce.com";
    public static final String VALID_PASSWORD = "Test@123456";
    
    public static final String INVALID_USERNAME = "invalid@test.com";
    public static final String INVALID_PASSWORD = "InvalidPass@123";
    
    public static final String EMPTY_STRING = "";
    
    public static final String SPECIAL_CHARACTERS = "!@#$%^&*()";
    
    public static final long WAIT_ELEMENT_TIMEOUT = 15;
    public static final long POLLING_INTERVAL = 500;
}
