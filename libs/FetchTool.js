
import {NetInfo} from 'react-native';

export function getData(url,callBack){
    NetInfo.getConnectionInfo().then((connectionInfo) => {
        var isConnect = true;
         if (connectionInfo.type.indexOf('wifi') !=-1 || connectionInfo.type.indexOf('cell')!=-1){
             isConnect = true
         }else{
             isConnect = false;
         }
         if (isConnect) {
            fetch(url)
            .then((response) =>response.json())
            .then((responseData)=>callBack(responseData))
            .catch()
            .done();
        }
      });
    // alert(isConnect);
    
};
    
export function postData(url,bodyStr,callBack){

    fetch(url, {
        method:'POST',
        body:bodyStr,
    })
    .then((response) => response.json())
    .then((responseData)=>callBack(responseData))
    .catch((error)=>{
        console.log(error);
    })
    .done();
        
}