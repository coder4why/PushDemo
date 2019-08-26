

import React, { Component } from 'react';
import { 
    Dimensions,
    TouchableWithoutFeedback,
    View,
    Text,
    FlatList,
    Image,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import {getData} from './FetchTool';
import { NavigationActions } from 'react-navigation';

const {width,height} = Dimensions.get("window");
const NaH = height>=812?84:64;

export default class VideoDetail extends Component {
 
    constructor(props){
        super(props);
        this.state={
            videoModels:[],
            isRefreshing:false,//下拉控制
            isLoading: true,
            showFoot:0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
            page:0,
        }
    }

    request(){
        let url = 'http://c.m.163.com/nc/video/list/'+this.props.navigation.state.params.rowData.sid+'/y/'+this.state.page.toString()+'-10.html'
        getData(url,(response)=>{
            if (response && response[this.props.navigation.state.params.rowData.sid].length>0) {
                var videos = this.state.videoModels;
                for(i=0;i<response[this.props.navigation.state.params.rowData.sid].length;i++){
                    videos.push(response[this.props.navigation.state.params.rowData.sid][i]);
                }
                this.setState({
                    videoModels:videos,
                    isRefreshing:false,
                    page:this.state.page+10,
                    showFoot:0,
                    isLoading:false
                });
            }
        });
    }
    componentDidMount(){
        this.request();
    }
    _tapItem(item){
        const rowData = {
            url:item.mp4_url,
            title:item.title,
            topicDesc:item.topicDesc,
            cover:item.cover
          };
        const navigateAction = NavigationActions.navigate({
            routeName: 'VideoPlay',
            params: {rowData},
            action: NavigationActions.navigate({ routeName: 'VideoPlay',title:''}),
            });
        this.props.navigation.dispatch(navigateAction);
    }

    _renderRow(rowData){
        
        return <TouchableWithoutFeedback onPress={()=>this._tapItem(rowData)}>
                    <View style={{flexDirection:"column",width:width,height:245}}> 
                            <View style={{width:width,height:200,position:'absolute',justifyContent:'center'}}>
                                <Image style={{flex:1}} source={{uri:rowData.cover}}></Image>
                                <Image style={{width:40,height:40,position:'absolute',marginLeft:(width-40)/2.0,resizeMode:'contain'}} source={require('./images/play.png')}></Image>
                            </View>
                            <View style={{flexDirection:"column",width:width,padding:10,height:200,position:'absolute',alignItems:'center'}}>
                                <Text numberOfLines={2} ellipsizeMode="clip" 
                                    style={{color:'white',fontSize:18,fontWeight:'bold',overflow:"hidden",width:width-20,lineHeight:25,textAlign:'left'}}>{rowData.title}
                                </Text>
                                <View style={{height:40,flexDirection:'row',width:width-20,marginBottom:0,marginTop:140,justifyContent:'space-between'}}>
                                    <Text numberOfLines={1}
                                        style={{color:'white',fontSize:13,textAlign:'left'}}>{rowData.playCount+'次播放'}
                                    </Text>
                                    <Text numberOfLines={1}
                                        style={{color:'white',fontSize:13,textAlign:'right'}}>{rowData.ptime}
                                    </Text>
                                </View>
                            </View>
                            <View style={{height:45,width:width,flexDirection:'row',alignItems:'center',justifyContent:"flex-start",marginTop:200}}>
                                <Image style={{width:30,height:30,borderRadius:15,marginLeft:15}} source={{uri:rowData.topicImg}}></Image>
                                <View style={{width:5}}></View>
                                <Text numberOfLines={1} ellipsizeMode='clip' 
                                    style={{color:'black',fontSize:15,fontWeight:'bold',overflow:"hidden",width:230}}>{rowData.topicDesc}
                                </Text>
                            </View>
                    </View>
                </TouchableWithoutFeedback>
      }
    _extraUniqueKey(item ,index){
        return "index"+index+1+item.text;
    }  
    handleRefresh = () => {
        this.setState({
            isRefreshing:true,//tag,下拉刷新中，加载完全，就设置成flase
        });
        this.request()
    }  
    _renderFooter(){
        if (this.state.showFoot === 1) {
            return (
                <View style={{height:30,alignItems:'center',justifyContent:'flex-start',}}>
                    <Text style={{color:'#999999',fontSize:14,marginTop:5,marginBottom:5,}}>
                        没有更多数据了
                    </Text>
                </View>
            );
        } else if(this.state.showFoot === 2) {
            return (
                <View style={{flexDirection:'row', height:24,justifyContent:'center',alignItems:'center',marginBottom:10,}}>
                    <ActivityIndicator />
                    <Text>正在加载更多数据...</Text>
                </View>
            );
        } else if(this.state.showFoot === 0){
            return (
                <View style={{flexDirection:'row', height:24,justifyContent:'center',alignItems:'center',marginBottom:10,}}>
                    <Text></Text>
                </View>
            );
        }
    } 
    _onEndReached(){
        //如果是正在加载中或没有更多数据了，则返回
        if(this.state.showFoot != 0 ){
            return ;
        }
        //底部显示正在加载更多数据
        this.setState({showFoot:2});
        this.request();
    }
    _videos(){
        return  <View style={{flex:1}}>
                    <FlatList
                        keyExtractor = {this._extraUniqueKey}   
                        style={{width:width,
                        height:height-60,}}
                        data={this.state.videoModels}
                        renderItem = {({item}) => this._renderRow(item)}
                        onEndReachedThreshold={0.1}
                        onEndReached={this._onEndReached.bind(this)}
                        ListFooterComponent={this._renderFooter.bind(this)}
                        //为刷新设置颜色
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isRefreshing}
                                onRefresh={this.handleRefresh.bind(this)}//因为涉及到this.state
                                colors={['#ff0000', '#00ff00','#0000ff','#3ad564']}
                                progressBackgroundColor="#ffffff"
                            />
                        }
                    />
                </View>;
      }
      _back(){
        this.props.navigation.goBack();
      }
  
    render() {
        return (
            <View style={{height:height,width:width,backgroundColor:'white',flexDirection:'column'}}>
                <View style={{height:NaH,width:width,backgroundColor:'white',flexDirection:'row',justifyContent:'flex-start'}}>
                    <TouchableWithoutFeedback onPress={()=>this._back()}>
                        <View style={{marginLeft:10,heigth:NaH,width:60}}>
                            <Image style={{resizeMode:'contain',marginTop:(Dimensions.get("window").height>=812?40:20),width:24,height:44}} source={require('./images/back.png')}></Image>
                        </View>
                    </TouchableWithoutFeedback>
                    <Text style={{width:200,fontSize:24,textAlign:'center',fontWeight:'normal',lineHeight:44,paddingTop:NaH==84?40:20,height:NaH}}>
                        {this.props.navigation.state.params.rowData.title}
                    </Text>
                </View>
                {this._videos()}
            </View>
        );
    }
}