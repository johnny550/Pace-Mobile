import '@babel/polyfill'
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import vueFire from 'vuefire'
import firebaseC from './fireBaseConf/FirebaseConf'
import { store } from './components/store/myStore.js'
import Alert from './components/sharedComps/Alert.vue'
import VeeValidate from 'vee-validate';

Vue.use(VeeValidate);


Vue.use(Vuetify)
Vue.use(vueFire)
Vue.config.productionTip = false
Vue.component('app-alert', Alert)

//used it for passwords to be same ==> Vue.use(window['vue-validator'])
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  created() {
    firebaseC
    firebaseC.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$store.dispatch('autoSignIn', user)
        this.$store.dispatch('fetchUserData')
        //this.$store.dispatch('addUserToDB')
      }

    })
  }
});

