import React, { Component } from 'react';
import {
    View,
    StyleSheet,ScrollView , Text,Image, TouchableOpacity ,ActivityIndicator,Clipboard,Alert
} from 'react-native';
import colors from '../constants/Colors'
import { connect } from 'react-redux';
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import {FontAwesome,Feather, AntDesign} from '@expo/vector-icons';
import RoundedButton from '../components/RoundedButton';
import Services from '../constants/services';
import Images from '../constants/images'
import {deleteBuyService, deleteRentService, getBuyActivationStatus,changeBuyActivationStatus} from '../actions/actions';
import {changeBalance} from '../actions/actions';
import {moderateScale as normalize} from 'react-native-size-matters'

import {calcMintues} from '../functions/funcs';
import * as d from '../constants/data';

class BuyActivation extends Component {
  

    state={
        isLoading: false,
        smscode:`\u2022`+`\u2022`+`\u2022`,
        timeLeft:'',
        enableReload:false,
        activated: false,
    }

    constructor(props){
        super(props);
        
    }
    
    timeFunc = ()=>{
      const {item, user} = this.props;
      const startTime = item.start;
      const elapsedTime = 20 - calcMintues(startTime);
      if(elapsedTime>0) this.setState({timeLeft:elapsedTime });
      else{
        //delete 
        this.props.deleteBuyService(user , item , ()=>{console.log('successssssssss', this.props.user)});
        clearInterval(this.intervalId);
      }
      console.log('min left is ', this.state.timeLeft)
    } 

   componentDidMount(){
      const {item, fromBuy} = this.props;
      //check for status message if from buy
        this.setState({phone: item.phone, })
        this.timeFunc();
        this.intervalId = setInterval( this.timeFunc, 1000* 60);
    }

    getStatus = (fromReload)=>{
      const {item, user} = this.props;
      this.setState({isLoading: true})
      this.props.getBuyActivationStatus(item.phoneId, (data)=>{
        const res = data.split(":");
          if(res[0]==d.STATUS_OK){
            //got message update code str state
            //decrease balance , enable cancel/finish/reload
            //change checkbtn action
            const takeBalance = res[1]!=this.state.smscode; //take balance when codes aren't equal
            this.setState({enableReload: true, isLoading:false, smscode: res[1]});
            if(takeBalance){
              console.log('new  code taking balance')
              this.props.changeBalance(user , -1 * item.cost , ()=>{console.log('decreased user balance: ', user.balance)});
            }else{
              console.log('old code not taking balance')
            }
          }else if(res[0]==d.STATUS_WAIT_CODE){
            //fetch again after 1 second
            setTimeout(()=>{
              this.getStatus();
            },2000)
          }else if(res[0]==d.STATUS_WAIT_RETRY){
            //fetch again after 1 second
            setTimeout(()=>{
              this.getStatus();
            },2000)
          }
      }, this.stopRefresh);
    }
    reloadAgain = ()=>{
      const {phoneId} = this.props.item;
      this.setState({isLoading: true})
      this.props.changeBuyActivationStatus(phoneId, d.REQUEST_ANOTHER_CODE,(data)=>{
        this.setState({isLoading: false})
        if(data=="ACCESS_RETRY_GET"){
          this.alert('يمكنك القيام بعمليه تفعيل اخري')
          console.log('successful, waiting to recieve another sms');
        }else{
          this.alert('لا يمكنك القيام بهذه العمليه')
          console.log('reload failed');
        }
      });
      this.getStatus(true);
    }
    stopRefresh = ()=>{
      this.setState({isLoading: false})
    }

    cancelActivtion = ()=>{
      const {user, item} = this.props;
      this.props.changeBuyActivationStatus(item.phoneId, d.CANCEL_ACITIVATION,(data)=>{
        if(data=="ACCESS_CANCEL"|| data =="ACCESS_CONFIRM_GET" || data =="BAD_STATUS"){
          console.log('successful, successfully cancelled num');
          this.props.deleteBuyService(user , item , ()=>{console.log('successssssssss', this.props.user)});
        }else{
          console.log(' cancelling num failed');
        }
      });
    }

    completeActivation = ()=>{
      const {phoneId} =  this.props.item;
      this.props.changeBuyActivationStatus(phoneId, d.COMPLETE_ACITIVATION,(data)=>{
        if(data=="ACCESS_ACTIVATION"){
           this.cancelActivtion();
           console.log('successfully done change code 6')
        }else{
          this.cancelActivtion();
          console.log('not successfull changing code to 6');
        }
      });
    }
    activateNum = ()=>{
      const {phoneId} =  this.props.item;
      this.props.changeBuyActivationStatus(phoneId, d.ACTIVATE_NUM,(data)=>{
        if(data=="ACCESS_READY"){
           console.log('access is ready go');
           this.setState({activated: true})
        }else{
          console.log('failed to do access_ready 1');
        }
      });
      this.getStatus();
    }

 

