
// #ifndef VUE3
import Vue from 'vue'
import App from './App'
import store from "store/index.js"
import utils from 'utils/tool.js'
import config from 'common/config/config.js'
import dayjs from 'dayjs'
import rTime from 'dayjs/plugin/relativeTime'
import calendar from 'dayjs/plugin/calendar'
import uView from '@/uni_modules/uview-ui'

dayjs.locale('zh-cn')
dayjs.extend(rTime)
dayjs.extend(calendar)

Vue.prototype.$store = store
Vue.prototype.$dayjs = dayjs
Vue.prototype.$utils = utils
Vue.prototype.config = config
Vue.use(uView)

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App,
    store,
})
app.$mount()
// #endif
