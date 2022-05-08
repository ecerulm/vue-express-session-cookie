<script setup>
import { v4 as uuidv4 } from 'uuid';
import { ref, onMounted } from 'vue';
import { login } from '@/apiclient.js'
const myid = uuidv4();

const email = ref("ddd@ddd.com");
const password = ref("dddd");



</script>

<template>
    <form class="d-flex" @submit.prevent="login(this.email.value, this.password.value)">
        <input class="form-control me-2" type="email" v-model="email" placeholder="enter your email">
        <input class="form-control me-2" type="password" v-model="password" placeholder="enter your password">
        <button class="btn btn-outline-success" type="submit">Login</button>
    </form>
</template>

<style scoped>
</style>