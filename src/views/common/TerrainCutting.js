import 'cesium/Build/Cesium/Widgets/widgets.css'
import * as Cesium from 'cesium'
/* eslint-disable */

//保存区域挖掘数据

export default class TerrainCutting {
  constructor(viewer) {
    this.viewer = viewer
    // 注册区域挖掘
    this.clippingPlanesArray = []
    this.clippingPoint = []
    this.temporayrPolygonEntity = null
    this.clippingWallEntities = null
    this.clippingBootomWallEntities = null
    this.activeClickPick = null
    this.infoWindowElement = null
    this.preRenderEvent = null
    this.clippingDeepValue = 20
    this.cesiumEventState = ''
  }

  create() {
    // 开始之前清除数据
    this.cesiumEvent = new Cesium.ScreenSpaceEventHandler(
      this.viewer.scene.canvas
    )
    this.cesiumEvent.setInputAction((event) => {
      // 更新鼠标状态
      this.cesiumEventState = 'leftClick'
      // 当前点击覆盖物
      this.activeClickPick = this.viewer.scene.pick(event.position)
      // 点击空白区域重新绘制
      if (!this.activeClickPick || !this.activeClickPick.id) {
        // 恢复地形开挖状态
        if (this.clippingWallEntities) {
          this.destroy()
        }
        // 绘制地形开挖边界
        this.saveClippingPlaneCollectionData(event)
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

    // 鼠标按下事件
    this.cesiumEvent.setInputAction((event) => {
      // 更新鼠标状态
      this.cesiumEventState = 'leftDown'
      // 当前点击覆盖物
      this.activeClickPick = this.viewer.scene.pick(event.position)
      if (this.clippingWallEntities) {
        if (this.activeClickPick && this.activeClickPick.id) {
          // 选中点击位置
          this.selectClickPoint()
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN)

    // 鼠标抬起事件
    this.cesiumEvent.setInputAction((event) => {
      // 更新鼠标状态
      this.cesiumEventState = 'leftUp'
    }, Cesium.ScreenSpaceEventType.LEFT_UP)

    // 鼠标移动事件
    this.cesiumEvent.setInputAction((event) => {
      if (this.activeClickPick && this.activeClickPick.id) {
        // 判断鼠标是否为按压状态
        if (this.cesiumEventState === 'leftDown') {
          this.changeLayerPointPostion(event)
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

    this.cesiumEvent.setInputAction((event) => {
      // 更新鼠标状态
      this.cesiumEventState = 'rightClick'
      this.clippingPlaneCollection()
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
  }

  // 保存区域挖掘数据
  saveClippingPlaneCollectionData(event) {
    const cartesian = this.viewer.camera.pickEllipsoid(
      event.position,
      this.viewer.scene.globe.ellipsoid
    )
    this.clippingPlanesArray.push(cartesian)

    // 绘制点
    const clippingPoint = this.viewer.entities.add({
      name: '定位点',
      position: cartesian,
      point: {
        color: Cesium.Color.SKYBLUE,
        pixelSize: 10,
        outlineColor: Cesium.Color.YELLOW,
        outlineWidth: 3,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
      }
    })
    this.clippingPoint.push(clippingPoint)

    // 绘制开挖区域
    if (!this.temporayrPolygonEntity) {
      this.temporayrPolygonEntity = this.viewer.entities.add({
        polygon: {
          hierarchy: new Cesium.CallbackProperty(() => {
            return new Cesium.PolygonHierarchy(this.clippingPlanesArray)
          }, false), // 添加了 isConstant 参数
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          material: Cesium.Color.RED.withAlpha(0.5)
        }
      })
    }
  }

  // 开始挖掘
  // clippingPlaneCollection() {
  //   // 开始挖掘之前移除已经挖掘过的区域
  //   if (this.clippingWallEntities) {
  //     this.viewer.entities.remove(this.clippingWallEntities)
  //     this.clippingWallEntities = null
  //   }

  //   if (this.clippingBootomWallEntities) {
  //     this.viewer.entities.remove(this.clippingBootomWallEntities)
  //     this.clippingBootomWallEntities = null
  //   }

  //   this.viewer.scene.globe.clippingPlanes = new Cesium.ClippingPlaneCollection(
  //     {
  //       planes: [],
  //       edgeWidth: 0
  //     }
  //   )

  //   const points = this.clippingPlanesArray
  //   const pointsLength = points.length
  //   const clippingPlanes = []
  //   for (let i = 0; i < pointsLength; ++i) {
  //     const nextIndex = (i + 1) % pointsLength

  //     let midpoint = Cesium.Cartesian3.add(
  //       points[i],
  //       points[nextIndex],
  //       new Cesium.Cartesian3()
  //     )
  //     midpoint = Cesium.Cartesian3.multiplyByScalar(midpoint, 0.5, midpoint)

  //     const up = Cesium.Cartesian3.normalize(midpoint, new Cesium.Cartesian3())
  //     let right = Cesium.Cartesian3.subtract(
  //       points[nextIndex],
  //       midpoint,
  //       new Cesium.Cartesian3()
  //     )
  //     right = Cesium.Cartesian3.normalize(right, right)

  //     let normal = Cesium.Cartesian3.cross(right, up, new Cesium.Cartesian3())
  //     normal = Cesium.Cartesian3.normalize(normal, normal)

  //     const originCenteredPlane = new Cesium.Plane(normal, 0.0)
  //     const distance = Cesium.Plane.getPointDistance(
  //       originCenteredPlane,
  //       midpoint
  //     )

  //     clippingPlanes.push(new Cesium.ClippingPlane(normal, distance))
  //   }

  //   this.viewer.scene.globe.clippingPlanes = new Cesium.ClippingPlaneCollection(
  //     {
  //       planes: clippingPlanes,
  //       edgeWidth: 1
  //     }
  //   )

  //   // 侧边墙体
  //   this.clippingWallEntities = this.viewer.entities.add({
  //     corridor: {
  //       positions: [
  //         ...this.clippingPlanesArray,
  //         this.clippingPlanesArray[0],
  //         this.clippingPlanesArray[1]
  //       ],
  //       height: this.clippingDeepValue * -1,
  //       extrudedHeight: 0,
  //       width: 1,
  //       cornerType: Cesium.CornerType.ROUNDED,
  //       material: Cesium.Color.fromCssColorString('rgba(66,187,133,1)'),
  //       outline: false
  //     }
  //   })

  //   // 底部墙体
  //   this.clippingBootomWallEntities = this.viewer.entities.add({
  //     polygon: {
  //       hierarchy: this.clippingPlanesArray,
  //       height: this.clippingDeepValue * -1,
  //       extrudedHeight: this.clippingDeepValue * -1 + 1,
  //       material: Cesium.Color.YELLOW
  //     }
  //   })

  //   // 挖掘结束显示弹窗
  //   this.showTooltip()
  // }
  clippingPlaneCollection() {
    // 清除已有的挖掘区域
    if (this.clippingWallEntities) {
      this.viewer.entities.remove(this.clippingWallEntities)
      this.clippingWallEntities = null
    }

    if (this.clippingBootomWallEntities) {
      this.viewer.entities.remove(this.clippingBootomWallEntities)
      this.clippingBootomWallEntities = null
    }

    this.viewer.scene.globe.clippingPlanes = new Cesium.ClippingPlaneCollection(
      {
        planes: [],
        edgeWidth: 0
      }
    )

    const points = this.clippingPlanesArray
    const pointsLength = points.length
    const clippingPlanes = []

    for (let i = 0; i < pointsLength; ++i) {
      const nextIndex = (i + 1) % pointsLength

      let midpoint = Cesium.Cartesian3.add(
        points[i],
        points[nextIndex],
        new Cesium.Cartesian3()
      )
      midpoint = Cesium.Cartesian3.multiplyByScalar(midpoint, 0.5, midpoint)

      let up = Cesium.Cartesian3.normalize(midpoint, new Cesium.Cartesian3())
      let right = Cesium.Cartesian3.subtract(
        points[nextIndex],
        midpoint,
        new Cesium.Cartesian3()
      )
      right = Cesium.Cartesian3.normalize(right, right)

      // Ensure 'right' vector is not a zero vector before normalizing
      if (
        Cesium.Cartesian3.equalsEpsilon(
          right,
          Cesium.Cartesian3.ZERO,
          Cesium.Math.EPSILON6
        )
      ) {
        continue // Skip this iteration if 'right' is a zero vector
      }

      let normal = Cesium.Cartesian3.cross(right, up, new Cesium.Cartesian3())
      normal = Cesium.Cartesian3.normalize(normal, normal)

      // Ensure 'normal' vector is not a zero vector
      if (
        Cesium.Cartesian3.equalsEpsilon(
          normal,
          Cesium.Cartesian3.ZERO,
          Cesium.Math.EPSILON6
        )
      ) {
        continue // Skip this iteration if 'normal' is a zero vector
      }

      const originCenteredPlane = new Cesium.Plane(normal, 0.0)
      const distance = Cesium.Plane.getPointDistance(
        originCenteredPlane,
        midpoint
      )

      clippingPlanes.push(new Cesium.ClippingPlane(normal, distance))
    }

    this.viewer.scene.globe.clippingPlanes = new Cesium.ClippingPlaneCollection(
      {
        planes: clippingPlanes,
        edgeWidth: 1
      }
    )

    // 侧边墙体
    this.clippingWallEntities = this.viewer.entities.add({
      corridor: {
        positions: [
          ...this.clippingPlanesArray,
          this.clippingPlanesArray[0],
          this.clippingPlanesArray[1]
        ],
        height: this.clippingDeepValue * -1,
        extrudedHeight: 0,
        width: 1,
        cornerType: Cesium.CornerType.ROUNDED,
        material: Cesium.Color.fromCssColorString('rgba(66,187,133,1)'),
        outline: false
      }
    })

    // 底部墙体
    this.clippingBootomWallEntities = this.viewer.entities.add({
      polygon: {
        hierarchy: this.clippingPlanesArray,
        height: this.clippingDeepValue * -1,
        extrudedHeight: this.clippingDeepValue * -1 + 1,
        material: Cesium.Color.YELLOW
      }
    })

    // 挖掘结束显示弹窗
    this.showTooltip()
  }

  // 修改定位点选中状态
  selectClickPoint() {
    if (this.activeClickPick.id.name === '定位点') {
      for (let i = 0; i < this.clippingPoint.length; i++) {
        this.clippingPoint[i].point.color = Cesium.Color.SKYBLUE
      }
      this.activeClickPick.id.point.color = Cesium.Color.RED
    }
  }

  // 修改选中点的位置，更新矩形边框位置
  changeLayerPointPostion(event) {
    const cartesian = this.viewer.camera.pickEllipsoid(
      event.endPosition,
      this.viewer.scene.globe.ellipsoid
    )
    this.activeClickPick.id.position = cartesian

    // 根据ID得到修改的index
    let activeIndex = -1
    for (let i = 0; i < this.clippingPoint.length; i++) {
      if (this.activeClickPick.id._id === this.clippingPoint[i]._id) {
        activeIndex = i
      }
    }
    this.clippingPlanesArray[activeIndex] = cartesian

    // 修改挖掘区域
    if (this.clippingWallEntities) {
      this.clippingPlaneCollection()
    }
  }

  // 停止挖掘
  stop() {
    if (this.cesiumEvent) {
      this.cesiumEvent.destroy()
    }
    if (this.temporayrPolygonEntity) {
      this.viewer.entities.remove(this.temporayrPolygonEntity)
      this.clippingPlanesArray = []
      this.temporayrPolygonEntity = null
    }
    if (this.clippingWallEntities) {
      this.viewer.entities.remove(this.clippingWallEntities)
      this.clippingWallEntities = null
    }
    if (this.clippingBootomWallEntities) {
      this.viewer.entities.remove(this.clippingBootomWallEntities)
      this.clippingBootomWallEntities = null
    }
    if (this.clippingPoint.length > 0) {
      for (let i = 0; i < this.clippingPoint.length; i++) {
        this.viewer.entities.remove(this.clippingPoint[i])
      }
      this.clippingPoint = []
    }
    this.viewer.scene.globe.clippingPlanes = new Cesium.ClippingPlaneCollection(
      {
        planes: [],
        edgeWidth: 0
      }
    )
    if (this.infoWindowElement) {
      document
        .getElementById('cesiumContainer')
        .removeChild(this.infoWindowElement)
      this.infoWindowElement = null
      this.preRenderEvent()
    }
  }

  // 销毁整个工具类
  destroy() {
    if (this.temporayrPolygonEntity) {
      this.viewer.entities.remove(this.temporayrPolygonEntity)
      this.clippingPlanesArray = []
      this.temporayrPolygonEntity = null
    }
    if (this.clippingWallEntities) {
      this.viewer.entities.remove(this.clippingWallEntities)
      this.clippingWallEntities = null
    }
    if (this.clippingBootomWallEntities) {
      this.viewer.entities.remove(this.clippingBootomWallEntities)
      this.clippingBootomWallEntities = null
    }
    if (this.clippingPoint.length > 0) {
      for (let i = 0; i < this.clippingPoint.length; i++) {
        this.viewer.entities.remove(this.clippingPoint[i])
      }
      this.clippingPoint = []
    }

    this.viewer.scene.globe.clippingPlanes = new Cesium.ClippingPlaneCollection(
      {
        planes: [],
        edgeWidth: 0
      }
    )

    if (this.infoWindowElement) {
      document
        .getElementById('cesiumContainer')
        .removeChild(this.infoWindowElement)
      this.infoWindowElement = null
      this.preRenderEvent()
    }
  }

  // 显示信息弹窗
  showTooltip() {
    if (!this.infoWindowElement) {
      this.infoWindowElement = document.createElement('div')
      this.infoWindowElement.style.position = 'absolute'
      this.infoWindowElement.style.left = '0px'
      this.infoWindowElement.style.top = '0px'
      this.infoWindowElement.innerHTML = `
        <div style="max-width:300px;">
          <div id="deepWindowInfoBox" style="padding:20px;background:rgba(18,40,82,1);border-radius:10px;transition:all 350ms;">
            <div style="margin-top:10px;color:#fff;display:flex;">
              <span>挖掘深度(m)：</span>
              <div style="flex:1;">
                <input value=${this.clippingDeepValue} style="color:#000;border:none;outline:none;background:#fff;" id="deepHeightInput"/>
              </div>
            </div>
            <div style="margin-top:10px;color:#fff;">
              <span>面积：</span>
              <span>--</span>
            </div>
            <div style="margin-top:10px;color:#fff;">
              <span>周长：</span>
              <span>--</span>
            </div>
            <div style="margin-top:10px;color:#fff;">
              <span>土壤类型：粘土</span>
            </div>
            <div style="margin-top:10px;color:#fff;">
              <span>铺设建议：</span>
              <span style="color:rgb(255, 103, 0);">对溢流混合污水进行适当处理。即将排水管网溢流的混合污水先进行适当处理,包括细</span>
            </div>
          </div>
          <div style="
            width: 0;
            height: 0;
            margin-left:20px;
            border-top: 15px solid rgba(18,40,82,1);
            border-right:10px solid transparent;
            border-left:10px solid transparent;
          "></div>
        </div>
      `
      document
        .getElementById('cesiumContainer')
        .appendChild(this.infoWindowElement)

      // 检测深度
      document
        .getElementById('deepHeightInput')
        .addEventListener('input', (e) => {
          // 判断是否为数据
          if (/^\d+$/.test(e.target.value)) {
            this.clippingDeepValue = parseInt(e.target.value)
            // 修改挖掘区域
            this.clippingPlaneCollection()
          }
        })

      this.preRenderEvent = this.viewer.scene.preRender.addEventListener(() => {
        if (this.infoWindowElement) {
          const canvasPosition = this.viewer.scene.cartesianToCanvasCoordinates(
            this.clippingPlanesArray[this.clippingPlanesArray.length - 1],
            new Cesium.Cartesian2()
          )

          this.infoWindowElement.style.left = canvasPosition.x - 25 + 'px'
          this.infoWindowElement.style.top =
            canvasPosition.y - this.infoWindowElement.offsetHeight - 10 + 'px'
        }
      })
    }
  }
}
