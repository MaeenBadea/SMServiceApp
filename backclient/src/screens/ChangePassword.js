import React, { Component } from 'react';
import {View , StyleSheet ,  Image , ToastAndroid , ScrollView , Text , Alert } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import colors from '../constants/Colors';
import {connect} from 'react-redux';

import Button from '../components/Button';
import SignTextInput from '../components/SignTextInput'
import { storeUserId} from '../functions/Storage';
import {updateUserPassword} from '../actions/actions'
import {CommonActions} from '@react-navigation/native';
import * as firebase from 'firebase';
import LogoTitle from '../components/LogoTitle';

 class ChangePassword extends Component {

    state = {
        email:'roro@gmail.com',
        pass:'',
        newpass:'',
        isLoading:false,
    }

    

    componentDidMount() {
    }

   
    reauthenticate = (currentPassword) => {
        let user = firebase.auth().currentUser;
        let cred = firebase.auth.EmailAuthProvider.credential(
            user.email, currentPassword);
        return user.reauthenticateWithCredential(cred);
    }


  
    
    successCB = (user)=>{
        //verified <3
        storeUserId(user.uid);
        this.props.navigation.navigate('Login');
          console.log('yeeeeeeeeeeeeeeeeeeeeeeeeees')
    }
    errCB = (err)=>{
        console.log('signup error is ', err);
        if(err.code=="auth/email-already-in-use"){
            this.alert("هذا البريد الالكتروني مسجل مسبقا")
        }else if(err.code=="auth/network-request-failed"){
            this.alert("مشكلة في الاتصال.. تأكد من اتصالك بالانترنت")
        }
    }
 
   
    
      stopRefresh = ()=>{
        this.setState({isLoading:false})

      }
      alert = (title)=>{
        Alert.alert(
            '',
            title,
            [
              {text: "حسنا", onPress: () => console.log('OK Pressed')},
            ],
            { cancelable: false }
          );
      }
      
    updatePassword = ()=>{

        const { pass , newpass } = this.state;
        const {user} = this.props;
        if(pass&&newpass){
                
                if(newpass.length>=6){
                    if(pass==user.password){
                        
                        this.setState({isLoading:true})
                        this.reauthenticate(user.password).then(() => {
                            let u = firebase.auth().currentUser;
                            u.updatePassword(newpass).then(() => {
                              console.log("Password updated!");
                              this.props.updateUserPassword(user,newpass, this.stopRefresh,()=>{
                                ToastAndroid.show("تم تحديث كلمة السر", ToastAndroid.LONG);
                                this.setState({pass:'', newpass:''})
                              })
                              
        
                            }).catch((error) => {
                                 console.log(error);
                                 this.setState({isLoading: false})
                                 ToastAndroid.show("لم يتم تحديث كلمة السر", ToastAndroid.LONG);

                             });
                          }).catch((error) => {
                               console.log(error);
                               this.setState({isLoading: false})
                               ToastAndroid.show("لم يتم تحديث كلمة السر", ToastAndroid.LONG);
                         });



                    }else{
                        this.alert("كلمة السر القديمة غير صحيحه");
                    }
                }else{
                    this.alert("كلمة السر يجب ان تتكون علي الاقل من 6 خانات")
                }

        }else{
            this.alert("الرجاء ملئ كل الفراغات")
        }
    }

  

    render() {
        const {email} = this.props.user;
        return (
            <View style={{flex:1,}}>
              <Image style={styles.image} source={require('../assets/images/background.jpg')}/>
              <LogoTitle title ="كلمة السر" canBack = {true} action ={()=>{this.props.navigation.goBack()}} />

            <View style = {styles.container}>
               
               <View style={{flex:1,paddingTop:hp('20%')}}>
                <ScrollView  contentContainerStyle={{ alignItems:'center', paddingHorizontal:wp('3%')}}>
                        

                        <View style={{width: '100%', flexDirection:'row' , padding: 10, marginBottom:hp('1%')}}>
                            <View style={{flex:1 ,  paddingHorizontal: wp('2%')}}>
                                <Text style={styles.fieldTxt}>البريد الإلكتروني</Text>
                                <SignTextInput editable={false} value={email} height= {hp('6%')} onChangeText = {(text)=>{this.setState({email: text})}} />
                            </View>
                        </View>

                      
                        <View style={{width: '100%', flexDirection:'row' , padding: 10, marginBottom:hp('3%')}}>
                            <View style={{flex:1 ,  paddingHorizontal: wp('2%') }}>
                                <Text style={styles.fieldTxt}>كلمة السر القديمة</Text>
                                <SignTextInput value={this.state.pass} secure height= {hp('6%')} onChangeText = {(text)=>{this.setState({pass: text})}} />
                            </View>

                            <View style={{flex:1 ,  paddingHorizontal: wp('2%') ,}}>
                                <Text style={styles.fieldTxt}>كلمة السر الجديدة</Text>
                                <SignTextInput value={this.state.newpass} secure height= {hp('6%')} onChangeText = {(text)=>{this.setState({newpass: text})}} />
                            </View>
                        </View>
                    
                        <Button
                            extras ={{alignSelf:'center'}}
                             width = {wp('40%')}
                             height= {hp('7%')}
                             title={"تحديث كلمة السر"}
                             action = {this.updatePassword} 
                             isLoading= {this.state.isLoading}
                             />
                        

                </ScrollView>
                
               
              </View>
                
            </View>
            </View>

        )
    }
}

const mapStateToProps = (state)=>{
    return {
        user: state.user
    }
}
export default connect( mapStateToProps, { updateUserPassword})(ChangePassword);

const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    image:{
        flex:1,
        position:'absolute',
        width: '100%', 
        height: '100%'
    },
    line:{
        backgroundColor: colors.main,
        height: 2,
        width: wp('66%')
    },
    fieldTxt:{
        fontSize: 16,
        color: colors.raven,
        marginBottom:8,
        marginStart:8
    },
    newUserTxt:{
        color: colors.raven,
        fontSize: 18
    },
});
