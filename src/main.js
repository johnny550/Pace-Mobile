import '@babel/polyfill'
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import * as firebase from 'firebase'
import { store } from './components/store/myStore.js'
import Alert from './components/sharedComps/Alert.vue'

Vue.use(Vuetify)
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
  created(){
    firebase.initializeApp({
      apiKey: "AIzaSyCUH5KKc_obi_dh73A4HgQcibbxq41E6bY",
      authDomain: "pace-data.firebaseapp.com",
      databaseURL: "https://pace-data.firebaseio.com",
      projectId: "pace-data",
      storageBucket: "pace-data.appspot.com"
    })
  }
})
