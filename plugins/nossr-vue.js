import Vue from 'vue'

// No-SSR plugins import:
import pdf from 'vue-pdf'
import StackModal from '@innologica/vue-stackable-modal'
import LoadingOverlay from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css' // the Stylesheet
import { PDFDocument } from 'pdf-lib'
import VueCryptojs from 'vue-cryptojs'

// Init plugin:
Vue.component('pdf', pdf)
Vue.component('stack-modal', StackModal)
Vue.use(LoadingOverlay)
Vue.component('PDFDocument', PDFDocument)
Vue.use(VueCryptojs)
// https://github.com/FranckFreiburger/vue-pdf/issues/148  --> Vue pdf remove SSR issue
// https://innologica.github.io/vue-stackable-modal/#source-code --> Stack modal [pop up UI component]
// https://github.com/ankurk91/vue-loading-overlay --> Lvue-loading-overlay
