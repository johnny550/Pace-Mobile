<template>
    <v-alert
       type="error"
       dismissible
       @input="onClose"
       :value="true"
       color= "red lighten-1"
    >
     {{text}}
    </v-alert>
</template>


<script>
export default {
    props: ['text'],
    methods:{
        onClose(){
            this.$emit('dismissed')
        }
    }
}
</script>

