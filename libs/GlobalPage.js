
import {getData} from './FetchTool';
import React, {Component} from 'react';
import {
    Dimensions,
    Text,
    View,
    FlatList,
    Image,
    TouchableWithoutFeedback,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';
const {width,height} = Dimensions.get('window');
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { NavigationActions } from 'react-navigation';
const NaH = height>=812?84:64;
export default class GlobalPage extends Component{
    constructor(props){
        super(props);
        this.state={
            dataModels:[],
            isRefreshing:false,//下拉控制
            isLoading: true,
            showFoot:0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
            oldTimestamp:'0',
        }
    }

    request(){
        let url = 'http://interfacev5.vivame.cn/x1-interface-v5/json/newdatalist.json?platform=android&installversion=5.6.6.3&channelno=BDSCA2320480100&mid=7c2f435b4eb9c9267addf21979bc88c4&uid=11024476&sid=b8bc94d0-0fef-4f64-890d-7c1de00412a0&type=-1&id=5&category=-1&ot='+this.state.oldTimestamp+'&nt=0';
        getData(url,(response)=>{
            if (response && response.code == '0') {
                var items = response.data.feedlist;
                var datas = this.state.dataModels;
                for(i=0;i<items.length;i++){
                    let it = items[i].items;
                    if (it.length>0) {
                        for(k=0;k<it.length;k++){
                            let iT = it[k]
                            if (iT.img.length>0) {
                                datas.push(iT);
                            }
                        }
                    }
                }
                this.setState({
                    dataModels:datas,
                    oldTimestamp:response.data.oldTimestamp,
                    isRefreshing:false,
                    showFoot:0,
                    isLoading:false
                  });
              
            }else{
                this.setState({
                    isRefreshing:false,
                    showFoot:1,
                    isLoading:false
                  });
                  return;
            }
        });
           
    }

    _tapItem(item){
        const rowData = {
          url:item.fileurl,
          title:item.title
        };
        const navigateAction = NavigationActions.navigate({
          routeName: 'HomeDetail',
          params: {rowData},
          action: NavigationActions.navigate({ routeName: 'HomeDetail',title:''}),
          });
        this.props.navigation.dispatch(navigateAction);
    }
    componentDidMount(){
        this.request();
    }
    _renderRow(rowData){
        return <TouchableWithoutFeedback onPress={()=>this._tapItem(rowData)}>
                    <View style={{flexDirection:"column",width:width,}}> 
                        <View style={{height:10}}></View>
                        <View style={{flexDirection:'row'}}> 
                            <Image style={{width:120,height:100,borderRadius:10,marginLeft:10,padding:10}} source={{uri:rowData.img}}></Image>
                            <View style={{flexDirection:"column",width:width-130,padding:10,justifyContent:'space-between'}}>
                                <Text numberOfLines={3} ellipsizeMode="clip" 
                                    style={{color:'black',fontSize:18,fontWeight:'normal',overflow:"hidden"}}>{rowData.title}
                                </Text>
                                <View style={{height:20}}></View>
                                <Text numberOfLines={1} ellipsizeMode="clip" 
                                    style={{color:'grey',fontSize:13,overflow:"hidden"}}>{rowData.stypename}
                                </Text>
                            </View>
                        </View>
                    </View>
        </TouchableWithoutFeedback>
      }
    _extraUniqueKey(item ,index){
        return "index"+index+item.text;
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
    _news(){
        return  <View style={{flex:1}}>
                    <FlatList
                        keyExtractor = {this._extraUniqueKey}   
                        style={{width:width,
                        height:height-60,}}
                        data={this.state.dataModels}
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
    render(){
        return (
        <View style={{height:height,width:width,backgroundColor:'white',flexDirection:'column',alignItems:'center'}}>
            <Text style={{width:200,fontSize:24,textAlign:'center',fontWeight:'normal',lineHeight:44,paddingTop:NaH==84?40:20,height:NaH}}>体育热点</Text>
            {this._news()}
        </View>
        );
    }

}