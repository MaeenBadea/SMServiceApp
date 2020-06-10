import React, { Component } from 'react'
import {View , StyleSheet, Image} from 'react-native'

export default class Container extends Component {
 
    render() {
        return (
            <View style = {styles.container}>
              <Image style={styles.image} source={require('../assets/images/background.jpg')}/>

                {this.props.children}

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{ 
        flex:1
    },
    image:{
        flex:1,
        position:'absolute',
        width: '100%', 
        height: '100%'
    }
})