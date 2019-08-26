

import HomeDetail from './HomeDetail';
import VideoDetail from './VideoDetail';
import VideoPlay from './VideoPlay';
  //工作台路由
  export default routeIndex = {
    HomeDetail:{
        screen:HomeDetail,
        navigationOptions:{
            header:null,
            },
          },
    VideoDetail:{
            screen:VideoDetail,
            navigationOptions:{
                header:null,
                },
        },
    VideoPlay:{
        screen:VideoPlay,
        navigationOptions:{
            header:null,
            },
    },
}
  