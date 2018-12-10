import * as firebaseC from 'firebase'
let config = {
    apiKey: "AIzaSyCUH5KKc_obi_dh73A4HgQcibbxq41E6bY",
    authDomain: "pace-data.firebaseapp.com",
    databaseURL: "https://pace-data.firebaseio.com",
    projectId: "pace-data",
    storageBucket: "pace-data.appspot.com"
  }

export default !firebaseC.apps.length ? firebaseC.initializeApp(config) : firebaseC.app();

export const databaseReference=  firebaseC.database(); 
  