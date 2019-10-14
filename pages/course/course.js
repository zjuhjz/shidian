var api = require("../../modules/api.js")
var router = require("../../modules/router.js")
var appG = require("../../modules/appGlobal.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabCur: 0,
    tabCur2: 0,
    scrollLeft: 0,
    pageSize: 6,
    banners: [],
    catgs: [],
    courseData: [{
        title: "课程报名",
        loading: false,
        pageIndex: 0,
        list: []
      },
      {
        title: "往期课堂",
        loading: false,
        pageIndex: 0,
        list: []
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.inItHistoryMonth()
    this.api_205()
  },
  tabSelect(e) {
    this.setData({
      tabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
  tabSelect2(e) {
    this.setData({
      tabCur2: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
  /**
   * 加载今年历史月份
   */
  inItHistoryMonth() {
    let list = []
    let myDate = new Date()
    let tMonth = myDate.getMonth() + 1
    for (let i = 0; i < tMonth; i++) {
      list.push({
        month: i + 1 + "月",
        list: []
      })
    }
    this.setData({
      ['courseData[1].list']: list
    })
  },

  /**
   * 加载课堂页数据
   */
  api_205: function() {
    var that = this
    //当前选中索引
    let index = this.data.tabCur
    //当前选中项
    let curItem = this.data.courseData[index]

    //是否加载中
    let loading = curItem.loading
    //是否加载完成
    let loadComplete = curItem.loadComplete

    if (!curItem.loading && !curItem.loadComplete) {
      api.post(api.api_205, api.getSign({
        Type: 5,
        Size: that.data.pageSize,
        Index: that.data.courseData[0].pageIndex
      }), function(app, res) {
        if (res.data.Basis.State != api.state.state_200) {
          wx.showToast({
            title: res.data.Basis.Msg,
            icon: 'none',
            duration: 3000
          })
        } else {
          //banner数据
          if (that.data.tabCur == 0 && curItem.pageIndex == 0) {
            res.data.Result.banners.map(function(obj, index, arr) {
              obj.type = "image"
              obj.url = obj.imgurl
            })
            //banner数据
            for (let item of res.data.Result.banners) {
              that.data.banners.push(item)
            }
            that.setData({
              banners: that.data.banners
            })

            //将banner数据写入缓存
            appG.storage.swiper.setCourseBanner(res.data.Result.banners)
          }

          curItem.loading = false
          curItem.pageIndex = curItem.pageIndex + 1
          res.data.Result.course.forEach(function(o, i) {
            o.start_date = appG.util.date.dateFormat(o.start_date,'yyyy-MM-dd')
            curItem.list.push(o)
          })
          that.setData({
            ['courseData[' + index + ']']: curItem
          })
          //是否全部加载完毕
          if (res.data.Result.course.length == 0) {
            curItem.loadComplete = true
            that.setData({
              ['courseData[' + index + ']']: curItem
            })
            wx.showToast({
              title: '加载完成',
              icon: 'success',
              duration: 3000
            })
          }
        }
      })
    }
  },

  /**
   * 加载课程历史数据
   */
  api_207: function() {
    var that = this
    //当前选中索引
    let index = this.data.tabCur
    //当前选中项
    let curItem = this.data.courseData[index]

    api.post(api.api_207, api.getSign({
      Type: 5,
      Size: that.data.pageSize,
      Index: that.data.courseData[0].pageIndex
    }), function(app, res) {
      if (res.data.Basis.State != api.state.state_200) {
        wx.showToast({
          title: res.data.Basis.Msg,
          icon: 'none',
          duration: 3000
        })
      } else {

        curItem.loading = false
        curItem.pageIndex = curItem.pageIndex + 1
        res.data.Result.course.forEach(function(o, i) {
          curItem.list.push(o)
        })
     
      }
    })

  },

  /**
   * 菜单跳转
   */
  goUrl: function(e) {
    //跳转地址
    let url = '../courseDetail/courseDetail?id=' + e.currentTarget.dataset.id
    //跳转
    router.goUrl({
      url: url
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.api_205()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})