import {store} from '../components/store/myStore'

export default(to, from, next)=> {
    if(store.getters.user){
        next();
    }else{
        next('/')
    }
}
