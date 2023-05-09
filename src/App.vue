<template>
  <div id="app">
    <sitebar />
    <main>
      <router-view />
    </main>
    <footersite />
  </div>
</template>

<script>
import sitebar from "../src/views/sitebar.vue";
import footersite from "../src/views/footersite.vue";
import ValidationObserver from "vee-validate"
import { ValidationProvider } from 'vee-validate';

export default {
  components: { sitebar, footersite, ValidationObserver, ValidationProvider },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
