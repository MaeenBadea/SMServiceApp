import React, { Component } from 'react';
import {
    View,
    StyleSheet , Text,Switch, ActivityIndicator ,FlatList,Clipboard,Alert, TouchableOpacity,TextInput,
    
} from 'react-native';
import colors from '../constants/Colors'
import { connect } from 'react-redux';
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import {FontAwesome, AntDesign, MaterialCommunityIcons} from '@expo/vector-icons';
import RoundedButton from '../components/RoundedButton';
import Services from '../constants/services';
import Images from '../constants/images'
import { deleteRentService,updateEndDate, deleteRentNumber ,activateRentNumber, getRentNumbersStatus, getMessagesOfNumber, renewRentNumber} from '../actions/actions';
import {changeBalance} from '../actions/actions';
import {moderateScale as normalize} from 'react-native-size-matters'
import * as d from '../constants/data';
import {timeSince, timeLeft, timeInRussiaNow} from '../functions/funcs'
import {getNewCost,} from '../functions/funcs'
import {HRS,DAYS , WEEKS, MONTHS } from '../constants/data'
import { Menu,  } from 'react-native-paper';
import {Overlay, CheckBox} from 'react-native-elements';


class RentActivation extends Component {
  
    _openphoneMenu = () => this.setState({ durationMenuVisible: true });
    _closephoneMenu = () => this.setState({ durationMenuVisible: false });
    state={
        isLoading: false,
        smscode:`\u2022`+`\u2022`+`\u2022`,
        timeLeft:'',
        enableReload:false,
        activated: false,
        messages:[],
        finished:false,
        repeat:'',
        overlayVisible: false,
        renewprice:0
    }
    getPrice = (repeat,type)=>{
      let days = 1;
      switch(type){
        case MONTHS:
          days = 30;
          break;
        case WEEKS:
          days = 7;
          break;
      }
      return  Number(getNewCost(this.props.item.price_day* repeat*days)).toFixed(3);
    }

    componentDidMount(){
         const {item, user, activated} = this.props;
        this.setState({phone: item.phone, activated})
        this.timeFunc();
        this.intervalId = setInterval( this.timeFunc, 1000 * 5* 60 );
    }
    timeFunc = ()=>{
      const {item, user} = this.props;
      const time = timeLeft(item.endDate) ;
      const endDatePassed = item.endDate <= Date.now() ;
      if(!endDatePassed) {
          this.setState({timeLeft:time });
      }
      else{
        //enable renew btn
        clearInterval(this.intervalId);
        this.props.deleteRentService(user , item , ()=>{console.log('successssssssss deleting rent act')});
        
      }
    } 

    setSelectedDuration = (duration)=>{
      //this.props.setDurationType(duration);
      this.setState({durationType: duration , repeat:1})
      this._closephoneMenu();
    }

   checkForMessages = ()=>{
      const {item, user} = this.props;
      this.setState({isLoading: true})
      this.props.getMessagesOfNumber(item.phoneId, this.stopRefresh, (messages)=>{
            this.setState({messages,})
      });
    }
   
    stopRefresh = ()=>{
      this.setState({isLoading: false})
    }
    

    cancelActivtion = ()=>{
      const {user, item} = this.props;
      this.props.deleteRentNumber(item.phoneId,()=>{
          this.props.deleteRentService(user , item , ()=>{console.log('successssssssss', this.props.user)});
      });
    }

    activateNumber = ()=>{
        const {user, item} = this.props;
        const inputs = {user, item};
        this.props.activateRentNumber(item.phoneId,inputs, (id)=>{
          console.log('successfully activated num ',id);
          this.setState({activated:true})
        });
    }

