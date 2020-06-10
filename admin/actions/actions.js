import * as api from './api';
import { auth  , storage} from "../config/firebase";

//admin
export function insertCoupon(coupon, stopRefresh , successCB){
        api.insertCoupon(coupon, (success , coupondb ,err)=>{
            stopRefresh();
            if(success){
                successCB();
                console.log(('coupon added is ', coupondb))
            }else{
                console.log('errr ading ', err)
            }
        });
    
}

export function getCoupons(stopRefresh,successCB){
        api.getCoupons((success , data ,err)=>{
            stopRefresh();
            if(success){
                successCB(data);
                console.log(('coupon got ', data))
            }
        });
}
export function deleteCoupon(coupon,successCB) {
        api.deleteCoupon(coupon,  (success, nothing, error)=>{
            if (success) {
                successCB();
            }else if (error) console.log('error while delteing coup out', error)
        });
    
}