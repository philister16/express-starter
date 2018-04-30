# Express API Starter

## API Specification

The following are the specifications of the API in order to achieve consistency across the entire app.

### Data format

If not specified the data format is always JSON (`application/json`).

### Versioning

Overall the API can have different versions. In order to be able to support different apps using different versions the segment of the API URL represents the version: `https://www.site.com/api/v1`.

For the remainder of this specification, we ommit the the first part of the URL including the versioning. All routes and URL segments are assumed to be appended to the specific version of the API.

### Error handling

Errors take the following general format with a status, message and an optional text property.

```json
{
  "status": 404,
  "message": "Not found",
  "error": {
    "full error": "object here"
  }
}
```
Error status codes are harmonized across the API as follows:

- **401**: ["Invalid credentials"] For invalid requests, i.e. failed authentication
- **403**: ["Forbidden"] For forbidden requests, i.e. failed authorization
- **404**: ["Not found"] For requests to resources that do not exist
- **422**: For validation errors in forms
- **500**: For server errors

### Response objects

For simplicity response objects are kept as large as necessary and as small as possible. We do generally **not** pass any meta data with the response.

*The following example could be a response holding user information.*
```json 
{
  "username": "johnny",
  "firstname": "John",
  "lastname": "Doe",
  "email": "johnny@email.com"
}
```
Success response status codes are harmonized across the API as follows:

- **200**: ["OK"] for successful requests and successful resource returned
- **201**: ["Created"] for new creation of a resource (i.e. new user saved to DB)
- **204**: ["No Content"] for responses that do not return any resource (i.e. logout call)

### JWT

The token contains the user information.

*The decoded token as an example:*
```json
{
  "_id": "5ad4b1c6213af70f73a25c35", // note the _id to for consistency with MongoDB
  "permissions": ["user", "admin"]
}
```

### API Routes (Version 1)

#### Auth

All endpoints related to authentication are routes appended to the URL segment `/auth`.

#### Signup

`POST /auth/signup`
```json
{
	"email": "tester2@rhinerock.com",
	"password": "12345678",
	"firstname": "Tester",
	"lastname": "Two"
}
```
Response (Status 201):
```json
{
  "language": "en",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.XbPfbIHMI6arZ3Y922BhjWgQzWXcXNrz0ogtVhfEd2o"
}
```

#### Signin

`POST /auth/signin`
```json
{
	"email": "tester1@rhinerock.com",
	"password": "abcdefgh"
}
```
Response (Status 200):
```json
{
  "language": "en",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.XbPfbIHMI6arZ3Y922BhjWgQzWXcXNrz0ogtVhfEd2o"
}
```

#### Confirm email

`POST /auth/confirm`
```json
{
	"token": "14daa138a994281c10b1719cae774e8b1b83c285d3615f764e25ee1ec8d322c7d9fbf924"
}
```
Response (Status 204): no data in response

#### Forgot password

`POST /auth/forgot`
```json
{
	"email": "tester1@rhinerock.com"
}
```
Response (Status 200): no data in response

#### Reset password

`POST /auth/reset`
```json
{
	"token": "123",
	"password": "abcdefgh"
}
```
Response (Status 200): no data in response
