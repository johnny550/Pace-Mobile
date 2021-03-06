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
        monthPointer: null,
        email: '',
        emailVerified: false
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
        },
        setEmail(state, payload) {
            state.email = payload
        },
        setEmailVerified(state, payload) {
            state.emailVerified = payload
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
        signUserUp({ commit, getters }, payload) {
            commit('setLoading', true)
            commit('clearError')
            firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password).then(
                user => {
                    commit('setLoading', false)
                    const newUser = {
                        id: user.user.uid
                    }
                    commit('setUser', newUser)
                    commit('setEmail', payload.email)

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
        sendVerification() {
            var user = firebase.auth().currentUser
            user.sendEmailVerification().then(function () {
                //email is sent
                window.alert("Verification sent")
            }).catch(function (error) {
                console.log("message" + error.message)
            })
        },

        signUserIn({ commit }, payload) {
            commit('setLoading', true)
            commit('clearError')
            firebase.auth().signInWithEmailAndPassword(payload.email, payload.password).then(
                user => {

                    commit('setLoading', false)
                    const newUser = {
                        id: user.user.uid,
                    }
                    commit('setUser', newUser)
                    //console.log("Email verified: "+newUser.emailVerified)

                }
            )
                .catch(
                    error => {
                        commit('setLoading', false)
                        commit('setError', error)
                        console.log(error)
                    }
                )
            //var user =firebase.auth().currentUser

        },

        autoSignIn({ commit }, payload) {
            commit('setUser', { id: payload.uid })
        },
        getEmail({ commit, getters }) {
            firebase.database().ref('Users/' + getters.user.id + '').once('value')
                .then(data => {
                    data.child("email").forEach(function (childSnapshot) {
                        commit("setEmail", childSnapshot.val())
                    })
                })
        },

        addUserToDB({ getters }) {
            console.log("adding")
            firebase.database()
                .ref('Users/' + getters.user.id + '').set({ "email": email })

        },
        emptyMonthDataArrays({ commit, getters }) {
            commit('setUserDataYAxis', [])

            commit('setUserDataXAxis', [])
            console.log("contenu x:  " + getters.userDataXAxis + "  y: " + getters.userDataYAxis)
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
                            var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
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
                        moment: e.moment,
                        val: e.val / e.count
                    }
                })
                    for (var i = 0; i < final.length; i++) {
                        var day = final[i].moment.substring(0, final[i].moment.indexOf("/"))
                        var month = (final[i].moment.substring(final[i].moment.indexOf("/"), final[i].moment.lastIndexOf("/")).replace("/", "")) - 1
                        var year = final[i].moment.substring(final[i].moment.lastIndexOf("/")).replace("/", "")
                        var myDate = new Date(year, month, day)
                        final[i].moment = myDate
                    }
                    var date_sort = function (date1, date2) {
                        return date1.moment - date2.moment
                    };

                    final.sort(date_sort)
                    for (var i = 0; i < final.length; i++) {
                        final[i].moment = final[i].moment.toString().substring(0, 15)
                        //console.log(final[i].moment)
                    }
                   

                    /* console.log(final)
                     final.forEach(function(y){
                       console.log("day: "+y.moment+"  value: "+y.val)
                     })*/
                    const valuesNeeded = final.map(e => e.val);
                    const days = final.map(x => x.moment)
                    //const timeS = dataArray.map(x => x.timestamp)
                    // const valuesNeeded = dataArray.map(x => x.val)

                    commit('setUserDataXAxis', days.unique())

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
            commit('setEmailVerified', false)
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
        message(state) {
            return state.message
        },
        email(state) {
            return state.email
        },
        emailVerified(state) {
            return state.emailVerified
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
        emptyDayDataArrays({ commit }) {
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
                        data.child('Values').child(y).forEach(function () {
                            // var month = childSnapshot.key
                            var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
                            var monthName = months[Number(mth) - 1];

                            //under the month node
                            data.child('Values').child(y).child(monthName).forEach(function () {


                                data.child('Values').child(y).child(monthName).child(d).forEach(function (childSnapshot) {
                                    var timeStp = childSnapshot.key
                                    data.child('Values').child(y).child(monthName).child(d).child(timeStp).forEach(function (childSnapshot) {
                                        var childData = childSnapshot.val();
                                        dataArray.push({
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
                    Array.prototype.unique = function () {
                        return this.filter(function (value, index, self) {
                            return self.indexOf(value) === index;
                        });
                    };
                    dataArray.sort(function naturalCompare(a, b) {
                        var ax = [], bx = [];
                        a.timestamp.replace(/(\d+)|(\D+)/g, function (_, $1, $2) { ax.push([$1 || Infinity, $2 || ""]) });
                        b.timestamp.replace(/(\d+)|(\D+)/g, function (_, $1, $2) { bx.push([$1 || Infinity, $2 || ""]) });

                        while (ax.length && bx.length) {
                            var an = ax.shift();
                            var bn = bx.shift();
                            var nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
                            if (nn) return nn;
                        }

                        return ax.length - bx.length;
                    })

                    let outputValue = dataArray.reduce((op, cur) => {
                        if (op[cur.timestamp]) {
                            op[cur.timestamp].val += cur.val;
                            op[cur.timestamp].count++;
                        } else {
                            op[cur.timestamp] = cur
                            op[cur.timestamp].count = 1;
                        }
                        return op;
                    }, {})

                    let myValues = Object.values(outputValue).map(e => {
                        return {
                            val: e.val / e.count
                        }
                    })

                    const timeS = dataArray.map(x => x.timestamp)
                    const valuesNeeded = myValues.map(x => x.val)

                    commit('setTimestamps', timeS.unique())
                    commit('setUserData', valuesNeeded)

                    if (getters.timestamps.length > 0 && getters.userData.length > 0) {
                        commit('setRender', true)
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
    mutations: {
        setXAxisPerYear(state, payload) {
            state.xAxisPerYear = payload
        },
        setYAxisPerYear(state, payload) {
            state.yAxisPerYear = payload
        },
        setYearPointer(state, payload) {
            state.yearPointer = payload
        },
        setRenderForYear(state, payload) {
            state.renderForYear = payload
        }
    },
    actions: {
        activateYearPointer({ commit }) {
            var today = new Date()
            var myYear = today.getFullYear()

            commit('setYearPointer', myYear)
        },
        getYearData({ commit, getters }) {
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
                           // console.log("check 1   " + month)
                            //under the month node
                            var evenDeeperContent = data.child('Values').child(yearToWorkWith).child(month).forEach(function (childSnapshot) {

                                var day = childSnapshot.key

                                data.child('Values').child(yearToWorkWith).child(month).child(day).forEach(function (childSnapshot) {
                                    var timeStp = childSnapshot.key
                                    data.child('Values').child(yearToWorkWith).child(month).child(day).child(timeStp).forEach(function (childSnapshot) {
                                        var childData = childSnapshot.val();
                                        var toNum = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
                                        for (var i = 0; i < toNum.length; i++) {
                                            if (toNum[i] == month) {
                                                var numMonth = toNum.indexOf(month) + 1
                                                dataArray.push({
                                                    moment: day + "/" + numMonth + "/" + yearToWorkWith,
                                                    //timestamp: timeStp,
                                                    val: childData
                                                })
                                            }
                                        }
                                    })

                                });

                            })
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
                            moment: e.moment,
                            val: e.val / e.count
                        }
                    })
                    for (var i = 0; i < final.length; i++) {
                        var day = final[i].moment.substring(0, final[i].moment.indexOf("/"))
                        var month = (final[i].moment.substring(final[i].moment.indexOf("/"), final[i].moment.lastIndexOf("/")).replace("/", "")) - 1
                        var year = final[i].moment.substring(final[i].moment.lastIndexOf("/")).replace("/", "")
                        var myDate = new Date(year, month, day)
                        final[i].moment = myDate
                    }
                    var date_sort = function (date1, date2) {
                        return date1.moment - date2.moment
                    };

                    final.sort(date_sort)
                    for (var i = 0; i < final.length; i++) {
                        final[i].moment = final[i].moment.toString().substring(0, 15)
                        //console.log(final[i].moment)
                    }

                    const days = final.map(x => x.moment)
                    const valuesNeeded = final.map(e => e.val);

                    commit('setXAxisPerYear', days.unique())
                    commit('setYAxisPerYear', valuesNeeded)

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

    getters: {
        xAxisPerYear(state) {
            return state.xAxisPerYear
        },
        yAxisPerYear(state) {
            return state.yAxisPerYear
        },
        yearPointer(state) {
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

