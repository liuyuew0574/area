﻿import request from '~/utils/request'
import Vue from 'vue'
const api = {
  //获取全球地区信息
  AreaLoc: (params) => {
    return request.get('/Sys/AreaLoc', { params: params })
  },
}
export default class area {
  constructor(options) {
    this.api = api;  //调用的api
    this.options = options;  //配置项
    this.subAreaList = [];// 接收洲的数组
    this.AsiaList = [];//亚洲的所有国家
    this.continentRegion = [];// 接收国家的数组
    this.provinceRegion = [];//接收省份的数组
    this.cityRegion = [];//接收城市的数组

    this.continent = "";//前台v-model洲绑定的值 旧版
    this.country = "";//前台v-model国家绑定的值 旧版
    this.povice = "";//前台v-model省份绑定的值 旧版
    this.city = "";//前台v-model城市绑定的值 旧版


    //新版接收分割线 
    this.continentId = 1; //洲 ID 默认亚洲 
    this.countryId = "中国"; //国家id 默认中国 由于前台显示 总会出现数字 7 因此 直接定义中国
    this.poviceId = "";// 省份id
    this.cityId = ""; //城市id

    this.continentRow = [];//获取到洲一行所有数据
    this.countryRow = [];//获取到国家一行所有数据
    this.poviceRow = [];//获取到省份一行所有数据
    this.cityRow = [];//获取到城市一行所有数据
    if (options != undefined && options.Area == false) {
      this.newAreaLoc(false);
    }
  }
  AreaLoc(isAsia)//需要洲为true
  {
    const that = this;
    that.api.AreaLoc().then(function (res) {
      if (res.isCompleted) {
        that.AsiaList = res.data[0].subAreaLoc;
        that.subAreaList = res.data;//res.data[0]亚洲  res.data[0].subAreaLoc 中国
        if (isAsia == false)//默认给亚洲
        {
          that.continentChange(0, "")
          that.countryChange(0, "中国")
        }
      } else {
        that.$message.error(res.message)
      }
    })
  }
  //点击洲 求国家
  continentChange(index, name) {
    const that = this;
    that.continent = name;
    that.continentRegion = that.subAreaList[index].subAreaLoc

  }
  //点击国家 求省份
  countryChange(index, name) {
    const that = this;
    that.country = name;
    that.provinceRegion = that.continentRegion[index].subAreaLoc
  }
  //点击省份 求国家
  provinceChange(index, name) {
    const that = this;
    that.povice = name;
    that.cityRegion = that.provinceRegion[index].subAreaLoc
  }









  ///新版
  //获取地区
  async newAreaLoc(isAsia) {
    const that = this;
    await that.api.AreaLoc().then(function (res) {
      if (res.isCompleted) {
        if (isAsia == false)//默认给亚洲
        {
          res.data.map(function (item, index) {
            if (item.areaId == 1) {
              that.continentRegion = item.subAreaLoc
              that.continentRegion.map(function (item, index) {
                if (item.areaId == 7) {
                  that.provinceRegion = item.subAreaLoc
                  if (that.poviceId != "" && that.poviceId != 0) {
                    that.newProvinceChange();
                  }
                }
              })
            }
          })
        }
        else {
          that.subAreaList = res.data;//res.data[0]亚洲  res.data[0].subAreaLoc 中国
        }
      } else {
        that.$message.error(res.message)
      }
    })
  }
  //点击洲 求国家

  async newContinentChange() {
    const that = this;
    await that.subAreaList.map(function (item, index) {
      if (item.areaId == that.continentId) {
        that.continentRow = item;
        that.continentRegion = item.subAreaLoc
      }
    })
  }
  //点击国家 求省份
  async newCountryChange(areaId) {
    const that = this;
    await that.continentRegion.map(function (item, index) {
      if (areaId == undefined) {
        if (that.countryId == "中国") {
          that.countryId = 7;
        }
        if (item.areaId == that.countryId) {
          that.provinceRegion = item.subAreaLoc
          that.countryRow = item;
        }
      }
      else {
        if (item.areaId == 1) {
          that.provinceRegion = item.subAreaLoc
        }
      }
    })
  }
  //点击省份 求城市
  async newProvinceChange() {
    const that = this;
    await that.provinceRegion.map(function (item, index) {
      if (item.areaId == that.poviceId) {
        that.cityRegion = item.subAreaLoc
        that.poviceRow = item;
      }
    })
  }

  //点击城市 求城市当前行
  async newCityChange() {
    const that = this;
    await that.cityRegion.map(function (item, index) {
      if (item.areaId == that.cityId) {
        that.cityRow = item;
      }
    })
  }
}
