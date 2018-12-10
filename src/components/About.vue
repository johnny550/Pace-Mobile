<template>
    <v-container>

      <form @submit.prevent="ourToast">
        <div class="text-xs-center">
            <v-btn round color="primary" type="submit" dark>Rounded Button</v-btn>
        </div>
      </form>

    </v-container>
</template>


     <script>
            export default {
                data(){return{}},
                methods:{
					ourToast(){
						Android.showToast('Hello Android!')
					}
                }
            }
    </script>
