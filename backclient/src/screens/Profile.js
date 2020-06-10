import React, { Component } from 'react';
import {
    View,
    StyleSheet,ScrollView , Text,Image, TouchableOpacity
} from 'react-native';
import colors from '../constants/Colors'
import { connect } from 'react-redux';
import { CommonActions } from '@react-navigation/native';
import {LogOut} from '../actions/actions'
import Container from '../components/Container'
import LogoTitle from '../components/LogoTitle';
import Button from '../components/Button'
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import {FontAwesome, MaterialIcons} from '@expo/vector-icons';
import {clearVal} from '../functions/Storage'
class Profile extends Component {

    state={
        isLoading: false
    }

    constructor(props){
      super(props);
    }

   componentDidMount(){
         

    }
  
    logOutSuccess = ()=>{

        clearVal('userId');
        this.props.navigation.dispatch(
            CommonActions.reset({
            index: 1,
            routes: [
                {
                name: 'Sign',
                },
            ],
            })
        );
    }
    SignOut = ()=>{
        this.setState({isLoading:true});
        this.props.LogOut(this.logOutSuccess , ()=>{this.setState({isLoading:false})});
    }
    render(){
        const {name , balance, email} = this.props.user;
        return (
          <Container>
             <View style={{flex:1}}>
             <LogoTitle title ="الصفحه الشخصية" />
  
              <ScrollView style={{flex:1,}} >
                <View  style={styles.container}>
                  <View style={styles.infoCard}>
  
                      <Text style={{alignSelf:'center',fontSize: 18 , fontFamily:'space-mono' ,color:colors.black, fontWeight:'200'}}>حسابك</Text>
  
                      <View style={styles.thin_line}/>
                      <View style={styles.section}>
                          <View style={styles.icon_label}>
                            <MaterialIcons name="person-pin-circle" size={24} color={colors.baseblue}  />
                              <Text style={styles.label_txt}>الإسم</Text>
                          </View>
                          <Text style={styles.info_txt}>{name}</Text>
                      </View>
                      
                      <View style={styles.thin_line}/>
                      <View style={styles.section}>
                          <View style={styles.icon_label}>
                              <FontAwesome name='envelope-o' style={{fontSize:24, color: colors.baseblue}} />
                              <Text style={[styles.label_txt ]}>البريد الالكتروني</Text>
                          </View>
                          <Text style={[styles.info_txt, {fontWeight:'bold'}]}>{email}</Text>
                      </View>
  
                      <View style={styles.thin_line}/>
                      <View style={styles.section}>
                          <View style={styles.icon_label}>
                          <FontAwesome name="credit-card-alt" size={24} color={colors.baseblue} />
                          <Text style={styles.label_txt}>الرصيد</Text>
                          </View>
                          <Text style={[styles.info_txt, {fontWeight:'bold'}]}>{balance} $</Text>
  
                      </View>
  
                      <View style={styles.thin_line}/>

                      <TouchableOpacity onPress={()=>{this.props.navigation.navigate('Coupon')}}>
                            <Text style={styles.buycredit}>شراء رصيد</Text>
                      </TouchableOpacity>

                      {/*<View style = {styles.line}/>
                      
                      <TouchableOpacity onPress={()=>{this.props.navigation.navigate('ChangePassword')}}>
                            <Text style={[styles.buycredit,{color:colors.pink}]}>تغيير كلمة السر</Text>
                      </TouchableOpacity>*/}
  
                  </View>

                  <Button
                        width = {wp('30%')}
                        height= {hp('7%')}
                        title={"تسجيل الخروج"}
                        action = {this.SignOut} 
                        isLoading= {this.state.isLoading}
                        color = {colors.pink}

                        />
  
                  <View style = {styles.avatar}>
                  <Image source={require('../assets/images/icon.png')} style = {styles.av} />
  
                  </View>
                  </View>
                  
              </ScrollView>
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

export default connect( mapStateToProps, {LogOut })(Profile)



const IMAGE_DIM = wp('16%');
const WIDTH  = wp('100%');
const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    width: WIDTH , 
    height:'100%',
    marginTop: hp('5%'),
    marginBottom: hp('6%'),
    alignItems:'center',
  },
  av:{
    width: IMAGE_DIM,
    height: IMAGE_DIM,
    borderRadius: IMAGE_DIM/2,
    resizeMode:'cover'
  },
  avatar:{
    backgroundColor:'white',
      width: IMAGE_DIM,
      height: IMAGE_DIM,
      borderRadius: IMAGE_DIM/2,
      marginBottom: 15,
      position: 'absolute',
      ...Platform.select({
        ios: {
          shadowColor: 'black',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.1,
          shadowRadius: IMAGE_DIM/2,
        },
        android: {
          elevation: 20,
        },
      }),      
  },  
  infoCard:{
    borderRadius:5 ,
    width: (WIDTH- wp('14%')),
    marginBottom: 20,
    backgroundColor: colors.white,
    paddingTop: wp('12%'),
    paddingLeft:20,
    paddingRight:20,
    paddingBottom:20,
    marginTop: wp('7%'),
    elevation:3
  },
  callIcon:{
    width: 40,
    height: 40,
    borderRadius: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems:'center',
    backgroundColor:colors.main
  },
  couponInfo: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between',
    paddingHorizontal:wp('2%'),
  },
  thin_line:{
    height:1,
    backgroundColor:'lightgrey',
    marginVertical:10
  },
  icon_label:{
    flex:1,
    flexDirection: 'row',
  },
  label_txt:{
    marginStart:8,
    fontSize:16,
    color: colors.asher,
    fontWeight:'200',
    fontFamily:'space-mono'
  },
  label_icon:{
    marginRight:5,
  },
  info_txt:{
      color: colors.secondary,
      fontWeight:'300',
      fontSize:15,
      flex:1,
      textAlign:'center'
  },
  iconBtnStyle:{
    width:40 ,
    height:40 ,
    borderRadius:20,
    justifyContent:'center',
    alignItems: 'center'
  },
  buycredit:{
      color:colors.baseblue,
      fontSize:18, 
      fontWeight:'bold',
      alignSelf:'center',
      marginTop:hp('1%')
  },
  line:{
    backgroundColor: colors.baseblue,
    height: 1,
    marginVertical:hp('1%')
},
});

