import React, { Component } from 'react';
import {View , StyleSheet , TouchableOpacity , Text, ActivityIndicator} from 'react-native';
import colors from '../constants/Colors';
import { heightPercentageToDP as hp  , widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {AntDesign} from '@expo/vector-icons'
export default class CustomButton extends Component {


  handlePress = () => {
    const { action } = this.props;
    action();
  };
    render() {
        const {width , height , title, icon , action  ,color, extras} = this.props;
        const radius = height/2;
        return (
          <TouchableOpacity
          onPress={this.handlePress}>
          <View style={[styles.btn, {width , height, backgroundColor: color,  borderRadius:radius, ...extras}]}>
             {title&&<Text style={styles.txt}>{title}</Text>} 
             <AntDesign name={icon} size={20} color="white" />
          </View>
        </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    btn:{
        flexDirection:'row',
      padding: 8,
      height: Platform.OS === 'ios' ? 35 : 40,
      overflow: 'hidden',
      justifyContent:'center',
      alignItems:'center',
      ...Platform.select({
        ios: {
          shadowColor: 'black',
          shadowOffset: { width: 8, height: -5 },
          shadowOpacity: 0.1,
          shadowRadius: 5,
        },
        android: {
          elevation: 8,
        },
      })
    },
    txt:{
        color: colors.white,   
        marginEnd:5
    }
});
