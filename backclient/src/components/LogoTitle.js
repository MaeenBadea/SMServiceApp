import React, { Component } from 'react';
import {View , StyleSheet , Text , TouchableOpacity, Image} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import colors from '../constants/Colors';
import {FontAwesome5, MaterialIcons} from '@expo/vector-icons';
import {} from '../actions/actions'
import {connect} from 'react-redux';
import { moderateScale as normalize } from 'react-native-size-matters';

 class LogoTitle extends Component {
    render() {
      const {action, title, canBack , left,  leftAction} = this.props;
        return (
            <View style={styles.header}>
                {canBack&&<TouchableOpacity style={{marginStart:5}} onPress = {action}>
                  <FontAwesome5 name={"arrow-right"} size = {hp('4%')} color={"white"}/>
                </TouchableOpacity>}
                  
                <Text style={styles.headerTitle}>{title}</Text>

                {left&&<TouchableOpacity style={{flex:1, alignItems:'flex-end'}} onPress={leftAction}>
                  <MaterialIcons name="move-to-inbox" size={normalize(28)} color="white" />

                </TouchableOpacity>}

            </View> 
          )
    }
}

const mapStateToProps = (state)=>{
  return ({
    main_color: state.main_color
  })
}
export default connect(mapStateToProps, {} )(LogoTitle);

const IMG_DIM = hp('5%')
const styles = StyleSheet.create({
 
    headerTitle:{
      fontSize:20,
      color: 'white',
      marginStart: wp('2%')
    },
    header:{
      width:'100%',
      flexDirection:'row',
      alignItems:'center',
      height:hp('8%'),
      backgroundColor:colors.baseblue,
      paddingHorizontal:wp('1.5%'),
      ...Platform.select({
        ios: {
          shadowColor: colors.blue,
          shadowOffset: { width: 10, height: -5 },
          shadowOpacity: 0.1,
          shadowRadius: 5,
        },
        android: {
          elevation: 20,
        },
      })
    },
    image:{
      width:IMG_DIM,
      height:IMG_DIM,
      resizeMode:'contain'

    }
});
