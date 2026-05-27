# RESTful Booker API - Test Cases

## Test Case Format (JIRA Compatible)

---

## 1. AUTH - CreateToken Endpoint Tests

### TC_AUTH_001 - Happy Path: Create Token with Valid Credentials
```
Test Case ID: TC_AUTH_001
Summary: Create authentication token with valid credentials
Component: Auth
Priority: Critical
Type: Functional

Description:
Verify that a valid authentication token is generated when correct credentials (admin/password123) are provided to the Auth endpoint.

Steps to Reproduce:
1. Open API client (Postman, curl, etc.)
2. Set request method to POST
3. Set URL to https://restful-booker.herokuapp.com/auth
4. Set Content-Type header to application/json
5. Send request with body:
   {
     "username": "admin",
     "password": "password123"
   }

Expected Result:
- HTTP Status Code: 200 OK
- Response contains "token" field
- Token value is a non-empty string (e.g., "abc123")
- Response time < 2000ms

Actual Result:
[To be filled during execution]

Notes:
- This token is required for PUT, PATCH, and DELETE operations
- Token format and expiration policy should be documented
```

### TC_AUTH_002 - Error Scenario: Create Token with Invalid Username
```
Test Case ID: TC_AUTH_002
Summary: Attempt token creation with invalid username
Component: Auth
Priority: High
Type: Negative

Description:
Verify that authentication fails gracefully when an invalid username is provided.

Steps to Reproduce:
1. Open API client
2. Set request method to POST
3. Set URL to https://restful-booker.herokuapp.com/auth
4. Set Content-Type header to application/json
5. Send request with body:
   {
     "username": "invaliduser",
     "password": "password123"
   }

Expected Result:
- HTTP Status Code: 200 (or 401/403 depending on API design)
- Response does NOT contain a valid token
- OR Response contains error message indicating authentication failure
- No token issued

Actual Result:
[To be filled during execution]

Notes:
- API behavior for invalid username should be clearly documented
```

### TC_AUTH_003 - Error Scenario: Create Token with Invalid Password
```
Test Case ID: TC_AUTH_003
Summary: Attempt token creation with invalid password
Component: Auth
Priority: High
Type: Negative

Description:
Verify that authentication fails when correct username but incorrect password is provided.

Steps to Reproduce:
1. Open API client
2. Set request method to POST
3. Set URL to https://restful-booker.herokuapp.com/auth
4. Set Content-Type header to application/json
5. Send request with body:
   {
     "username": "admin",
     "password": "wrongpassword"
   }

Expected Result:
- HTTP Status Code: 200 (or 401 depending on design)
- Response does NOT contain a valid token
- OR Response contains error message

Actual Result:
[To be filled during execution]
```

### TC_AUTH_004 - Edge Case: Create Token with Empty Credentials
```
Test Case ID: TC_AUTH_004
Summary: Attempt token creation with empty username and password
Component: Auth
Priority: High
Type: Edge Case

Description:
Verify API behavior when empty strings are provided for credentials.

Steps to Reproduce:
1. Open API client
2. Set request method to POST
3. Set URL to https://restful-booker.herokuapp.com/auth
4. Set Content-Type header to application/json
5. Send request with body:
   {
     "username": "",
     "password": ""
   }

Expected Result:
- HTTP Status Code: 400 (Bad Request) or 401 (Unauthorized)
- Request is rejected
- Error message indicates invalid input

Actual Result:
[To be filled during execution]
```

### TC_AUTH_005 - Edge Case: Create Token with Missing JSON Fields
```
Test Case ID: TC_AUTH_005
Summary: Attempt token creation with missing password field
Component: Auth
Priority: High
Type: Edge Case

Description:
Verify API validation when required fields are missing.

Steps to Reproduce:
1. Open API client
2. Set request method to POST
3. Set URL to https://restful-booker.herokuapp.com/auth
4. Set Content-Type header to application/json
5. Send request with body:
   {
     "username": "admin"
   }

Expected Result:
- HTTP Status Code: 400 (Bad Request)
- Error message indicates missing required field "password"
- No token issued

Actual Result:
[To be filled during execution]
```

### TC_AUTH_006 - Edge Case: Create Token with Special Characters in Password
```
Test Case ID: TC_AUTH_006
Summary: Create token with special characters in credentials
Component: Auth
Priority: Medium
Type: Edge Case

Description:
Verify token creation handles special characters properly.

Steps to Reproduce:
1. Open API client
2. Set request method to POST
3. Set URL to https://restful-booker.herokuapp.com/auth
4. Set Content-Type header to application/json
5. Send request with body:
   {
     "username": "admin@special#test",
     "password": "p@$$w0rd!123"
   }

Expected Result:
- HTTP Status Code: 200 or 401 (depending on whether these are valid credentials)
- Response handled without encoding errors
- No SQL injection or special character handling issues

Actual Result:
[To be filled during execution]
```

---

## 2. BOOKING - GetBookingIds Endpoint Tests

### TC_BOOKING_GET_001 - Happy Path: Get All Booking IDs
```
Test Case ID: TC_BOOKING_GET_001
Summary: Retrieve all booking IDs without filters
Component: Booking - GetBookingIds
Priority: Critical
Type: Functional

Description:
Verify that all booking IDs are retrieved successfully without applying any filters.

Steps to Reproduce:
1. Open API client
2. Set request method to GET
3. Set URL to https://restful-booker.herokuapp.com/booking
4. No request body needed
5. Send request

Expected Result:
- HTTP Status Code: 200 OK
- Response contains array of booking objects
- Each object contains "bookingid" field with numeric value
- Response is valid JSON array
- Response time < 2000ms
- Example response:
  [
    { "bookingid": 1 },
    { "bookingid": 2 },
    { "bookingid": 3 }
  ]

Actual Result:
[To be filled during execution]

Notes:
- Number of bookings may vary depending on test environment
```

### TC_BOOKING_GET_002 - Happy Path: Get Bookings Filtered by First Name
```
Test Case ID: TC_BOOKING_GET_002
Summary: Retrieve bookings filtered by first name
Component: Booking - GetBookingIds
Priority: High
Type: Functional

Description:
Verify that filtering by firstname parameter works correctly.

Steps to Reproduce:
1. Open API client
2. Set request method to GET
3. Set URL to https://restful-booker.herokuapp.com/booking?firstname=sally
4. Send request

Expected Result:
- HTTP Status Code: 200 OK
- Response contains array of booking objects
- All returned bookings have firstname "Sally" (or equivalent)
- Each object contains "bookingid" field
- Response is empty array [] if no matches found

Actual Result:
[To be filled during execution]

Notes:
- Test with both existing and non-existing first names
```

### TC_BOOKING_GET_003 - Happy Path: Get Bookings Filtered by Last Name
```
Test Case ID: TC_BOOKING_GET_003
Summary: Retrieve bookings filtered by last name
Component: Booking - GetBookingIds
Priority: High
Type: Functional

Description:
Verify that filtering by lastname parameter works correctly.

Steps to Reproduce:
1. Open API client
2. Set request method to GET
3. Set URL to https://restful-booker.herokuapp.com/booking?lastname=Brown
4. Send request

Expected Result:
- HTTP Status Code: 200 OK
- Response contains array of bookings
- All returned bookings have lastname "Brown"
- Response is empty array [] if no matches

Actual Result:
[To be filled during execution]
```

### TC_BOOKING_GET_004 - Happy Path: Get Bookings Filtered by Check-in Date
```
Test Case ID: TC_BOOKING_GET_004
Summary: Retrieve bookings filtered by check-in date
Component: Booking - GetBookingIds
Priority: High
Type: Functional

Description:
Verify that filtering by checkin date works correctly. Only bookings with checkin >= specified date should be returned.

Steps to Reproduce:
1. Open API client
2. Set request method to GET
3. Set URL to https://restful-booker.herokuapp.com/booking?checkin=2014-03-13
4. Send request

Expected Result:
- HTTP Status Code: 200 OK
- Response contains array of bookings
- All returned bookings have checkin date >= 2014-03-13
- Date format in response follows YYYY-MM-DD format
- Response is empty array [] if no bookings match

Actual Result:
[To be filled during execution]

Notes:
- Date format must be CCYY-MM-DD as per API documentation
```

### TC_BOOKING_GET_005 - Happy Path: Get Bookings Filtered by Checkout Date
```
Test Case ID: TC_BOOKING_GET_005
Summary: Retrieve bookings filtered by checkout date
Component: Booking - GetBookingIds
Priority: High
Type: Functional

Description:
Verify that filtering by checkout date works correctly.

Steps to Reproduce:
1. Open API client
2. Set request method to GET
3. Set URL to https://restful-booker.herokuapp.com/booking?checkout=2014-05-20
4. Send request

Expected Result:
- HTTP Status Code: 200 OK
- Response contains array of bookings
- All returned bookings have checkout date >= 2014-05-20
- Response is empty array [] if no matches

Actual Result:
[To be filled during execution]
```

