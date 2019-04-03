<template>
  <div>
    <div style="position:absolute">
      <v-navigation-drawer v-model="sideNav" dark temporary style="position:relative">
        <v-list class="light-blue accent-3">
          <v-list-tile></v-list-tile>

          <div class="container fluid pb-0">
            <div class="text-xs-center">
              <h4 class="body-2 font-weight-bold white--text">PACE</h4>
              <span
                class="d-block mb-3 caption white--text text--lighten-1"
              >Physical Activities traCker for Everyone</span>
              <a
                target="_blank"
                rel="noopener"
                large
                class="mb-4 v-btn v-btn--large v-btn--outline v-btn--depressed theme--light primary--text"
              >
                <div class="v-btn__content">
                  <span class="caption font-weight-bold">Support Us</span>
                </div>
              </a>
            </div>
          </div>

          <v-list-tile v-for="item in menuItems" :key="item.title" router :to="item.link">
            <v-list-tile-action>
              <v-icon>{{item.icon}}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>{{item.title}}</v-list-tile-content>
          </v-list-tile>

          <v-list-tile v-if="userIsAuthenticated" @click="onLogout">
            <v-list-tile-action>
              <v-icon>logout</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>Logout</v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>
    </div>

    <v-toolbar class="yellow lighten-1">
      <v-toolbar-side-icon @click.native.stop="sideNav= !sideNav" class="hidden-sm-and-up"></v-toolbar-side-icon>
      <v-toolbar-title>
        <router-link to="/" tag="span" style="cursor:pointer">Pace</router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn flat v-for="item in menuItems" :key="item.title" color="black" :to="item.link">
          <v-icon left>{{item.icon}}</v-icon>
          {{item.title}}
        </v-btn>

        <v-btn v-if="userIsAuthenticated" flat @click="onLogout">
          <v-icon left>logout</v-icon>Logout
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sideNav: false
    };
  },
  methods: {
    onLogout() {
      this.$store.dispatch("logout");
      this.$router.push("/");
    }
  },
  computed: {
    menuItems() {
      let menuItems = [
        { icon: "lock_open", title: "Login", link: "/" },
        { icon: "face", title: "Register", link: "/register" }
      ];
      if (this.userIsAuthenticated) {
        menuItems = [
          { icon: "contacts", title: "Dashboard", link: "/dashboard" },
          { icon: "fingerprint", title: "Reference", link: "/reference" },
          { icon: "question_answer", title: "About", link: "/about" }
        ];
      }

      return menuItems;
    },

    userIsAuthenticated() {
      return (
        this.$store.getters.user !== null &&
        this.$store.getters.user !== undefined
      );
    }
  }
};
</script>
