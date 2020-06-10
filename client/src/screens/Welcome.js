import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    ActivityIndicator, Platform
} from 'react-native';
import colors from '../constants/Colors'
import { connect } from 'react-redux';
import {getUser} from '../actions/actions';
import { getStoredInfo, storeFirstTime} from '../functions/Storage';
import { CommonActions } from '@react-navigation/native';
import Offline from '../components/Offline';
import NetInfo from '@react-native-community/netinfo';
import * as updates from 'expo-updates'


class Welcome extends Component {

    constructor(props){
      super(props);
      this.mounted = false;
      //this.unsubscribe = NetInfo.addEventListener('connectionChange', this.handleConnectionChange);
      //NetInfo.fetch().then(state => this.setState({isConnected:state.isConnected ,fetched:true}));
    }

    state= {
        isLoading: true,
        notification: {},

    }
  async componentDidMount(){

    
    
    this.setState({ll: 'dfs'})
      this.mounted =true;
      const info = this.props.route.params;

      console.log('passed info', info)
      if(!info.first_time){//app opened for the first time
          console.log('calling reload',)
          storeFirstTime("first_time");
          await updates.reloadAsync();         
      }
      
        
    }
    componentWillUnmount(){
      this.mounted =false;
    }
    componentDidUpdate(){
      const info = this.props.route.params;
      if( this.mounted){
        if(info.userId){
          //logged in 
          //load user data if he's signed in 
          this.props.getUser(info.userId , ()=>{}).then(()=>{
            console.log('finall y loaaaaaaaaaaaaaaaaaaded ,this is user token', info.userId)
            
            //remove welcome from stack
            this.props.navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [
                  {
                    name: 'Main',
                  },
                ],
              })
            );
          });
          
      }else{
                //remove welcome from stack
          this.props.navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [
                {
                  name: 'Sign',
                },
              ],
            })
          );
      }
      }
      
    }
    componentWillUnmount() {
     //this.unsubscribe()
    }
    handleConnectionChange = (isConnected) => this.setState({ isConnected });

     

    
    render() {
      if(!this.state.isConnected && this.state.fetched){
        return(<Offline />);
      }

        return (
            <View style={styles.container}>
                <ActivityIndicator color={colors.main} size = "large"/>
            </View>
        )
        
    }
}



export default connect( null, {getUser})(Welcome)


const styles = StyleSheet.create({
    container:{
        flex:1, 
        justifyContent:'center' , alignItems:'center',
        backgroundColor:colors.white
    }
})

