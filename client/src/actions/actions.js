import * as t from './actionTypes';
import * as api from './api';
import { auth  , storage} from "../config/firebase";
import axios from 'axios';

import {BASE_URL, SIMS_BASE_URL} from './api'


export function setDurationType(val){
    return async (dispatch)=>{
        dispatch({
            type: t.DURATION_TYPE,
            payload: val
          });
    }
}

export function setRepeat(val){
    return async (dispatch)=>{
        dispatch({
            type: t.REPEAT_TIMES,
            payload: val
          });
    }
}


export function setCountry(val){
    return async (dispatch)=>{
        dispatch({
            type: t.SET_COUNTRY,
            payload: val
          });
    }
}
export function setService(val){
    return async (dispatch)=>{
        dispatch({
            type: t.SET_SERVICE,
            payload: val
          });
    }
}
export function setRent(val){
    return async (dispatch)=>{
        dispatch({
            type: t.SET_RENT,
            payload: val
          });
    }
}

export function loginUser(creds, stopRefresh ,successCB , errCB){
    return async (dispatch)=>{
        api.login(creds , (success , data ,err )=>{
            stopRefresh();
            if(success){
                if(data.exists){
                    dispatch({type: t.GET_USER, payload: data.user});
                    successCB(data.user, creds.password);
                }else{
                    
                }
            }
            else{
                errCB(err);
                console.log('errror is ', err)
            }
        });
    }

}

//pass email , pass
export function getUserByEmail(email , stopRefresh,successCB , errCB ){
    return async (dispatch)=>{
        api.getUserByEmail(email , function(success , data ,err ){
            stopRefresh();
            if(success&& data.exists){
                successCB(data.user);
                
            }else if(success && !data.exists){
                alert('هذا الايميل غير مسجل');
            }
            else{
                errCB();
            }
        });
    }
}

export function updateUser(user , successCB , errCB){
    return async (dispatch)=>{
        api.updateUser(user , function(success , data , err){
            if(success){
                dispatch({type: t.UPDATE_USER, payload: {...user}});
                successCB();
            }
            else {
                errCB();
            }
        });
    }

 }

 export function getUser(userId , stopRefresh){
    return async (dispatch)=>{
        console.log('passed user id is', userId)
        api.getUser(userId , function(success , data , err){
            stopRefresh();
            if(success){
                if(data.exists)dispatch({type: t.GET_USER, payload: data.user});
            }else if(err){
                console.log('error is ', err);

            }
        });
    }
 }

 export function updateUserPassword(user, password  , stopRefresh,successCB){
    return (dispatch) => {
        api.updateUserPassword(user, password  ,(success , userdb , err)=>{
            stopRefresh();
            if(success){
                successCB();
                dispatch({type: t.UPDATE_USER, payload: userdb});
            }else if(err){
                console.log('error is ', err)
            }
        });
    }
 }



export function registerUser(user,stopRefresh , successCB, errorCB) {
    return async (dispatch) => {

        

        api.register(user,  (success, userdb, error)=> {
            stopRefresh();
            if (success) {
                dispatch({type: t.USER_CREATED, payload: userdb});
                successCB(userdb);
            }else if (error) errorCB(error)
            else{
                console.log('calling this weird areaaaaaaaaaaaaaaaaaa');
            }
        });
    };
}
export function addBuyService(user,service, successCB, stopRefresh) {
    return (dispatch) => {
        api.addBuyService(user ,service ,  (success, servicedb, error)=>{
            stopRefresh();
            if (success) {
                user.buys[servicedb.sid] = servicedb ;
                dispatch({type: t.UPDATE_USER , payload:{...user   } });
                successCB(servicedb.sid);
            }else if (error) console.log('error while loggin out', error)
        });
    };
}
export function deleteBuyService(user,service, successCB) {
    return (dispatch) => {
        api.deleteBuyService(user ,service ,  (success, nothing, error)=>{
            if (success) {
                delete user.buys[service.sid];
                dispatch({type: t.UPDATE_USER , payload:{...user} });
                successCB();
            }else if (error) console.log('error while loggin out', error)
        });
    };
}


