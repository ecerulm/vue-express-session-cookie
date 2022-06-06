# frontend-vue

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run build
npm run test:e2e # or `npm run test:e2e:ci` for headless testing
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

# Notes

* The frontend will check with the API if there is a logged in session by using `/api/userinfo`
  * The return value of `/api/userinfo` determines if the user sees a `Logout` button or a `Login` form.
* The API is using the session cookie for the (http, localhost, 3000) to determine if the user is authenticated
* The Login button makes a request to `/api/login` with username/password in the JSON body, 
  * if the login is successful the session cookie will be regenerated/changed to protect agains session fixation attacks
  * the frontend will recheck the authentication  / logged-in status with `/api/userinfo` every time you click on `Login` or `Logout`


# TODO 

* Require content-type `application/json` in the API. Browsers will refuse to make cross-site requests for that content-type
* Require non-standard headers in the API, `X-Requested-With`. Browser will refuse to make cross-site request if non-standard headers are present
* Make session cookie a SameSite cookie
* Make session cookie `__Host-` prefix
* Add hash-based double submit CSRF cookie
  * __Host- and SameSite
  



# TODO

