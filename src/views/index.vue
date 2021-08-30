<template>
  <div class="center-wrapper">
      <div class="menu-item">
          <ul>
              <li v-for="(item,index) in $router.options.routes[0].children" :key="index">
                  <router-link :to="item.path">{{item.name}}</router-link>
              </li>
          </ul>
      </div>
      <div class="center-wrapper">
          <router-view/>
      </div>
  </div>
</template>

<script>
    export default {
        name: "index",
        mounted() {

        }
    }
</script>

<style scoped lang="scss">
    .center-wrapper{
        width: 100%;
        height: 100%;
        .menu-item{
            width: 100%;
            height: 50px;
            line-height: 50px;
            ul{
                width: 70%;
                height: 100%;
                float: right;
                li{
                    padding: 0 20px;
                    float: left;
                    cursor: pointer;
                    text-align: center;
                }
            }
        }
        .center-wrapper{
            width: 100%;
            height: calc(100% - 50px);
            //overflow: hidden;
            padding: 0px 20px 10px 20px;
            box-sizing: border-box;
        }
    }
    .router-link-active{
        color: #42b983;
    }

</style>
