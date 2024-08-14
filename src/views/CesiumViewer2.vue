<template>
  <div id="cesiumContainer"></div>
</template>

<script>
/* eslint-disable */
import { Particle3D, Vortex } from 'cesium-particle'

import 'cesium/Build/Cesium/Widgets/widgets.css'
import * as Cesium from 'cesium'
import * as dat from 'dat.gui'
export default {
  name: 'CesiumViewer',
  data() {
    return {
      viewer: null
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    //初始化地图
    init() {
      Cesium.Ion.defaultAccessToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlMjA3MDk1Ni05YTUxLTQ1YTItYTgxNS1iZTQwODM4NDVmOTciLCJpZCI6MjI1NjE0LCJpYXQiOjE3MTk4MjYxNDR9.nMeglmI4UqBSGUtKT2g6oegxXgBYvR1ATaZ34rrN5OI'

      this.viewer = new Cesium.Viewer('cesiumContainer', {
        // terrainProvider: Cesium.createWorldTerrain(),
        animation: false, // 是否显示动画控件
        homeButton: true, // 是否显示home键
        geocoder: true, // 是否显示地名查找控件        如果设置为true，则无法查询
        baseLayerPicker: true, // 是否显示图层选择控件
        timeline: true, // 是否显示时间线控件
        fullscreenButton: true, // 是否全屏显示
        scene3DOnly: false, // 如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
        infoBox: true, // 是否显示点击要素之后显示的信息
        sceneModePicker: true, // 是否显示投影方式控件  三维/二维
        navigationInstructionsInitiallyVisible: true,
        navigationHelpButton: true, // 是否显示帮助信息控件
        selectionIndicator: true, // 是否显示指示器组件
        // 加载天地图
        imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
          url: 'http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=19b72f6cde5c8b49cf21ea2bb4c5b21e',
          layer: 'tdtBasicLayer',
          style: 'default',
          format: 'image/jpeg',
          tileMatrixSetID: 'GoogleMapsCompatible',
          show: false,
          mininumLevel: 0,
          maximumLevel: 16
        })
      })
      // this.loadParticle('/nc/5_mask_result_00.nc')
      // this.loadParticle('/nc/5_mask_result_01.nc')
      // this.loadParticle('/nc/5_mask_result_02.nc')
      // this.loadParticle('/nc/5_mask_result_03.nc')
      this.loadParticle('/nc/5_mask_result_04.nc')
      // this.useTranslucencyMask()
    },
    loadParticle(url) {
      var viewer = this.viewer

      // 粒子系统配置
      const systemOptions = {
        offset: { lon: 100000, lat: 100000, lev: 0 },
        maxParticles: 250000, // 最大粒子数(会自动取平方数)
        particleHeight: 1000.0, // 粒子高度
        fadeOpacity: 0.996, // 拖尾透明度
        dropRate: 0.003, // 粒子重置率
        dropRateBump: 0.01, // 随速度增加的粒子重置率百分比，速度越快越密集，
        // 最终的粒子重置率particleDropRate = dropRate + dropRateBump * speedNorm;
        speedFactor: 1.0, // 粒子速度
        lineWidth: 4.0, // 线宽
        dynamic: true // 是否动态运行
      }

      // 粒子颜色色带
      // const colorTable = [
      //   [0.015686, 0.054902, 0.847059],
      //   [0.12549, 0.313725, 1.0]
      // ]
      // 粒子颜色色带
      const colorTable = [
        [0.015686, 0.054902, 0.847059], // 深蓝色，表示低速
        [0.12549, 0.313725, 1.0], // 蓝色
        [0.0, 0.807843, 0.819608], // 青色
        [0.0, 0.988235, 0.0], // 绿色
        [1.0, 1.0, 0.0], // 黄色，表示中速
        [1.0, 0.647059, 0.0], // 橙色
        [1.0, 0.0, 0.0] // 红色，表示高速
      ]
      fetch(url)
        .then((response) => response.blob())
        .then((blob) => {
          // 将 blob 传递给 Particle3D
          const particleObj = new Particle3D(this.viewer, {
            input: blob,
            colorTable: colorTable,

            systemOptions: systemOptions,
            fields: {
              U: 'water_u',
              V: 'water_v',
              H: 'water_u',
              W: 'water_u'
            }
          })
          // console.log(particleObj)
          // particleObj.data.H.forEach((element) => {
          //   element = 10000
          // })
          console.log(particleObj)
          particleObj.init().then(() => {
            particleObj.show()
          })
          // 更新粒子系统配置的回调函数
          function updateOptions() {
            particleObj.optionsChange(systemOptions)
          }

          // 初始化dat.GUI
          const gui = new dat.GUI()

          // 添加控制面板选项
          gui
            .add(systemOptions, 'maxParticles', 1000, 10000)
            .onChange(updateOptions)
          gui
            .add(systemOptions, 'particleHeight', 0, 5000)
            .onChange(updateOptions)
          gui
            .add(systemOptions, 'fadeOpacity', 0.9, 1.0)
            .onChange(updateOptions)
          gui.add(systemOptions, 'dropRate', 0.0, 0.1).onChange(updateOptions)
          gui
            .add(systemOptions, 'dropRateBump', 0.0, 0.1)
            .onChange(updateOptions)
          gui
            .add(systemOptions, 'speedFactor', 0.1, 5.0)
            .onChange(updateOptions)
          gui.add(systemOptions, 'lineWidth', 1.0, 10.0).onChange(updateOptions)
        })
      // // 第二种
      // // 构建涡旋模型对象
      // const parameter = [[120, 30, 100], 5, 5, 2000, 0.1, 0.1, 2000] // [['lon', 'lat', 'lev'], 'radiusX', 'radiusY', 'height', 'dx', 'dy', 'dz']
      // const jsonData = new Vortex(...parameter).getData()
      // // 从json数据生成粒子系统对象
      // const particleObj2 = new Particle3D(viewer, {
      //   input: jsonData,
      //   type: 'json', // 必填
      //   userInput: systemOptions,
      //   colorTable: colorTable,
      //   colour: 'height' // 颜色变化跟随速度,可选值: 'speed'(defalut) or 'height'
      // })

      // systemOptions.fadeOpacity = 0.9
      // particleObj.optionsChange(systemOptions) // 更新粒子系统配置

      // particleObj.hide() // 停止粒子系统
      // particleObj.remove() // 移除粒子系统
    },
    loadGeoJson(url) {
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          data.features.forEach((feature) => {
            const geometry = feature.geometry
            const properties = feature.properties

            if (geometry.type === 'Polygon') {
              this.addPolygon(geometry.coordinates, properties)
            } else if (geometry.type === 'MultiPolygon') {
              this.addMultiPolygon(geometry.coordinates, properties)
            }
          })
        })
    },
    addPolygon(coordinates, properties) {
      console.log('Polygon')
      const positions = Cesium.Cartesian3.fromDegreesArray(
        coordinates[0].flat()
      )
      const entity = {
        polygon: {
          hierarchy: new Cesium.PolygonHierarchy(positions),
          material: Cesium.Color.RED.withAlpha(0.5),
          height: properties.height || 1000
        }
      }
      this.entities.push(entity)
    },
    addMultiPolygon(coordinates, properties) {
      // console.log('Multi')
      coordinates.forEach((polygon) => {
        console.log(polygon)
        this.addPolygon(polygon, properties)
      })
    }
  },
  //隐藏海洋
  useTranslucencyMask() {
    const scene = this.viewer.scene
    const globe = scene.globe
    const baseLayer = this.viewer.scene.imageryLayers.get(0)
    globe.showGroundAtmosphere = false
    globe.baseColor = Cesium.Color.TRANSPARENT
    globe.translucency.enabled = true
    globe.undergroundColor = undefined

    baseLayer.colorToAlpha = new Cesium.Color(0.0, 0.0, 0.0)
    baseLayer.colorToAlphaThreshold = 0.2
  }
}
</script>

<style lang="scss" scoped>
#cesiumContainer {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
