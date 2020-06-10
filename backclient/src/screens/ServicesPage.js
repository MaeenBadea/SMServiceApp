import React, { Component } from 'react';
import {
    View,
    StyleSheet,FlatList , Text, TouchableOpacity ,ActivityIndicator,RefreshControl
} from 'react-native';
import colors from '../constants/Colors'
import { connect } from 'react-redux';
import { CommonActions } from '@react-navigation/native';
import Container from '../components/Container'
import LogoTitle from '../components/LogoTitle';
import Button from '../components/Button'
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import {FontAwesome,Feather,  MaterialIcons, AntDesign, FontAwesome5} from '@expo/vector-icons';
import RoundedButton from '../components/RoundedButton';
import Services from '../constants/services';
import Images from '../constants/images';
import { moderateScale as normalize } from 'react-native-size-matters';
import BuyActivation from '../components/BuyActivation'
import RentActivation from '../components/RentActivation'
import {getUser, deleteBuyService, deleteRentService} from '../actions/actions';
import {calcMintues, timeInRussiaNow} from '../functions/funcs'
class ServicesPage extends Component {

    state={
        refreshing: false,
        tab:0,
        
    }

    componentDidMount(){
        this.props.route.params?.openTabRents?this.setState({tab:1}):{};
        console.log('params passed ', this.props.route.params)
    }


    _onRefreshServices = ()=>{
        const {uid} = this.props.user;
        this.setState({refreshing:true});
        this.props.getUser(uid, ()=>{this.setState({refreshing:false})});
    }
    
    render(){
        const {buys , rents} = this.props.user;
        const {tab} = this.state;

        return (    
            <Container>
                <View style={{flex:1}}>
                <LogoTitle title ="الخدمات" canBack action= {()=>{this.props.navigation.goBack()}} />

                <View style ={styles.tabsCont}>
                    <TouchableOpacity style={[styles.tab1, tab?{backgroundColor: 'white'}:{backgroundColor: colors.baseblue}]} onPress= {()=>{this.setState({tab:0})}}>
                        <Text style={[styles.tabLabel ,tab?{color: colors.baseblue}:{color: 'white'}]}>تفعيل</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.tab2, tab?{backgroundColor: colors.baseblue}:{backgroundColor: 'white'}]} onPress= {()=>{this.setState({tab:1})}}>
                        <Text style={[styles.tabLabel ,tab?{color: 'white'}:{color: colors.baseblue}]}>شراء لمدة</Text>
                    </TouchableOpacity>
                </View>

                {!tab?<FlatList
                        refreshControl={
                            <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefreshServices}
                            />
                        } 
                        data={this.formatBuyServices(buys)}
                        renderItem={this.renderBuyService}    
                        showsVerticalScrollIndicator={false}
                    />:
                    <FlatList
                        refreshControl={
                            <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefreshServices}
                            />
                        } 
                        data={this.formatRentServices(rents)}
                        renderItem={this.renderRentService}    
                        showsVerticalScrollIndicator={false}
                    />
                    }
                </View>
                    
    
            </Container>
        );
      }
      renderBuyService = ({item, index})=>{
        return (
            <BuyActivation item = {item} fromBuy={ this.props.route.params?.fromBuyServ===item.sid} key={`{item.sid}-key-${index}`}/>
        );
      }
      renderRentService = ({item, index})=>{
        const thing = {
            service:'ig',
            id: 'sth',
            cost: .7,
            phone: '+926622193',
            sid:'kdfkdljf',
            endDate: Date.now() + 10*60*1000,
            durationType: 'hrs'
        };
        return (
            <RentActivation item = {item} key={`key-${index}`}/>
        );
    }
    formatBuyServices = (items)=>{
        const {user} = this.props;
        let servs = [];
        for(let serk in items){
            const serv = items[serk];
            const mintuesPassed = calcMintues(serv.start);
            if(mintuesPassed < 20)servs.push(serv);   
            else{
                console.log('time passed deleting rent num')
                this.props.deleteBuyService(user , serv , ()=>{console.log('successssssssss deleting buy service', this.props.user)});
            }
        }
        return servs;
    }
    formatRentServices = (items)=>{
        const {user} = this.props;
        const now = timeInRussiaNow();
        let servs = [];
        for(let serk in items){
            const serv = items[serk];
            const endDate = new Date (serv.endDate.replace(' ', 'T'));
            const endDatePassed = endDate <= now ;
            if(!endDatePassed) {
                servs.push(serv);
                console.log('not passed')
            }   
            else{
                console.log('passed');
                this.props.deleteRentService(user , serv , ()=>{console.log('successfull delet of rent service page')});
            }
        }
        return servs;
    }
    
}



const mapStateToProps = (state)=>{
    return {
        user: state.user
    }
}


export default connect( mapStateToProps, {getUser, deleteBuyService, deleteRentService})(ServicesPage)


const ICON_BTN_DIM = hp('6.5%');
const IMAGE_DIM = wp('12%');
const WIDTH  = wp('100%');
const RADIUS =5;
const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: "transparent",
    width: WIDTH , 
    marginTop: hp('10%'),
    marginBottom: hp('1%'),
    alignItems:'center'
  },
  tabsCont:{
    flexDirection:'row',
    width: wp('60%'),
    height: hp('7%'),
    marginVertical: hp('4%'),
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
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    borderTopStartRadius:RADIUS,
    borderBottomStartRadius:RADIUS
  },
  tab2:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    borderTopEndRadius: RADIUS,
    borderBottomEndRadius: RADIUS
  },
  tabLabel:{
    fontSize: normalize(17),
    fontWeight:'600'
  }
  

  
});

