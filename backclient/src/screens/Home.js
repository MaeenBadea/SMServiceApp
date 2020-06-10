import React, { Component } from 'react';
import {
    View,
    StyleSheet,Button, Switch,Text, ScrollView, RefreshControl
} from 'react-native';
import colors from '../constants/Colors'
import { connect } from 'react-redux';
import { CommonActions } from '@react-navigation/native';
import {getCurrentPricesByCountry} from '../actions/actions'
import CountryPicker from 'react-native-country-picker-modal'
import { heightPercentageToDP as hp  , widthPercentageToDP as wp} from 'react-native-responsive-screen';
import Countries from '../constants/countries';
import {setCountry , setService , setRent, getAvailablePhonesByCountry, getRentServices, getBuyServices} from '../actions/actions';
import LogoTitle from '../components/LogoTitle';
import Container from '../components/Container';
import RentCard from  '../components/RentCard';
import { Provider  } from 'react-native-paper';
import BuyCard from '../components/BuyCard';
import {getNewCost, convertRublesToDollars} from '../functions/funcs'
import * as d from '../constants/data'
import {HRS,DAYS , WEEKS } from '../constants/data'


class Home extends Component {

    state={
      num:0,
      selectedCardKey: '',
      rentServices: {},
      buyServices:{},
      refreshing:false,

    }

    constructor(props){
      super(props);
      const {country , rent , service} = this.props;
      this.countryCodes = Object.keys(Countries);
      this.rentCountryCodes = Object.keys(d.RENT_COUNTRIES);
      this.getBuyServices();
    }
   componentDidMount(){
 
    }
    
    getTime = ()=>{
      const {repeat , durationType} =this.props;
      let hrs =1;
      switch(durationType.type){
        case DAYS:
          hrs = 24;
          break;
        case WEEKS:
          hrs = 7*24;
          break;
      }
      return hrs* repeat;
    }
    setRentServices = (servs)=>{this.setState({rentServices: servs})}
    setBuyServices = (servs)=>{this.setState({buyServices: servs})};

    getRentServices = (cont)=>{
      let {country }= this.props;
      if(cont){
        country = cont;
        console.log('from country seelcted')
       }
      const time = this.getTime();
      const input = {country:Countries[country] , time };
      console.log('hours selected is ', time);
      console.log('hours selected is ', input);
      this.props.getRentServices(input,this.setRentServices, ()=>{this.setState({refreshing:false})}, ()=>console.log('failed fetching rent phones available'));
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
    
    render() {
      const {country , service ,rent , user} = this.props;
      const {rentServices ,buyServices } = this.state;
      const rentServicesKeys = Object.keys(rentServices);
      const buyServicesKeys = Object.keys(buyServices);
      return (
        <Provider>

        <View style={styles.container}>
            <LogoTitle title ="الرئيسية" left leftAction ={()=>{this.props.navigation.navigate('ServicesPage')}} />
            <Container>

            <View style={styles.serviceCont}>
                <Text style={styles.serviceLabelTxt}>الخدمة: </Text>
                <View style={{flex:4,flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                    <Text style={styles.serviceTxt}>شراء لمدة</Text>
                    <Switch style={{marginHorizontal: wp('2%')}} onValueChange={this.changeActionType} value={rent}/>
                    <Text style={styles.serviceTxt}>تفعيل</Text>
                </View>
            </View>
            <View style={{marginVertical: hp('2%'), alignSelf:'center'}}>

            {rent&&<CountryPicker
                  {...{
                    countryCode: country,
                    withFilter:true,
                    withFlag:true,
                    countryCodes:this.rentCountryCodes,
                    withCountryNameButton:true,
                    onSelect:this.onSelect,
                  }}
                  visible
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
                  visible
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
                  {rentServicesKeys.map((rentKey, i)=>{
                    const rentServ = rentServices[rentKey];
                    //console.log('rent key', rentKey)
                    const cost  = Number(getNewCost(rentServ.cost)).toFixed(3)
                    const bg = rentServ.quant >25 ? colors.bluegrey : colors.lightpink
                      return (
                        <RentCard bg={bg} cost={cost} num={rentServ.quant}
                        serv={rentKey}
                        setSelectedRentCard={this.setSelectedCardKey}
                        setRentServices = {this.setRentServices}
                        navigation={this.props.navigation}
                        selected = {rentKey==this.state.selectedCardKey} key={`${i}-key-${rentKey}`}/>
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
    }
})

