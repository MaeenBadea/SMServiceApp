import React, { Component } from 'react';
import {
    View,
    StyleSheet,ScrollView , Text,Image, TouchableOpacity ,Linking
} from 'react-native';
import colors from '../constants/Colors'
import { connect } from 'react-redux';
import Container from '../components/Container'
import LogoTitle from '../components/LogoTitle';
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import {FontAwesome,Feather,  MaterialIcons, AntDesign, FontAwesome5} from '@expo/vector-icons';
import {  Overlay } from 'react-native-elements';
import { moderateScale as normalize } from 'react-native-size-matters';

export default class ContactAdmin extends Component {

    state={
        
    }

    constructor(props){
      super(props);
    }

    sendMessageToWhatsapp = ()=>{
        const Message = "مرحبا";
        const phone = "+96407805642131";
        Linking.openURL(`whatsapp://send?text=${Message}&&phone=${phone}`);
    }

   
    
    render(){
        
        return (
            <ScrollView style={{flex:1,}} contentContainerStyle ={styles.container}>
                <Text style={[styles.gentxt , styles.h1, {marginTop:hp('1%')}]}>لشحن حسابك في موقعنا</Text>
                <Text style={[styles.gentxt , styles.h2]}>*اضغط علي الواتس اب للتواصل معنا</Text>
                <TouchableOpacity style={{backgroundColor:'transparent'}} onPress= {this.sendMessageToWhatsapp} >
                    <Image source = {require('../assets/images/whatsapp.png')} style={styles.img}/>
                </TouchableOpacity>
                <Text style={[styles.gentxt , styles.h1]}>أو اتصل علي الأرقام التاليه</Text>
                <Text style={[styles.gentxt , styles.h2]}>  <Text style={[styles.h1]}>07805642131</Text> داخل العراق</Text>
                <Text style={[styles.gentxt , styles.h2]}><Text style={[styles.h1]}>9647805642131+</Text> خارج العراق </Text>
                <Text style={[styles.gentxt , styles.h1,{textAlign:'center',marginTop:hp('2%')}]}>مده الرد علي رساله من 30 دقيقه الي 3 ساعات عندما تتواصل معنا بعده يتم تفعيل شحن حسابك</Text>

                <View style={styles.redbox}>
                    <Text style={[styles.gentxt , styles.h1,{fontWeight:'700'}]}>نقبل الدفع بالطرق التاليه</Text>
                </View>

                <View style={styles.paysCont}>
                    <Image source = {require('../assets/images/asia-hawala.jpg')} style={styles.payimg}/>
                    <View style={{justifyContent:'space-between'}}>
                        <Image source = {require('../assets/images/paypal.png')} style={styles.payimg}/>
                        <Image source = {require('../assets/images/west-union.jpg')} style={styles.payimg}/>
                    </View>
                    <Image source = {require('../assets/images/zain.png')} style={styles.payimg}/>


                </View>

            </ScrollView>
         );
      }
}



const IMAGE_DIM = wp('25%');
const WIDTH  = wp('100%');
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.darkgrey,
    width: '100%' , 
    alignItems:'center',
    paddingHorizontal: wp('2%'),
    paddingBottom:hp('2%') 
  },
  img:{
    width: IMAGE_DIM,
    height: IMAGE_DIM,
    borderRadius: IMAGE_DIM/2,
    resizeMode:'cover',
  },
   
  thin_line:{
    height:1,
    backgroundColor:'lightgrey',
    marginVertical:10
  },
  gentxt:{
    marginStart:8,
    fontSize:16,
    color: colors.asher,
    fontWeight:'200',
    fontFamily:'space-mono',
    color: 'white'
  },
  h1:{
      fontSize:normalize(20),
  },
  h2:{
    fontSize:normalize(17),

  },
  redbox:{
      backgroundColor: colors.baseblue,
      height: hp('8%'),
      paddingVertical:hp('1%'),
      justifyContent:'center',
      alignItems:'center',
      width:'100%',
      marginTop:hp('1%')
  },
  payimg:{
      alignSelf:'center',
      width:wp('15%'),
      height:hp('8%'),
      resizeMode:'contain'
  },
  paysCont:{
      flexDirection: 'row',
      justifyContent:'space-around',
      width:'100%',
      height:hp('25%'),
      marginTop:hp('4%')
    }
});

