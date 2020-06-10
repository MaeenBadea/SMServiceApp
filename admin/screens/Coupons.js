import React, { Component } from 'react';
import {
    View,
    StyleSheet,FlatList , Text, TouchableOpacity ,ActivityIndicator,RefreshControl,Clipboard,ToastAndroid
} from 'react-native';
import colors from '../constants/Colors'
import Container from '../components/Container'
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {getCoupons , deleteCoupon} from '../actions/actions'
import {MaterialIcons} from '@expo/vector-icons'
export default class Coupons extends Component {

    state={
        refreshing: false,
        coupons: []        
    }

    componentDidMount(){
        this._onRefreshServices();
    }

    copy = async (str)=>{
        await Clipboard.setString(str);
        ToastAndroid.show("تم نسخ الكوبون", ToastAndroid.SHORT);

    }
    _onRefreshServices = ()=>{
        this.setState({refreshing:true});
        getCoupons(()=>{this.setState({refreshing:false})},(snapshots)=>{
            let coupons = [];
            //convert the snapshot (json object) to array
            snapshots.forEach(function (childSnapshot) {
                    const item = childSnapshot.val();
                    item.key = childSnapshot.key;
                    coupons.push(item);
            });
            coupons.reverse();
            this.setState({coupons})
        });
    }
    deleteCoupon = (coup, index)=>{
        let {coupons} = this.state;
        deleteCoupon(coup, ()=>{
            console.log('coupons before', index)
            coupons.splice(index, 1,);
            console.log('coupons after', coupons)
            this.setState({coupons})
        });
    }
    
    render(){

        return (    
            <Container>
                <View style={{flex:1, paddingTop: hp('3%')}}>

                    <FlatList
                        refreshControl={
                            <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefreshServices}
                            />
                        } 
                        contentContainerStyle={{alignItems:'center'}}
                        data={this.state.coupons}
                        renderItem={this.renderCoupon}    
                        showsVerticalScrollIndicator={false}
                    />
                    
                </View>
                    
    
            </Container>
        );
      }
      renderCoupon = ({item, index})=>{
          
        return (
            <View style ={styles.couponCont}>
                <View style= {{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={styles.code}>{item.str}</Text>
                    <TouchableOpacity onPress = {()=>this.deleteCoupon(item.str, index)}>
                        <MaterialIcons name="delete" size={24} color={colors.red} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.valTxt}>{item.val} $</Text>
                <TouchableOpacity style={styles.btn} onPress={()=>this.copy(item.str)}>
                    <Text style={{color:'white'}}>نسخ</Text>
                </TouchableOpacity>

            </View>
        );
      }
    
    
  
    
}


const ICON_BTN_DIM = hp('5%');

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: "transparent",
  },
  couponCont:{
        width: wp('80%'),
        paddingHorizontal: wp('3%'),
        paddingVertical: hp('2%'),
        backgroundColor: colors.lightasher,
        marginVertical: hp('1%')
  },
  code:{
    color:'black',
    fontSize: 18,
    fontWeight:'bold'
  },
  btn:{
    backgroundColor:colors.green,
    width: wp('20%'),
    alignSelf:'center',
    height:ICON_BTN_DIM,
    borderRadius: ICON_BTN_DIM/2,
    justifyContent:'center',
    alignItems:'center'
  },
  valTxt:{
    color:'black',
    fontSize: 16,
    fontWeight:'700',
    alignSelf:'center',
    marginBottom:hp('1%')
  }
  
  
});

