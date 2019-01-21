<template>
  <v-container>
    <h2>{{message}}</h2>
    <v-layout row v-if="error">
      <v-flex xs12 sm6 offset-sm3>
        <app-alert @dismissed="onDismissed" :text="error.message"></app-alert>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <v-card-text>
            <v-container>
              <form @submit.prevent="onSignUp">
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field
                      name="email"
                      label="Mail"
                      id="email"
                      v-model="email"
                      type="email"
                      required
                    ></v-text-field>
                  </v-flex>
                </v-layout>

                <v-layout row>
                  <v-flex xs12>
                    <v-text-field
                      name="password"
                      label="Password"
                      id="password"
                      v-model="password"
                      type="password"
                      v-validate="'required'"
                      class="form-control"
                      ref="password"
                      required
                    ></v-text-field>
                  </v-flex>
                </v-layout>

                <v-layout row>
                  <v-flex xs12>
                    <v-text-field
                      v-validate="'required|confirmed:password'"
                      data-vv-as="password"
                      class="form-control"
                      name="confirmPassword"
                      label="Confirm password"
                      id="confirmPassword"
                      v-model="confirmPassword"
                      type="password"
                    ></v-text-field>
                  </v-flex>
                </v-layout>

                <v-layout row>
                  <v-flex xs12>
                  <div class="alert alert-danger" v-show="errors.any()">
                    <div v-if="errors.has('password')">{{ errors.first('password') }}</div>
                    <div
                      v-if="errors.has('confirmPassword')"
                    >{{ errors.first('confirmPassword') }}</div>
                  </div>
                  </v-flex>
                </v-layout>

                <v-layout row>
                  <v-flex xs12>
                    <v-btn type="submit" :disabled="loading" :loading="loading">
                      Sign up
                      <span slot="loader" class="custom-loader">
                        <v-icon light>cached</v-icon>
                      </span>
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
//import store from './store/myStore.js'
//import { databaseReference } from "../firebaseConf/FirebaseConf.js";

export default {
  // store: store,
  data() {
    return {
      email: "",
      password: "",
      confirmPassword: ""
    };
  },
  computed: {
    comparePasswords: function() {
      return this.$root.password !== this.$root.confirmPassword
        ? "Passwords do not match"
        : true;
    },

    message() {
      //return store.state.message;
      return this.$store.getters.message;
    },

    user() {
      return this.$store.getters.user;
    },

    error() {
      return this.$store.getters.error;
    },

    loading() {
      return this.$store.getters.loading;
    }
  },
  watch: {
    user(value) {
      if (value !== null && value !== undefined) {
        //after a successfull sign in, get redirected to :/
        this.$router.push("/dashboard");
      }
    }
  },
  methods: {
    onSignUp() {
      this.$store.dispatch("signUserUp", {
        email: this.email,
        password: this.password
      });

      //this.$store.dispatch('addUserToDB')
    },
    onDismissed() {
      this.$store.dispatch("clearError");
    },
    validateAll() {
      this.$validator
        .validateAll()
        .then(function(response) {
          // Validation success if response === true
        })
        .catch(function(e) {
          // Catch errors
        });
    }
  }
};
</script>
