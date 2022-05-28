<script setup>
import { v4 as uuidv4 } from 'uuid';
import { ref, inject, onMounted } from 'vue';
import { login } from '@/apiclient.js'
const myid = uuidv4();

const email = ref("ddd@ddd.com");
const password = ref("dddd");
const flashes = inject('flashes')


function errHandler(error) {
    console.log("errHandler")
    flashes.push("Login incorrect"+error);
}

</script>

<template>
    <form class="d-flex" @submit.prevent="login(this.email, this.password, this.errHandler)">
        <input class="form-control me-2" type="email" v-model="email" placeholder="enter your email">
        <input class="form-control me-2" type="password" v-model="password" placeholder="enter your password">
        <button class="btn btn-outline-success" type="submit">Login</button>
    </form>
</template>

<style scoped>
</style>