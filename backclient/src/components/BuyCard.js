import React, { Component } from 'react';
import {
    View,
    StyleSheet,Text,TouchableOpacity,Image,Alert, ToastAndroid
} from 'react-native';
import colors from '../constants/Colors'
import { connect } from 'react-redux';
import {rentNumber} from '../actions/actions'
import { heightPercentageToDP as hp  , widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {} from '../actions/actions';
import Button from './Button';
import Services from '../constants/services'
import Countries from '../constants/countries'
import Images from '../constants/images'
import {buyNumber,addBuyService } from '../actions/actions';
import * as d from '../constants/data';

function myStopFunction() {
    clearInterval(myVar);
  }
class RentCard extends Component {

    state={
      nums:1,
      isLoading:false,
    }

    constructor(props){
      super(props);
    }
    

   componentDidMount(){
 
   }

    buyNumber = ()=>{
      this.setState({isLoading:true});
      const {serv, country, user, cost} = this.props;
      if(user.balance>=cost){
        this.props.buyNumber({service:serv, country: Countries[country]}, this.stopRefresh, this.buySuccessCB, this.noNumsCB );
      }else{
        this.stopRefresh();
        this.alert()
      }
    }
    noNumsCB = ()=>{
      ToastAndroid.show("عفوا لايوجد ارقام متاحة حاليا لهذه الخدمة", ToastAndroid.LONG);
    }

    alert = ()=>{
      Alert.alert(
        '',
        'رصيدك غير كافي لإجراء هذه العملية',
        [
          {text: 'تخطي', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {text: 'شراء رصيد', onPress: () => this.props.navigation.navigate('ProfileStack',{ screen: 'Coupon' })},
        ],
        { cancelable: false }
      )
    }

    buySuccessCB = ({id , phone})=>{
      console.log('successfully reg phone '+ id, phone);
      const {serv ,cost , user} = this.props;
      const buyItem = {phoneId:id ,phone: `+${phone}`,  start: Date.now(),service:serv ,cost  };
      this.props.addBuyService(user , buyItem,  (sid)=>{
        console.log('successssssssss stored serv ind db', this.props.user);
        this.props.navigation.navigate('ServicesPage', {fromBuyServ: sid});
      }, this.stopRefresh)
    }

    stopRefresh =()=>{
        this.setState({isLoading:false});
    }
    
    render() {
      const {selected , serv ,num,cost, setSelectedRentCard , bg  , user} = this.props;
      return (
            <View>
                <TouchableOpacity onPress={()=>{setSelectedRentCard(serv)}} style={[styles.card_container , {backgroundColor:bg}]}>
                    <Text style={styles.price}>{cost} $</Text>
                    {selected&&<Button
                        width = {wp('22%')}
                        height= {BTN_HEIGHT}
                        title={"شراء"}
                        action = {this.buyNumber} 
                        isLoading= {this.state.isLoading}
                        />}
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                            <Text style={styles.numTxt}>{num} رقم</Text>
                            <Text style={styles.serviceTxt}>{Services[serv]}</Text>
                            <Image source = {Images[serv]} style={styles.icon}/>
                    </View>
                </TouchableOpacity>
               
            </View>
      );
    
 
        
    }
}


const mapStateToProps = (state)=>{
  return {
    user:state.user,
    country:state.country
  }
}
export default connect( mapStateToProps, { buyNumber, addBuyService })(RentCard)

const CARD_HEIGHT = hp('8%');
const BTN_HEIGHT = CARD_HEIGHT - hp('2%');
const ICON_DIM = CARD_HEIGHT - hp('4%');
const styles = StyleSheet.create({
    card_container:{
        width:wp('100%'),
        height: CARD_HEIGHT,
        flexDirection:'row',
        paddingHorizontal: wp('3%'),
        alignItems:'center',
        justifyContent:'space-between'
    },
    price:{
        color:colors.raven,
        fontSize:16,
        fontWeight:'bold',
    },
    numTxt:{
        color:colors.asher,
        fontSize:13,
        marginEnd:wp('3%'),
        alignSelf:'flex-end'
    },
    serviceTxt:{
        color:'black',
        fontSize:16,
        fontWeight:'700',
    },
    icon:{
      width: ICON_DIM,
      height:ICON_DIM,
      marginStart: wp('1%'),
      alignSelf:'center'
    }
})

