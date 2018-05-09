import Vue from 'vue'
import Toast from './cordova/android/toast'
import System from './cordova/android/system'
import Thirdparty from './cordova/android/thirdparty'
import UI from './cordova/android/ui'
declare module 'vue/types/vue' {
  interface Vue {
    $Toast: Promise<Toast>
    $System: Promise<System>
    $ThirdParty: Promise<Thirdparty>
    $UI: Promise<UI>
  }
}
