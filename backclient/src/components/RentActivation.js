import React, { Component } from 'react';
import {
    View,
    StyleSheet,ScrollView , Text,Image, ActivityIndicator ,FlatList,Clipboard,Alert
} from 'react-native';
import colors from '../constants/Colors'
import { connect } from 'react-redux';
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import {FontAwesome, AntDesign} from '@expo/vector-icons';
import RoundedButton from '../components/RoundedButton';
import Services from '../constants/services';
import Images from '../constants/images'
import { deleteRentService, getRentStatus,changeRentStatus} from '../actions/actions';
import {changeBalance} from '../actions/actions';
import {moderateScale as normalize} from 'react-native-size-matters'
import * as d from '../constants/data';
import {timeSince, timeLeft, timeInRussiaNow} from '../functions/funcs'

class RentActivation extends Component {
  

    state={
        isLoading: false,
        smscode:`\u2022`+`\u2022`+`\u2022`,
        timeLeft:'',
        enableReload:false,
        activated: false,
        messages:[],
        quantity:0
    }

    componentDidMount(){
         const {item, user} = this.props;
        this.setState({phone: item.phone, })
        this.timeFunc();
        this.intervalId = setInterval( this.timeFunc, 1000 * 5* 60);
    }
    timeFunc = ()=>{
      const {item, user} = this.props;
      const time = timeLeft(item.endDate.replace(' ', 'T')) ;
      const endDatePassed = new Date(item.endDate.replace(' ', 'T')) <= timeInRussiaNow() ;
      if(!endDatePassed) {
          this.setState({timeLeft:time });
      }
      else{
        //delete 
        clearInterval(this.intervalId);
        this.props.deleteRentService(user , item , ()=>{console.log('successssssssss deleting rent act')});
      }
    } 

  

   startCheckingStatus = ()=>{
      const {item, user} = this.props;
      this.setState({isLoading: true})
      this.props.getRentStatus(item.phoneId, this.stopRefresh, (messages, quantity)=>{
            this.setState({messages, quantity})
      });
    }
   
    stopRefresh = ()=>{
      this.setState({isLoading: false})
    }
    

    cancelActivtion = ()=>{
      const {user, item} = this.props;
      this.props.changeRentStatus(item.phoneId, d.RENT_FINISH,()=>{
          console.log('calling this part')
          this.props.deleteRentService(user , item , ()=>{console.log('successssssssss', this.props.user)});
      });
    }

    finishActivation = ()=>{
      const {user, item} = this.props;
      this.props.changeBuyActivationStatus(item.phoneId, d.RENT_FINISH,(data)=>{
        this.props.deleteRentService(user , item , ()=>{console.log('successssssssss', this.props.user)});
      });
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
        
        const {service, phone, endDate } = this.props.item;
        //const {service} = this.props;
        //const {code, phone} = this.state;
        const {isLoading, activated, quantity} = this.state;
    
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
                          <Text style={styles.info_txt}>{this.state.timeLeft}</Text>
                      </View>
                   
                      <View style={styles.thin_line}/>
                      <View style={[styles.section, {marginBottom:hp('2%')}]}>
                          <View style={styles.icon_label}>
                            <AntDesign name="message1" size={22} color={colors.baseblue}  />
                              <Text style={styles.label_txt}>الرسائل</Text>
                          </View>
                          {isLoading&&<ActivityIndicator small color={colors.lightgreen}/>}
                          {!isLoading&&<Text style={[styles.info_txt, {fontSize: normalize(14),color:quantity>0?colors.green:colors.pink}]}>{quantity}</Text>}

                      </View>
                      
                      <FlatList 
                        data= {this.state.messages}
                        renderItem= {this.renderMessages}
                        horizontal
                        ListEmptyComponent={this.renderEmptyComponent}
                      />
                      
  

                      <View style={[styles.section, {marginTop:hp('1%'),}]}>
                        <View style={[styles.icon_label, {justifyContent:'center'}]}>
                          
                            <RoundedButton 
                              extras ={{marginEnd: wp('10%')}}
                              width ={ICON_BTN_DIM}
                              height= {ICON_BTN_DIM}
                              color = {colors.red}
                              icon = "close"
                              action = {this.cancelActivtion}
                              />
                           
                            <RoundedButton 
                                extras ={{alignSelf:'center',marginVertical:hp('.5%')}}
                                title = {"تحديث"}
                                width ={wp('25%')}
                                height= {ICON_BTN_DIM}
                                color = {colors.purple}
                                icon = "retweet"
                                action = {this.startCheckingStatus}
                                />
                              
                          
                        </View>

                      </View>

                  </View>

  
                  <View style = {styles.avatar}>
                        <Image source={Images[service]} style = {styles.av}  />
                  </View>
                  
              </View>
  
            );
      }
      renderMessages = ({item, index})=>{
         
          return(
            <View style={styles.msgCont}>
                <Text style={styles.from}>من:    <Text style={styles.senderNum}>{item.phoneFrom}</Text></Text>
                <Text style= {styles.timesince}>منذ {timeSince(item.date.replace(' ', 'T'))}</Text>
                <Text style= {styles.msg}>{item.text}</Text>
            </View>
          );
      }
      renderEmptyComponent = ()=>{
        return(
          <View style={[styles.emptyComp]}>
              <Text style= {styles.nomsgsTxt}>ليس لديك اي رسائل بعد.</Text>
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

export default connect( mapStateToProps, { deleteRentService,changeBalance, getRentStatus, changeRentStatus})(RentActivation)


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
  },
  msgCont:{
      backgroundColor: colors.lightasher,
      marginVertical:hp('1%'),
      paddingVertical:hp('.5%'),
      paddingHorizontal:wp('1%'),
      width:wp('70%'),
      marginHorizontal:wp('1%')
  },
  from:{
    color: colors.raven,
    fontWeight:'300',
    fontSize:normalize(17),
    fontWeight:'bold',
  },
  senderNum:{
    color: colors.baseblue,
    fontWeight:'bold',
    fontSize:normalize(15),
  },
  timesince:{
    color: colors.green,
    fontSize:normalize(12),
  },
  msg:{
    color: colors.raven,
    fontWeight:'300',
    fontSize:normalize(13),
    flex:1,
    textAlign:'center',
    fontFamily:'space-mono',
  },
  emptyComp:{
    backgroundColor: colors.lightasher,
    height: hp('16%'),
    marginVertical:hp('1%'),
    width:wp('70%'),
    marginHorizontal:wp('1%'),
    justifyContent:'center',
    alignItems:'center'
  },
  nomsgsTxt:{
    color: colors.raven,
    fontWeight:'400',
    fontSize:normalize(14),
  }
});

