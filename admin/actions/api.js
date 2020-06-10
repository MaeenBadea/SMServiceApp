import { auth, database } from "../config/firebase";

//admin
export function insertCoupon(coupon, callback){

    // Write the new group data  in the groups list
    let updates = {};
    updates[`coupons/${coupon.str}`] = coupon;
    database.ref().update(updates)
        .then(() => callback(true, coupon.str, null))
        .catch((error) => callback(false, null, error));
}

export function getCoupons(callback){
    const competRef = database.ref('coupons');
    //start listening for new data
    competRef.on('value', function(snapshot) {
        callback(true, snapshot, null)
    });
}

export function deleteCoupon(coupon,callback){

    // Write the new group data  in the groups list
    let updates = {};
    updates[`coupons/${coupon}`] = null;
    database.ref().update(updates)
        .then(() => callback(true, null, null))
        .catch((error) => callback(false, null, error));
}