### TC_BOOKING_GET_006 - Happy Path: Get Bookings with Multiple Filters
```
Test Case ID: TC_BOOKING_GET_006
Summary: Retrieve bookings with combined first name, last name, and date filters
Component: Booking - GetBookingIds
Priority: High
Type: Functional

Description:
Verify that multiple filter parameters work together correctly.

Steps to Reproduce:
1. Open API client
2. Set request method to GET
3. Set URL to https://restful-booker.herokuapp.com/booking?firstname=Jim&lastname=Brown&checkin=2013-01-01&checkout=2014-12-31
4. Send request

Expected Result:
- HTTP Status Code: 200 OK
- Response contains array of bookings
- All bookings match ALL filter criteria
- Filters work with AND logic (not OR)

Actual Result:
[To be filled during execution]
```

### TC_BOOKING_GET_007 - Error Scenario: Invalid Date Format
```
Test Case ID: TC_BOOKING_GET_007
Summary: Attempt to filter with invalid date format
Component: Booking - GetBookingIds
Priority: High
Type: Negative

Description:
Verify API handles invalid date format gracefully.

Steps to Reproduce:
1. Open API client
2. Set request method to GET
3. Set URL to https://restful-booker.herokuapp.com/booking?checkin=13-03-2014
4. Send request

Expected Result:
- HTTP Status Code: 400 (Bad Request) or 200 with empty results
- Error message or empty response indicating invalid format
- API does not crash

Actual Result:
[To be filled during execution]

Notes:
- API should validate date format (CCYY-MM-DD)
```

### TC_BOOKING_GET_008 - Edge Case: Filter with Non-existent Name
```
Test Case ID: TC_BOOKING_GET_008
Summary: Retrieve bookings with filter matching no records
Component: Booking - GetBookingIds
Priority: Medium
Type: Edge Case

Description:
Verify API returns empty array when filter matches no bookings.

Steps to Reproduce:
1. Open API client
2. Set request method to GET
3. Set URL to https://restful-booker.herokuapp.com/booking?firstname=NonExistentName123
4. Send request

Expected Result:
- HTTP Status Code: 200 OK
- Response is empty array []
- No error message, graceful empty result

Actual Result:
[To be filled during execution]
```

### TC_BOOKING_GET_009 - Edge Case: Filter with SQL Injection Attempt
```
Test Case ID: TC_BOOKING_GET_009
Summary: Security test - attempt SQL injection via firstname filter
Component: Booking - GetBookingIds
Priority: Critical
Type: Security/Edge Case

Description:
Verify API is protected against SQL injection attacks through query parameters.

Steps to Reproduce:
1. Open API client
2. Set request method to GET
3. Set URL to https://restful-booker.herokuapp.com/booking?firstname='; DROP TABLE bookings; --
4. Send request

Expected Result:
- HTTP Status Code: 200 OK
- Response contains no bookings (parameter treated as literal string)
- Database structure remains intact
- No SQL errors in response

Actual Result:
[To be filled during execution]

Notes:
- Critical security test
- Verify input sanitization
```

### TC_BOOKING_GET_010 - Edge Case: Filter with Special URL Characters
```
Test Case ID: TC_BOOKING_GET_010
Summary: Test filtering with special URL-encoded characters
Component: Booking - GetBookingIds
Priority: Medium
Type: Edge Case

Description:
Verify proper URL encoding handling in query parameters.

Steps to Reproduce:
1. Open API client
2. Set request method to GET
3. Set URL to https://restful-booker.herokuapp.com/booking?firstname=John%20Paul&lastname=O%27Brien
4. Send request

Expected Result:
- HTTP Status Code: 200 OK
- Query parameters properly decoded
- Spaces and special characters handled correctly
- Results match literal string values

Actual Result:
[To be filled during execution]

Notes:
- Test URL encoding/decoding
```

---

## 3. BOOKING - GetBooking Endpoint Tests

### TC_BOOKING_GETID_001 - Happy Path: Get Existing Booking by ID
```
Test Case ID: TC_BOOKING_GETID_001
Summary: Retrieve specific booking details by valid ID
Component: Booking - GetBooking
Priority: Critical
Type: Functional

Description:
Verify that booking details are retrieved successfully using a valid booking ID.

Steps to Reproduce:
1. Open API client
2. Set request method to GET
3. Set URL to https://restful-booker.herokuapp.com/booking/1
4. Set Accept header to application/json
5. Send request

Expected Result:
- HTTP Status Code: 200 OK
- Response contains booking object with fields:
  - firstname (String)
  - lastname (String)
  - totalprice (Number)
  - depositpaid (Boolean)
  - bookingdates (Object)
    - checkin (Date, format: YYYY-MM-DD)
    - checkout (Date, format: YYYY-MM-DD)
  - additionalneeds (String)
- Response time < 1000ms
- Example response:
  {
    "firstname": "Sally",
    "lastname": "Brown",
    "totalprice": 111,
    "depositpaid": true,
    "bookingdates": {
      "checkin": "2013-02-23",
      "checkout": "2014-10-23"
    },
    "additionalneeds": "Breakfast"
  }

Actual Result:
[To be filled during execution]
```

### TC_BOOKING_GETID_002 - Happy Path: Get Booking with JSON Accept Header
```
Test Case ID: TC_BOOKING_GETID_002
Summary: Retrieve booking with explicit JSON response format
Component: Booking - GetBooking
Priority: High
Type: Functional

Description:
Verify that Accept header application/json returns valid JSON response.

Steps to Reproduce:
1. Open API client
2. Set request method to GET
3. Set URL to https://restful-booker.herokuapp.com/booking/1
4. Set Accept header to application/json
5. Send request

Expected Result:
- HTTP Status Code: 200 OK
- Response Content-Type: application/json
- Response is valid JSON (not XML)
- All booking data present

Actual Result:
[To be filled during execution]
```

### TC_BOOKING_GETID_003 - Happy Path: Get Booking with XML Accept Header
```
Test Case ID: TC_BOOKING_GETID_003
Summary: Retrieve booking with XML response format
Component: Booking - GetBooking
Priority: High
Type: Functional

Description:
Verify that Accept header application/xml returns valid XML response.

Steps to Reproduce:
1. Open API client
2. Set request method to GET
3. Set URL to https://restful-booker.herokuapp.com/booking/1
4. Set Accept header to application/xml
5. Send request

Expected Result:
- HTTP Status Code: 200 OK
- Response Content-Type: application/xml
- Response is valid XML with structure:
  <booking>
    <firstname>...</firstname>
    <lastname>...</lastname>
    ...
  </booking>

Actual Result:
[To be filled during execution]
```

### TC_BOOKING_GETID_004 - Error Scenario: Get Non-existent Booking
```
Test Case ID: TC_BOOKING_GETID_004
Summary: Attempt to retrieve booking with invalid ID
Component: Booking - GetBooking
Priority: High
Type: Negative

Description:
Verify API handles request for non-existent booking ID gracefully.

Steps to Reproduce:
1. Open API client
2. Set request method to GET
3. Set URL to https://restful-booker.herokuapp.com/booking/99999
4. Set Accept header to application/json
5. Send request

Expected Result:
- HTTP Status Code: 404 (Not Found)
- Response may be empty or contain error message
- No invalid data returned

Actual Result:
[To be filled during execution]

Notes:
- Verify 404 is appropriate for missing resource
```

### TC_BOOKING_GETID_005 - Error Scenario: Get Booking with Invalid ID Format
```
Test Case ID: TC_BOOKING_GETID_005
Summary: Attempt to retrieve booking with non-numeric ID
Component: Booking - GetBooking
Priority: High
Type: Negative

Description:
Verify API validation of booking ID parameter format.

Steps to Reproduce:
1. Open API client
2. Set request method to GET
3. Set URL to https://restful-booker.herokuapp.com/booking/abc123
4. Send request

Expected Result:
- HTTP Status Code: 400 (Bad Request) or 404 (Not Found)
- Error message indicating invalid ID format
- API does not crash

Actual Result:
[To be filled during execution]
```

