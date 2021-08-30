<template>
  <div
      @dragstart="dragStart($event)"
      @dragover.prevent="dragOver($event) "
      @drop="drop($event)">
    <div class="source-material-wrapper">
      <div class="source-items" v-for="(item,index) in sourceMaterialList" :key="index" :data-drop="item.id">
        <img :src="item.imgSrc" alt="" :data-drop="item.id">
      </div>
    </div>
    <!-- 刻度尺 -->

    <div class="scale-wrapper">
      <div class="slider-box">
        <div class="slider">
        <el-slider v-model="selectTimer"
                   show-stops
                   :max="360"
                   :min="60"
                   :step="60">
        </el-slider>
        </div>
      </div>
      <div class="date-wrapper">
        <div v-for="(item,index) in dateList" class="items-date">
          <i v-for="i in index < dateList.length ? 10 : 11" :key="i"></i>
          <span class="item_scale_time">
          {{ item }}</span>
        </div>
<!--        <div class="timeline-box">-->
<!--          <span class="line-item"></span>-->
<!--        </div>-->
      </div>
    </div>
    <div class="track-list-wrapper" ref="trackList">
      <div v-for="(item,index) in trackList" :key="index">
        <div class="track-items" :id="index" :class="{'selectTrack':isDarg}">
          <vue-draggable-resizable
              v-for="(i, index) in item"
              :key="index"
              :w="i.w"
              :h="60"
              :resizable="true"
              :x="i.x"
              @activated="activatedSelect(i, index)"
              @dragging="onDrag"
              @resizing="onResizing"
              :min-height="60"
              :handles="['ml', 'mr']"
              :parent="true"
              class="video_track"
          >
            <span style="color: aliceblue">{{i.starTimer}}----{{i.endTimer}}</span>
          </vue-draggable-resizable>
        </div>
      </div>
      <!-- 滚动的线 -->
      <vue-draggable-resizable
          :x="0"
          :w="20"
          :h="400"
          axis="x"
          :parent="true"
          :handles="[]"
          class="run_line_content"
      >
        <div class="icon-arrow-b_fill"></div>
        <div class="run_line"></div>
      </vue-draggable-resizable>
    </div>

  </div>
</template>
<script>

export default {
  name: "lm-timing-control",
  data(){
    return{
      rulerSizeNumber: 30,
      sourceMaterialList:[
        {
          id:1125,
          imgSrc:require('../../assets/images/35af5124880511ebb6edd017c2d2eca2.jpg'),
          starTimer:''
        },
        {
          id:1126,
          imgSrc:require('../../assets/images/35af5124880511ebb6edd017c2d2eca2.jpg'),
          starTimer:''
        }
      ],
      trackList:[
        [],
        [],
        [],
        [],
      ],
      isDarg:false,
      selectTimer: 60,
      dateList: [],
      activeDrag:{

      },
      activeImg:{

      }
    }
  },
  watch: {
    selectTimer: function (val, oval) {
      this.dateList=this.create(val)
      if(this.activeDrag.index!==undefined)
      var hourDiffFromStart=this.mapTimeToPosition(this.trackList[this.activeDrag.index][0].starTimer);
      let offWidth=this.$refs.trackList.offsetWidth-5 //  3px的padding+2px的border
      console.log(hourDiffFromStart/(86400/offWidth));
    }
  },
  methods:{
    create(minute) {
      var seconds = minute * 60;
      var len = (60 * 24 * 60) / seconds; //数组长度
      for (var i = 0, total = 0, newArr = []; i < len; i++) {
        var h = parseInt(total / 3600),
            min = parseInt(total % 3600 / 60);
        newArr.push(this.s(h) + ':' + this.s(min));
        total += seconds;
      }
      return newArr;
    },
    s(n) {
      return n < 10 ? '0' + n : n
    },
    dragStart($event){
      $event.target.dataset.drop!==undefined&& $event.target.dataset.drop!==''?this.isDarg=true:this.isDarg=false
    },
    dragOver($event){

    },
    activatedSelect(item,i){
      this.activeDrag.index=i;
      this.activeDrag.value=item;
    },
    onDrag(x, y) {
      let newDay=this.$moment().format("YYYY-MM-DD");
      let findDrag=this.trackList[this.activeDrag.index].find(item=> item.id===this.activeDrag.value.id)
      if(findDrag!==undefined)
      findDrag.starTimer=this.mapPositionToTime(x);
      //减去一秒
      let odate=this.$moment(newDay +' '+ this.mapPositionToTime(x + findDrag.w))
      findDrag.endTimer=odate.subtract(1,'seconds').format('HH:mm:ss');
      //findDrag.starTimer=this.$moment(newDay+' 00:00:00').add(x*47, 'seconds').format('HH:mm:ss');
    },
    onResizing(x,y,w,h){
      let newDay=this.$moment().format("YYYY-MM-DD");
      let findDrag=this.trackList[this.activeDrag.index].find(item=> item.id===this.activeDrag.value.id)
      if(findDrag!==undefined)
        findDrag.w=w
        findDrag.starTimer=this.mapPositionToTime(x);
        //减去一秒
        let odate=this.$moment(newDay +' '+ this.mapPositionToTime(x + w))
        findDrag.endTimer=odate.subtract(1,'seconds').format('HH:mm:ss');

    },
    drop($event){
      if(this.isDarg&&$event.target.id!=='')
        this.trackList[Number($event.target.id)].push({
          id:$event.target.id,
          x:$event.x,
          w:200,
          starTimer:this.mapPositionToTime($event.x),
          endTimer:this.mapPositionToTime($event.x+200)
        });
      this.activeDrag.index=Number($event.target.id);
      this.activeDrag.value=this.trackList[Number($event.target.id)];
      this.isDarg=false
    },

    //根据位置x装换成时间HH:mm:ss格式
    mapPositionToTime(x){
      let newDay=this.$moment().format("YYYY-MM-DD");
      let offWidth=this.$refs.trackList.offsetWidth-5 //3px的padding+2px的border
      return this.$moment(newDay+' 00:00:00').add(x*(86400/offWidth), 'seconds').format('HH:mm:ss');

    },

    //根据时间格式HH:mm:ss 装换位置 x
    mapTimeToPosition(time){
      let newDay=this.$moment().format("YYYY-MM-DD");
     return this.$moment(newDay+' '+time).diff(newDay+' 00:00:00',"seconds",true)
    }
  },
  mounted() {
    this.dateList=this.create(this.selectTimer);
  }
}
</script>

