import React, { Component } from 'react';
import {
    View,
    StyleSheet , Text, TouchableOpacity ,ToastAndroid, TextInput
} from 'react-native';
import colors from '../constants/Colors'
import Container from '../components/Container'
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {insertCoupon} from '../actions/actions'
import Button from '../components/Button'
export default class Coupons extends Component {

    state={
        isLoading: false,
        val:''    
    }

   
   
    addCoupon = ()=>{
        if(!this.state.val){
            alert('الرجاء ادخال قيمة الكوبون بالدولار')
            return ;
        };
        const str = genCoupon();
        console.log('str' , str)
        this.setState({isLoading: true})
        insertCoupon({str, val: parseFloat(this.state.val)}, ()=>{this.setState({isLoading:false})},()=>{
            const msg = `تم اضافه الكوبون ${str} بقيمة ${this.state.val}`;
            ToastAndroid.show(msg, ToastAndroid.LONG);
            this.setState({val: '', });
        })
    }
 
    
    render(){

        return (    
            <Container>
                <View style={{flex:1 , alignItems:'center', marginTop: hp('15%')}}>
                    <TextInput
                            onChangeText = {(txt)=>{this.setState({val:txt})}}
                            style={styles.couponinput}
                            value = {this.state.val}
                            keyboardType={'numeric'}
                            placeholder="ادخل قيمة الكوبون بالدولار"
                        />
                    <Button
                        width = {wp('30%')}
                        height= {hp('7%')}
                        title={"اضف الكوبون"}
                        action = {this.addCoupon} 
                        isLoading= {this.state.isLoading}
                        />
              
                </View>
                    
    
            </Container>
        );
      }
      
       
}
function genCoupon() { 
    var ans = ''; 
    let arr = "AG8FOLE2WVTCPY5ZH3NIUDBXSMQK7946"
    for (var i = 8; i > 0; i--) { 
        ans +=  
          arr[Math.floor(Math.random() * arr.length)]; 
    } 
    return ans; 
}


const ICON_BTN_DIM = hp('5%');
const TEXT_INPUT_HEIGHT = hp('6%');

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: "transparent",
  },
  couponinput:{
      width: wp('60%'),
      height:TEXT_INPUT_HEIGHT,
      borderRadius: TEXT_INPUT_HEIGHT/2,
      backgroundColor:'white',
      borderWidth:2,
      borderColor: colors.raven,
      paddingHorizontal:wp('2%'),
      textAlign:'center',
      marginTop:hp('2%'),
      marginBottom: hp('3%'),
      elevation:15
  },
  couponCont:{
        width: wp('80%'),
        paddingHorizontal: wp('3%'),
        paddingVertical: hp('2%'),
        backgroundColor: colors.lightasher,
        marginVertical: hp('1%')
  },
  code:{
    color:'black',
    fontSize: 18,
    fontWeight:'bold'
  },
  btn:{
    backgroundColor:colors.green,
    width: wp('20%'),
    alignSelf:'center',
    height:ICON_BTN_DIM,
    borderRadius: ICON_BTN_DIM/2,
    justifyContent:'center',
    alignItems:'center'
  },
  
  
});

