
import {getData} from './FetchTool';
import React, {Component} from 'react';
import { NavigationActions } from 'react-navigation';
import {NativeModules} from 'react-native';
import {MarqueeVertical } from 'react-native-marquee-ab';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import DatePicker from 'react-native-datepicker';
import {
    Dimensions,
    Text,
    View,
    FlatList,
    Image,
    TouchableWithoutFeedback,
    RefreshControl,
    ActivityIndicator
} from 'react-native';

const RNMapManager = NativeModules.RNMapManager;
const {width,height} = Dimensions.get('window');
const NaH = height>=812?84:64;

export default class HomePage extends Component{
    constructor(props){
        super(props);
        this.state={
            dataModels:[],
            isRefreshing:false,//下拉控制
            isLoading: true,
            showFoot:0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
            page:0,
            shwoPicker:false,
            date:"2019-08-13",
            city:'',
            weather:'',
            casts:[]
        }
    }

    request(){
        let url = "http://api.iclient.ifeng.com/ClientNews?id=SYLB10,SYDT10,SYRECOMMEND&page="+this.state.page+
        "&gv=4.6.5&av=0&proid=ifengnews&os=ios_8.1.3&vt=5&screen=750x1334&publishid=4002&uid=bef7607d434c99fa031f3f68117efe5cda3e292c";
        getData(url,(response)=>{
            if (response && response[0] && response[0].item!=null) {
                    var items = response[0].item;
                    var datas = this.state.dataModels;
                    for(i=0;i<items.length;i++){
                        let it = items[i];
                        if (it.type=='doc' && it.thumbnail && it.thumbnail.length>0) {
                            datas.push(it);
                        }
                    }
                    this.setState({
                        dataModels:datas,
                        page:this.state.page+1,
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
            }
        });
    }

    _tapItem(item){
        const rowData = {
          url:item.link.weburl,
          title:item.title
        };
        const navigateAction = NavigationActions.navigate({
          routeName: 'HomeDetail',
          params: {rowData},
          action: NavigationActions.navigate({ routeName: 'HomeDetail',title:''}),
          });
        this.props.navigation.dispatch(navigateAction);
    }
    componentDidMount() {
        this.request();
        var that = this;
        RNMapManager.getLocationCallback((results)=>{
                    that.setState({
                        city:results.city
                    });
                    RNMapManager.searchWeatherForcast(results.adcode,(results)=>{
                        that.setState({
                            casts:results.casts
                        });
                    })
                });
    }
    _renderRow(rowData){
        return <TouchableWithoutFeedback onPress={()=>this._tapItem(rowData)}>
                    <View style={{flexDirection:"column",width:width,}}> 
                        <View style={{height:10}}></View>
                        <View style={{flexDirection:'row'}}> 
                            <Image style={{width:120,height:100,borderRadius:10,marginLeft:10,padding:10}} source={{uri:rowData.thumbnail}}></Image>
                            <View style={{flexDirection:"column",width:width-130,padding:10,justifyContent:'space-between'}}>
                                <Text numberOfLines={3} ellipsizeMode="clip" 
                                    style={{color:'black',fontSize:18,fontWeight:'normal',overflow:"hidden"}}>{rowData.title}
                                </Text>
                                <View style={{height:20}}></View>
                                <Text numberOfLines={1} ellipsizeMode="clip" 
                                    style={{color:'grey',fontSize:13,overflow:"hidden"}}>{rowData.source+' '+rowData.updateTime}
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
        if (this.state.page<10) {
            this.state.page++;
        }else{
            this.setState({showFoot:1});
            return;
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

    _runHorse(){

        var textList = [];
        for(i=0;i<this.state.casts.length;i++){
            let cs = this.state.casts[i];
            let dates = cs.date.split("-");
            textList.push({label:'1',value:(i==0?"今日 ":dates[1]+'.'+dates[2]+' ')+cs.nightWeather+' '+cs.dayTemp+"℃"});
        }
        return <MarqueeVertical
                    textList = {textList}
                    width = {(width-130)/2.0}
                    height = {22}
                    delay = {3000}
                    direction = {'up'}
                    numberOfLines = {2}
                    bgContainerStyle = {{backgroundColor : 'white'}}
                    textStyle = {{textAlign:'left',fontSize : 16,textDecorationLine:'underline',color:'grey',lineHeight:20,height:22}}
                />;
    }

    _calenders(){
      return  <Calendar
                // Specify style for calendar container element. Default = {}
                style={{
                    borderWidth: 1,
                    borderColor: 'gray',
                    height: 500
                }}
                // Specify theme properties to override specific styles for calendar parts. Default = {}
                theme={{
                    backgroundColor: '#ffffff',
                    calendarBackground: '#ffffff',
                    textSectionTitleColor: '#b6c1cd',
                    selectedDayBackgroundColor: '#00adf5',
                    selectedDayTextColor: '#ffffff',
                    todayTextColor: '#00adf5',
                    dayTextColor: '#2d4150',
                    textDisabledColor: '#d9e1e8',
                    dotColor: '#00adf5',
                    selectedDotColor: '#ffffff',
                    arrowColor: 'orange',
                    monthTextColor: 'blue',
                    indicatorColor: 'blue',
                    // textDayFontFamily: 'monospace',
                    // textMonthFontFamily: 'monospace',
                    // textDayHeaderFontFamily: 'monospace',
                    textDayFontWeight: '300',
                    textMonthFontWeight: 'bold',
                    textDayHeaderFontWeight: '300',
                    textDayFontSize: 16,
                    textMonthFontSize: 16,
                    textDayHeaderFontSize: 16
                }}
            />;
    }
    _datePicker(){
        return <DatePicker
                style={{width: 200,backgroundColor:'yellow',marginLeft:10}}
                date={this.state.date}
                mode="date"
                placeholder="select date"
                format="YYYY-MM-DD"
                minDate="2019-08-13"
                maxDate="2020-08-13"
                confirmBtnText="确定"
                cancelBtnText="取消"
                customStyles={{
                    dateIcon:null,
                // dateIcon: {
                //     position: 'absolute',
                //     left: 0,
                //     top: 4,
                //     marginLeft: 0
                // },
                dateInput: {
                    marginLeft: 36
                }
                }}
                onDateChange={(date) => {this.setState({date: date})}}
            />;
    }
    
    render(){
        return (
        <View style={{height:height,width:width,backgroundColor:'white',flexDirection:'column',alignItems:'center'}}>
            <View style={{width:width,backgroundColor:'white',flexDirection:'row',paddingTop:NaH==84?40:20,height:NaH,alignItems:'center'}}>
                <View style={{width:(width-130)/2.0,height:44,alignItems:'center'}}>
                    <Text numberOfLines={2} 
                        style={{textDecorationLine:'underline',color:'grey',paddingLeft:10,width:(width-130)/2.0,
                                fontSize:16,textAlign:'left',fontWeight:'normal',lineHeight:20,height:22}}>
                        {this.state.city}
                    </Text>
                    <View style={{flex:1,paddingLeft:22}}>
                        {this._runHorse()}
                    </View>
                </View>
                <Text style={{width:130,fontSize:24,textAlign:'center',fontWeight:'normal',lineHeight:44}}>头条新闻</Text>
            </View>
            {/*this._datePicker()*/}
            {/*this._calenders()*/}
            {this._news()}
        </View>
        );
    }

}