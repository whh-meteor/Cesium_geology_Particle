<template>
  <div>
    <div
      id="app"
      style="z-index: 999; position: relative; background-color: aliceblue"
    >
      <VueDragResize
        :isActive="true"
        :w="700"
        :h="100"
        v-on:resizing="resize"
        v-on:dragging="resize"
      >
        <el-button type="" @click="LoadTerrain()">加载地形</el-button>
        <el-button type="" @click="LoadPartial()">加载粒子场</el-button>
        <el-button type="" @click="cutting()">地形开挖</el-button>
        <el-button type="" @click="stopCutting()">停止开挖</el-button>
        <el-button type="" @click="hideSeaArea()">隐藏海洋</el-button>
      </VueDragResize>
    </div>
    <div id="cesiumContainer">
      <SeaParticle v-if="showParticle"></SeaParticle>
      <UnderSeaLayer v-if="showUnderSea"></UnderSeaLayer>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import VueDragResize from 'vue-drag-resize'

import 'cesium/Build/Cesium/Widgets/widgets.css'
import * as Cesium from 'cesium'

import TIFFImageryProvider from 'tiff-imagery-provider'
import proj4 from 'proj4'
import TerrainCutting from './common/TerrainCutting.js'
import SeaParticle from '../components/Particle/Particle'
import TerrainCut from '@/components/TerrainCutting/terrainCutting'
import UnderSeaLayer from '@/components/UnderSeaLayer/underSea'
export default {
  name: 'CesiumViewer',
  components: {
    VueDragResize,
    SeaParticle,
    UnderSeaLayer,
    TerrainCut
  },
  data() {
    return {
      viewer: null,
      TerrainCutting: null,
      config: {
        selectedTerrain: 't8_等值线_100.json',
        offset: 0,
        scale: 3,
        color: '#00ffff'
      },
      width: 0,
      height: 0,
      top: 0,
      left: 0,
      showParticle: false,
      showUnderSea: false
    }
  },
  mounted() {
    window.$supervise = this

    this.init()
    // this.loadZoro()
  },
  methods: {
    stopCutting() {
      this.TerrainCutting.stop()
    },
    cutting() {
      //实例化TerrainCutting类
      this.TerrainCutting = new TerrainCutting(this.viewer)
      //开始挖掘
      this.TerrainCutting.create()
    },
    LoadPartial() {
      this.showParticle = !this.showParticle
    },
    LoadTerrain() {
      this.showUnderSea = !this.showUnderSea
    },
    resize(newRect) {
      this.width = newRect.width
      this.height = newRect.height
      this.top = newRect.top
      this.left = newRect.left
    },
    fly() {
      this.viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          124.10841361613471,
          28.399574509614315,
          1000000
        ),
        orientation: {
          heading: Cesium.Math.toRadians(0),
          pitch: -0.9764350593431694,
          roll: 0.0
        },
        duration: 1
      })
    },
    hideSeaArea() {
      const scene = this.viewer.scene
      const globe = scene.globe

      const reset = () => {
        let baseLayer = viewer.scene.imageryLayers.get(0)
        globe.showGroundAtmosphere = true
        globe.baseColor = Cesium.Color.BLUE
        globe.translucency.enabled = false
        globe.translucency.frontFaceAlpha = 1.0
        globe.translucency.rectangle = undefined
        globe.undergroundColor = Cesium.Color.BLACK
        baseLayer.colorToAlpha = undefined
      }

      const loadWaterEntity = () => {
        let baseLayer = viewer.scene.imageryLayers.get(0)
        globe.showGroundAtmosphere = false
        globe.baseColor = Cesium.Color.TRANSPARENT
        globe.translucency.enabled = true
        globe.undergroundColor = undefined

        baseLayer.colorToAlpha = new Cesium.Color(0.0, 0.016, 0.059)
        baseLayer.colorToAlphaThreshold = 0.2

        const mantleRadius = 6300000.0
        const sphere = new Cesium.SphereGeometry({
          radius: mantleRadius,
          vertexFormat: Cesium.VertexFormat.POSITION_NORMAL_AND_ST
        })
        const geometry = Cesium.SphereGeometry.createGeometry(sphere)
        let inst = new Cesium.GeometryInstance({
          geometry: geometry
        })
        let aper = new Cesium.MaterialAppearance({
          material: new Cesium.Material({
            fabric: {
              uniforms: {
                iTime: 0
              },
              source: `
                    const int NUM_STEPS = 8;
                    const float PI = 3.141592;
                    const float EPSILON = 1e-3;
                    //#define EPSILON_NRM (0.1 / iResolution.x)
                    #define EPSILON_NRM (0.1 / 200.0)
                    // sea
                    const int ITER_GEOMETRY = 3;
                    const int ITER_FRAGMENT = 5;
                    const float SEA_HEIGHT = 0.6;
                    const float SEA_CHOPPY = 4.0;
                    const float SEA_SPEED = 1.8;
                    const float SEA_FREQ = 0.16;
                    const vec3 SEA_BASE = vec3(0.1,0.19,0.22);
                    const vec3 SEA_WATER_COLOR = vec3(0.8,0.9,0.6);
                    //#define SEA_TIME (1.0 + iTime * SEA_SPEED)
                    const mat2 octave_m = mat2(1.6,1.2,-1.2,1.6);
                    // math
                    mat3 fromEuler(vec3 ang) {
                        vec2 a1 = vec2(sin(ang.x),cos(ang.x));
                        vec2 a2 = vec2(sin(ang.y),cos(ang.y));
                        vec2 a3 = vec2(sin(ang.z),cos(ang.z));
                        mat3 m;
                        m[0] = vec3(a1.y*a3.y+a1.x*a2.x*a3.x,a1.y*a2.x*a3.x+a3.y*a1.x,-a2.y*a3.x);
                        m[1] = vec3(-a2.y*a1.x,a1.y*a2.y,a2.x);
                        m[2] = vec3(a3.y*a1.x*a2.x+a1.y*a3.x,a1.x*a3.x-a1.y*a3.y*a2.x,a2.y*a3.y);
                        return m;
                    }
                    float hash( vec2 p ) {
                        float h = dot(p,vec2(127.1,311.7));
                        return fract(sin(h)*43758.5453123);
                    }
                    float noise( in vec2 p ) {
                        vec2 i = floor( p );
                        vec2 f = fract( p );
                        vec2 u = f*f*(3.0-2.0*f);
                        return -1.0+2.0*mix( mix( hash( i + vec2(0.0,0.0) ),
                                hash( i + vec2(1.0,0.0) ), u.x),
                            mix( hash( i + vec2(0.0,1.0) ),
                                hash( i + vec2(1.0,1.0) ), u.x), u.y);
                    }
                    // lighting
                    float diffuse(vec3 n,vec3 l,float p) {
                        return pow(dot(n,l) * 0.4 + 0.6,p);
                    }
                    float specular(vec3 n,vec3 l,vec3 e,float s) {
                        float nrm = (s + 8.0) / (PI * 8.0);
                        return pow(max(dot(reflect(e,n),l),0.0),s) * nrm;
                    }
                    // sky
                    vec3 getSkyColor(vec3 e) {
                        e.y = max(e.y,0.0);
                        return vec3(pow(1.0-e.y,2.0), 1.0-e.y, 0.6+(1.0-e.y)*0.4);
                    }
                    // sea
                    float sea_octave(vec2 uv, float choppy) {
                        uv += noise(uv);
                        vec2 wv = 1.0-abs(sin(uv));
                        vec2 swv = abs(cos(uv));
                        wv = mix(wv,swv,wv);
                        return pow(1.0-pow(wv.x * wv.y,0.65),choppy);
                    }
                    float map(vec3 p) {
                        float freq = SEA_FREQ;
                        float amp = SEA_HEIGHT;
                        float choppy = SEA_CHOPPY;
                        vec2 uv = p.xz; uv.x *= 0.75;
                        float d, h = 0.0;
                        float SEA_TIME = 1.0 + iTime * SEA_SPEED;
                        for (int i = 0; i < ITER_GEOMETRY; i++) {
                            d = sea_octave((uv+SEA_TIME)*freq,choppy);
                            d += sea_octave((uv-SEA_TIME)*freq,choppy);
                            h += d * amp;
                            uv *= octave_m; freq *= 1.9; amp *= 0.22;
                            choppy = mix(choppy,1.0,0.2);
                        }
                        return p.y - h;
                    }
                    float map_detailed(vec3 p) {
                        float freq = SEA_FREQ;
                        float amp = SEA_HEIGHT;
                        float choppy = SEA_CHOPPY;
                        vec2 uv = p.xz; uv.x *= 0.75;
                        float SEA_TIME = 1.0 + iTime * SEA_SPEED;
                        float d, h = 0.0;
                        for (int i = 0; i < ITER_FRAGMENT; i++) {
                            d = sea_octave((uv+SEA_TIME)*freq,choppy);
                            d += sea_octave((uv-SEA_TIME)*freq,choppy);
                            h += d * amp;
                            uv *= octave_m; freq *= 1.9; amp *= 0.22;
                            choppy = mix(choppy,1.0,0.2);
                        }
                        return p.y - h;
                    }
                    vec3 getSeaColor(vec3 p, vec3 n, vec3 l, vec3 eye, vec3 dist) {
                        float fresnel = clamp(1.0 - dot(n,-eye), 0.0, 1.0);
                        fresnel = pow(fresnel,3.0) * 0.65;
                        vec3 reflected = getSkyColor(reflect(eye,n));
                        vec3 refracted = SEA_BASE + diffuse(n,l,80.0) * SEA_WATER_COLOR * 0.12;
                        vec3 color = mix(refracted,reflected,fresnel);
                        float atten = max(1.0 - dot(dist,dist) * 0.001, 0.0);
                        color += SEA_WATER_COLOR * (p.y - SEA_HEIGHT) * 0.18 * atten;
                        color += vec3(specular(n,l,eye,60.0));
                        return color;
                    }
                    // tracing
                    vec3 getNormal(vec3 p, float eps) {
                        vec3 n;
                        n.y = map_detailed(p);
                        n.x = map_detailed(vec3(p.x+eps,p.y,p.z)) - n.y;
                        n.z = map_detailed(vec3(p.x,p.y,p.z+eps)) - n.y;
                        n.y = eps;
                        return normalize(n);
                    }
                    float heightMapTracing(vec3 ori, vec3 dir, out vec3 p) {
                        float tm = 0.0;
                        float tx = 1000.0;
                        float hx = map(ori + dir * tx);
                        if(hx > 0.0) return tx;
                        float hm = map(ori + dir * tm);
                        float tmid = 0.0;
                        for (int i = 0; i < NUM_STEPS; i++) {
                            tmid = mix(tm,tx, hm/(hm-hx));
                            p = ori + dir * tmid;
                            float hmid = map(p);
                            if (hmid < 0.0) {
                                tx = tmid;
                                hx = hmid;
                            } else {
                                tm = tmid;
                                hm = hmid;
                            }
                        }
                        return tmid;
                    }
                    vec4 czm_getMaterial(vec2 vUv)
                    {
                        vec2 uv = vUv;
                        uv = vUv * 2.0 - 1.0;
                        float time = iTime * 0.3 + 0.0*0.01;
                        // ray
                        vec3 ang = vec3(0, 1.2, 0.0);
                        vec3 ori = vec3(0.0,3.5,0);
                        vec3 dir = normalize(vec3(uv.xy,-2.0)); dir.z += length(uv) * 0.15;
                        dir = normalize(dir) * fromEuler(ang);
                        // tracing
                        vec3 p;
                        heightMapTracing(ori,dir,p);
                        vec3 dist = p - ori;
                        vec3 n = getNormal(p, dot(dist,dist) * EPSILON_NRM);
                        vec3 light = normalize(vec3(0.0,1.0,0.8));
                        // color
                        vec3 color = mix(
                        getSkyColor(dir),
                        getSeaColor(p,n,light,dir,dist),
                        pow(smoothstep(0.0,-0.05,dir.y),0.3));
                        return vec4( pow(color,vec3(0.75)), 1.0 );
                    }
                `
            }
          }),
          translucent: true,
          vertexShaderSource: `
            in vec3 position3DHigh;
            in vec3 position3DLow;
            in float batchId;
            in vec2 st;
            in vec3 normal;
            out vec2 v_st;
            out vec3 v_positionEC;
            out vec3 v_normalEC;
            void main() {
                v_st = st;
                vec4 p = czm_computePosition();
                v_positionEC = (czm_modelViewRelativeToEye * p).xyz;      // position in eye coordinates
                v_normalEC = czm_normal * normal;                         // normal in eye coordinates
                gl_Position = czm_modelViewProjectionRelativeToEye * p;
            }
        `,
          fragmentShaderSource: `
            in vec2 v_st;
            in vec3 v_positionEC;
            in vec3 v_normalEC;
            void main()  {
                vec3 positionToEyeEC = -v_positionEC;
                vec3 normalEC = normalize(v_normalEC);
                czm_materialInput materialInput;
                materialInput.normalEC = normalEC;
                materialInput.positionToEyeEC = positionToEyeEC;
                materialInput.st = v_st;
                vec4 color = czm_getMaterial(v_st);
                out_FragColor = color;
            }
        `
        })
        viewer.scene.primitives.add(
          new Cesium.Primitive({
            geometryInstances: inst,
            appearance: aper,
            asynchronous: false
          })
        )
        const renderLoop = (timestamp) => {
          aper.material.uniforms.iTime = timestamp / 1000
          requestAnimationFrame(renderLoop)
        }
        renderLoop()
      }

      // const baseLayer = this.viewer.scene.imageryLayers.get(0)

      // // 隐藏地球的地面大气层
      // globe.showGroundAtmosphere = false

      // //设置地球的基础颜色为透明，以便隐藏海洋
      // // globe.baseColor = Cesium.Color.TRANSPARENT
      // globe.baseColor = Cesium.Color.fromAlpha(Cesium.Color.WHITE, 0.1) // 完全不透明

      // // 启用地球的半透明功能，使地球表面可以根据颜色进行透明化处理
      // globe.translucency.enabled = true

      // // 清除地下颜色设置（默认情况下禁用地下颜色）
      // globe.undergroundColor = undefined

      // // 将基础图层的颜色设为透明，以隐藏特定颜色的部分（通常是黑色）
      // baseLayer.colorToAlpha = new Cesium.Color(0.0, 0.0, 0.0)

      // // 设置透明化阈值，低于此值的颜色将变得透明
      // baseLayer.colorToAlphaThreshold = 0.22

      // // 重新渲染场景
      // this.viewer.scene.requestRender()
    },
    //初始化地图
    init() {
      Cesium.Ion.defaultAccessToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlMjA3MDk1Ni05YTUxLTQ1YTItYTgxNS1iZTQwODM4NDVmOTciLCJpZCI6MjI1NjE0LCJpYXQiOjE3MTk4MjYxNDR9.nMeglmI4UqBSGUtKT2g6oegxXgBYvR1ATaZ34rrN5OI'

      let viewer = (this.viewer = new Cesium.Viewer('cesiumContainer', {
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
      }))
      this.viewer.scene.globe.depthTestAgainstTerrain = true
      this.viewer.scene.screenSpaceCameraController.minimumZoomDistance = -1000
      this.viewer.scene.camera.constrainedAxis = Cesium.Cartesian3.UNIT_Z
      this.fly()
      window.viewer = viewer
    },
    loadZoro() {
      const outerCoreRadius = 6000000
      this.viewer.entities.add({
        name: 'Outer Core',
        position: Cesium.Cartesian3.ZERO,
        ellipsoid: {
          radii: new Cesium.Cartesian3(
            outerCoreRadius,
            outerCoreRadius,
            outerCoreRadius
          ),
          material: Cesium.Color.BLACK.withAlpha(0.5)
        }
      })
    }
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
