import React , {Component} from 'react';
import {View , TouchableOpacity  , Text, Image, StyleSheet} from 'react-native';
import colors from '../constants/Colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default class Offline extends Component{
    render(){
      return (
            <View style={styles.offline_container}>
                <Text style={{marginTop: hp('2%') , fontSize:18 , color:'black'  }}>أنت غير متصل بالانترنت</Text>
            </View>
      );
    }
  }

  
  const styles = StyleSheet.create({
    offline_container:{
        flex:1, 
        backgroundColor:`${colors.red}85`,
        justifyContent: 'center' , 
        alignItems: 'center'
    }
  })