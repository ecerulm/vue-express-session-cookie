# What is this project? 

This is just an example for my own reference. 

* SPA login/logout flow using session cookies.
* API authentication using session cookies 
* Vue frontend 
* Express backend for the API
* Session cookies
* Flash messages 
* Bootstrap 5 

# Genereate HTTPS certificates so that you can use Secure cookies

```
cd certs

# Generate a random passphrase and store it in the keychain 
security add-generic-password -a $USER -s myCApassphrase -w $(cat /dev/urandom | LC_ALL=C tr -dc 'a-zA-Z0-9$./,:' | fold -w 32| head -n 1)

./myCA.sh
./localhostCert.sh
```

`./myCA.sh` will generate a root CA certificate and install it as trusted in you Keychain (macOS)
`./localhostCert.sh` will generate a server certificate signed by the root CA generated in the previous step. 

The generated `localhost.crt` and `localhost.key` will be automatically used in `frontend-vue/vite.config.js` if they are present.

The browser (Safari, Chrome) will use the macOS Keychain , so if our CA is trusted in the KeyChain it's also trusted by the browser. 

Node.js on the other hand does not look for trusted root CA in the macOS KeyChain so you will need to add this CA to the trusted certificates in node.js (with the environment variable `NODE_EXTRA_CA_CERTS`)



# Start both the frontend server and backend server

```
export PASSPHRASE=$(security find-generic-password -a $USER -s myCApassphrase -w)
cd backend-express
npm install
npm run serve

```

For the frontend we need to add the root CA file `myCA.pem` to `NODE_EXTRA_CA_CERTS` as node.js does not look into the macOS X KeyChain for root CAs, it has it's own list. See [Allow Node to use certificates from the macOS Keychain when making HTTPS requests ](https://github.com/nodejs/node/issues/39657). 


```
export PASSPHRASE=$(security find-generic-password -a $USER -s myCApassphrase -w)
export NODE_EXTRA_CA_CERTS="../certs/myCA.pem"
cd frontend-vue
npm install
npm run dev
```

The backend listens for requests at http://localhost:6000
The frontend listen for request at http://localhost:3000  or https://localhost:3000 but it proxies request to `/api/*` to the backend server. 

That is required so that the frontend and api have the same origin (protocol, host and **port**) so that the session cookie is sent in the API requests from javascript.

# How to login

Navigate with the browser to http://localhost:3000 and click on Login (this will fail as the prefilled username/password are incorrect)

Clicking on `Login` triggers an API request to `/api/login` with the username/password in the JSON body. The API will check if the username/password is correct and answer accordingly. Since this is a test application with no real user management, the application will successfully login **any username** as long as the password provided is equal to the username. 

It will show a flash message saying `Login incorrect` 

In order to login, you need to put the same value for username and for password. 


Then click again on Login and you will be able to login. 

The successful login will set the session cookie `connect.sid` and set the maxAge to 1 hour. 

If running on HTTPS it will get the Secure attribute in the cookie. 


# Noteworthy concepts about session cookies and CSRF attacks

The session cookie `Max-Age` is set to 1 hour.

The first line of defense agains CSRF attacks is that the API requires `Content-Type: application/json` and the non-standard header `X-Requested-With`, browser will block cross domain requests for those
* See [MDN - CORS - Simple requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#simple_requests)
* so the API requires those. 

The session cookie has the attribute SameSite / Secure . 
This tells the browser that if the **originating** domain of the request is not the original domain, the cookie should not be sent. 
So if  a malicious domain makes a cross-domain request to our API the session cookie (authentication toke) will not be included in the request.
In principle, this alone should be enough to prevent CSRF attacks since in 2022 [SameSite browser support](https://caniuse.com/same-site-cookie-attribute) is 94% percent. 
But to protect the 6% of users using older browsers you need to implement hash-based double submit cookie 

`__Host-` prefix for session cookie, makes so that the **target** domain for the cookie is restricted to the current host. 
No subdomain will receive the cookie.
No subdomain can overwrite the cookie. Prevents session fixation attacks

The hash-based double submit cookie (antiCSRF token) is designed so that the javascript originating the request must prove that it knows 
an unguessable value bound to the session. 
This is equivalent to know the session cookie value. 
If the attacker knew the session cookie value already it wouldn't need to perform a CSRF attack in the first place. 
The whole point of CSRF is that the attacker doesn't know how to authenticate as the user but it tries to trick the user's browser
into making an authenticated requests. 

The csrf cookie is called `__Host-csrfToken`, it has `SameSite: Strict` and `HttpOnly: false`. 
That way it can't be overwritten from subdomains (in case of subdomain hijacking). 
It can't be used in cross site requests (SameSite).
It can be read from client side javacript (but only from javascript originating from the host that set the cookie). 

The client side javascript must for each request read the `__Host-csrfToken` cookie and send its value as a `X-CSRF-Token` header. The API will check that the received `X-CSRF-Token` actually matches the SHA-256 of the `req.sessionID`





# TODO 

* Implement hash-based double submit cookie (anti CSRF token)


# References
* [API Security in Action](https://www.manning.com/books/api-security-in-action) by Neil Madden. Manning Publications
* [express-session](https://github.com/expressjs/session)
