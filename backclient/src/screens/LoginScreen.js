import React, { Component } from 'react';
import {View , StyleSheet , Alert , Image , TouchableOpacity , Text} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import {connect} from 'react-redux';
import { loginUser } from '../actions/actions'
import colors from '../constants/Colors';
import Button from '../components/Button';
import SignTextInput from '../components/SignTextInput'
import {storeUserId ,} from '../functions/Storage';
import { CommonActions } from '@react-navigation/native';
import {moderateScale as normalize} from 'react-native-size-matters'
class LoginScreen extends Component {
    state = {
        email: "", 
        password: '', 
        isLoading:false,
    }

    componentDidMount(){
        

    }
    
    login = async ()=>{
        //pass email , password
        const {email ,password} = this.state;
        if(!validateEmail(email)){
            this.alert("الرجاء ادخال البريد الالكتروني بطريقه صحيحه");
            return;
        }
        if(email&&password){
            this.setState({isLoading:true})
            this.props.loginUser({email , password} , this.stopRefresh , this.successCB , this.errCB)
        }else{
            this.alert("الرجاء ملئ كل الأماكن الفارغه");
        }
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
      
    stopRefresh = ()=>{
        this.setState({isLoading:false})
    }
    successCB = (user, sec)=>{
       storeUserId(user.uid);
        
        //pass from login here
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
          console.log('login successfully')
          
    }
    errCB = (err)=>{
        if(err.code =="auth/network-request-failed"){
            this.alert("مشكلة في الاتصال.. تأكد من اتصالك بالانترنت")
        }else if(err.code = "auth/user-not-found")
                            this.alert("عفوا انت غير مسجل.. يمكنك التسجيل من خلال الضغط علي مستخدم جديد");

    }
    render() {
        return (
            <View style={{flex:1,}}>
              <Image style={styles.image} source={require('../assets/images/backblue.jpg')}/>

                <View style = {styles.container}>
                
                <View style = {{flex:1,}}>
                        <View style = {[styles.container , {marginTop:hp('25%') , alignItems:'center', justifyContent:'space-around' , paddingBottom: hp('10%') }]}>

                                
                                <View style={{width:'100%' ,  paddingHorizontal: wp('3%'), marginVertical:hp('2%') }}>
                                    <Text style={styles.fieldTxt}>البريد الالكتروني</Text>
                                    <SignTextInput value = {this.state.email}  height = {hp('7%')} onChangeText = {(text)=>{this.setState({email: text})}} />
                                </View>

                                <View style={{width:'100%' ,  paddingHorizontal: wp('3%'), marginBottom:hp('2%')}}>
                                    <Text style={styles.fieldTxt}>كلمة المرور</Text>
                                    <SignTextInput value = {this.state.password} height = {hp('7%')} secure onChangeText = {(text)=>{this.setState({password: text})}} />
                                    <View style={{flexDirection:'row', alignItems:'center', marginTop:hp('1%')}}>
                                        <Text style={styles.forgotTxt}>هل نسيت كلمة السر؟</Text>
                                        <TouchableOpacity style={{marginStart: 4}} onPress={()=>{this.props.navigation.navigate('PasswordRecovery')}}>
                                        <Text underline style={[styles.forgotTxt,{fontWeight:'bold',textDecorationLine: 'underline'}]}>اضغط هنا</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                
                            

                                <Button
                                width = {wp('30%')}
                                height= {hp('7%')}
                                title={"تسجيل الدخول"}
                                action = {this.login} 
                                    isLoading= {this.state.isLoading}
                                />

                                <View style = {styles.line}/>

                                <TouchableOpacity onPress = {()=>{this.props.navigation.navigate('SignUp')}}>
                                    <Text style={styles.newUserTxt}>مستخدم جديد</Text>
                                </TouchableOpacity>
                        </View>
                    
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

export default connect(null , {loginUser})(LoginScreen);

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
        width: wp('66%'),
        marginVertical:hp('3%')
    },
    fieldTxt:{
        fontSize: normalize(18),
        color: 'black',
        marginBottom:8,
        marginStart:8,
        fontWeight:'500'
    },
    newUserTxt:{
        color: 'black',
        fontSize: normalize(20),
        fontWeight:'700'
    },
    image:{
        flex:1,
        position:'absolute',
        width: '100%', 
        height: '100%'
    },
    forgotTxt:{
        fontSize: normalize(19),
        fontWeight:'700',
        color:'white'
      }
    
});