### TC_BOOKING_GETID_006 - Edge Case: Get Booking with Negative ID
```
Test Case ID: TC_BOOKING_GETID_006
Summary: Attempt to retrieve booking with negative ID
Component: Booking - GetBooking
Priority: Medium
Type: Edge Case

Description:
Verify API handles negative ID values appropriately.

Steps to Reproduce:
1. Open API client
2. Set request method to GET
3. Set URL to https://restful-booker.herokuapp.com/booking/-1
4. Send request

Expected Result:
- HTTP Status Code: 404 (Not Found) or 400 (Bad Request)
- No booking returned

Actual Result:
[To be filled during execution]
```

### TC_BOOKING_GETID_007 - Edge Case: Get Booking with Zero ID
```
Test Case ID: TC_BOOKING_GETID_007
Summary: Attempt to retrieve booking with ID 0
Component: Booking - GetBooking
Priority: Medium
Type: Edge Case

Description:
Verify API handles zero as booking ID.

Steps to Reproduce:
1. Open API client
2. Set request method to GET
3. Set URL to https://restful-booker.herokuapp.com/booking/0
4. Send request

Expected Result:
- HTTP Status Code: 404 (Not Found)
- No booking returned

Actual Result:
[To be filled during execution]
```

### TC_BOOKING_GETID_008 - Error Scenario: Missing Accept Header
```
Test Case ID: TC_BOOKING_GETID_008
Summary: Get booking without Accept header
Component: Booking - GetBooking
Priority: Medium
Type: Edge Case

Description:
Verify API default response format when Accept header is missing.

Steps to Reproduce:
1. Open API client
2. Set request method to GET
3. Set URL to https://restful-booker.herokuapp.com/booking/1
4. Do NOT set Accept header
5. Send request

Expected Result:
- HTTP Status Code: 200 OK
- Response defaults to application/json (per API documentation)
- Booking data returned successfully

Actual Result:
[To be filled during execution]
```

### TC_BOOKING_GETID_009 - Edge Case: Very Large Booking ID
```
Test Case ID: TC_BOOKING_GETID_009
Summary: Attempt to retrieve booking with very large ID number
Component: Booking - GetBooking
Priority: Low
Type: Edge Case

Description:
Verify API handles very large numeric IDs appropriately.

Steps to Reproduce:
1. Open API client
2. Set request method to GET
3. Set URL to https://restful-booker.herokuapp.com/booking/999999999999999999
4. Send request

Expected Result:
- HTTP Status Code: 404 (Not Found)
- No booking returned
- No overflow or data type errors

Actual Result:
[To be filled during execution]
```

---

## 4. BOOKING - CreateBooking Endpoint Tests

### TC_BOOKING_CREATE_001 - Happy Path: Create Booking with All Fields
```
Test Case ID: TC_BOOKING_CREATE_001
Summary: Create new booking with all required fields
Component: Booking - CreateBooking
Priority: Critical
Type: Functional

Description:
Verify that a booking is created successfully with all mandatory fields.

Steps to Reproduce:
1. Open API client
2. Set request method to POST
3. Set URL to https://restful-booker.herokuapp.com/booking
4. Set Content-Type header to application/json
5. Set Accept header to application/json
6. Send request with body:
   {
     "firstname": "Jim",
     "lastname": "Brown",
     "totalprice": 111,
     "depositpaid": true,
     "bookingdates": {
       "checkin": "2018-01-01",
       "checkout": "2019-01-01"
     },
     "additionalneeds": "Breakfast"
   }

Expected Result:
- HTTP Status Code: 200 OK
- Response contains:
  - bookingid: numeric ID for newly created booking (positive integer)
  - booking: object containing all submitted fields
- All submitted data is correctly stored and returned
- Response time < 2000ms
- Example response:
  {
    "bookingid": 1,
    "booking": {
      "firstname": "Jim",
      "lastname": "Brown",
      "totalprice": 111,
      "depositpaid": true,
      "bookingdates": {
        "checkin": "2018-01-01",
        "checkout": "2019-01-01"
      },
      "additionalneeds": "Breakfast"
    }
  }

Actual Result:
[To be filled during execution]

Notes:
- Booking ID should be unique and incrementing
- Verify data persistence by retrieving booking via GET
```

### TC_BOOKING_CREATE_002 - Happy Path: Create Booking with Minimal Fields
```
Test Case ID: TC_BOOKING_CREATE_002
Summary: Create booking with only required fields (no additionalneeds)
Component: Booking - CreateBooking
Priority: High
Type: Functional

Description:
Verify that booking can be created without optional additionalneeds field.

Steps to Reproduce:
1. Open API client
2. Set request method to POST
3. Set URL to https://restful-booker.herokuapp.com/booking
4. Set Content-Type header to application/json
5. Send request with body:
   {
     "firstname": "Sally",
     "lastname": "Smith",
     "totalprice": 150,
     "depositpaid": false,
     "bookingdates": {
       "checkin": "2020-01-01",
       "checkout": "2020-01-05"
     }
   }

Expected Result:
- HTTP Status Code: 200 OK
- Booking created successfully
- bookingid returned
- additionalneeds field is either omitted or null in response

Actual Result:
[To be filled during execution]

Notes:
- Verify which fields are truly optional
```

### TC_BOOKING_CREATE_003 - Happy Path: Create Booking with Zero Total Price
```
Test Case ID: TC_BOOKING_CREATE_003
Summary: Create booking with zero total price
Component: Booking - CreateBooking
Priority: Medium
Type: Functional

Description:
Verify that bookings with zero or complimentary rates can be created.

Steps to Reproduce:
1. Open API client
2. Set request method to POST
3. Set URL to https://restful-booker.herokuapp.com/booking
4. Set Content-Type header to application/json
5. Send request with body:
   {
     "firstname": "John",
     "lastname": "Doe",
     "totalprice": 0,
     "depositpaid": false,
     "bookingdates": {
       "checkin": "2020-01-01",
       "checkout": "2020-01-02"
     },
     "additionalneeds": "Free tier"
   }

Expected Result:
- HTTP Status Code: 200 OK
- Booking created with totalprice: 0
- No validation error for zero price

Actual Result:
[To be filled during execution]
```

### TC_BOOKING_CREATE_004 - Happy Path: Create Booking with Negative Total Price
```
Test Case ID: TC_BOOKING_CREATE_004
Summary: Create booking with negative total price (refund/discount)
Component: Booking - CreateBooking
Priority: Medium
Type: Functional

Description:
Verify handling of negative prices (could represent refunds or discounts).

Steps to Reproduce:
1. Open API client
2. Set request method to POST
3. Set URL to https://restful-booker.herokuapp.com/booking
4. Set Content-Type header to application/json
5. Send request with body:
   {
     "firstname": "Jane",
     "lastname": "Refund",
     "totalprice": -50,
     "depositpaid": true,
     "bookingdates": {
       "checkin": "2020-01-01",
       "checkout": "2020-01-05"
     }
   }

Expected Result:
- HTTP Status Code: 200 OK or 400 (Bad Request)
- Either booking created or error message explaining why negative price not allowed

Actual Result:
[To be filled during execution]

Notes:
- API behavior for negative prices should be documented
```

### TC_BOOKING_CREATE_005 - Happy Path: Create Booking with Special Characters in Names
```
Test Case ID: TC_BOOKING_CREATE_005
Summary: Create booking with special characters in firstname and lastname
Component: Booking - CreateBooking
Priority: Medium
Type: Functional

Description:
Verify handling of special characters, accents, and unicode in guest names.

Steps to Reproduce:
1. Open API client
2. Set request method to POST
3. Set URL to https://restful-booker.herokuapp.com/booking
4. Set Content-Type header to application/json
5. Send request with body:
   {
     "firstname": "José",
     "lastname": "O'Brien-García",
     "totalprice": 200,
     "depositpaid": true,
     "bookingdates": {
       "checkin": "2020-01-01",
       "checkout": "2020-01-05"
     }
   }

Expected Result:
- HTTP Status Code: 200 OK
- Booking created with special characters preserved
- GET request retrieves booking with same characters intact

Actual Result:
[To be filled during execution]

Notes:
- UTF-8 encoding should be supported
```

### TC_BOOKING_CREATE_006 - Error Scenario: Create Booking Missing Required Field (firstname)
```
Test Case ID: TC_BOOKING_CREATE_006
Summary: Attempt to create booking without firstname field
Component: Booking - CreateBooking
Priority: High
Type: Negative

Description:
Verify that missing required firstname field is rejected.

Steps to Reproduce:
1. Open API client
2. Set request method to POST
3. Set URL to https://restful-booker.herokuapp.com/booking
4. Set Content-Type header to application/json
5. Send request with body:
   {
     "lastname": "Brown",
     "totalprice": 111,
     "depositpaid": true,
     "bookingdates": {
       "checkin": "2018-01-01",
       "checkout": "2019-01-01"
     }
   }

Expected Result:
- HTTP Status Code: 400 (Bad Request)
- Error message indicating missing firstname field
- No booking created

Actual Result:
[To be filled during execution]
```

