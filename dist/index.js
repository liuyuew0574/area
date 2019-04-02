import request from '~/utils/request'
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
    this.subAreaList = [];
    this.AsiaList = [];
    this.continentRegion = [];
    this.provinceRegion = [];
    this.cityRegion = [];
    this.continent = "";
    this.country = "";
    this.povice = "";
    this.city = "";
    this.continentId = 1;
    this.countryId = 7;
    this.poviceId = "";
    this.cityId = "";
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
  newAreaLoc(isAsia) {
    const that = this;
    that.api.AreaLoc().then(function (res) {
      if (res.isCompleted) {
        that.subAreaList = res.data;//res.data[0]亚洲  res.data[0].subAreaLoc 中国
        if (isAsia == false)//默认给亚洲
        {
          that.newContinentChange()
          that.newCountryChange()
        }
      } else {
        that.$message.error(res.message)
      }
    })
  }
  //点击洲 求国家
  newContinentChange() {
    const that = this;
    that.subAreaList.map(function (item, index) {
      if (item.areaId == that.continentId) {
        that.continentRegion = item.subAreaLoc
      }
    })
  }
  //点击国家 求省份
  newCountryChange(areaId) {
    const that = this;
    // that.countryId = areaId;

    that.continentRegion.map(function (item, index) {
      if (areaId == undefined) {
        if (item.areaId == that.countryId) {
          that.provinceRegion = item.subAreaLoc
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
  newProvinceChange() {
    const that = this;
    that.provinceRegion.map(function (item, index) {
      if (item.areaId == that.poviceId) {
        that.cityRegion = item.subAreaLoc
      }
    })
  }
}
