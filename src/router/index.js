import Vue from 'vue'
import Router from 'vue-router'
import login from '../components/Login.vue'
import register from '../components/signUp.vue'
import about from '../components/About.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'SignIn',
      component: login
    } ,
  {
      path: '/register',
      name: 'SignUp',
      component: register
  
  },
  {
      path: '/about',
      name: 'About',
      component: about
  
  }/*,
  {
      path: '/contact',
      name: 'Contact',
      component: Contact
  
  } */
  ]
})
