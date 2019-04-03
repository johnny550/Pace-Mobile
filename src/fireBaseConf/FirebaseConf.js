import * as firebaseC from 'firebase'
let config = {
    apiKey: "XXXXXXXXX",
    authDomain: "pace-data.firebaseapp.com",
    databaseURL: "https://pace-data.firebaseio.com",
    projectId: "pace-data",
    storageBucket: "pace-data.appspot.com"
  }

export default !firebaseC.apps.length ? firebaseC.initializeApp(config) : firebaseC.app();

export const databaseReference=  firebaseC.database(); 
  
