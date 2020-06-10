import {AsyncStorage} from 'react-native';

export const  storePhone = async (phone)=>{
    try {
      console.log("new phone is ", phone)
      await AsyncStorage.multiSet([
        ['phone',           `${phone}`],
      ]);
      console.log('stored phone successfully')
    } catch (error) {
      // Error retrieving data
      console.log("storing phone in AsyncStorage" + error)
    }
  }
  export const  storeUserId = async ( userId)=>{
    try {
      console.log('new userId is' , userId)
      await AsyncStorage.multiSet([
        ['userId',           `${userId}`],
      ]);
      console.log('stored userId successfully')
    } catch (error) {
      // Error retrieving data
      console.log("storing userId in AsyncStorage" + error)
    }
  }

  export const  storeFirstTime = async (first)=>{
    try {
      console.log("new first is ", first)
      await AsyncStorage.multiSet([
        ['first_time',           `${first}`],
      ]);
    } catch (error) {
      // Error retrieving data
      console.log("storing first in AsyncStorage" + error)
    }
  }


 export const getStoredInfo =async ()=>{
    let storedInfo = {};
    let keys = [   'userId' , 'first_time', ];
    await AsyncStorage.multiGet(keys, (err, stores) => {
      stores.map((result, i, store) => {
        let key = store[i][0];
        let value = store[i][1];
        storedInfo[key] = value;
      });
    });
  
    return storedInfo;
  }


  export const clearVal  = async (val)=>{
    try {
      await AsyncStorage.multiRemove(
        [`${val}`]
      );
      console.log('clearing '+val)
    } catch (error) {
      // Error retrieving data
      console.log(`clearing ${val} from Async failed: ,${error}`)
    }
  }

