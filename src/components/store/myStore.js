import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'

Vue.use(Vuex)

//for monthly collection of data
const moduleA = {
    state: {
        user: null,
        loading: false,
        error: null,
        userDataYAxis: [],
        userDataXAxis: [],
        renderForMonth: false,
        monthPointer: null
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
        setUserDataYAxis(state, payload) {
            state.userDataYAxis = payload
        },
        setUserDataXAxis(state, payload) {
            state.userDataXAxis = payload
        },
        setRenderForMonth(state, payload) {
            state.renderForMonth = payload
        },
        setMonthPointer(state, payload) {
            state.monthPointer = payload
        }
    },
    actions: {
        activateMonthPointer({ commit }) {

            var today = new Date()
            var mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
            var yyyy = today.getFullYear()

            var myMonth = mm + '/' + yyyy
            commit('setMonthPointer', myMonth)
        },
        signUserUp({ commit,getters }, payload) {
            commit('setLoading', true)
            commit('clearError')
            firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password).then(
                user => {
                    commit('setLoading', false)
                    const newUser = {
                        id: user.user.uid
                    }
                    commit('setUser', newUser)
                    console.log("ajoutee  "+getters.user.id)

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

        signUserIn({ commit, getters }, payload) {
            commit('setLoading', true)
            commit('clearError')
            firebase.auth().signInWithEmailAndPassword(payload.email, payload.password).then(
                user => {

                    commit('setLoading', false)
                    const newUser = {
                        id: user.user.uid,
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
            console.log("adding")
            firebase.database()
                .ref('Users/' + getters.user.id + '')
                .push(email)
                .then(data => {
                    //console.log(email)
                })
                .catch(error => {
                    console.log(error)
                })
        },
        emptyMonthDataArrays({commit, getters}){
            commit('setUserDataYAxis', [])
          
            commit('setUserDataXAxis', [])
            console.log("contenu x:  "+getters.userDataXAxis+"  y: "+getters.userDataYAxis)
        },

        fetchUserData({ commit, getters }) {
            console.log("per MONTH")
            var monthToWorkWith = getters.monthPointer

            var theMonth = monthToWorkWith.substring(0, monthToWorkWith.indexOf("/"));
            var theYear = monthToWorkWith.substring(monthToWorkWith.lastIndexOf("/")).replace("/", "");
            commit('setLoading', true)
            firebase.database().ref('Sensor data/' + getters.user.id + '').once('value')
                .then(data => {
                    var dataArray = []
                    // var periodArray = []
                    //const values = data.val()

                    //top level in firebase
                    data.child('Values').forEach(function (childSnapshot) {
                       // var year = childSnapshot.key;

                        //month level in firebase
                        data.child('Values').child(theYear).forEach(function (childSnapshot) {
                           // var month = childSnapshot.key
                            var months = ["January", "February", "March","April","May", "June", "July", "August", "September", "October", "November", "December"]
                            //var number = months.indexOf(theMonth) + 1;
                            var monthName = months[Number(theMonth) - 1];
                            //console.log("Monthpointer now on: "+getters.monthPointer)
                            //console.log("value in monthName: "+monthName)
                            //under the month node
                            data.child('Values').child(theYear).child(monthName).forEach(function (childSnapshot) {

                                var day = childSnapshot.key

                                data.child('Values').child(theYear).child(monthName).child(day).forEach(function (childSnapshot) {
                                    var timeStp = childSnapshot.key
                                    data.child('Values').child(theYear).child(monthName).child(day).child(timeStp).forEach(function (childSnapshot) {
                                        var childData = childSnapshot.val();
                                        dataArray.push({
                                            moment: day + "/" + theMonth + "/" + theYear,
                                            //timestamp: timeStp,
                                            val: childData
                                        })
                                    })

                                })

                            });

                        });
                    })
                    /* this method can be used to define the elements that will be used on the x axis
                    ** Must put those elements in an array and share it within the application scope (commit...)
                    ** array to share: days[]
                    */
                    Array.prototype.unique = function () {
                        return this.filter(function (value, index, self) {
                            return self.indexOf(value) === index;
                        });
                    };
                    const days = dataArray.map(x => x.moment)
                    //const timeS = dataArray.map(x => x.timestamp)
                    // const valuesNeeded = dataArray.map(x => x.val)

                    commit('setUserDataXAxis', days.unique())
                    // commit('setTimestamps', timeS)

                    /* put the average value for each day
                    ** array to share : final[] instead of dataArray
                    */
                    let output = dataArray.reduce((op, cur) => {
                        if (op[cur.moment]) {
                            op[cur.moment].val += cur.val;
                            op[cur.moment].count++;
                        } else {
                            op[cur.moment] = cur
                            op[cur.moment].count = 1;
                        }
                        return op;
                    }, {})

                    let final = Object.values(output).map(e => {
                        return {
                            //moment: e.moment,
                            val: e.val / e.count
                        }
                    })

                    /* console.log(final)
                     final.forEach(function(y){
                       console.log("day: "+y.moment+"  value: "+y.val)
                     })*/
                    const valuesNeeded = final.map(e => e.val);


                    commit('setUserDataYAxis', valuesNeeded)
                    commit('setLoading', false)
                    if (getters.userDataXAxis.length > 0 && getters.userDataYAxis.length > 0) {
                        commit('setRenderForMonth', true)
                    }
                    else {
                        commit('setRenderForMonth', false)
                    }
                })


        },

        logout({ commit }) {
            firebase.auth().signOut();
            commit('setUser', null)
            //commit('setUserData', null)
            commit('setLoading', false)
            //commit('timestamps', null)
            commit('setRenderForMonth', false)
            commit('setRender', false)
            commit('setMonthPointer', false)
            commit('setYearPointer', false)
            commit('setRenderForYear', false)
        },

        clearError({ commit }) {
            commit('clearError')
        }
    },
    getters: {
        user(state) {
            return state.user
        },
        error(state) {
            return state.error
        },
        loading(state) {
            return state.loading
        },
        userDataXAxis(state) {
            return state.userDataXAxis
        },
        userDataYAxis(state) {
            return state.userDataYAxis
        },
        renderForMonth(state) {
            return state.renderForMonth
        },
        monthPointer(state) {
            return state.monthPointer
        },
        message(state){
            return state.message
        }
    }
}

//data for today
const moduleB = {
    state: {
        timestamps: [],
        userData: [],
        datePointer: null,
        render: null
    },
    mutations: {
        setTimestamps(state, payload) {
            state.timestamps = payload
        },
        setUserData(state, payload) {
            state.userData = payload
        },
        setDatePointer(state, payload) {
            state.datePointer = payload
        },
        setRender(state, payload) {
            state.render = payload
        }
    },
    actions: {
        activatePointer({ commit }) {
            var today = new Date()
            var dd = String(today.getDate()).padStart(2, '0')
            var mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
            var yyyy = today.getFullYear()

            today = dd + '/' + mm + '/' + yyyy
            commit('setDatePointer', today)
        },
        emptyDayDataArrays({commit}){
            commit('setUserData', [])
          
            commit('setTimestamps', [])
        },
        dataPerDay({ commit, getters }) {
            console.log("per DAY")
            var dateToWorkWith = getters.datePointer

            var d = dateToWorkWith.substring(0, dateToWorkWith.indexOf("/"));
            var mth = dateToWorkWith.substring(dateToWorkWith.indexOf("/"), dateToWorkWith.lastIndexOf("/")).replace("/", "");
            var y = dateToWorkWith.substring(dateToWorkWith.lastIndexOf("/")).replace("/", "");

            commit('setLoading', true)
            firebase.database().ref('Sensor data/' + getters.user.id + '').once('value')
                .then(data => {
                    var dataArray = []
                    // var periodArray = []
                    data.val()

                    //top level in firebase
                    data.child('Values').forEach(function (childSnapshot) {
                        // var year = childSnapshot.key;

                        //month level in firebase
                        data.child('Values').child(y).forEach(function (childSnapshot) {
                            // var month = childSnapshot.key
                            var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
                            var monthName = months[Number(mth) - 1];

                            //under the month node
                            data.child('Values').child(y).child(monthName).forEach(function (childSnapshot) {

                                //var day = childSnapshot.key


                                data.child('Values').child(y).child(monthName).child(d).forEach(function (childSnapshot) {
                                    var timeStp = childSnapshot.key
                                    data.child('Values').child(y).child(monthName).child(d).child(timeStp).forEach(function (childSnapshot) {
                                        var childData = childSnapshot.val();
                                        dataArray.push({
                                            //moment: day + "/" + number + "/" + year,
                                            timestamp: timeStp,
                                            val: childData
                                        })
                                    })

                                })

                            });

                        });
                    })
                    /* this method can be used to define the elements that will be used on the x axis
                    ** Must put those elements in an array and share it within the application scope (commit...)
                    ** array to share: days[]
                    */

                    const timeS = dataArray.map(x => x.timestamp)
                    const valuesNeeded = dataArray.map(x => x.val)
                    //console.log("timestamps: " + timeS)
                    //console.log("values:  " + valuesNeeded)

                    commit('setTimestamps', timeS)
                    commit('setUserData', valuesNeeded)

                    if (getters.timestamps.length > 0 && getters.userData.length > 0) {
                        commit('setRender', true)
                        console.log("rendering", getters.render)
                    }
                    else {
                        commit('setRender', false)
                    }
                })
        }
    },
    getters: {
        timestamps(state) {
            return state.timestamps
        },
        userData(state) {
            return state.userData
        },
        datePointer(state) {
            return state.datePointer
        },
        render(state) {
            return state.render
        }
    }
}

//data for a year
const moduleC = {
    state: {
        xAxisPerYear: [],
        yAxisPerYear: [],
        yearPointer: null,
        renderForYear: false
    },
    mutations:{
        setXAxisPerYear(state, payload){
            state.xAxisPerYear = payload
        },
        setYAxisPerYear(state, payload){
            state.yAxisPerYear = payload
        },
        setYearPointer(state, payload){
            state.yearPointer = payload
        },
        setRenderForYear(state, payload){
            state.renderForYear = payload
        }
    },
    actions:{
        activateYearPointer({commit}){
            var today = new Date()
            var myYear = today.getFullYear()

       // var theMonth = String(today.getMonth() + 1).padStart(2, '0') 
            commit('setYearPointer', myYear)
        },
        getYearData({commit, getters}){
            console.log("per YEAR")
            var yearToWorkWith = getters.yearPointer
            commit('setLoading', true)
            firebase.database().ref('Sensor data/' + getters.user.id + '').once('value')
                .then(data => {
                    var dataArray = []
                    // var periodArray = []
                    const values = data.val()

                    //top level in firebase
                    var content = data.child('Values').forEach(function (childSnapshot) {
                        //var year = childSnapshot.key;

                        //month level in firebase
                        var deeperContent = data.child('Values').child(yearToWorkWith).forEach(function (childSnapshot) {
                            var month = childSnapshot.key
                            var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
                            //var number = months.indexOf(theMonth) + 1;
                            console.log("check 1   "+ month)
                            //under the month node
                            var evenDeeperContent = data.child('Values').child(yearToWorkWith).child(month).forEach(function (childSnapshot) {

                                var day = childSnapshot.key

                                data.child('Values').child(yearToWorkWith).child(month).child(day).forEach(function (childSnapshot) {
                                    var timeStp = childSnapshot.key
                                    data.child('Values').child(yearToWorkWith).child(month).child(day).child(timeStp).forEach(function (childSnapshot) {
                                        var childData = childSnapshot.val();
                                        dataArray.push({
                                            moment: day + "/" + month + "/" + yearToWorkWith,
                                            //timestamp: timeStp,
                                            val: childData
                                        })
                                    })

                                })

                            });

                        });
                    })
                    /* this method can be used to define the elements that will be used on the x axis
                    ** Must put those elements in an array and share it within the application scope (commit...)
                    ** array to share: days[]
                    */
                    Array.prototype.unique = function () {
                        return this.filter(function (value, index, self) {
                            return self.indexOf(value) === index;
                        });
                    };
                    const days = dataArray.map(x => x.moment)
                    //const timeS = dataArray.map(x => x.timestamp)
                    // const valuesNeeded = dataArray.map(x => x.val)

                    commit('setXAxisPerYear', days.reverse().unique())
                    // commit('setTimestamps', timeS)

                    /* put the average value for each day
                    ** array to share : final[] instead of dataArray
                    */
                    let output = dataArray.reduce((op, cur) => {
                        if (op[cur.moment]) {
                            op[cur.moment].val += cur.val;
                            op[cur.moment].count++;
                        } else {
                            op[cur.moment] = cur
                            op[cur.moment].count = 1;
                        }
                        return op;
                    }, {})

                    let final = Object.values(output).map(e => {
                        return {
                            //moment: e.moment,
                            val: e.val / e.count
                        }
                    })

                    /* console.log(final)
                     final.forEach(function(y){
                       console.log("day: "+y.moment+"  value: "+y.val)
                     })*/
                    const valuesNeeded = final.map(e => e.val);


                    commit('setYAxisPerYear', valuesNeeded.reverse())
                    commit('setLoading', false)
                    if (getters.xAxisPerYear.length > 0 && getters.yAxisPerYear.length > 0) {
                        commit('setRenderForYear', true)
                    }
                    else {
                        commit('setRenderForYear', false)
                    }
                })
        }
    },
    
    getters:{
        xAxisPerYear(state) {
            return state.xAxisPerYear
        },
        yAxisPerYear(state) {
            return state.yAxisPerYear
        },
        yearPointer(state){
            return state.yearPointer
        },
        renderForYear(state) {
            return state.renderForYear
        }
    }
}



export const store = new Vuex.Store({
    modules: {
        a: moduleA,
        b: moduleB,
        c: moduleC
    }
})