    writeToClipboard = async (str, code) => {
        await Clipboard.setString(code);
        Alert.alert("",
         `تم نسخ ${str}`,
          [
            {text: 'حسنا', onPress: () => console.log('OK Pressed')},
          ],
          {cancelable: false},
        );
        
    }
    
    componentWillUnmount(){
      clearInterval(this.intervalId);
    }
    
    render(){
        const {name , balance, email} = this.props.user;
        const {service, phone } = this.props.item;
        //const {service} = this.props;
        //const {code, phone} = this.state;
        const {isLoading, activated} = this.state;
        return (
  
              <View style={styles.container}>
                  <View style={styles.infoCard}>
  
                      <Text style={{alignSelf:'center',fontSize: 18 , fontFamily:'space-mono' ,color:colors.black, fontWeight:'200'}}>{Services[service]}</Text>
  
                      <View style={styles.thin_line}/>
                      <View style={styles.section}>
                          <View style={styles.icon_label}>
                            <FontAwesome name="phone" size={22} color={colors.baseblue}  />
                              <Text style={styles.label_txt}>الرقم</Text>
                          </View>
                          <Text style={[styles.info_txt, {fontSize: normalize(14)}]}>{phone}</Text>
                      </View>
                      
                      <RoundedButton 
                      extras ={{alignSelf:'center',marginVertical:hp('.5%')}}
                      title = {"نسخ"}
                      width ={wp('25%')}
                      height= {hp('5%')}
                      color = {colors.green}
                      icon = "copy1"
                      action = {()=>{this.writeToClipboard('الرقم', phone)}}
                      />

                      <View style={styles.thin_line}/>
                      <View style={styles.section}>
                          <View style={styles.icon_label}>
                            <AntDesign name="clockcircleo" size={22} color={colors.baseblue}  />
                              <Text style={styles.label_txt}>الزمن</Text>
                          </View>
                          <Text style={styles.info_txt}>{this.state.timeLeft} د</Text>
                      </View>
                   
                      <View style={styles.thin_line}/>
                      <View style={styles.section}>
                          <View style={styles.icon_label}>
                            <Feather name="activity" size={22} color={colors.baseblue}  />
                            <Text style={styles.label_txt}>كود التفعيل</Text>
                          </View>
                          {!isLoading?
                          <Text style={[styles.info_txt, {fontWeight:'bold'}]}>{this.state.smscode}</Text>
                          :
                          <ActivityIndicator small color={colors.green}/>
                          }

                      </View>
  
                      <View style={styles.thin_line}/>

                      <View style={[styles.section, {marginTop:hp('1%')}]}>
                        <View style={styles.icon_label}>
                          {this.state.enableReload&&<RoundedButton 
                              extras ={{marginEnd: wp('3%')}}
                              width ={ICON_BTN_DIM}
                              height= {ICON_BTN_DIM}
                              color = {colors.blue}
                              icon = "reload1"
                              action = {this.reloadAgain}
                              />}
                            <RoundedButton 
                              extras ={{marginEnd: wp('2%')}}
                              width ={ICON_BTN_DIM}
                              height= {ICON_BTN_DIM}
                              color = {colors.red}
                              icon = "close"
                              action = {this.cancelActivtion}
                              />
                              {!activated&&
                                <RoundedButton 
                                    width ={ICON_BTN_DIM}
                                    height= {ICON_BTN_DIM}
                                    color = {colors.purple}
                                    icon = "check"
                                    action = {this.activateNum}
                                    />
                              }
                          
                        </View>
                        <RoundedButton 
                            extras ={{alignSelf:'center',marginVertical:hp('.5%')}}
                            title = {"نسخ"}
                            width ={wp('25%')}
                            height= {hp('5%')}
                            color = {colors.green}
                            icon ="copy1"
                            action = {()=>{this.writeToClipboard('الكود', this.state.smscode)}}
                            />
                          
                      </View>

                  </View>

  
                  <View style = {styles.avatar}>
                        <Image source={Images[service]} style = {styles.av}  />
                  </View>
                  
              </View>
  
            );
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
}

const mapStateToProps = (state)=>{
    return {
        user: state.user
    }
}

export default connect( mapStateToProps, { deleteBuyService, deleteRentService,changeBalance, getBuyActivationStatus, changeBuyActivationStatus})(BuyActivation)


const ICON_BTN_DIM = hp('6.5%');
const IMAGE_DIM = wp('12%');
const WIDTH  = wp('100%');
const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: "transparent",
    marginVertical: hp('1%'),
    alignItems:'center'
  },
  av:{
    width: IMAGE_DIM,
    height: IMAGE_DIM,
    borderRadius: IMAGE_DIM/2,
    resizeMode:'cover'
  },
  avatar:{
    
      width: IMAGE_DIM,
      height: IMAGE_DIM,
      backgroundColor:'white',
      borderRadius: IMAGE_DIM/2,
      marginBottom: 15,
      position: 'absolute',
      justifyContent:'center',
      alignItems:'center',
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
      textAlign:'center',
      fontFamily:'space-mono'
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
  }
});

