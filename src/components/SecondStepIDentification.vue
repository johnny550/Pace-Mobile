<template>
    <v-container>
        <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
                <v-card>
                    <v-card-text>
                       <v-container>
                           <form @submit.prevent="submitToken">
                               <v-layout row>
                                   <v-flex xs12>
                                       <v-text-field 
                                       name="token"
                                       label="Your wearable Token"
                                       id="token"
                                       type="text"
                                       required
                                       counter=32></v-text-field>
                                   </v-flex>
                               </v-layout>
                                
                                <v-layout row>
                                    <ul id="text">
                                       <li v-for="aToken of tokens" v-bind:key="aToken['.key']"> {{aToken}}</li>
                                    </ul>
                               </v-layout>

                                <v-layout row>
                                   <v-flex xs12>
                                       <v-btn type="submit">
                                            Submit
                                        </v-btn>
                                   </v-flex>
                                </v-layout>
                           </form>
                        </v-container> 
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import { databaseReference } from "../firebaseConf/FirebaseConf.js";
export default {
  data() {
    return {
      token: ""
    };
  },
  methods: {
    submitToken() {
      //no special characters in the token
      let regex = new RegExp("^[_A-z0-9]*((-|s)*[_A-z0-9])*$");
      var input = document.getElementById("token").value;
      if (regex.test(input)) {
        //if (input in firebase.tokens) this.$router.push("/dashboard");
        if (
          document.getElementById("text").value != "" &&
          document.getElementById("text").value != undefined
        ) {
          alert("rempli");
          //si rempli donc token is ok..laisser aller vers le dashboard
        } else {
          alert("vide");
        }
      } else {
        alert("ko");
        document.getElementById("token").value("");
      }
    }
  },
  firebase: {
    tokens: databaseReference.ref("Sensor data").child("idUser")
  }
};
</script>