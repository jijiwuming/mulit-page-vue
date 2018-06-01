<template>
  <div v-if="bannerArray.length>0"></div>

</template>

<script>
import Slick from "vue-slick";
import "slick-carousel/slick/slick.css";
import ajaxAsync from "../../resources/ajaxAsync.js";
import BannerModel from "./BannerModel.js";
import { resolve } from "url";
import dateFtt from "../../../static/js/dateFtt.js";
export default {
  data() {
    return {
      bannerArray: {
        type: Array,
        default: []
      },
      ADBANNER_API_CONFIG: "FEBNOL2322NBLANL" //后台配置广告位数据缓存字段
    };
  },
  props: {
    height: {
      type: String,
      default: "4rem" /* 300/75 */
    },
    width: {
      type: String,
      default: "9.2rem" /* 690/75 */
    },
    bannerEnName: {
      type: String,
      require: true
    },
    slidesToShow: 1,
    throudSourceBannerEnName: {
      type: String,
      default: ""
    }
  },
  methods: {
    getAdConfig() {
      return new Promise((resolve, reject) => {
        ajaxAsync("/system/app/configs", { CONFIG_KEY: "AD_CONFIG" })
          .then(body => {
            resolve(body);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    getAdDataByPlugin() {
      if (this.throudSourceBannerEnName && this.throudSourceBannerEnName != "")
        this.$ThirdParty
          .then(thirdparty => {
            thirdparty.getAdInfo(
              jsonStr => {
                let adData = JSON.parse(jsonStr);
                
              },
              () => {},
              this.throudSourceBannerEnName
            );
          })
          .catch(() => {});
    },
    putFlagToCacheWhenApiCheckedToday(hasData = false) {
      let key = this.ADBANNER_API_CONFIG + "_" + bannerEnName;
      let value = dateFtt("yyyy/MM/dd", new Date()) + "_" + hasData;
      window.localStorage.setItem(key, value);
    }
  },
  mounted() {
    this.getAdConfig()
      .then(body => {
        let enable = false; //是否启用
        let adConfigBody = body;
        if (adConfigBody.COUNT === 0) {
          //配置数据为空，默认广告位启用
          enable = true;
        } else {
          let adConfig = adConfigBody.LIST[0];
          if (adConfig) {
            //判断是否启用广告位
            if (adConfig.CONFIG_KEY === "AD_CONFIG") {
              //判断该广告位是否启用
              let notUseADArray = adConfig.CONFIG;
              let thisAdIsUse = true;
              notUseADArray.forEach(element => {
                if (element === this.bannerEnName) thisAdIsUse = false;
              });
              //该广告位启用
              if (thisAdIsUse) {
                enable = true;
              }
            }
          }
        }

        //启用广告位逻辑
        if (enable) {
          let key = this.ADBANNER_API_CONFIG + "_" + this.bannerEnName;
          let configInCache = window.localStorage.getItem(key);
          if (configInCache === undefined || configInCache === "") {
            //没有数据.则说明从来没有判断过.那么走API去判断
          } else {
          }
        }
      })
      .catch(error => {});
  }
};
</script>

<style scoped>
</style>
