# 插件文件夹

## 目前仅有 nativePlugin.js 插件

## HOW TO IMPORT

```javascript
// main.js

import Vue from 'vue'
import nativeAPIPlugin from '@/plugins/nativePlugin'

// 请在生产环境中开启使用原生插件
if (process.env.NODE_ENV === 'production') {
  Vue.use(nativeAPIPlugin, {
    platform: true
  })
}
```

```xml
<!-- in js file which need IntelliSense should add follow code -->
<!-- relative/path/to means relativepath to plugins/nativePlugin.d.ts, does not just mean what show there -->
<!-- 在需要智能提示的文件的js头部加入以下内容 -->

/// <reference path="relative/path/to/plugins/nativePlugin.d.ts"/>
```

## USE EXAMPLE

```javascript
// vue中

export default {
  mounted: function() {
    // 调用System插件,由于需要等待deviceready事件，此处$System为一个Promise对象
    this.$System.then(system => {
      // 此处的system即为注入的插件对象，之后直接调用方法即可
      if (system) {
        system.getDeviceInfo(str => {
          console.log(str)
        })
      }
    })
  }
}
```

## DONE

* vue 插件化

* 加入 d.ts 和 jsdoc，使用 VScode 可获得代码智能提示[IntelliSense]

* 目前仅转入 cordova 的 android 下 system/thirdparty/toast/ui 插件

## TODO

* 其他原生插件的加入
