import React, { Component } from 'react';
import {
    View,
    StyleSheet,Button, Switch,Text, ScrollView, RefreshControl, TouchableOpacity
} from 'react-native';
import colors from '../constants/Colors'
import { connect } from 'react-redux';
import { CommonActions } from '@react-navigation/native';
import {getCurrentPricesByCountry} from '../actions/actions'
import CountryPicker from 'react-native-country-picker-modal'
import { heightPercentageToDP as hp  , widthPercentageToDP as wp} from 'react-native-responsive-screen';
import Countries from '../constants/countries';
import {setCountry , setService , setRent, getAvailablePhonesByCountry, getRentServices, getBuyServices} from '../actions/actions';
import {getAvailableRentCountries} from '../actions/actions';
import { moderateScale as normalize } from 'react-native-size-matters';

import LogoTitle from '../components/LogoTitle';
import Container from '../components/Container';
import RentCard from  '../components/RentCard';
import { Provider  } from 'react-native-paper';
import BuyCard from '../components/BuyCard';
import {getNewCost, convertRublesToDollars} from '../functions/funcs'
import * as d from '../constants/data'
import {HRS,DAYS , WEEKS , MONTHS} from '../constants/data'


class Home extends Component {

    state={
      num:0,
      selectedCardKey: '',
      rentServices: [],
      buyServices:{},
      refreshing:false,
      tab:0,

    }

    constructor(props){
      super(props);
      this.rentCountriesCodes = [];
      const {country , rent , service} = this.props;
      this.countryCodes = Object.keys(Countries);
      //getAvailableRentCountries((codes)=> this.rentCountriesCodes =codes);
      this.getBuyServices();
    }
   componentDidMount(){
 
    }
    
  
    setRentServices = (servs)=>{this.setState({rentServices: servs})}
    setBuyServices = (servs)=>{this.setState({buyServices: servs})};

    getRentServices = (cont)=>{
      let {country }= this.props;
      if(cont){
        country = cont;
        console.log('from country seelcted')
       }
      console.log('country selected is ', country);
      this.props.getRentServices(country,this.setRentServices, ()=>{this.setState({refreshing:false})}, ()=>console.log('failed fetching rent phones available'));
    }
    getBuyServices = (cont)=>{
      let {country }= this.props;
      if(cont){
         country = cont;
         console.log('from country seelcted')
        }
      this.props.getBuyServices(Countries[country], this.setBuyServices, ()=>{this.setState({refreshing:false})}, ()=>console.log('failed fetching buy phones available'));
    }

    _onRefreshRentServices = ()=>{
      this.setState({refreshing:true})
      this.getRentServices();
    }
    _onRefreshBuyServices = ()=>{
      this.setState({refreshing:true})
      this.getBuyServices();
    }
    setSelectedCardKey = (k)=>{
      this.setState({selectedCardKey:k})
    }


    onSelect = (country) => {
        const { rent } = this.props;
        const country_code = country.cca2;
        this.props.setCountry(country_code);
        console.log('country code is', country_code, Countries[country_code])
        if(rent){
            this.getRentServices(country_code);
        }else{
          this.getBuyServices(country_code);
        }
        //remove selected
        this.setState({selectedCardKey:''})
    }

    changeActionType = (val)=>{
      const { country } = this.props;

      //remove selected
      this.setState({selectedCardKey:''});
      this.props.setRent(val);
      if(val){
        this.props.setCountry('RU');// set country to default ru before getting services
        const  contr = this.props.country;
        this.getRentServices('RU');
      }else{
        this.getBuyServices();

      }
    }
    clickRent = ()=>{
      if(this.state.tab==1) return;
      const { country } = this.props;
      //remove selected
      this.setState({selectedCardKey:'', tab:1,});
      this.props.setRent(true);
      this.props.setCountry('RU');// set country to default ru before getting services
      const  contr = this.props.country;
      this.getRentServices('RU');
    }
    clickBuy = ()=>{
      if(this.state.tab==0) return;
      const { country } = this.props;
      //remove selected
      this.setState({selectedCardKey:'',tab:0,});
      this.props.setRent(false);
      this.getBuyServices();

    }
    
    render() {
      const {country , service ,rent , user} = this.props;
      const {rentServices ,buyServices, tab } = this.state;
      const buyServicesKeys = Object.keys(buyServices);

      return (
        <Provider>

        <View style={styles.container}>
            <LogoTitle title ="الرئيسية" left leftAction ={()=>{this.props.navigation.navigate('ServicesPage')}} />
            <Container>


            <View style ={styles.tabsCont}>
                    <TouchableOpacity style={[styles.tab1, tab?{backgroundColor: 'white'}:{backgroundColor: colors.baseblue}]} onPress= {this.clickBuy}>
                        <Text style={[styles.tabLabel ,tab?{color: colors.baseblue}:{color: 'white'}]}>حجز رقم تفعيل</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.tab2, tab?{backgroundColor: colors.baseblue}:{backgroundColor: 'white'}]} onPress= {this.clickRent}>
                        <Text style={[styles.tabLabel ,tab?{color: 'white'}:{color: colors.baseblue}]}>إيجار رقم</Text>
                    </TouchableOpacity>
                </View>
            <View style={{marginVertical: hp('2%'), alignSelf:'center'}}>

