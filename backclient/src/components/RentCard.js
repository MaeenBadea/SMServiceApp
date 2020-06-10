import React, { Component } from 'react';
import {
    View,
    StyleSheet, Switch,Text, ScrollView,TouchableOpacity,TextInput,Image, Alert
} from 'react-native';
import colors from '../constants/Colors'
import { connect } from 'react-redux';
import { heightPercentageToDP as hp  , widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {} from '../actions/actions';
import { Menu,  } from 'react-native-paper';
import {AntDesign} from '@expo/vector-icons'
import Button from './Button';
import Services from '../constants/services'
import Images from '../constants/images';
import {setRepeat, setDurationType, getRentServices, addRentService,changeBalance,rentNumber} from '../actions/actions'
import {HRS,DAYS , WEEKS } from '../constants/data'
import Countries from '../constants/countries';

const DURATIONS =[
    {
      type:HRS,
      title: 'ساعات',
    },
    {
      type:DAYS,
      title:'أيام'
    },
    {
      type:WEEKS,
      title:'اسابيع'
    }
  ];

class RentCard extends Component {

    state={
      durationMenuVisible:false,
      isLoading:false,
      disabled: false
    }

    constructor(props){
      super(props);
    }
    _openphoneMenu = () => this.setState({ durationMenuVisible: true });
    _closephoneMenu = () => this.setState({ durationMenuVisible: false });

   componentDidMount(){
 
    }
    getTime = (repeat, type)=>{
      const { durationType} =this.props;
      let hrs =1;
      switch(type){
        case DAYS:
          hrs = 24;
          break;
        case WEEKS:
          hrs = 7*24;
          break;
      }
      return hrs* repeat;
    }
    

    getRentServices = (repeat, type)=>{
      const {country }= this.props;
      const time = this.getTime(repeat, type);
      const input = {country:Countries[country] , time };
      console.log('hours selected is ', time);
      console.log('hours selected is ', input);
      this.props.getRentServices(input,this.props.setRentServices, ()=>{this.setState({disabled:false})}, ()=>console.log('failed fetching rent phones available'));
    }
    setSelectedDuration = (duration)=>{
      this.props.setDurationType(duration);
      this.props.setRepeat(1)
      this.getRentServices(1, duration.type);
      this._closephoneMenu();
    }
    increaseNums = ()=>{
      const {repeat, durationType} =this.props;
      switch(durationType.type){
        case HRS:
          if(repeat==24) return ;
          break;
        case DAYS:
          if(repeat==14) return ;
          break;
        case WEEKS:
          if(repeat==2) return ;
          break;
      }
      this.setState({disabled:true})

      //this.setState({nums: nums +1})
      const newval = repeat + 1
      this.props.setRepeat(newval);
      this.getRentServices(newval, durationType.type);
    }
    decreaseNums = ()=>{
      const {repeat, durationType} =this.props;
      if(repeat==1) return ;
      this.setState({disabled:true})

      //this.setState({nums: this.state.nums -1})
      const newval = repeat -1
      this.props.setRepeat(newval);
      this.getRentServices(newval, durationType.type);
    }

    rentNumber = ()=>{
      this.setState({isLoading:true});
      const {serv, country, user, cost, repeat, durationType} = this.props;
      const time = this.getTime(repeat, durationType.type);
      const input = {service:serv ,country:Countries[country] , time };
      console.log('time is', time , cost)
      if(user.balance>=cost){
        this.props.rentNumber(input, this.stopRefresh, this.rentSuccessCB );
      }else{
        this.stopRefresh();
        this.alert()
      }
    }
    stopRefresh =()=>{
      this.setState({isLoading:false});
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

    rentSuccessCB = ({id , endDate,number})=>{
      console.log('successfully reg phone '+ id + `  ${endDate}`, number);
      const {serv ,cost , user } = this.props;
      const rentItem = {phoneId:id ,phone: `+${number}`, endDate,service:serv ,cost};
      this.props.changeBalance(user , -1* cost, ()=>{console.log('successfully updated balance',this.props.user)});
      this.props.addRentService(user , rentItem,  ()=>{
        console.log('successssssssss stored serv ind db', this.props.user);
        this.props.navigation.navigate('ServicesPage', {openTabRents:true,});
      })
    }
    render() {
      const {selected , serv ,num,cost, setSelectedRentCard, bg , repeat , durationType , user} = this.props;
      return (
        <View >
            <View>
                <TouchableOpacity onPress={()=>{setSelectedRentCard(serv)}} style={[styles.card_container , {backgroundColor:bg}]}>
                    <Text style={styles.price}>{cost} $</Text>
                    {selected&&!this.state.disabled&&<Button
                        width = {wp('22%')}
                        height= {BTN_HEIGHT}
                        title={"شراء"}
                        action = {this.rentNumber} 
                        isLoading= {this.state.isLoading}
                        disabled = {this.state.disabled}
                        />}
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                            <Text style={styles.numTxt}>{num} رقم</Text>
                            <Text style={styles.serviceTxt}>{Services[serv]}</Text>
                            <Image source = {Images[serv]} style={styles.icon}/>
                    </View>
                </TouchableOpacity>
                {selected&&
                <View style={{flexDirection:'row',justifyContent:'space-between', marginBottom:4}}>
                    <Text style={styles.actTxt}>اختر مدة التفعيل: </Text>

                    <View style={{flexDirection:'row'}}>
                      {/** duration selector */}
                      <Menu
                                  visible={this.state.durationMenuVisible}
                                  onDismiss={this._closephoneMenu}
                                  anchor={
                                    <TouchableOpacity style={styles.durationBtn} onPress={this._openphoneMenu}>
                                      <View style={styles.durationBtnView}>
                                          <AntDesign name={"caretdown"} size={14} color={colors.raven} />
                                          <Text style={styles.durationTxt}>{durationType.title}</Text>
                                      </View>
                                    </TouchableOpacity>
                                  }
                                  >
                                  {DURATIONS.map((c)=>{
                                      return(
                                          <Menu.Item onPress={()=>this.setSelectedDuration(c)} title={c.title} />

                                      )
                                  })}
                              
                              </Menu>
                        {/** */}
                        <View style={[styles.incCont , {backgroundColor: bg}]}>
                          <TouchableOpacity onPress={this.increaseNums}>
                            <AntDesign name="plus" size={20} color={colors.raven} />
                          </TouchableOpacity>
                          <TextInput style={styles.counter} editable={false} value= {repeat+""}/>
                          <TouchableOpacity onPress={this.decreaseNums}>
                            <AntDesign name="minus" size={20} color={colors.raven} />
                          </TouchableOpacity>
                        </View>
                    </View>
                    
                </View>

                }
            </View>
        </View>
      );
    
 
        
    }
}


const mapStateToProps = (state)=>{
  return {
    user:state.user,
    rent: state.rent,
    repeat: state.repeat, 
    durationType: state.durationType,
    country: state.country
    
  }
}
export default connect( mapStateToProps, { rentNumber, setRepeat, setDurationType ,getRentServices,addRentService,rentNumber, changeBalance})(RentCard)

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
    incCont:{
      flexDirection:'row',
      alignItems:'center',
      backgroundColor:'red',
      borderBottomStartRadius:5,
      borderBottomEndRadius:5,
      width: wp('26%'),
      justifyContent:'center',
      height:hp('6%'),
      paddingHorizontal:wp('2%')
    },
    durationBtn:{
    },
    durationBtnView:{
      elevation:5,
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'center',
      backgroundColor:'white',
      borderRadius:4,
      width: wp('20%'),
      height:hp('6.5%'),
      marginHorizontal:wp('2%')
    },
    durationTxt:{
        color:colors.raven,
        fontSize:14,
        marginStart:wp('1%')
    },
    counter:{
      backgroundColor:'white',
      textAlign:'center',
      borderRadius:5,
      borderWidth:1,
      borderColor:colors.raven,
      width:wp('7%'),
      marginHorizontal:wp('2%')

    },
    icon:{
      width: ICON_DIM,
      height:ICON_DIM,
      marginStart: wp('1%'),
      alignSelf:'center'
    },
    actTxt:{
        color:colors.raven,
        fontSize:16,
        fontWeight:'700',
        alignSelf:'center'
    }
})

