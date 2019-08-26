
import React, { Component } from 'react';
import { 
    Dimensions,
    View,
    Text,
    Image,
    TouchableWithoutFeedback
} from 'react-native';
import Video from 'react-native-video';
import { NavigationActions } from 'react-navigation';
const {width,height} = Dimensions.get("window");
const NaH = height>=812?84:64;

export default class VideoPlay extends Component {
    constructor(props){
        super(props);
        this.state={
            isplaying: true,
        }
    }
   
    _back(){
        this.props.navigation.goBack();
      }
    render(){
        return (
            <View style={{height:height,width:width,backgroundColor:'white',flexDirection:'column',alignItems:'center'}}>
                <View style={{height:NaH,width:width,backgroundColor:'white',flexDirection:'row',justifyContent:'flex-start'}}>
                    <TouchableWithoutFeedback onPress={()=>this._back()}>
                        <View style={{marginLeft:10,heigth:NaH,width:60}}>
                            <Image style={{resizeMode:'contain',marginTop:(Dimensions.get("window").height>=812?40:20),width:24,height:44}} source={require('./images/back.png')}></Image>
                        </View>
                    </TouchableWithoutFeedback>
                    <Text numberOfLines={1} style={{width:200,fontSize:24,textAlign:'center',fontWeight:'normal',lineHeight:44,paddingTop:NaH==84?40:20,height:NaH}}>
                        {this.props.navigation.state.params.rowData.topicDesc}
                    </Text>
                </View>
                    <View style={{width:width,height:400,justifyContent:'center'}}>
                        {
                            this.state.isplaying==true?
                            <Image style={{resizeMode:'cover',width:width,height:400}} source={{uri:this.props.navigation.state.params.rowData.cover}}></Image>
                            :null
                        }
                    </View>
                <Video
                    ref={(ref) => {
                        this.video = ref
                    }}
                    onReadyForDisplay={()=>this.setState({isplaying:true})}
                    source={{uri: this.props.navigation.state.params.rowData.url}}
                    style={{width:width,height:400,position:'absolute',marginTop:NaH}}
                    resizeMode={'cover'}
                    repeat={false}
                    paused={!this.state.isplaying}
                    onEnd={()=>this.setState({isplaying:false})}
                />
                {
                    this.state.isplaying==false?
                    <TouchableWithoutFeedback onPress={()=>{
                        this.setState({isplaying:true});
                        this.video.seek(1);
                    }}>
                        <Image style={{width:40,height:40,position:'absolute',marginLeft:(width-40)/2.0,resizeMode:'contain',marginTop:NaH+180}} 
                            source={require('./images/play.png')}>
                        </Image>
                    </TouchableWithoutFeedback>
                    :null
                }
                <Text style={{margin:10,width:width-20,fontSize:18,textAlign:'left',fontWeight:'bold',lineHeight:25,}}>
                    {this.props.navigation.state.params.rowData.title}
                </Text>
            </View>
        );
    }
}