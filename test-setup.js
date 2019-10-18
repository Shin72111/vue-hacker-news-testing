import Vue from 'vue'
import { titleMixin } from './src/util/mixins'

Vue.config.productionTip = false

Vue.mixin(titleMixin)
