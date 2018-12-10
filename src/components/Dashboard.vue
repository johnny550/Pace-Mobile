<template>
    <v-container>
        <div>
            <ul>
               <li v-for="aUser of user" v-bind:key="aUser['.key']"> {{aUser}}</li>
            </ul>
        </div>
        <div>
            <ul>
               <li v-for="aData of data" v-bind:key="aData['.key']"> {{aData}}</li>
            </ul>
        </div>     
    </v-container>
</template>

<script>
 import {databaseReference} from '../firebaseConf/FirebaseConf.js';
export default {
   firebase: {
       user: databaseReference.ref('Users').child("-LPOxuk1KpojpPdkO7q5"),
       data: databaseReference.ref('Sensor data').child("CEEF7370ECAE4C30AB0995C532AFE5D9")
   },

}
</script>

