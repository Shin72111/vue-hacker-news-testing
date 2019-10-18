import Vue from 'vue'
import { titleMixin } from './src/util/mixins'
import { host, timeAgo } from './src/util/filters'

Vue.config.productionTip = false

Vue.mixin(titleMixin)

Vue.filter('timeAgo', timeAgo)
Vue.filter('host', host)