    renewNumber = ()=>{
      const {user ,item} = this.props;
      let {repeat, month} =this.state;
      repeat = parseInt(repeat);
      if(!repeat){
        return;
      };
      const dtype = month?MONTHS: WEEKS;
      const input = {id:item.phoneId ,repeat, dtype,};
      const price = this.getPrice(repeat, dtype);
      console.log('price token is ', price)
      if(user.balance>=price){
        this.props.renewRentNumber(input, ()=>{
          getRentNumbersStatus((servs)=>{
            const services = servs.filter(s=> item.phoneId==s.id);
            //const ww = 1000*60*60*24*7;
            const newuntil = services[0].until *1000 ;
            console.log('got new until which is are',new Date(newuntil))
            this.props.item.endDate = newuntil;
            this.setState({overlayVisible:false});
            this.timeFunc();
            //update endDate in db
            this.props.updateEndDate(newuntil, user , item )
          });
          this.props.changeBalance(user , -1 * price, ()=>{console.log('decreased user balance: ', user.balance)});
        });
      }else{
        this.alert()
      }
    }

    
  alert = ()=>{
      Alert.alert(
        '',
        'رصيدك غير كافي لإجراء هذه العملية',
        [
          {text: 'تخطي', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {text: 'شراء رصيد', onPress: () => {
            this.setState({overlayVisible:false})
            this.props.navigation.navigate('ProfileStack',{ screen: 'Coupon' });
            
          } },
        ],
        { cancelable: false }
      )
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
        const { balance, email} = this.props.user;
        
        const {service, phone, endDate , name} = this.props.item;
        //const {service} = this.props;
        //const {code, phone} = this.state;
        const {isLoading, messages, activated, overlayVisible } = this.state;
        const quantity = messages.length;

        return (
  
              <View style={styles.container}>
                  <View style={styles.infoCard}>
                      {this.props.canprolong&&<TouchableOpacity onPress={()=>{this.setState({overlayVisible:true})}}>
                        <View style={{flexDirection:'row', alignItems:'center', alignSelf:'flex-end'}}>
                        <Text style={{marginEnd:4,fontSize:normalize(12),color:colors.raven}}>تمديد صلاحية </Text>
                        <MaterialCommunityIcons name="clock-start" size={normalize(26)} color={colors.lightblue} />
                        </View>
                      </TouchableOpacity>}
                      <Text style={{alignSelf:'center',fontSize: 18 , fontFamily:'space-mono' ,color:colors.black, fontWeight:'200'}}>{name}</Text>
  
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

                      {!activated&&
                      <View style={{alignItems:'center', width:'100%'}}>
                        <RoundedButton 
                                extras ={{alignSelf:'center',marginVertical:hp('.5%')}}
                                title = {"تنشيط"}
                                width ={wp('25%')}
                                height= {ICON_BTN_DIM}
                                color = {colors.lightblue}
                                icon = "check"
                                action = {this.activateNumber}
                                />
                        </View>
                      }
                      {activated&&
                      <View style={{ alignItems:'center', width:'100%'}}>
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
                                icon = "reload1"
                                action = {this.checkForMessages}
                                />
                        </View>
                        </View>
                        }


                      </View>

                      <Overlay overlayStyle={styles.overlay} isVisible={overlayVisible} onBackdropPress={()=>{this.setState({overlayVisible:false})}}>
                        {this.renderRenewalComponent()}   
                      </Overlay>

                  </View>

                  
              </View>
  
            );
      }
      
      renderMessages = ({item, index})=>{
  
          return(
            <View style={styles.msgCont}>
                <Text style={styles.from}>من:    <Text style={styles.senderNum}>{item.sender}</Text></Text>
                <Text style= {styles.timesince}>منذ {timeSince(item.date)}</Text>
                <Text style= {styles.msg}>{item.text}</Text>
            </View>
          );
      }
      changeDType = (val)=>{
        this.setState({month:val});
        let {repeat} =this.state;
        repeat = parseInt(repeat);
        if(!repeat){
          return;
        };
        const dtype = val?MONTHS: WEEKS;
        const price = this.getPrice(repeat, dtype);
        this.setState({renewprice: price})
      }
      renderRenewalComponent = ()=>{
        const {repeat , durationType} = this.state;
        return (
          <View style={{flex:1,justifyContent:'center', alignItems:'center'}}>
                <Text style={styles.actTxt}>تمديد مدة إيجار الرقم</Text>

                <View style={{flexDirection:'row',justifyContent:'center', marginBottom:hp('2%')}}>
                  <CheckBox
                      center
                      title='اسبوع'
                      checkedIcon='dot-circle-o'
                      uncheckedIcon='circle-o'
                      checked={!this.state.month}
                      onPress={()=>this.changeDType(false)}
                    />
                  <CheckBox
                      center
                      title='شهر'
                      checkedIcon='dot-circle-o'
                      uncheckedIcon='circle-o'
                      checked={this.state.month}
                      onPress={()=>this.changeDType(true)}
                    />
                </View>
                <View style={[styles.incCont , {backgroundColor: colors.white}]}>
                            <TextInput style={styles.counter}
                             keyboardType="numeric"
                             maxLength={2}
                             onChangeText={this.calcPrice}
                              value= {repeat+""}/>
                          </View>
                <View style={[styles.icon_label, {justifyContent:'center'}]}>
                            <RoundedButton 
                                extras ={{alignSelf:'center',marginVertical:hp('.5%')}}
                                title = {"تمديد"}
                                width ={wp('25%')}
                                height= {ICON_BTN_DIM}
                                color = {colors.purple}
                                icon = "retweet"
                                action = {this.renewNumber}
                                />
                </View>
                <View style={{flexDirection:'row', alignItems:'center', alignSelf:'center'}}>
                        <Text style={{marginEnd:4,fontSize:normalize(16),color:colors.raven,fontWeight:'600'}}>السعر: </Text>
                        <Text style={{fontSize:normalize(16),color:'black',fontWeight:'bold' }}>{this.state.renewprice} $</Text>
                </View>
           </View>

        );
      }
      calcPrice = (txt)=>{
        this.setState({repeat:txt});
        const {item} = this.props;
      let {repeat, month} =this.state;
      repeat = parseInt(txt);
      if(!repeat){
        return;
      };
      const dtype = month?MONTHS: WEEKS;
      const price = this.getPrice(repeat, dtype);
      this.setState({renewprice: price})
      }
      renderEmptyComponent = ()=>{
        return(
          <View style={[styles.emptyComp]}>
              <Text style= {styles.nomsgsTxt}>ليس لديك اي رسائل بعد.</Text>
          </View>
        );
    }
      
}

const mapStateToProps = (state)=>{
    return {
        user: state.user
    }
}

export default connect( mapStateToProps, { deleteRentService,changeBalance, updateEndDate, deleteRentNumber ,activateRentNumber, getMessagesOfNumber, renewRentNumber})(RentActivation)


const ICON_BTN_DIM = hp('6.5%');
const IMAGE_DIM = wp('12%');
const WIDTH  = wp('100%');

const ICON_DIM = hp('4%');
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
    paddingTop: wp('5%'),
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
    marginBottom:hp('1%')
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
  },
   overlay:{
    width: wp('70%'),
    height:hp('40%')
  },

  ///////////////////////////////////
  incCont:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    paddingHorizontal:wp('2%'),
    marginBottom:hp('2%')
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
    width:wp('10%'),
    marginHorizontal:wp('2%')

  },
  icon:{
    width: ICON_DIM,
    height:ICON_DIM,
    marginStart: wp('1%'),
    alignSelf:'center'
  },
  actTxt:{
      color:'black',
      fontSize:normalize(18),
      fontWeight:'bold',
      alignSelf:'center',
      marginBottom:4
  },
  durationLabelTxt:{
    color:colors.raven,
    fontWeight:'bold',
    fontSize:normalize(16),
  },
});

