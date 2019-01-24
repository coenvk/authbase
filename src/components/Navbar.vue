<template>
  <b-navbar type="light" variant="light" toggleable="md">
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    <b-collapse is-nav id="nav-collapse">
      <b-navbar-brand :to="{name: 'login' }">Authbase</b-navbar-brand>
      <b-navbar-nav class="ml-auto" v-if="!user">
        <b-nav-item :to="{ name: 'login' }">Login</b-nav-item>
        <b-nav-item :to="{ name: 'signup' }">Signup</b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto" v-else>
        <b-nav-item-dropdown :text="user.username" right>
          <b-dropdown-item @click="logout">Logout</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import { LOGOUT } from '../store/actions.type'

export default {
  name: 'Navbar',
  computed: {
    user () {
      return this.$store.getters.currentUser
    }
  },
  methods: {
    logout () {
      this.$store.dispatch(LOGOUT).then(() => {
        this.$router.push({ name: 'login' })
      })
    }
  }
}
</script>

<style scoped>

</style>
