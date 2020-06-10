import React, { Component } from 'react';
import {View , StyleSheet , TouchableHighlight , Text, ActivityIndicator} from 'react-native';
import colors from '../constants/Colors';
import { heightPercentageToDP as hp  , widthPercentageToDP as wp} from 'react-native-responsive-screen';

export default class CustomButton extends Component {


  handlePress = () => {
    const { isLoading, action } = this.props;

    if (isLoading) {
      return;
    }

    if (action) {
      action();
    }
  };
    render() {
        const {width , height , title , action  , isLoading ,color, disabled} = this.props;
        return (
          <TouchableHighlight
          style={[styles.btn, {width , height, backgroundColor: color?color:colors.baseblue}]}
          underlayColor={color?color:colors.baseblue}
          disabled= {disabled}
          onPress={this.handlePress}>
          <View>
            {isLoading && <ActivityIndicator animating size="small" color={colors.white} />}
            {!isLoading && <Text style={styles.txt}>{title}</Text> }
          </View>
        </TouchableHighlight>
        )
    }
}


const styles = StyleSheet.create({
    btn:{
      padding: 8,
      height: Platform.OS === 'ios' ? 35 : 40,
      overflow: 'hidden',
      justifyContent:'center',
      alignItems:'center',
      alignItems: 'center',
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
    }
});