export function addRentService(user,service, successCB) {
    return (dispatch) => {
        api.addRentService(user ,service ,  (success, servicedb, error)=>{
            if (success) {
                user.rents[servicedb.sid] = servicedb ;
                dispatch({type: t.UPDATE_USER , payload:{...user } });
                successCB();
            }else if (error) console.log('error deleting rent service', error)
        });
    };
}

export function deleteRentService(user,service, successCB) {
    return (dispatch) => {
        api.deleteRentService(user ,service ,  (success, nothing, error)=>{
            if (success) {
                delete user.rents[service.sid];
                dispatch({type: t.UPDATE_USER , payload:{...user} });
                successCB();
            }else if (error) console.log('error deleting rent service', error)
        });
    };
}
export function LogOut(successCB, stopLoading) {
    return (dispatch) => {
        api.signOut(function (success, data, error) {
            stopLoading();
            if (success) {
                dispatch({type: t.LOGGED_OUT});
                successCB();
            }else if (error) console.log('error while loggin out', error)
        });
    };
}



export function validateCoupon(user , couponStr , stopRefresh, successCB){
    return async (dispatch)=>{

        api.validateCoupon(couponStr , (success , data , err)=>{
            if(success){
                if(data.exists){
                    //valid coupon update balance
                    api.updateUserBalance(user, data.couponObj,(success, userdb, err)=>{
                        if(success){
                            stopRefresh();
                            dispatch({type: t.UPDATE_USER, payload: {...userdb}});
                            successCB();
                        }

                    })
                }else{
                    successCB("not found");
                    stopRefresh();
                }

            }else if(err){
                console.log('error is ', err);
                stopRefresh();
            }
        });
    }
 }


 export function changeBalance(user , val ,successCB){
    return (dispatch) => {
        api.changeBalance(user , val ,(success , userdb , err)=>{
            if(success){
                successCB();
                dispatch({type: t.UPDATE_USER , payload: {...userdb}})
            }else if(err){
                console.log('error is ', err)
            }
        });
    }
 }
 export function activateNum(user , service ,successCB){
    return (dispatch) => {
        api.activateNum(user , service ,(success , userdb , err)=>{
            if(success){
                successCB();
                dispatch({type: t.UPDATE_USER , payload: {...userdb}})
            }else if(err){
                console.log('error is ', err)
            }
        });
    }
 }

 export function updateEndDate(until,user , service ,successCB){
    return (dispatch) => {
        api.updateEndDate(until,user , service ,(success , userdb , err)=>{
            if(success){
                console.log('update service endDate', service)
                dispatch({type: t.UPDATE_USER , payload: {...userdb}})
            }else if(err){
                console.log('error is ', err)
            }
        });
    }
 }

/**
 *  smsservices actions
 * 
 */

export function getAdminBalance(callback){
    return (dispatch) => {
        const url = BASE_URL + "&action=getBalance";
        axios.get(url).then(res =>{
            callback(res.data)
        })
    }
}

export function getAvailablePhonesByCountry(country,successCB, errCB){
    return (dispatch) => {

    const url = BASE_URL +`&action=getNumbersStatus&country=${country}` ;
        axios.get(url).then(({data})=>{
            if(data){
                console.log('availble phones are', data)
                successCB(data)
            }else {
                errCB();
            }
        });
    }
    
}
export function getBuyServices(country , successCB, stopRefresh, errCB){
    return (dispatch) => {
        console.log('got country ', country)
    const url = BASE_URL + `&action=getPrices&country=${country}`;
        axios.get(url).then(({data})=>{
            stopRefresh();
            if(data){
                let {ot_1, ym_1, ya_1, av_1,...services} = data[country]
                console.log('buy services are', services)
                successCB(services)
            }else {
                errCB();
            }
        });
    }
}

