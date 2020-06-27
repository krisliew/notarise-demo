<template>
  <div class="insideNav" :class="{ 'insideNav--hidden': !showNavbar }">
    <b-navbar
      sticky
      toggleable="lg"
      type="dark"
      variant="primary-dark"
      class="navbar"
    >
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      showNavbar: true,
      lastScrollPosition: 0,
      verifyActive: false,
      notariseActive: false,
    }
  },
  watch: {
    $route(value) {
      this.routeCheck(value)
    },
  },
  mounted() {
    this.routeCheck(this.$route)
    window.addEventListener('scroll', this.onScroll)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.onScroll)
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
    onScroll() {
      const currentScrollPosition =
        window.pageYOffset || document.documentElement.scrollTop
      if (currentScrollPosition < 0) {
        return
      }
      // Stop executing this function if the difference between
      // current scroll position and last scroll position is less than some offset
      if (Math.abs(currentScrollPosition - this.lastScrollPosition) < 30) {
        return
      }
      this.showNavbar = currentScrollPosition < this.lastScrollPosition
      this.lastScrollPosition = currentScrollPosition
    },
  },
}
</script>
<style scoped>
#siteLogo {
  padding-right: 30px;
}

.dropDownMenu {
  background-color: rgba(0, 0, 41, 0.9) !important;
}

.insideNav,
.navbar {
  background-color: rgba(0, 0, 41, 1);
  height: 60px;
  box-shadow: 0 2px 15px rgba(71, 120, 120, 0.5);
  transform: translate3d(0, 0, 0);
  transition: 0.1s all ease-out;
}
.insideNav {
  width: 100vw;
  position: fixed;
  z-index: 99;
}
.navbar {
  max-width: 960px;
  margin-left: auto;
  margin-right: auto;
  background-color: rgba(0, 0, 41, 1);
  position: relative;
  z-index: 99;
}
.navbar.navbar--hidden,
.insideNav--hidden {
  box-shadow: none;
  transform: translate3d(0, -100%, 0);
}

html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
</style>
