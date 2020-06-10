import React, { Component } from 'react';
import {View , StyleSheet ,  Image , KeyboardAvoidingView , ScrollView , Text , Alert } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import colors from '../constants/Colors';
import {connect} from 'react-redux';

import Button from '../components/Button';
import SignTextInput from '../components/SignTextInput'
import { storeUserId} from '../functions/Storage';
import {registerUser} from '../actions/actions'
import {CommonActions} from '@react-navigation/native';

 class SignUp extends Component {

    state = {
        name:'',
        email:'',
        pass:'',
        verifypass:'',
        isLoading:false,
    }

    

    componentDidMount() {
    }

  
    
    successCB = (user)=>{
        //verified <3
        storeUserId(user.uid);
        this.props.navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [
                {
                  name: 'Main',
                },
              ],
            })
          );
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
      
    signUp = async()=>{

        const { name , email , pass , verifypass } = this.state;
        if(name&&email&&pass&&verifypass){
            if(validateEmail(email)){
                
                if(pass.length>=6){
                    if(pass===verifypass){
                        
                        this.setState({isLoading:true})
                        let userData= {
                            name,email ,
                            password:pass,
                        }
                        console.log('user data is ' , userData)
        
                        userData = {...this.props.user , ...userData};
                        console.log('userdata is ', userData)
                        this.props.registerUser(userData , this.stopRefresh, this.successCB ,this.errCB);

                    }else{
                        this.alert("كلمتي السر غير متشابهتين");
                    }
                }else{
                    this.alert("كلمة السر يجب ان تتكون علي الاقل من 6 خانات")
                }
            }else{
                this.alert('الرجاء ادخال البريد بطريقه صحيح');

            }

        }else{
            this.alert("الرجاء ملئ كل الفراغات")
        }
    }

  

    render() {
        return (
            <View style={{flex:1,}}>
              <Image style={styles.image} source={require('../assets/images/bg1.jpg')}/>
            <View style = {styles.container}>
               
               <View style={{flex:1,paddingTop:hp('20%')}}>
                <ScrollView  contentContainerStyle={{ alignItems:'center', paddingHorizontal:wp('3%')}}>
                        

                        <View style={{width: '100%', flexDirection:'row' , padding: 10, marginBottom:hp('1%')}}>
                            <View style={{flex:1 ,  paddingHorizontal: wp('2%') }}>
                                <Text style={styles.fieldTxt}>الإسم</Text>
                                <SignTextInput value={this.state.name} height= {hp('6%')} onChangeText = {(text)=>{this.setState({name: text})}} />
                            </View>
                        </View>

                      

                        <View style={{width: '100%', flexDirection:'row' , padding: 10, marginBottom:hp('1%')}}>
                            <View style={{flex:1 ,  paddingHorizontal: wp('2%')}}>
                                <Text style={styles.fieldTxt}>البريد الإلكتروني</Text>
                                <SignTextInput value={this.state.email} height= {hp('6%')} onChangeText = {(text)=>{this.setState({email: text})}} />
                            </View>
                        </View>

                        <View style={{width: '100%', flexDirection:'row' , padding: 10, marginBottom:hp('3%')}}>
                            <View style={{flex:1 ,  paddingHorizontal: wp('2%') }}>
                                <Text style={styles.fieldTxt}>كلمة السر</Text>
                                <SignTextInput value={this.state.pass} secure height= {hp('6%')} onChangeText = {(text)=>{this.setState({pass: text})}} />
                            </View>

                            <View style={{flex:1 ,  paddingHorizontal: wp('2%') ,}}>
                                <Text style={styles.fieldTxt}>تأكيد كلمة السر</Text>
                                <SignTextInput value={this.state.verifypass} secure height= {hp('6%')} onChangeText = {(text)=>{this.setState({verifypass: text})}} />
                            </View>
                        </View>
                    
                        <Button
                            extras ={{alignSelf:'center'}}
                             width = {wp('30%')}
                             height= {hp('7%')}
                             title={"انشاء حساب"}
                             action = {this.signUp} 
                             isLoading= {this.state.isLoading}
                             />
                        

                </ScrollView>
                
               
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
export default connect( mapStateToProps, { registerUser})(SignUp);

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
    image:{
        flex:1,
        position:'absolute',
        width: '100%', 
        height: '100%'
    },
});