### TC_BOOKING_CREATE_007 - Error Scenario: Create Booking Missing Checkout Date
```
Test Case ID: TC_BOOKING_CREATE_007
Summary: Attempt to create booking without checkout date
Component: Booking - CreateBooking
Priority: High
Type: Negative

Description:
Verify that missing checkout date is rejected.

Steps to Reproduce:
1. Open API client
2. Set request method to POST
3. Set URL to https://restful-booker.herokuapp.com/booking
4. Set Content-Type header to application/json
5. Send request with body:
   {
     "firstname": "Jim",
     "lastname": "Brown",
     "totalprice": 111,
     "depositpaid": true,
     "bookingdates": {
       "checkin": "2018-01-01"
     }
   }

Expected Result:
- HTTP Status Code: 400 (Bad Request)
- Error message about missing checkout date
- No booking created

Actual Result:
[To be filled during execution]
```

### TC_BOOKING_CREATE_008 - Error Scenario: Create Booking with Checkout Before Checkin
```
Test Case ID: TC_BOOKING_CREATE_008
Summary: Attempt to create booking where checkout date is before checkin date
Component: Booking - CreateBooking
Priority: High
Type: Negative

Description:
Verify business logic validation that checkout cannot be before checkin.

Steps to Reproduce:
1. Open API client
2. Set request method to POST
3. Set URL to https://restful-booker.herokuapp.com/booking
4. Set Content-Type header to application/json
5. Send request with body:
   {
     "firstname": "Jim",
     "lastname": "Brown",
     "totalprice": 111,
     "depositpaid": true,
     "bookingdates": {
       "checkin": "2019-01-01",
       "checkout": "2018-01-01"
     }
   }

Expected Result:
- HTTP Status Code: 400 (Bad Request)
- Error message indicating checkout must be after checkin
- No booking created

Actual Result:
[To be filled during execution]

Notes:
- Critical business logic validation
```

### TC_BOOKING_CREATE_009 - Error Scenario: Create Booking with Same Checkin and Checkout Dates
```
Test Case ID: TC_BOOKING_CREATE_009
Summary: Attempt to create booking with identical checkin and checkout dates
Component: Booking - CreateBooking
Priority: Medium
Type: Edge Case

Description:
Verify handling of zero-night stay.

Steps to Reproduce:
1. Open API client
2. Set request method to POST
3. Set URL to https://restful-booker.herokuapp.com/booking
4. Set Content-Type header to application/json
5. Send request with body:
   {
     "firstname": "Jim",
     "lastname": "Brown",
     "totalprice": 0,
     "depositpaid": true,
     "bookingdates": {
       "checkin": "2018-01-01",
       "checkout": "2018-01-01"
     }
   }

Expected Result:
- HTTP Status Code: 400 (Bad Request) or 200 (depending on business rules)
- Either rejected with error or created (behavior depends on system design)

Actual Result:
[To be filled during execution]

Notes:
- Clarify if zero-night stays are allowed
```

### TC_BOOKING_CREATE_010 - Error Scenario: Create Booking with Invalid Date Format
```
Test Case ID: TC_BOOKING_CREATE_010
Summary: Attempt to create booking with invalid date format
Component: Booking - CreateBooking
Priority: High
Type: Negative

Description:
Verify date format validation for booking dates.

Steps to Reproduce:
1. Open API client
2. Set request method to POST
3. Set URL to https://restful-booker.herokuapp.com/booking
4. Set Content-Type header to application/json
5. Send request with body:
   {
     "firstname": "Jim",
     "lastname": "Brown",
     "totalprice": 111,
     "depositpaid": true,
     "bookingdates": {
       "checkin": "01-01-2018",
       "checkout": "01-01-2019"
     }
   }

Expected Result:
- HTTP Status Code: 400 (Bad Request)
- Error message about invalid date format
- No booking created

Actual Result:
[To be filled during execution]

Notes:
- Format should be YYYY-MM-DD
```

### TC_BOOKING_CREATE_011 - Error Scenario: Create Booking with Non-Numeric Total Price
```
Test Case ID: TC_BOOKING_CREATE_011
Summary: Attempt to create booking with non-numeric total price
Component: Booking - CreateBooking
Priority: High
Type: Negative

Description:
Verify type validation for totalprice field.

Steps to Reproduce:
1. Open API client
2. Set request method to POST
3. Set URL to https://restful-booker.herokuapp.com/booking
4. Set Content-Type header to application/json
5. Send request with body:
   {
     "firstname": "Jim",
     "lastname": "Brown",
     "totalprice": "expensive",
     "depositpaid": true,
     "bookingdates": {
       "checkin": "2018-01-01",
       "checkout": "2019-01-01"
     }
   }

Expected Result:
- HTTP Status Code: 400 (Bad Request)
- Error message about invalid totalprice type
- No booking created

Actual Result:
[To be filled during execution]
```

### TC_BOOKING_CREATE_012 - Error Scenario: Create Booking with Invalid JSON
```
Test Case ID: TC_BOOKING_CREATE_012
Summary: Attempt to create booking with malformed JSON
Component: Booking - CreateBooking
Priority: High
Type: Negative

Description:
Verify JSON parsing error handling.

Steps to Reproduce:
1. Open API client
2. Set request method to POST
3. Set URL to https://restful-booker.herokuapp.com/booking
4. Set Content-Type header to application/json
5. Send request with invalid JSON body:
   {
     "firstname": "Jim,
     "lastname": "Brown"
   }

Expected Result:
- HTTP Status Code: 400 (Bad Request)
- Error message about JSON parsing error
- No booking created

Actual Result:
[To be filled during execution]
```

### TC_BOOKING_CREATE_013 - Edge Case: Create Booking with Very Long String Values
```
Test Case ID: TC_BOOKING_CREATE_013
Summary: Create booking with extremely long firstname/lastname values
Component: Booking - CreateBooking
Priority: Low
Type: Edge Case

Description:
Verify field length validation or limits.

Steps to Reproduce:
1. Open API client
2. Set request method to POST
3. Set URL to https://restful-booker.herokuapp.com/booking
4. Set Content-Type header to application/json
5. Send request with body:
   {
     "firstname": "[1000 character string]",
     "lastname": "Brown",
     "totalprice": 111,
     "depositpaid": true,
     "bookingdates": {
       "checkin": "2018-01-01",
       "checkout": "2019-01-01"
     }
   }

Expected Result:
- HTTP Status Code: 200 or 400 (depending on field length limits)
- Either booking created or error about field length
- No buffer overflow or system crash

Actual Result:
[To be filled during execution]

Notes:
- Field length limits should be documented
```

### TC_BOOKING_CREATE_014 - Edge Case: Create Booking with Past Dates
```
Test Case ID: TC_BOOKING_CREATE_014
Summary: Create booking with historical checkin and checkout dates
Component: Booking - CreateBooking
Priority: Medium
Type: Edge Case

Description:
Verify system allows bookings for past dates (retroactive bookings).

Steps to Reproduce:
1. Open API client
2. Set request method to POST
3. Set URL to https://restful-booker.herokuapp.com/booking
4. Set Content-Type header to application/json
5. Send request with body:
   {
     "firstname": "Jim",
     "lastname": "Brown",
     "totalprice": 111,
     "depositpaid": true,
     "bookingdates": {
       "checkin": "2010-01-01",
       "checkout": "2010-01-05"
     }
   }

Expected Result:
- HTTP Status Code: 200 OK or 400 (depending on business rules)
- Clarify if historical bookings are allowed

Actual Result:
[To be filled during execution]

Notes:
- Business logic for date range acceptance should be clear
```

### TC_BOOKING_CREATE_015 - Happy Path: Create Booking with Decimal Total Price
```
Test Case ID: TC_BOOKING_CREATE_015
Summary: Create booking with decimal total price (cents/pence)
Component: Booking - CreateBooking
Priority: Medium
Type: Functional

Description:
Verify handling of decimal values for total price.

Steps to Reproduce:
1. Open API client
2. Set request method to POST
3. Set URL to https://restful-booker.herokuapp.com/booking
4. Set Content-Type header to application/json
5. Send request with body:
   {
     "firstname": "Jim",
     "lastname": "Brown",
     "totalprice": 111.50,
     "depositpaid": true,
     "bookingdates": {
       "checkin": "2018-01-01",
       "checkout": "2019-01-01"
     }
   }

Expected Result:
- HTTP Status Code: 200 OK
- Booking created with price preserved as 111.50
- Decimal precision maintained

Actual Result:
[To be filled during execution]
```

