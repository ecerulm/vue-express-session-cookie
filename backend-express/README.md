#  How to start


```
npm run serve
```

# Notes

The API endpoints are 

* `/api/login`
 * it takes a JSON body `{username: 'xxx', password: 'yyy'}`
 * if the `username === password` it will consider it a valid login
 * the session will be regenerated (the session cookie value will change) to prevent session fixation attacks
 * from that moment on any API request that include that cookie value will be considered to be performed by that logged-in user. 
* `/api/logout`
 * will invalidate the current session
* `/api/userinfo` check if the user is logged in
 * if the session cookie value is associated to a session that has a `username` attribute then it means that's logged in 
