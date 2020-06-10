import { auth, database } from "../config/firebase";
import axios from 'axios';
export const BASE_URL= "https://sms-activate.ru/stubs/handler_api.php?api_key=07d5e56956cb2Ac16fA9d8A37440bf5c";
export const SIMS_BASE_URL = "https://simsms.org/api/rent.php?";

//Register the user using email and password
export function register(user, callback) {
    const { email, password  } = user;
    auth.createUserWithEmailAndPassword(email, password)
        .then((resp) => createUser({ ...user , uid:resp.user.uid }, callback))
        .catch((error) => callback(false, null, error));
}


export function addUser(user , callback){
    const newuserRef = database.ref().child('/users').push();
    const newuserKey = newuserRef.key;

    user.id = newuserKey;

    // Write the new user data  in the users list
    let updates = {};
    updates['users/' + newuserKey] = user;
    database.ref().update(updates)
        .then(() => callback(true, user, null))
        .catch((error) => callback(false, null, error));
}


//update user data
export function updateUser(user, callback) {

    let updates = {};
    const {uid} = user;
    updates[ 'users/' + uid  ] = user;

    database.ref().update(updates)
        .then(() => callback(true, user, null))
        .catch((error) => callback(false, null, error));
}

export function updateUserPassword(user, password, callback) {

    let updates = {};
    const {uid} = user;
    updates[ `users/${uid}/password` ] = password;
    user.password = password;
    database.ref().update(updates)
        .then(() => callback(true, user, null))
        .catch((error) => callback(false, null, error));
}
//Create the user object in realtime database
export function createUser (user, callback) {
    const userRef = database.ref().child('users');

    userRef.child(user.uid).update(user)
        .then(() => callback(true, user, null))
        .catch((error) => callback(false, null, {message: error}));
}

//Sign the user in with their email and password
export function login(data, callback) {
    const { email, password } = data;
    auth.signInWithEmailAndPassword(email, password)
        .then((resp) => getUser(resp.user.uid, callback))
        .catch((error) => callback(false, null, error));
}

//Get the user object from the realtime database
export function getUser(userId, callback) {
    let user = {};
    database.ref('users').child(userId).once('value')
        .then(function(snapshot) {

            const exists = (snapshot.val() !== null);

            //if the user exist in the DB, replace the user variable with the returned snapshot
            if (exists) user = snapshot.val();

            const data = { exists, user }
            callback(true, data, null);
        })
        .catch(error => callback(false, null, error));
}

export function getUserByEmail(email, callback) {
    database.ref('users').orderByChild('email').equalTo(email).on('child_added', function(snapshot){
        let exists = (snapshot.val() !== null);;
        let user= {}
        //if the user exist in the DB, replace the user variable with the returned snapshot
        if (exists) user = snapshot.val();
        const data = {exists ,user};
        callback(true ,data , '')
    });
}
//buys creation
export function addBuyService(user, service , callback){
    
    const {uid} = user;
    const newbuyRef = database.ref().child(`users/${uid}/buys`).push();
    const newbuyKey = newbuyRef.key;

    service.sid = newbuyKey;

    // Write the new group data  in the groups list
    let updates = {};
    updates[`users/${uid}/buys/${newbuyKey}`] = service;
    database.ref().update(updates)
        .then(() => callback(true, service, null))
        .catch((error) => callback(false, null, error));
}

export function deleteBuyService(user,service, callback){
    const {uid} = user;
    const sid = service.sid 

    // Write the new group data  in the groups list
    let updates = {};
    updates[`users/${uid}/buys/${sid}`] = null;
    database.ref().update(updates)
        .then(() => callback(true, null, null))
        .catch((error) => callback(false, null, error));
}


//rents creation
export function addRentService(user, service , callback){
    const {uid} = user;

    const newrentRef = database.ref().child(`users/${uid}/rents`).push();
    const newrentKey = newrentRef.key;

    service.sid = newrentKey;

    // Write the new group data  in the groups list
    let updates = {};
    updates[`users/${uid}/rents/${newrentKey}`] = service;
    database.ref().update(updates)
        .then(() => callback(true, service, null))
        .catch((error) => callback(false, null, error));
}

export function deleteRentService(user,service, callback){
    const {uid} = user;

    const sid = service.sid 


    // Write the new group data  in the groups list
    let updates = {};
    updates[`users/${uid}/rents/${sid}`] = null;
    database.ref().update(updates)
        .then(() => callback(true, null, null))
        .catch((error) => callback(false, null, error));
}



export function signOut (callback) {
    auth.signOut()
        .then(() => {
            if (callback) callback(true, null, null)
        })
        .catch((error) => {
            if (callback) callback(false, null, error)
        });
}
//////////////////////////////////////////////////////////////////////////////////////



//Get the user object from the realtime database
export function validateCoupon(couponStr, callback) {
    database.ref('coupons').child(couponStr).once('value')
        .then(function(snapshot) {

            const exists = (snapshot.val() !== null);

            let obj = {};
            //if the user exist in the DB, replace the user variable with the returned snapshot
            if (exists) obj = snapshot.val();

            const data = { exists, couponObj:obj }
            callback(true, data, null);
        })
        .catch(error => callback(false, null, error));
}

//update user data
export function updateUserBalance(user, coupon, callback) {

    let updates = {};
    const {uid} = user;
    const oldbalance = parseFloat(user.balance)
    const newbalance = parseFloat(Number(oldbalance + coupon.val).toFixed(2))
    
    updates[ `users/${uid}/balance`  ] = newbalance;
    user.balance = newbalance;
    console.log('new balance is', newbalance)

    updates[`coupons/${coupon.str}`] = null;//delete coupon

    database.ref().update(updates)
        .then(() => callback(true, user, null))
        .catch((error) => callback(false, null, error));
}

//update user data
export function changeBalance(user, val, callback) {

    let updates = {};
    const {uid} = user;
    const oldbalance = parseFloat(user.balance)
    const newbalance = parseFloat(Number(oldbalance + val).toFixed(3))
    
    updates[ `users/${uid}/balance`  ] = newbalance;
    user.balance = newbalance;
    database.ref().update(updates)
        .then(() => callback(true, user, null))
        .catch((error) => callback(false, null, error));
}

export function activateNum(user,service, callback) {

    let updates = {};
    const {uid} = user;

    updates[ `users/${uid}/buys/${service.sid}/activated`  ] = true;
    user.buys[service.sid].activated = true;

    database.ref().update(updates)
        .then(() => callback(true, user, null))
        .catch((error) => callback(false, null, error));
}

export function updateEndDate(until,user,service, callback) {

    let updates = {};
    const {uid} = user;

    updates[ `users/${uid}/rents/${service.sid}/endDate`  ] = until;
    user.rents[service.sid].endDate = until;

    database.ref().update(updates)
        .then(() => callback(true, user, null))
        .catch((error) => callback(false, null, error));
}