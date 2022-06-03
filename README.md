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
export NODE_EXTRA_CA_CERTS="../certs/myCA.pem" npm run dev
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





# TODO 

* Set cookie name to `__Host-connect.sid` 



# References
* [API Security in Action](https://www.manning.com/books/api-security-in-action) by Neil Madden. Manning Publications
* [express-session](https://github.com/expressjs/session)
