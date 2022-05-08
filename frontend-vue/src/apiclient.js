import axios from 'axios';

export function login(email,password) {
    axios.post('/api/login', {username:email, password})
    .then((response) => {
        console.log(response);
    }, (error) => {
        console.log(error);
    });
}

