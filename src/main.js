import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import moment from 'moment'//导入文件
Vue.prototype.$moment = moment;//赋值使用
import '@/assets/style/index.scss'
import 'element-ui/lib/theme-chalk/index.css';
import VueDraggableResizable from 'vue-draggable-resizable'
import 'vue-draggable-resizable/dist/VueDraggableResizable.css'
import lmEcharts from 'lm-echarts'
Vue.use(lmEcharts);
Vue.config.productionTip = false
Vue.use(ElementUI);

Vue.component('vue-draggable-resizable', VueDraggableResizable)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
