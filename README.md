# What is this project? 

This is just an example for my own reference. 

* SPA login/logout flow using session cookies.
* API authentication using session cookies 
* Vue frontend 
* Express backend for the API
* Session cookies
* Flash messages 
* Bootstrap 5 

# Start both the frontend server and backend server

```
cd backend-express
npm run serve
cd frontend-vue
npm run dev
```

The backend listens for requests at http://localhost:6000
The frontend listen for request at http://localhost:3000 but it proxies request to `/api/*` to the backend server. 

That is required so that the frontend and api have the same origin (protocol, host and **port**) so that the session cookie is sent in the API requests from javascript.

# How to login

Navigate with the browser to http://localhost:3000 and click on Login (this will fail as the prefilled username/password are incorrect)

Clicking on `Login` triggers an API request to `/api/login` with the username/password in the JSON body. The API will check if the username/password is correct and answer accordingly. Since this is a test application with no real user management, the application will successfully login **any username** as long as the password provided is equal to the username. 

It will show a flash message saying `Login incorrect` 

In order to login, you need to put the same value for username and for password. 


Then click again on Login and you will be able to login




# References
* [API Security in Action](https://www.manning.com/books/api-security-in-action) by Neil Madden. Manning Publications
* [express-session](https://github.com/expressjs/session)