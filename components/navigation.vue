<template>
  <b-navbar sticky toggleable="lg" type="dark" variant="primary-dark">
    <b-navbar-brand id="siteLogo" to="/">NotoCert Demo</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item
          id="verifyPage"
          to="/"
          class="dropDownMenu"
          :active="verifyActive"
          >Verify</b-nav-item
        >
        <b-nav-item
          id="notarisePage"
          to="/notarise"
          class="dropDownMenu"
          :active="notariseActive"
          >Notarise</b-nav-item
        >
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
export default {
  data() {
    return {
      verifyActive: false,
      notariseActive: false,
    }
  },
  watch: {
    $route(value) {
      this.routeCheck(value)
    },
  },
  beforeMount() {
    this.routeCheck(this.$route)
  },
  methods: {
    routeCheck(value) {
      switch (value.path) {
        case '/notarise':
          this.verifyActive = false
          this.notariseActive = true
          document.getElementById('notarisePage').style.color =
            'rgba(255, 255, 255, 0)'
          break
        case '/':
          this.verifyActive = true
          this.notariseActive = false
          document.getElementById('verifyPage').style.color =
            'rgba(255, 255, 255, 0)'
          break
      }
    },
  },
}
</script>
<style scoped>
.dropDownMenu {
  background-color: rgba(0, 0, 41, 0.9);
}

.navbar {
  width: 100%;
  height: 60px;
  background-color: rgba(0, 0, 41, 1);
  box-shadow: 0 2px 15px rgba(71, 120, 120, 0.5);
  transform: translate3d(0, 0, 0);
  transition: 0.1s all ease-out;
}
#verifyPage,
#notarisePage {
  font-size: 20px;
  padding-left: 20px;
}
</style>
