/**
 * @license
 * Cesium - https://github.com/CesiumGS/cesium
 * Version 1.118.1
 *
 * Copyright 2011-2022 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/CesiumGS/cesium/blob/main/LICENSE.md for full licensing details.
 */
import{a as r}from"./chunk-W6AEJFXB.js";import"./chunk-WLRVP2UA.js";import{a as m}from"./chunk-DUVNED7U.js";import"./chunk-RQXB4B4V.js";import"./chunk-MPVEZNKB.js";import"./chunk-FATK2EQ2.js";import"./chunk-3FEM743H.js";import"./chunk-CMXCDAKR.js";import"./chunk-77ESX6BV.js";import{a as s}from"./chunk-LJCGAQ64.js";import"./chunk-JFG572S7.js";import"./chunk-JZYZ7RT4.js";import"./chunk-IRDBGNMC.js";import{a as l}from"./chunk-42NIXFVW.js";import{b as p}from"./chunk-5YVCOCPP.js";import{e as c}from"./chunk-U73D6PDD.js";function n(t){let i=l(t.radius,1),e={radii:new s(i,i,i),stackPartitions:t.stackPartitions,slicePartitions:t.slicePartitions,vertexFormat:t.vertexFormat};this._ellipsoidGeometry=new r(e),this._workerName="createSphereGeometry"}n.packedLength=r.packedLength,n.pack=function(t,i,e){return p.typeOf.object("value",t),r.pack(t._ellipsoidGeometry,i,e)};var f=new r,i={radius:void 0,radii:new s,vertexFormat:new m,stackPartitions:void 0,slicePartitions:void 0};n.unpack=function(t,e,o){let a=r.unpack(t,e,f);return i.vertexFormat=m.clone(a._vertexFormat,i.vertexFormat),i.stackPartitions=a._stackPartitions,i.slicePartitions=a._slicePartitions,c(o)?(s.clone(a._radii,i.radii),o._ellipsoidGeometry=new r(i),o):(i.radius=a._radii.x,new n(i))},n.createGeometry=function(t){return r.createGeometry(t._ellipsoidGeometry)};var d=n;function u(r,t){return c(t)&&(r=d.unpack(r,t)),d.createGeometry(r)}var v=u;export{v as default};