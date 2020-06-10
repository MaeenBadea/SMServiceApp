import React, { Component } from 'react';
import {
    View,
    StyleSheet,ScrollView , Text,Image, TouchableOpacity, TextInput,ToastAndroid
} from 'react-native';
import colors from '../constants/Colors'
import { connect } from 'react-redux';

import Container from '../components/Container'
import LogoTitle from '../components/LogoTitle';
import {validateCoupon} from '../actions/actions'
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import Button from '../components/Button';
import {Overlay} from 'react-native-elements';
import ContactAdmin from './ContactAdmin';
import {moderateScale as normalize} from 'react-native-size-matters'
class CouponScreen extends Component {

    state={
        isLoading:false,
        coupon: '',
        visible:false
    }

    constructor(props){
      super(props);
    }

   
    addCoupon = ()=>{
      this.setState({isLoading:true});
      const {user} =this.props;
      this.props.validateCoupon(user,this.state.coupon,()=>{this.setState({isLoading:false})},this.successCB)
    }
    successCB = (res)=>{
      if(res=="not found"){
        ToastAndroid.show("عفوا الكوبون المدخل غير صحيح أو تم تحميله من قبل!", ToastAndroid.LONG);
        return;
      }
      this.setState({coupon:''})
      ToastAndroid.show("تم شحن الرصيد", ToastAndroid.SHORT);

    }

 
    
    render(){
        const {balance} = this.props.user;
        const {visible} = this.state;
        return (
          <Container>
             <View style={{flex:1}}>
             <LogoTitle title ="شراء رصيد" canBack = {true} action ={()=>{this.props.navigation.goBack()}} />
  
              <View style={styles.container}>
                    <Text style={styles.labelTxt}>رصيدك الحالي</Text>
                    <View style={styles.line}/>
                    <Text style= {styles.balanceTxt}>{balance} <Text style={{fontSize:wp('14%')}}>$</Text></Text>

                    <TextInput
                        onChangeText = {(txt)=>{this.setState({coupon:txt})}}
                        style={styles.couponinput}
                        value = {this.state.coupon}
                        placeholder="رمز الكوبون"
                     />

                    <Button
                        width = {wp('30%')}
                        height= {hp('7%')}
                        title={"اضف"}
                        action = {this.addCoupon} 
                        isLoading= {this.state.isLoading}
                        />
                  <View style={{flexDirection:'row', alignItems:'center', marginTop: hp('8%')}}>
                    <Text style={styles.coupTxt}>الحصول علي كوبون؟</Text>
                    <TouchableOpacity style={{marginStart: 4}} onPress={()=>{this.setState({visible:true})}}>
                       <Text style={[styles.coupTxt,{color: colors.raven, textDecorationLine: 'underline'}]}>اضغط هنا</Text>
                    </TouchableOpacity>
                  </View>


                  <Overlay overlayStyle={styles.overlay} isVisible={visible} onBackdropPress={()=>{this.setState({visible:false})}}>
                          <ContactAdmin />
                  </Overlay>
                    

                 
              </View>
              </View>
  
            </Container>
            );
      }
}

const mapStateToProps = (state)=>{
    return {
        user: state.user
    }
}

export default connect( mapStateToProps, {validateCoupon})(CouponScreen)



const WIDTH  = wp('100%');
const TEXT_INPUT_HEIGHT = hp('6%');
const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: "transparent",
    marginTop:hp('5%'),
    width: WIDTH , 
    alignItems:'center'
  },
  overlay:{
    width: wp('92%'),
    height:hp('84%')
  },
  balanceTxt:{
      color:colors.raven,
      fontSize: wp('18%'),
  },
  labelTxt:{
    fontSize: normalize(17),
    fontWeight:'700',
    color:colors.asher
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
  line:{
    backgroundColor: colors.asher,
    height: 2,
    width: wp('30%'),
  },
  coupTxt:{
    fontSize: normalize(19),
    fontWeight:'700',
    color:colors.asher
  }

});

