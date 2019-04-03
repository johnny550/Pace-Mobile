<template>
    <div>
        <app-toolbar></app-toolbar>
            <router-view/>
         <!-- <app-footer style="position:absolute;z-index:-1"></app-footer>  -->
         <app-footer></app-footer> 
    </div>
</template>

<script>
import AppToolbar from './components/AppToolbar.vue'
import AppFooter from './components/AppFooter.vue'
export default {
    name : 'App',
    components: {AppToolbar,AppFooter}
}
</script>