<style scoped lang="scss">
.source-material-wrapper{
  width:100%;
  height: 300px;
  border: 1px solid #2c3e50;
  padding: 5px;
  box-sizing: border-box;
  display: flex;
  .source-items{
    width: 150px;
    height: 100px;
    cursor: pointer;
    margin: 5px;
    img{
      width: 100%;
      height: 100%;
    }
  }

}
.scale-wrapper {
  width: 100%;
  box-sizing: border-box;
  -moz-user-select:none; /*火狐*/
  -webkit-user-select:none; /*webkit浏览器*/
  -ms-user-select:none; /*IE10*/
  -khtml-user-select:none; /*早期浏览器*/
  user-select:none;
  .slider-box {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    .slider{
      width: 30%;
    }
  }
  .date-wrapper{
    height: 60px;
    width: 100%;
    background: #34363b;
    box-sizing: border-box;
    padding:10px 0;
    display: flex;
    flex-wrap: nowrap;
    justify-content: left;
    overflow: hidden;
    .items-date{
      height: 40px;
      position: relative;
      //width: 200px;
      display: flex;
      flex: 1;
      flex-wrap: nowrap;
      justify-content: space-around;
      i {
        display: inline-block;
        width: 1px;
        background: #fafafa;
        height: 5px;
      }
      :nth-child(5n + 1) {
        height: 10px;
      }
      :nth-child(10n + 1) {
        height: 15px;
      }
      :nth-child(10) {
        height: 5px;
      }
      :first-child {
        margin-left: 0;
      }
      .item_scale_time {
        position: absolute;
        bottom: 0;
        left: 0;
        color: #fafafa;
      }
    }
  }
}
.track-list-wrapper{
  height: 400px;
  width: 100%;
  position: relative;
  .track-items{
    height: 60px;
    border: 1px solid #ccc;
    margin-top: 10px;
    line-height: 60px;
    padding-left: 3px;
  }
  .video_track{
    background: #2c3e50;
  }
  ::v-deep .vdr {
    border: none !important;
  }
  .run_line_content {
    z-index: 999;
    position: absolute;
    top: -70px;
    left: -7px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    .icon-arrow-b_fill {
      width: 0;
      height: 0;
      border-right:10px solid transparent;
      border-left:10px solid transparent;
      border-top:8px solid red;
    }
    .run_line {
      width: 1px;
      background: #ff0000;
      height: 100%;
    }
  }
}

.selectTrack{
  width: 100%;
  height: 100%;
  border-color: coral !important;
}
</style>