export function buyNumber(input, stopRefresh, successCB, noNumsCB){
    return (dispatch) => {
        const {service , country } = input;
        console.log('country in buy is ', country)
        const url = BASE_URL + `&action=getNumber&service=${service}&country=${country}`;
        axios.get(url, ).then(({data}) =>{
            const resSplit = data.split(":");
            if(resSplit[0]=="ACCESS_NUMBER"){
                const res = {id:resSplit[1], phone: resSplit[2]};
                console.log('got res back', data);
                successCB(res)
            }else if(resSplit[0]=="NO_NUMBERS"){
                noNumsCB();
                stopRefresh();
            }
            else{
                console.log('couldnot buy num', data);
                stopRefresh();
            }
        });
    /*
    ACCESS_NUMBER:$id:$number , where ($id - id operations,$number - phone number)*/
    }
}

export function getBuyActivationStatus(id , successCB,stopRefresh , errCB){
    return (dispatch) => {
    const url = BASE_URL + `&action=getStatus&id=${id}`;
        axios.get(url).then(({data})=>{
            console.log('buy activiation status res is', data);                
            if(!data || data=="NO_ACTIVATION"|| data=="ERROR_SQL ") {
                console.log('err fetching buy stuts');
                stopRefresh();
                return ;
            }

            successCB(data)
        });
    }
}

export function changeBuyActivationStatus(id, status , successCB, errCB){
    return (dispatch) => {
    const url = BASE_URL + `&action=setStatus&status=${status}&id=${id}`;
        axios.get(url).then(({data})=>{
            if(data){
                console.log('buy activiation status res is', data)
                successCB(data)
            }else {
                //errCB();
                console.log('errr changing buy status')
            }
        });
    }
}

//rent Services
/*
export function getRentServices(input , successCB, stopRefresh, errCB){
    return (dispatch) => {
        const {country ,time} = input;

    const url = BASE_URL + `&action=getRentServicesAndCountries&rent_time=${time}&country=${country}`;
        axios.get(url).then(({data})=>{
            stopRefresh()
            console.log('rent services are', data)
            if(data){
                let {full,...services} = data.services
                successCB(services)
            }else {
                errCB();
                console.log('rent services is null');
            }
        });
    }
}

export function rentNumber(input , stopRefresh, successCB, errCB){
    return (dispatch) => {
    const {service , country ,time } = input;
    console.log('timee is', time);
    const furl = BASE_URL + `&action=getRentNumber&service=${service}&rent_time=${time}&country=${country}`;
        axios.get(furl).then(({data})=>{
            stopRefresh();
            console.log('rent order res is', data)
            if(data&&data.status=="success"){
                successCB(data.phone);
            }else {
                //errCB();
                console.log('couldnot rent number ,, failed ^." ');
            }
        });
    }
}


export function getRentStatus(id , stopRefresh, successCB, errCB){
    return (dispatch) => {
    const url = BASE_URL + `&action=getRentStatus&id=${id}`;
        axios.get(url).then(({data})=>{
            stopRefresh();
            console.log('rent status res is', data)
            if(data&&data.status=="success"&&data.quantity>0){
                const messages = formatRentStatuses(data.values);
                successCB(messages, data.quantity)
            }else {
                //errCB();
                console.log('error get rent status')
            }
        });
    }
}


export function changeRentStatus(id, status , successCB, errCB){
    return (dispatch) => {
    const url = BASE_URL + `&action=setRentStatus&id=${id}&status=${status}`;
        axios.get(url).then(({data})=>{
            if(data){
                console.log('rent status res is', data)
                if(data.status=="success")  successCB();
                else console.log('didnot change status but here si msg', data)
            }else {
                //errCB();
                console.log('failed changing rent status');
            }
        });
    }
}
*/

