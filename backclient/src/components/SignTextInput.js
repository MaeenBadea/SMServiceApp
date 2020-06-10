import React, { Component } from 'react';
import {View , StyleSheet , TextInput} from 'react-native';
import colors from '../constants/Colors'
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
export default class SignTxtInput extends Component {
    render() {
      const {editable} = this.props;
        return (
            <TextInput style  = {[styles.container , {width: this.props.width, height: this.props.height ,textAlign: this.props.alignLeft?"left":'auto'}]}
              keyboardType={this.props.numeric?'numeric':'default'}
              onChangeText = {this.props.onChangeText}
              value = {this.props.value}
              secureTextEntry={this.props.secure}
              placeholder = {this.props.placeholder}
              editable={editable}
              selectTextOnFocus={editable} 
             >
            </TextInput>
        )
    }
}


const styles = StyleSheet.create({
    container:{
        paddingHorizontal:8,
        height: hp('3.5%'),
        borderRadius: 5,
        backgroundColor: colors.white,
        ...Platform.select({
            ios: {
              shadowColor: 'black',
              shadowOffset: { width: 8, height: -5 },
              shadowOpacity: 0.1,
              shadowRadius: 5,
            },
            android: {
              elevation: 10,
            },
          }),
        
    },

});