---

## 5. BOOKING - UpdateBooking Endpoint Tests

### TC_BOOKING_UPDATE_001 - Happy Path: Update Entire Booking with All Fields
```
Test Case ID: TC_BOOKING_UPDATE_001
Summary: Update existing booking with all fields modified
Component: Booking - UpdateBooking
Priority: Critical
Type: Functional

Description:
Verify that an entire booking can be updated with new values for all fields.

Prerequisites:
- Valid booking exists (e.g., bookingid=1)
- Valid auth token obtained from TC_AUTH_001

Steps to Reproduce:
1. First, create or identify an existing booking (e.g., ID=1)
2. Open API client
3. Set request method to PUT
4. Set URL to https://restful-booker.herokuapp.com/booking/1
5. Set Content-Type header to application/json
6. Set Accept header to application/json
7. Set Cookie header to: token=[AUTH_TOKEN]
   (Alternatively, use Authorization header: Basic [BASE64_CREDENTIALS])
8. Send request with body:
   {
     "firstname": "James",
     "lastname": "Wilson",
     "totalprice": 500,
     "depositpaid": false,
     "bookingdates": {
       "checkin": "2020-01-15",
       "checkout": "2020-01-20"
     },
     "additionalneeds": "WiFi access"
   }

Expected Result:
- HTTP Status Code: 200 OK
- Response contains all updated booking data
- All fields reflect new values
- Original booking ID remains the same
- Response time < 2000ms
- Example response:
  {
    "firstname": "James",
    "lastname": "Wilson",
    "totalprice": 500,
    "depositpaid": false,
    "bookingdates": {
      "checkin": "2020-01-15",
      "checkout": "2020-01-20"
    },
    "additionalneeds": "WiFi access"
  }

Actual Result:
[To be filled during execution]

Notes:
- Verify update is persisted by retrieving booking via GET
- PUT requires authentication (token or Basic auth)
```

### TC_BOOKING_UPDATE_002 - Happy Path: Update Booking with Cookie Token Authentication
```
Test Case ID: TC_BOOKING_UPDATE_002
Summary: Update booking using Cookie header authentication
Component: Booking - UpdateBooking
Priority: High
Type: Functional

Description:
Verify PUT request works with authentication token in Cookie header.

Prerequisites:
- Valid auth token obtained

Steps to Reproduce:
1. Open API client
2. Set request method to PUT
3. Set URL to https://restful-booker.herokuapp.com/booking/1
4. Set Content-Type header to application/json
5. Set Cookie header to: token=abc123
6. Send request with booking update body

Expected Result:
- HTTP Status Code: 200 OK
- Booking updated successfully
- Authentication via Cookie works

Actual Result:
[To be filled during execution]
```

### TC_BOOKING_UPDATE_003 - Happy Path: Update Booking with Basic Auth
```
Test Case ID: TC_BOOKING_UPDATE_003
Summary: Update booking using Basic authentication header
Component: Booking - UpdateBooking
Priority: High
Type: Functional

Description:
Verify PUT request works with Basic authorization header.

Steps to Reproduce:
1. Open API client
2. Set request method to PUT
3. Set URL to https://restful-booker.herokuapp.com/booking/1
4. Set Content-Type header to application/json
5. Set Authorization header to: Basic YWRtaW46cGFzc3dvcmQxMjM=
   (Base64 encoded: admin:password123)
6. Send request with booking update body

Expected Result:
- HTTP Status Code: 200 OK
- Booking updated successfully
- Basic auth authentication works

Actual Result:
[To be filled during execution]
```

### TC_BOOKING_UPDATE_004 - Error Scenario: Update Booking Without Authentication
```
Test Case ID: TC_BOOKING_UPDATE_004
Summary: Attempt to update booking without authentication token
Component: Booking - UpdateBooking
Priority: Critical
Type: Negative

Description:
Verify that PUT requests require authentication and fail without valid token.

Steps to Reproduce:
1. Open API client
2. Set request method to PUT
3. Set URL to https://restful-booker.herokuapp.com/booking/1
4. Set Content-Type header to application/json
5. Do NOT set Cookie or Authorization header
6. Send request with booking update body

Expected Result:
- HTTP Status Code: 401 (Unauthorized) or 403 (Forbidden)
- Error message indicating missing or invalid authentication
- Booking NOT updated

Actual Result:
[To be filled during execution]

Notes:
- Security critical: unauthorized updates must be prevented
```

### TC_BOOKING_UPDATE_005 - Error Scenario: Update Booking with Invalid Token
```
Test Case ID: TC_BOOKING_UPDATE_005
Summary: Attempt to update booking with invalid authentication token
Component: Booking - UpdateBooking
Priority: High
Type: Negative

Description:
Verify that invalid tokens are rejected.

Steps to Reproduce:
1. Open API client
2. Set request method to PUT
3. Set URL to https://restful-booker.herokuapp.com/booking/1
4. Set Content-Type header to application/json
5. Set Cookie header to: token=invalid_token_xyz
6. Send request with booking update body

Expected Result:
- HTTP Status Code: 401 (Unauthorized)
- Error message indicating invalid token
- Booking NOT updated

Actual Result:
[To be filled during execution]
```

### TC_BOOKING_UPDATE_006 - Error Scenario: Update Non-existent Booking
```
Test Case ID: TC_BOOKING_UPDATE_006
Summary: Attempt to update booking with non-existent ID
Component: Booking - UpdateBooking
Priority: High
Type: Negative

Description:
Verify handling of update request for non-existent booking.

Prerequisites:
- Valid auth token

Steps to Reproduce:
1. Open API client
2. Set request method to PUT
3. Set URL to https://restful-booker.herokuapp.com/booking/99999
4. Set Content-Type header to application/json
5. Set Cookie header with valid token
6. Send request with booking update body

Expected Result:
- HTTP Status Code: 404 (Not Found) or 405 (Method Not Allowed)
- Error message or empty response
- No data created/modified

Actual Result:
[To be filled during execution]
```

### TC_BOOKING_UPDATE_007 - Error Scenario: Update Booking with Invalid Dates
```
Test Case ID: TC_BOOKING_UPDATE_007
Summary: Attempt to update booking with checkout before checkin
Component: Booking - UpdateBooking
Priority: High
Type: Negative

Description:
Verify business logic validation during update.

Prerequisites:
- Valid auth token

Steps to Reproduce:
1. Open API client
2. Set request method to PUT
3. Set URL to https://restful-booker.herokuapp.com/booking/1
4. Set Content-Type header to application/json
5. Set Cookie header with valid token
6. Send request with body:
   {
     "firstname": "James",
     "lastname": "Brown",
     "totalprice": 111,
     "depositpaid": true,
     "bookingdates": {
       "checkin": "2020-01-20",
       "checkout": "2020-01-15"
     }
   }

Expected Result:
- HTTP Status Code: 400 (Bad Request)
- Error message about invalid date range
- Booking NOT updated

Actual Result:
[To be filled during execution]
```

### TC_BOOKING_UPDATE_008 - Error Scenario: Update Booking Missing Required Field
```
Test Case ID: TC_BOOKING_UPDATE_008
Summary: Attempt to update booking without firstname field
Component: Booking - UpdateBooking
Priority: High
Type: Negative

Description:
Verify that PUT requires all mandatory fields (not partial updates).

Prerequisites:
- Valid auth token

Steps to Reproduce:
1. Open API client
2. Set request method to PUT
3. Set URL to https://restful-booker.herokuapp.com/booking/1
4. Set Content-Type header to application/json
5. Set Cookie header with valid token
6. Send request with incomplete body (missing firstname):
   {
     "lastname": "Brown",
     "totalprice": 111,
     "depositpaid": true,
     "bookingdates": {
       "checkin": "2020-01-15",
       "checkout": "2020-01-20"
     }
   }

Expected Result:
- HTTP Status Code: 400 (Bad Request)
- Error message about missing required field
- Booking NOT updated

Actual Result:
[To be filled during execution]

Notes:
- PUT should require all fields (for full replacement)
- PATCH is for partial updates
```

### TC_BOOKING_UPDATE_009 - Happy Path: Update Booking Accept XML Response
```
Test Case ID: TC_BOOKING_UPDATE_009
Summary: Update booking and receive response in XML format
Component: Booking - UpdateBooking
Priority: Medium
Type: Functional

Description:
Verify PUT request can return XML formatted response.

Prerequisites:
- Valid auth token

Steps to Reproduce:
1. Open API client
2. Set request method to PUT
3. Set URL to https://restful-booker.herokuapp.com/booking/1
4. Set Content-Type header to application/json
5. Set Accept header to application/xml
6. Set Cookie header with valid token
7. Send request with booking update body

Expected Result:
- HTTP Status Code: 200 OK
- Response Content-Type: application/xml
- Response is valid XML with booking data

Actual Result:
[To be filled during execution]
```

