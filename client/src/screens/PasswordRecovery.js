import React, { Component } from 'react';
import {View , StyleSheet ,  Image , ToastAndroid , ScrollView , Text , Alert } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import colors from '../constants/Colors';
import {connect} from 'react-redux';

import Button from '../components/Button';
import SignTextInput from '../components/SignTextInput'
import { storeUserId} from '../functions/Storage';
import {registerUser, getUserByEmail} from '../actions/actions'
import {CommonActions} from '@react-navigation/native';
import * as firebase from 'firebase';
import axios from 'axios';
import {auth} from '../config/firebase'

 class PasswordRecovery extends Component {

    state = {
        email:'',
        pass:'',
        newpass:'',
        isLoading:false,
    }

    

    componentDidMount() {
    }

    getUserSendMail =async ()=>{
        const {email} = this.state;
        if(!validateEmail(email)){
            ToastAndroid.show("الرجاء ادخال بريد صحيح", ToastAndroid.LONG);
            return ;
        }
        this.setState({isLoading:true})
        await firebase.auth().sendPasswordResetEmail(email);
        ToastAndroid.show("تم ارسال ايميل الي بريدك لتغيير كلمة السر", ToastAndroid.LONG);
        this.setState({isLoading:false})
        return ;
        this.props.getUserByEmail(email, this.stopRefresh ,(user)=>{
            console.log('recieved user and it is ', user);
            this.sendEmail(user)
        },()=>{console.log('error getting user')})
    }
    sendEmail = (user)=>{
        console.log('trying to send email');
        const {email, password ,name}  = user;
       /* const email ="roronoamaeen@gmail.com";
        const password ="kaka123";
        const name ="Maeen Badea";*/

        axios.post("https://still-badlands-50758.herokuapp.com/api/passwordreset"
         , {email, password ,name}).then(
                 ({data})=>{
                    console.log('recieved res which is', data)
                 if(data.status=="ok"){
                    ToastAndroid.show("تم ارسال كلمة السر الي البريد المدخل", ToastAndroid.LONG);
                } else{

                 }
        })
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
      
  

    render() {
        return (
            <View style={{flex:1,}}>
              <Image style={styles.image} source={require('../assets/images/bg1.jpg')}/>
            <View style = {styles.container}>
               
                <View  style={{flex:1,paddingTop:hp('35%') ,alignItems:'center', paddingHorizontal:wp('3%')}}>
                        

                        <View style={{width: '100%', flexDirection:'row' , padding: 10, marginBottom:hp('2%')}}>
                            <View style={{flex:1 ,  paddingHorizontal: wp('2%')}}>
                                <Text style={styles.fieldTxt}>البريد الإلكتروني</Text>
                                <SignTextInput value={this.state.email} height= {hp('6%')} onChangeText = {(text)=>{this.setState({email: text})}} />
                            </View>
                        </View>

                        <Button
                            extras ={{alignSelf:'center',backgroundColor:colors.orange}}
                             width = {wp('50%')}
                             height= {hp('7%')}
                             title={"تغيير كلمة السر"}
                             action = {this.getUserSendMail} 
                             isLoading= {this.state.isLoading}
                             />

                      
                    
                       

                </View>
                
               
                
            </View>
            </View>

        )
    }
}

const  validateEmail = (email)=> {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
const mapStateToProps = (state)=>{
    return {
        user: state.user
    }
}
export default connect( mapStateToProps, { getUserByEmail})(PasswordRecovery);

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