export function getAvailableRentCountries(successCB){
    const url = SIMS_BASE_URL + `method=getcountries`;
        axios.get(url).then(({data})=>{
            console.log('rent services are', data)
            if(data.status){
                const codes = data.data.map(item=>{
                    return item.code
                })
                successCB(codes)
            }else {
                console.log('couldnot load available rent countries');
            }
        });
    
}

export function getRentServices(country , successCB, stopRefresh, errCB){
    return (dispatch) => {

    const url = SIMS_BASE_URL + `method=getdata&country=${country}`;
        axios.get(url).then(({data})=>{
            stopRefresh()
            console.log('rent services are', data)
            if(data.status){
                successCB(data.data)
            }else {
                errCB();
                console.log('failed to fetch rent services');
            }
        });
    }
}
const SIMS_API_KEY = "V5Zf6ZOYbWojPWwu2dNFB05BOo6ddS";
export function rentNumber(input , stopRefresh, successCB, errCB){
    return (dispatch) => {
    const {service , country ,dtype, repeat } = input;
    const furl = SIMS_BASE_URL + `method=create&apikey=${SIMS_API_KEY}&dtype=${dtype}&dcount=${repeat}&country=${country}&service=${service}`;
    axios.get(furl).then(({data})=>{
            stopRefresh();
            console.log('rent order res is', data)
            if(data.status){
                successCB(data.data);
            }else {
                //errCB();
                console.log('couldnot rent number ,, failed ^." ');
            }
        });
    }
}

export function getMessagesOfNumber(id, successCB, errCB){
    return (dispatch) => {

    const url = SIMS_BASE_URL + `method=sms&id=${id}&apikey=${SIMS_API_KEY}`;
        axios.get(url).then(({data})=>{
            console.log('rent messages status res is', data)
            if(data.status){
                successCB(data.data);
            }else {
                //errCB();
                console.log('failed getting num messages');
            }
        });
    }
}

export function getRentNumbersStatus(successCB, errCB){

    const url = SIMS_BASE_URL + `method=orders&apikey=${SIMS_API_KEY}`;
        axios.get(url).then(({data})=>{
            console.log('rent num status res is', data)
            if(data.status){
                successCB(data.data);
            }else {
                //errCB();
                console.log('failed getting  rent number stuts');
            }
        });
    
}

export function renewRentNumber(input, successCB, errCB){
    return (dispatch) => {
        const {id ,dtype, repeat } = input;
    const url = SIMS_BASE_URL + `id=${id}&dcount=${repeat}&dtype=${dtype}&method=prolong&apikey=${SIMS_API_KEY}`;
        axios.get(url).then(({data})=>{
            console.log('rent renew status res is', data)
            if(data.status){
                successCB(data.data);
            }else {
                //errCB();
                console.log('failed renewing rent number');
            }
        });
    }
}


export function activateRentNumber(id, inputs, successCB, errCB){
    return (dispatch) => {
        const {service , user} = inputs;
    const url = SIMS_BASE_URL + `method=activate&&id=${id}&apikey=${SIMS_API_KEY}`;
        axios.get(url).then(({data})=>{
            console.log('rent activation status res is', data)
            if(data.status){
                successCB(data.data.id);
            }else {
                //errCB();
                console.log('failed activating rent number');
            }
        });
    }
}

export function deleteRentNumber(id, successCB, errCB){
    return (dispatch) => {
    const url = SIMS_BASE_URL + `method=delete&id=${id}&apikey=${SIMS_API_KEY}`;
        axios.get(url).then(({data})=>{
            console.log('rent delete status res is', data)
            if(data.status){
                successCB();
            }else {
                //errCB();
                console.log('failed deleting rent number');
            }
        });
    }
}
function formatRentStatuses (items){
    let servs = [];
    for(let serk in items){
        const serv = items[serk];
        servs.push(serv);   
    }
    return servs;
}
