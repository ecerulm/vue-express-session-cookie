import axios from 'axios';
import {reactive,ref} from 'vue';
import { addFlash } from './flashes';

const axiosConfig = {
    timeout:5000,
    headers: {
        'Content-Type': 'application/json', 
        'X-Requested-With': 'Axios'
    }
}

export const loggedInStatus = ref(false);

export function login(email,password, err) {
    console.log(`email: ${email} password: ${password}`)
    axios.post('/api/login', {username:email, password}, axiosConfig)
    .then((response) => {
        console.log(response);
    }, (error) => {
        console.log(error)
        err(error)
    })
    .finally(()=> {
        updateLoggedInStatus()
    });
}

export function updateLoggedInStatus() {
    console.log('checkLoginStatus')
    axios.get('/api/userinfo', axiosConfig)
    .then((response) => {
        console.log('checkLoginStatus response was', response)
        loggedInStatus.value = Boolean(response.data.loggedInStatus)
        console.log('checkLoggedInStatus', loggedInStatus)
    }, (error) => {
        console.log('checkLoginStatus',error)
        addFlash("Can't check the loggedInStatus " + error)
    })
}

export function logout() {
    axios.post('/api/logout', {}, axiosConfig)
    .then((response) => {
        console.log('logout response', response)

    }, (error) => {
        console.error('logout error', error)
        addFlash("Couldn't logout " + error)
    })
    .finally(() => {
        updateLoggedInStatus()
    })
}

// automatically update the status on import
updateLoggedInStatus();