            {rent&&<CountryPicker
                  {...{
                    countryCode: country,
                    withFilter:true,
                    withFlag:true,
                    countryCodes:d.RENT_COUNTRIES,
                    withCountryNameButton:true,
                    onSelect:this.onSelect,
                  }}
                  
                />}
               {!rent&& 
                <CountryPicker
                  {...{
                    countryCode: country,
                    withFilter:true,
                    withFlag:true,
                    countryCodes:this.countryCodes,
                    withCountryNameButton:true,
                    onSelect:this.onSelect,
                  }}
                  
                />
                
                }
                
            </View>

            {/* rent services */
              rent&&
              <ScrollView style={{flex:1}}
                refreshControl={
                              <RefreshControl
                              refreshing={this.state.refreshing}
                              onRefresh={this._onRefreshRentServices}
                              />
                            } 
                >
                  {rentServices.map((rentItem, i)=>{
                    const bg = rentItem.count >25 ? colors.bluegrey : colors.lightpink
                      return (
                        <RentCard bg={bg} 
                        item = {rentItem}
                        setSelectedRentCard={this.setSelectedCardKey}
                        setRentServices = {this.setRentServices}
                        navigation={this.props.navigation}
                        selected = {rentItem.service==this.state.selectedCardKey} key={`${i}-key-${rentItem.service}`}/>
                      );
                  })}
                
              </ScrollView>
            }

            {/* buy services */
              !rent&&
              <ScrollView style={{flex:1}}
                refreshControl={
                                <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this._onRefreshBuyServices}
                                />
                            } 
                >
                    {buyServicesKeys.map((buyKey, i)=>{
                      const buyServ = buyServices[buyKey];
                      const cost  = Number(getNewCost(buyServ.cost)).toFixed(3)
                      const bg = buyServ.count >25 ? colors.bluegrey : colors.lightpink 
                      //console.log('old cost '+ buyServ.cost+' old cost in $ '+ convertRublesToDollars(buyServ.cost) + ' new cost : '+ cost)
                        return (
                          <BuyCard bg={bg} cost={cost} num={buyServ.count} serv={buyKey} setSelectedRentCard={this.setSelectedCardKey} navigation={this.props.navigation} selected = {buyKey==this.state.selectedCardKey} key={`${i}--${buyKey}`}/>
                        );
                    })}
                
              </ScrollView>
            }

            </Container>

        </View>
        </Provider>

      );
    
 
        
    }
}


const mapStateToProps = (state)=>{
  return {
    country: state.country,
    user:state.user,
    service: state.service,
    rent: state.rent,
    durationType: state.durationType,
    repeat: state.repeat
  }
}
export default connect( mapStateToProps, {setCountry , setService , setRent, getRentServices, getAvailablePhonesByCountry, getBuyServices })(Home)

const RADIUS =5;
const HEIGHT  =hp('8%');
const WIDTH = wp('35%');
const styles = StyleSheet.create({
    container:{
        flex:1, 
    },
    serviceCont:{
      flexDirection:'row',
      alignItems:'center',
      width:'100%',
      paddingHorizontal:wp('6%'),
      marginTop:hp('2%')

    },
    serviceLabelTxt:{
      color:'black',
      fontWeight:'bold',
      fontSize:18,
      flex:1,
    },
    serviceTxt:{
      color:colors.pink,
      fontSize:16,
      marginHorizontal:wp('2%'),
      fontWeight:'700'
    },
    tabsCont:{
      flexDirection:'row',
      marginVertical: hp('2%'),
      alignSelf:'center',
      ...Platform.select({
          ios: {
          shadowColor: 'black',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          },
          android: {
          elevation: 10,
          },
      }),
    },
    tab1:{
      justifyContent:'center',
      alignItems:'center',
      height:HEIGHT,
      width:WIDTH,
      borderRadius:HEIGHT/2,
      marginHorizontal:wp('2%')
    },
    tab2:{
      justifyContent:'center',
      alignItems:'center',
      height:HEIGHT,
      width:WIDTH,
      borderRadius:HEIGHT/2,
      marginHorizontal:wp('2%')
    },
    tabLabel:{
      fontSize: normalize(17),
      fontWeight:'bold'
    }
})

