import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'

Vue.use(Vuex)

export const store = new Vuex.Store({
 /*    state:{
        action:{
            signUserUp({commit}, payload) {
                firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password).then(
                    user=>
                )
            }
        }
    } */

    state:{
      message: 'vueX toDo',
      user: null,
      loading: false,
      error: null
    },
    mutations:{
        setUser(state, payload){
            state.user=payload
        },
        setLoading(state, payload) {
            state.loading = payload
        },
        setError (state, payload){
            state.error = payload
        },
        clearError (state){
            state.error=null
        }
    },
    actions:{
        signUserUp({commit}, payload) {
            commit('setLoading', true) 
            commit('clearError')
            firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password).then(
                user=> {
                    commit('setLoading', false)
                    const newUser = {
                        id: user.user.uid
                    }
                    commit('setUser', newUser)
                }
            )
                .catch(
                    error=> {
                        commit('setLoading', false)
                        commit('setError', error)
                        console.log(error)
                    }
                )
        },

        signUserIn({commit}, payload){
            commit('setLoading', true) 
            commit('clearError')
            firebase.auth().signInWithEmailAndPassword(payload.email, payload.password).then(
                user=> {

                    commit('setLoading', false)
                    const newUser = {
                        id: user.user.uid
                    }
                    commit('setUser', newUser)
                }
            )
            .catch(
                error=> {
                    commit('setLoading', false)
                    commit('setError', error)
                    console.log(error)
                }
            )
        },

        autoSignIn({commit}, payload){
            commit('setUser', {id: payload.uid })
        },

        logout({commit}){
            firebase.auth().signOut();
            commit('setUser', null)
        },

        clearError({commit}){
            commit('clearError')
        }
    },
    getters:{
        message(state){
            return state.message.toUpperCase();
        },
        user(state){
            return state.user
        },
        error(state){
            return state.error
        },
        loading(state){
            return state.loading
        }
    }
})