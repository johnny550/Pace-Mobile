<template>
  <v-container>
    <div>
      <ul>
        <li>{{data}}</li>
      </ul>
    </div>
 
  </v-container>
</template>

<script>
//import { databaseReference } from "../firebaseConf/FirebaseConf.js";
export default {
  computed: {
    data() {
      return this.$store.getters.userData
    },
    /*periods(){
      return this.$store.getters.dateOfData
    }*/
  }
  
};
</script>