### TC_BOOKING_UPDATE_010 - Edge Case: Update Booking with Very Long Field Values
```
Test Case ID: TC_BOOKING_UPDATE_010
Summary: Update booking with extremely long string in additionalneeds
Component: Booking - UpdateBooking
Priority: Low
Type: Edge Case

Description:
Verify handling of long string values during update.

Prerequisites:
- Valid auth token

Steps to Reproduce:
1. Open API client
2. Set request method to PUT
3. Set URL to https://restful-booker.herokuapp.com/booking/1
4. Set Content-Type header to application/json
5. Set Cookie header with valid token
6. Send request with body containing very long additionalneeds string (5000+ chars)

Expected Result:
- HTTP Status Code: 200 or 400 (depending on field limits)
- Either updated or error about field length limit
- No system crash or buffer overflow

Actual Result:
[To be filled during execution]
```

---

## 6. BOOKING - PartialUpdateBooking (PATCH) Endpoint Tests

### TC_BOOKING_PATCH_001 - Happy Path: Partial Update - Change Only Firstname
```
Test Case ID: TC_BOOKING_PATCH_001
Summary: Partially update booking - modify only firstname field
Component: Booking - PartialUpdateBooking
Priority: Critical
Type: Functional

Description:
Verify that PATCH allows partial updates and only specified fields are changed.

Prerequisites:
- Valid booking exists
- Valid auth token

Steps to Reproduce:
1. Open API client
2. Set request method to PATCH (not PUT)
3. Set URL to https://restful-booker.herokuapp.com/booking/1
4. Set Content-Type header to application/json
5. Set Accept header to application/json
6. Set Cookie header to: token=[AUTH_TOKEN]
7. Send request with body containing ONLY firstname:
   {
     "firstname": "James"
   }

Expected Result:
- HTTP Status Code: 200 OK
- Response contains updated booking with:
  - firstname changed to "James"
  - All other fields unchanged from previous state
- Example response:
  {
    "firstname": "James",
    "lastname": "Brown",  (unchanged)
    "totalprice": 111,    (unchanged)
    "depositpaid": true,  (unchanged)
    "bookingdates": {...},(unchanged)
    "additionalneeds": "Breakfast" (unchanged)
  }

Actual Result:
[To be filled during execution]

Notes:
- PATCH allows partial updates while PUT requires all fields
- Verify other fields are preserved
```

### TC_BOOKING_PATCH_002 - Happy Path: Partial Update - Change Only Dates
```
Test Case ID: TC_BOOKING_PATCH_002
Summary: Partially update booking - modify only booking dates
Component: Booking - PartialUpdateBooking
Priority: High
Type: Functional

Description:
Verify partial update of nested bookingdates object.

Prerequisites:
- Valid auth token

Steps to Reproduce:
1. Open API client
2. Set request method to PATCH
3. Set URL to https://restful-booker.herokuapp.com/booking/1
4. Set Content-Type header to application/json
5. Set Cookie header with valid token
6. Send request with body:
   {
     "bookingdates": {
       "checkin": "2020-05-01",
       "checkout": "2020-05-10"
     }
   }

Expected Result:
- HTTP Status Code: 200 OK
- Booking dates updated
- All other fields remain unchanged

Actual Result:
[To be filled during execution]
```

### TC_BOOKING_PATCH_003 - Happy Path: Partial Update - Multiple Fields
```
Test Case ID: TC_BOOKING_PATCH_003
Summary: Partially update booking - modify multiple fields (firstname, lastname, additionalneeds)
Component: Booking - PartialUpdateBooking
Priority: High
Type: Functional

Description:
Verify PATCH with multiple field updates.

Prerequisites:
- Valid auth token

Steps to Reproduce:
1. Open API client
2. Set request method to PATCH
3. Set URL to https://restful-booker.herokuapp.com/booking/1
4. Set Content-Type header to application/json
5. Set Cookie header with valid token
6. Send request with body:
   {
     "firstname": "James",
     "lastname": "Wilson",
     "additionalneeds": "Late checkout"
   }

Expected Result:
- HTTP Status Code: 200 OK
- All three fields updated
- totalprice, depositpaid, bookingdates remain unchanged

Actual Result:
[To be filled during execution]
```

### TC_BOOKING_PATCH_004 - Error Scenario: Partial Update Without Authentication
```
Test Case ID: TC_BOOKING_PATCH_004
Summary: Attempt PATCH without authentication token
Component: Booking - PartialUpdateBooking
Priority: Critical
Type: Negative

Description:
Verify PATCH requires authentication like PUT.

Steps to Reproduce:
1. Open API client
2. Set request method to PATCH
3. Set URL to https://restful-booker.herokuapp.com/booking/1
4. Set Content-Type header to application/json
5. Do NOT set authentication header
6. Send request with body: { "firstname": "James" }

Expected Result:
- HTTP Status Code: 401 (Unauthorized) or 403 (Forbidden)
- Booking NOT updated

Actual Result:
[To be filled during execution]
```

### TC_BOOKING_PATCH_005 - Error Scenario: Partial Update with Invalid Data Type
```
Test Case ID: TC_BOOKING_PATCH_005
Summary: Attempt PATCH with invalid data type for field
Component: Booking - PartialUpdateBooking
Priority: High
Type: Negative

Description:
Verify type validation even for partial updates.

Prerequisites:
- Valid auth token

Steps to Reproduce:
1. Open API client
2. Set request method to PATCH
3. Set URL to https://restful-booker.herokuapp.com/booking/1
4. Set Content-Type header to application/json
5. Set Cookie header with valid token
6. Send request with body:
   {
     "totalprice": "expensive"
   }

Expected Result:
- HTTP Status Code: 400 (Bad Request)
- Error message about invalid type
- Booking NOT updated

Actual Result:
[To be filled during execution]
```

### TC_BOOKING_PATCH_006 - Edge Case: Partial Update with Empty Object
```
Test Case ID: TC_BOOKING_PATCH_006
Summary: Send PATCH request with empty JSON object
Component: Booking - PartialUpdateBooking
Priority: Medium
Type: Edge Case

Description:
Verify behavior when PATCH contains no update fields.

Prerequisites:
- Valid auth token

Steps to Reproduce:
1. Open API client
2. Set request method to PATCH
3. Set URL to https://restful-booker.herokuapp.com/booking/1
4. Set Content-Type header to application/json
5. Set Cookie header with valid token
6. Send request with body: {}

Expected Result:
- HTTP Status Code: 200 OK or 400 (Bad Request)
- If 200: Booking unchanged, returns existing data
- If 400: Error message about empty payload
- No errors or system issues

Actual Result:
[To be filled during execution]
```

### TC_BOOKING_PATCH_007 - Happy Path: Partial Update - Change Deposit Status Only
```
Test Case ID: TC_BOOKING_PATCH_007
Summary: Partially update booking - change only depositpaid status
Component: Booking - PartialUpdateBooking
Priority: Medium
Type: Functional

Description:
Verify boolean field can be updated via PATCH.

Prerequisites:
- Valid auth token

Steps to Reproduce:
1. Open API client
2. Set request method to PATCH
3. Set URL to https://restful-booker.herokuapp.com/booking/1
4. Set Content-Type header to application/json
5. Set Cookie header with valid token
6. Send request with body:
   {
     "depositpaid": false
   }

Expected Result:
- HTTP Status Code: 200 OK
- depositpaid changed to false
- All other fields unchanged

Actual Result:
[To be filled during execution]
```

---

## 7. BOOKING - DeleteBooking Endpoint Tests

### TC_BOOKING_DELETE_001 - Happy Path: Delete Existing Booking with Cookie Token
```
Test Case ID: TC_BOOKING_DELETE_001
Summary: Delete existing booking using Cookie authentication
Component: Booking - DeleteBooking
Priority: Critical
Type: Functional

Description:
Verify that a booking is successfully deleted with valid authentication token.

Prerequisites:
- Valid booking exists (e.g., bookingid=1)
- Valid auth token obtained

Steps to Reproduce:
1. Open API client
2. Set request method to DELETE
3. Set URL to https://restful-booker.herokuapp.com/booking/1
4. Set Content-Type header to application/json
5. Set Cookie header to: token=[AUTH_TOKEN]
6. Send request (no body required)

Expected Result:
- HTTP Status Code: 201 (Created) - per API docs
- Response contains: "OK" or similar success message
- Booking is deleted and no longer retrievable
- Verify by attempting GET /booking/1 which should return 404

Actual Result:
[To be filled during execution]

Notes:
- After deletion, GET request should fail with 404
- Status code 201 is unusual for DELETE (typically 204 No Content)
```

