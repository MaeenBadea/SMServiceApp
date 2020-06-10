import * as t from '../actions/actionTypes';
import {HRS, } from '../constants/data'

let initialState = {
    user:{
        uid:'4vsfYJeTUaPGq8X6CyKPfcXD2D53',
        name:'',
        email:'',
        balance:0,
        buys:{},
        rents:{}
    },
    service:'',
    country:'RU',
    rent:false,
    repeat: 1,
    durationType:{type: HRS, title:'ساعات'}
};


const rootReducer = (state= initialState , action)=>{
    switch(action.type){
        case t.USER_CREATED:
            return {...state , user: action.payload };
        case t.GET_USER:
            console.log('final user',{...state.user, ...action.payload} );
            return {...state , user: {...state.user, ...action.payload}};
        case t.UPDATE_USER:
            return {...state , user: action.payload};
        case t.SET_COUNTRY:
            return {...state , country: action.payload};
        case t.SET_SERVICE:
            return {...state , service: action.payload};
        case t.SET_RENT:
            return {...state , rent: action.payload};
        case t.LOGGED_OUT:
            return {...state , user: initialState.user};
        case t.REPEAT_TIMES:
            return {...state , repeat: action.payload};
        case t.DURATION_TYPE:
            return {...state , durationType: action.payload};
        default:
            return state;
    }

}

export default rootReducer;