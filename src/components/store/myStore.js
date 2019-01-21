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

    state: {
        message: 'vueX toDo',
        user: null,
        loading: false,
        error: null,
        userData: [],
        //dateOfData: []
    },
    mutations: {
        setUser(state, payload) {
            state.user = payload
        },
        setLoading(state, payload) {
            state.loading = payload
        },
        setError(state, payload) {
            state.error = payload
        },
        clearError(state) {
            state.error = null
        },
        setUserData(state, payload) {
            state.userData = payload
        },
        /*setDateForData(state, payload) {
            state.dateOfData = payload
        }*/
    },
    actions: {
        signUserUp({ commit }, payload) {
            commit('setLoading', true)
            commit('clearError')
            firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password).then(
                user => {
                    commit('setLoading', false)
                    const newUser = {
                        id: user.user.uid
                    }
                    commit('setUser', newUser)

                },
            )
                .catch(
                    error => {
                        commit('setLoading', false)
                        commit('setError', error)
                        console.log(error)
                    }
                )
        },

        signUserIn({ commit }, payload) {
            commit('setLoading', true)
            commit('clearError')
            firebase.auth().signInWithEmailAndPassword(payload.email, payload.password).then(
                user => {

                    commit('setLoading', false)
                    const newUser = {
                        id: user.user.uid
                    }
                    commit('setUser', newUser)
                }
            )
                .catch(
                    error => {
                        commit('setLoading', false)
                        commit('setError', error)
                        console.log(error)
                    }
                )
        },

        autoSignIn({ commit }, payload) {
            commit('setUser', { id: payload.uid })
        },

        addUserToDB({ getters }) {
            firebase.database()
                .ref('Users/' + getters.user.id + '')
                .push(email)
                .then(data => {
                    // console.log(data)
                })
                .catch(error => {
                    console.log(error)
                })
        },

        fetchUserData({ commit, getters }) {
            commit('setLoading', true)
            firebase.database().ref('Sensor data/' + getters.user.id + '').once('value')
                .then(data => {
                    var dataArray = []
                    var periodArray = []
                    const values = data.val()

                    //top level in firebase
                    var content = data.child('Values').forEach(function (childSnapshot) {
                        var year = childSnapshot.key;

                        //month level in firebase
                        var deeperContent = data.child('Values').child(year).forEach(function (childSnapshot) {
                            var month = childSnapshot.key
                            periodArray.push(month + " " + year)
                            // childSnapshot.key+" "+year

                            //under the month node
                            var evenDeeperContent = data.child('Values').child(year).child(month).forEach(function (childSnapshot) {

                                var day = childSnapshot.key
                                
                                data.child('Values').child(year).child(month).child(day).forEach(function (childSnapshot) {
                                    var childData = childSnapshot.val();
                                    dataArray.push(day+" "+month + " " + year, [childData])
                                })

                            });

                        });
                    });
                    // commit('setDateForData', periodArray)
                    for (var i = 0; i < dataArray.length; i++) {
                        //console.log("in 0   "+dataArray[0])
                        console.log("in i   " + dataArray[6])
                    }
                    commit('setUserData', dataArray)
                })

        },

        logout({ commit }) {
            firebase.auth().signOut();
            commit('setUser', null)
            commit('setUserData', null)
            // commit('setDateForData', null)
            commit('setLoading', false)
        },

        clearError({ commit }) {
            commit('clearError')
        }
    },
    getters: {
        message(state) {
            return state.message.toUpperCase();
        },
        user(state) {
            return state.user
        },
        error(state) {
            return state.error
        },
        loading(state) {
            return state.loading
        },
        userData(state) {
            return state.userData
        },
        /* dateOfData(state) {
             return state.dateOfData
         }*/
    }
})