### TC_BOOKING_DELETE_002 - Happy Path: Delete Booking with Basic Auth
```
Test Case ID: TC_BOOKING_DELETE_002
Summary: Delete booking using Basic authentication header
Component: Booking - DeleteBooking
Priority: High
Type: Functional

Description:
Verify DELETE works with Basic auth instead of Cookie token.

Prerequisites:
- Valid booking exists

Steps to Reproduce:
1. Open API client
2. Set request method to DELETE
3. Set URL to https://restful-booker.herokuapp.com/booking/1
4. Set Content-Type header to application/json
5. Set Authorization header to: Basic YWRtaW46cGFzc3dvcmQxMjM=
6. Send request

Expected Result:
- HTTP Status Code: 201 (Created)
- Booking deleted successfully
- Basic auth authentication works

Actual Result:
[To be filled during execution]
```

### TC_BOOKING_DELETE_003 - Error Scenario: Delete Without Authentication
```
Test Case ID: TC_BOOKING_DELETE_003
Summary: Attempt to delete booking without authentication
Component: Booking - DeleteBooking
Priority: Critical
Type: Negative

Description:
Verify DELETE requires authentication and fails without valid credentials.

Steps to Reproduce:
1. Open API client
2. Set request method to DELETE
3. Set URL to https://restful-booker.herokuapp.com/booking/1
4. Set Content-Type header to application/json
5. Do NOT set authentication header
6. Send request

Expected Result:
- HTTP Status Code: 401 (Unauthorized) or 403 (Forbidden)
- Error message indicating missing authentication
- Booking NOT deleted
- Verify booking still exists via GET request

Actual Result:
[To be filled during execution]

Notes:
- Security critical: unauthorized deletions must be prevented
```

### TC_BOOKING_DELETE_004 - Error Scenario: Delete with Invalid Token
```
Test Case ID: TC_BOOKING_DELETE_004
Summary: Attempt to delete booking with invalid token
Component: Booking - DeleteBooking
Priority: High
Type: Negative

Description:
Verify invalid tokens are rejected for DELETE operations.

Steps to Reproduce:
1. Open API client
2. Set request method to DELETE
3. Set URL to https://restful-booker.herokuapp.com/booking/1
4. Set Content-Type header to application/json
5. Set Cookie header to: token=invalid_token_xyz
6. Send request

Expected Result:
- HTTP Status Code: 401 (Unauthorized)
- Error message about invalid token
- Booking NOT deleted

Actual Result:
[To be filled during execution]
```

### TC_BOOKING_DELETE_005 - Error Scenario: Delete Non-existent Booking
```
Test Case ID: TC_BOOKING_DELETE_005
Summary: Attempt to delete booking with non-existent ID
Component: Booking - DeleteBooking
Priority: High
Type: Negative

Description:
Verify handling of DELETE for non-existent booking ID.

Prerequisites:
- Valid auth token

Steps to Reproduce:
1. Open API client
2. Set request method to DELETE
3. Set URL to https://restful-booker.herokuapp.com/booking/99999
4. Set Content-Type header to application/json
5. Set Cookie header with valid token
6. Send request

Expected Result:
- HTTP Status Code: 404 (Not Found) or 405
- Error message or empty response
- No data deleted

Actual Result:
[To be filled during execution]
```

### TC_BOOKING_DELETE_006 - Error Scenario: Delete with Invalid Booking ID Format
```
Test Case ID: TC_BOOKING_DELETE_006
Summary: Attempt to delete booking with non-numeric ID
Component: Booking - DeleteBooking
Priority: High
Type: Negative

Description:
Verify ID format validation for DELETE requests.

Prerequisites:
- Valid auth token

Steps to Reproduce:
1. Open API client
2. Set request method to DELETE
3. Set URL to https://restful-booker.herokuapp.com/booking/abc123
4. Set Content-Type header to application/json
5. Set Cookie header with valid token
6. Send request

Expected Result:
- HTTP Status Code: 400 (Bad Request) or 404 (Not Found)
- Error message about invalid ID format
- No data deleted

Actual Result:
[To be filled during execution]
```

### TC_BOOKING_DELETE_007 - Edge Case: Delete Already Deleted Booking
```
Test Case ID: TC_BOOKING_DELETE_007
Summary: Attempt to delete a booking that was already deleted
Component: Booking - DeleteBooking
Priority: Medium
Type: Edge Case

Description:
Verify behavior when deleting an already-deleted booking (idempotency).

Prerequisites:
- Valid auth token
- Booking has been previously deleted

Steps to Reproduce:
1. Open API client
2. Set request method to DELETE
3. Set URL to https://restful-booker.herokuapp.com/booking/1 (previously deleted)
4. Set Content-Type header to application/json
5. Set Cookie header with valid token
6. Send request

Expected Result:
- HTTP Status Code: 404 (Not Found) or 200/201 (idempotent)
- Error message if 404
- No duplicate deletions or errors

Actual Result:
[To be filled during execution]

Notes:
- Clarify if DELETE is idempotent (safe to call multiple times)
```

### TC_BOOKING_DELETE_008 - Happy Path: Delete and Verify Deletion
```
Test Case ID: TC_BOOKING_DELETE_008
Summary: Delete booking and verify it's no longer retrievable
Component: Booking - DeleteBooking
Priority: High
Type: Functional

Description:
End-to-end test verifying deletion persistence.

Prerequisites:
- Valid auth token

Steps to Reproduce:
1. Create a new booking via POST (or use existing booking ID)
2. Delete the booking via DELETE with valid token
   - Set request method to DELETE
   - Set URL to https://restful-booker.herokuapp.com/booking/[ID]
   - Set Cookie header with valid token
3. Attempt to retrieve deleted booking via GET
   - Set request method to GET
   - Set URL to https://restful-booker.herokuapp.com/booking/[ID]

Expected Result for DELETE:
- HTTP Status Code: 201 (Created)
- Booking appears deleted

Expected Result for subsequent GET:
- HTTP Status Code: 404 (Not Found)
- Booking is no longer available

Actual Result:
[To be filled during execution]

Notes:
- Comprehensive test verifying deletion is persisted
```

---

## 8. PING - HealthCheck Endpoint Tests

### TC_PING_001 - Happy Path: Health Check Success
```
Test Case ID: TC_PING_001
Summary: Verify API health check endpoint returns success
Component: Ping - HealthCheck
Priority: Critical
Type: Functional

Description:
Verify that the ping endpoint confirms the API is up and running.

Steps to Reproduce:
1. Open API client
2. Set request method to GET
3. Set URL to https://restful-booker.herokuapp.com/ping
4. Send request (no authentication required)

Expected Result:
- HTTP Status Code: 201 (Created) - per API docs
- Response body contains: "OK" or similar success indicator
- Response indicates API is healthy and operational
- Response time < 500ms

Actual Result:
[To be filled during execution]

Notes:
- Health check should not require authentication
- Status code 201 is unusual for health checks (typically 200)
```

### TC_PING_002 - Happy Path: Health Check Response Format
```
Test Case ID: TC_PING_002
Summary: Verify health check returns correct response format
Component: Ping - HealthCheck
Priority: High
Type: Functional

Description:
Verify response structure and content of health check.

Steps to Reproduce:
1. Open API client
2. Set request method to GET
3. Set URL to https://restful-booker.herokuapp.com/ping
4. Send request

Expected Result:
- HTTP Status Code: 201 (Created)
- Response body is valid string: "OK"
- Response Content-Type: text/plain or application/json
- No errors or warnings in response

Actual Result:
[To be filled during execution]
```

### TC_PING_003 - Edge Case: Ping with Query Parameters
```
Test Case ID: TC_PING_003
Summary: Health check with query parameters (should be ignored)
Component: Ping - HealthCheck
Priority: Low
Type: Edge Case

Description:
Verify that query parameters don't affect health check.

Steps to Reproduce:
1. Open API client
2. Set request method to GET
3. Set URL to https://restful-booker.herokuapp.com/ping?test=1&foo=bar
4. Send request

Expected Result:
- HTTP Status Code: 201 (Created)
- Response: "OK"
- Query parameters are safely ignored

Actual Result:
[To be filled during execution]
```

