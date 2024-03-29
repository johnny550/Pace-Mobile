import Vue from 'vue'
import Router from 'vue-router'
import login from '../components/Login.vue'
import register from '../components/signUp.vue'
import about from '../components/About.vue'
import dashboard from '../components/Dashboard.vue'
import askToken from '../components/SecondStepIDentification.vue'
import AuthGuard from './AuthGuard'
import reference from '../components/myNumber.vue'
import MonthlyChart from '../components/MonthGraph.vue'
import YearChart from '../components/YearGraph.vue'


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
      component: about,
      beforeEnter: AuthGuard
  
  },
  {
      path: '/dashboard',
      name: 'Dashboard',
      component: dashboard,
      beforeEnter: AuthGuard
  },
  {
    path: '/tokenAsk',
    name: 'tokenAsk',
    component:askToken,
    beforeEnter: AuthGuard
  },
  {
    path: '/reference',
    name: 'reference',
    component: reference,
    beforeEnter: AuthGuard
  },
  {
    path: '/graphM',
    name: 'monthly',
    component: MonthlyChart,
    beforeEnter: AuthGuard
  },
  {
    path: '/graphY',
    name: 'yearly',
    component: YearChart,
    beforeEnter: AuthGuard
  }
  ]
})
