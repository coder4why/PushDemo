
import React, { Component } from 'react';
import { Dimensions ,TouchableWithoutFeedback,View,Image,Text} from 'react-native';
import { WebView } from 'react-native-webview';

const width = Dimensions.get("window").width;
const NaH = Dimensions.get("window").height>=812?84:64;

export default class HomeDetail extends Component {
 
    _back(){
      this.props.navigation.goBack();
    }
    // 
  render() {
    return (
      <View style={{flex:1}}>
        <View style={{height:NaH,width:width,backgroundColor:'white',flexDirection:'row',justifyContent:'flex-start'}}>
          <TouchableWithoutFeedback onPress={()=>this._back()}>
              <View style={{marginLeft:10,heigth:NaH,width:60}}>
                  <Image style={{resizeMode:'contain',marginTop:(Dimensions.get("window").height>=812?40:20),width:24,height:44}} source={require('./images/back.png')}></Image>
              </View>
          </TouchableWithoutFeedback>
          <Text numberOfLines={1} style={{width:260,fontSize:20,textAlign:'center',fontWeight:'normal',lineHeight:44,paddingTop:NaH==84?40:20,height:NaH}}>
              {this.props.navigation.state.params.rowData.title}
          </Text>
        </View>
        <WebView source={{ uri: this.props.navigation.state.params.rowData.url}} />
      </View>
    );
  }
}