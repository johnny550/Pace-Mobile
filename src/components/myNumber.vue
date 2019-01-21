<template>
  <v-form>
    <v-container>
      <v-layout row>
        <v-flex xs12 sm6 offset-sm3>
          <v-card>
            <v-card-text>
              <v-container>
                <v-layout row>
                  <v-text-field value="Outline" 
                  name="refID"
                  v-model="rID"
                  single-line
                  outline 
                  readonly
                  color="#4FC3F7"></v-text-field>
                </v-layout>
              </v-container>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-form>
</template>

<script>
export default {
  data(){
    return{
      refID : ''
    }
  },
  computed:{
    rID(){return this.$store.getters.user.id}
  },
  methods:{
    rID(){ {{rID}} }
  }



}
</script>
>
