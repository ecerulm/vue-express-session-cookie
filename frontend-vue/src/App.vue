<script setup>
import { RouterLink, RouterView } from "vue-router";
import NavBar from "./components/NavBar.vue";
import { loggedInStatus, myCounter, increaseCounter } from '@/apiclient.js'
</script>

<template>
    <NavBar title="TheTestApp"/>
    <div>
        <div class="bg-light p-5 rounded">
            <div class="col-sm-8 mx-auto">
                <h1>The protected api call: </h1>
                <p>counter:  {{ myCounter }} </p>
                <p><button type="button" class="btn btn-primary" @click="increaseCounter">Increase counter</button></p>
                <p>loggedInStatus: {{ loggedInStatus }}</p>

            </div>
        </div>
    </div>
</template>

<style>

</style>
