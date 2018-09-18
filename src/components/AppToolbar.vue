<template> 
  <div>
    <div style="position:absolute">
  <v-navigation-drawer v-model="sideNav" dark temporary>
    <v-list class="blue-grey darken-2" >
      <v-list-tile>
       
      </v-list-tile>
            <v-list-tile v-for="item in menuItems" :key="item.title" router :to="item.link">
        <v-list-tile-action>
          <v-icon >{{item.icon}}</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>{{item.title}}</v-list-tile-content>
      </v-list-tile>

    </v-list>
  </v-navigation-drawer>
    </div>

    <v-toolbar class="yellow lighten-1">
      <v-toolbar-side-icon @click.native.stop="sideNav= !sideNav" class="hidden-sm-and-up"></v-toolbar-side-icon>
      <v-toolbar-title>
        <router-link to="/" tag="span" style="cursor:pointer"> Pace </router-link>
      </v-toolbar-title>  
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn flat v-for="item in menuItems" :key="item.title" color="black" :to="item.link">
          <v-icon left>{{item.icon}}</v-icon>
          {{item.title}}</v-btn>

       
      </v-toolbar-items>
    </v-toolbar>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        sideNav:  false
      }
    },
    computed:{
      menuItems(){
        let menuItems = [
            {icon: 'lock_open',title: 'Login', link: '/'},
            {icon: 'face',title: 'Register', link: '/register'},
          ]
          if (this.userIsAuthenticated){
            menuItems =  [
          {icon: 'contacts',title: 'Contact',link: '/contact'},
          {icon: 'question_answer',title: 'About',link: '/about'}
        ]
          }

          return menuItems
      },

      userIsAuthenticated(){
        return this.$store.getters.user !==null && this.$store.getters.user !==undefined
      }
    }
  }
</script>