### TC_PING_004 - Performance: Health Check Response Time
```
Test Case ID: TC_PING_004
Summary: Verify health check responds within acceptable time limit
Component: Ping - HealthCheck
Priority: High
Type: Performance

Description:
Verify ping endpoint meets response time SLA.

Steps to Reproduce:
1. Open API client
2. Set request method to GET
3. Set URL to https://restful-booker.herokuapp.com/ping
4. Send request
5. Measure response time

Expected Result:
- HTTP Status Code: 201 (Created)
- Response time < 500ms
- Consistent fast responses

Actual Result:
[To be filled during execution]

Notes:
- Health check should be fast (minimal database queries)
```

---

## 9. Integration & Cross-Endpoint Tests

### TC_INTEGRATION_001 - Complete Booking Lifecycle
```
Test Case ID: TC_INTEGRATION_001
Summary: Complete booking lifecycle - create, retrieve, update, delete
Component: Integration
Priority: Critical
Type: Integration/Functional

Description:
End-to-end test verifying complete booking workflow.

Steps to Reproduce:
1. **Step 1: Create Auth Token**
   - POST to /auth with admin:password123
   - Extract token from response

2. **Step 2: Create Booking**
   - POST to /booking with new booking data
   - Extract bookingid from response

3. **Step 3: Retrieve Booking**
   - GET /booking/[bookingid]
   - Verify data matches creation request

4. **Step 4: Update Booking**
   - PUT to /booking/[bookingid] with updated data
   - Use token from Step 1
   - Verify response contains updated fields

5. **Step 5: Partial Update**
   - PATCH to /booking/[bookingid] with partial data
   - Use token from Step 1
   - Verify only specified fields changed

6. **Step 6: Retrieve Updated Booking**
   - GET /booking/[bookingid]
   - Verify contains all updates

7. **Step 7: Delete Booking**
   - DELETE /booking/[bookingid]
   - Use token from Step 1
   - Verify 201 response

8. **Step 8: Verify Deletion**
   - GET /booking/[bookingid]
   - Verify 404 response

Expected Result:
- All operations succeed with appropriate status codes
- Data persists correctly through operations
- Lifecycle completes without errors

Actual Result:
[To be filled during execution]

Notes:
- This is a critical workflow validation test
```

### TC_INTEGRATION_002 - Multiple Bookings Operations
```
Test Case ID: TC_INTEGRATION_002
Summary: Create multiple bookings and retrieve with filters
Component: Integration
Priority: High
Type: Integration/Functional

Description:
Test multiple booking creations and filtering operations.

Steps to Reproduce:
1. Create Booking 1: "John Smith", 2020-01-01 to 2020-01-05, price 100
2. Create Booking 2: "John Brown", 2020-02-01 to 2020-02-05, price 200
3. Create Booking 3: "Jane Smith", 2020-03-01 to 2020-03-05, price 150
4. GET /booking (all bookings)
5. GET /booking?firstname=John
6. GET /booking?lastname=Smith
7. GET /booking?checkin=2020-02-01
8. GET /booking?firstname=John&lastname=Smith

Expected Result:
- Each booking created successfully with unique ID
- GET all returns all 3 bookings
- Firstname filter returns bookings 1 and 2
- Lastname filter returns bookings 1 and 3
- Checkin filter returns booking 2
- Combined filter returns booking 1 only
- All filtering logic works correctly

Actual Result:
[To be filled during execution]
```

### TC_INTEGRATION_003 - Concurrent Booking Operations
```
Test Case ID: TC_INTEGRATION_003
Summary: Create multiple bookings concurrently
Component: Integration
Priority: Medium
Type: Performance/Integration

Description:
Test system behavior under concurrent booking creation.

Steps to Reproduce:
1. Send 10 simultaneous POST requests to create bookings
2. All requests use different guest names and dates
3. Monitor responses and response times

Expected Result:
- All 10 bookings created successfully
- Each receives unique bookingid
- No duplicate IDs
- No data corruption
- Reasonable response times
- All status codes are 200 OK

Actual Result:
[To be filled during execution]

Notes:
- Tests race conditions and concurrency handling
```

---

## 10. Security & Compliance Tests

### TC_SECURITY_001 - SQL Injection Prevention
```
Test Case ID: TC_SECURITY_001
Summary: SQL Injection attack prevention in POST /booking
Component: Security
Priority: Critical
Type: Security

Description:
Verify API prevents SQL injection through input parameters.

Steps to Reproduce:
1. POST to /booking with firstname field containing:
   "'; DROP TABLE bookings; --"
2. Attempt to retrieve bookings
3. Verify database structure intact

Expected Result:
- HTTP Status Code: 200 OK or 400 (depending on input validation)
- Booking created with literal string (not executed as SQL)
- No database errors
- Table structure unchanged

Actual Result:
[To be filled during execution]

Notes:
- Critical security test
- All input fields should be tested
```

### TC_SECURITY_002 - XSS Prevention
```
Test Case ID: TC_SECURITY_002
Summary: XSS attack prevention in additionalneeds field
Component: Security
Priority: Critical
Type: Security

Description:
Verify API prevents Cross-Site Scripting attacks.

Steps to Reproduce:
1. POST to /booking with additionalneeds containing:
   "<script>alert('XSS')</script>"
2. Retrieve booking
3. Verify HTML encoding or escaping

Expected Result:
- HTTP Status Code: 200 OK
- Booking created
- Retrieved booking has script properly escaped or encoded
- Script does not execute when viewing in browser

Actual Result:
[To be filled during execution]

Notes:
- Verify output encoding when returning data
```

### TC_SECURITY_003 - Authentication Token Validation
```
Test Case ID: TC_SECURITY_003
Summary: Verify token expiration and invalid token handling
Component: Security
Priority: High
Type: Security

Description:
Test authentication token security and lifecycle.

Steps to Reproduce:
1. Obtain valid auth token
2. Wait for token expiration (if applicable)
3. Attempt PUT request with expired token
4. Verify request is rejected

Expected Result:
- HTTP Status Code: 401 (Unauthorized)
- Error message about token expiration
- Request denied

Actual Result:
[To be filled during execution]

Notes:
- Document token expiration policy
- Verify token invalidation
```

### TC_SECURITY_004 - Authorization - Delete Other User's Booking
```
Test Case ID: TC_SECURITY_004
Summary: Verify users cannot delete others' bookings
Component: Security
Priority: High
Type: Security

Description:
Test authorization - ensure operations limited to authorized resources.

Steps to Reproduce:
1. User A creates booking
2. User B attempts to delete User A's booking
3. (This assumes multi-user system)

Expected Result:
- HTTP Status Code: 403 (Forbidden)
- Booking NOT deleted
- Error message about authorization

Actual Result:
[To be filled during execution]

Notes:
- Only applicable if system has multi-user support
- Verify resource-level authorization
```

---

## Test Execution Summary Template

```
Project: RESTful Booker API Testing
Execution Date: ___________
Executed By: ___________
Environment: ___________

Total Test Cases: 73
Passed: _______
Failed: _______
Blocked: _______
Skipped: _______

Pass Rate: _______%

Critical Issues Found:
- 

High Priority Issues:
- 

Medium Priority Issues:
- 

Low Priority Issues:
- 

Notes:
```

---

## Quick Reference: API Authentication

### Getting Auth Token (Required for PUT, PATCH, DELETE)
```
POST https://restful-booker.herokuapp.com/auth
Content-Type: application/json

{
  "username": "admin",
  "password": "password123"
}

Response:
{
  "token": "abc123"
}
```

### Using Token in Requests
```
Method: PUT/PATCH/DELETE
URL: https://restful-booker.herokuapp.com/booking/:id

Option 1 - Cookie Header:
Cookie: token=abc123

Option 2 - Basic Auth Header:
Authorization: Basic YWRtaW46cGFzc3dvcmQxMjM=
(Base64 encoded: admin:password123)
```

---

## Test Data Recommendations

### Valid Test Data
```
firstname: "Jim", "Sally", "John", "Jane"
lastname: "Brown", "Smith", "Wilson", "Garcia"
totalprice: 100, 111, 150, 200, 0, 99.99
depositpaid: true, false
dates:
  - checkin: "2018-01-01", checkout: "2018-01-05"
  - checkin: "2020-06-15", checkout: "2020-06-20"
  - checkin: "2025-12-01", checkout: "2025-12-10"
additionalneeds: "Breakfast", "WiFi", "Late checkout", "Parking", ""
```

### Invalid Test Data
```
firstname: "", null, undefined, "<?php ?>", "<script>"
dates: "01-01-2020" (wrong format), "2020-13-45", "2020-01-05" before "2020-01-01"
totalprice: "expensive", true, -999, "100.50.50"
depositpaid: "yes", 1, "true"
```

---
