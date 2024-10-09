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
import{a as z,c as q}from"./chunk-DVG6ROYF.js";import{a as U}from"./chunk-WIE5YNSS.js";import{f as I}from"./chunk-CMXCDAKR.js";import{a as e,e as C}from"./chunk-LJCGAQ64.js";import{a as O}from"./chunk-JFG572S7.js";import{e as j}from"./chunk-U73D6PDD.js";var G={},B=new e,J=new e,_=new e,v=new e,g=[new e,new e],K=new e,W=new e,X=new e,$=new e,ee=new e,te=new e,ne=new e,oe=new e,re=new e,se=new e,F=new I,k=new C;function V(t,a,r,n,l){let o,i=e.angleBetween(e.subtract(a,t,B),e.subtract(r,t,J)),s=n===z.BEVELED?1:Math.ceil(i/O.toRadians(5))+1,c=3*s,u=new Array(c);u[c-3]=r.x,u[c-2]=r.y,u[c-1]=r.z,o=l?C.fromQuaternion(I.fromAxisAngle(e.negate(t,B),i/s,F),k):C.fromQuaternion(I.fromAxisAngle(t,i/s,F),k);let y=0;a=e.clone(a,B);for(let e=0;e<s;e++)a=C.multiplyByVector(o,a,a),u[y++]=a.x,u[y++]=a.y,u[y++]=a.z;return u}function ae(t){let a=K,r=W,n=X,l=t[1];r=e.fromArray(t[1],l.length-3,r),n=e.fromArray(t[0],0,n),a=e.midpoint(r,n,a);let o=V(a,r,n,z.ROUNDED,!1),i=t.length-1,s=t[i-1];l=t[i],r=e.fromArray(s,s.length-3,r),n=e.fromArray(l,0,n),a=e.midpoint(r,n,a);let c=V(a,r,n,z.ROUNDED,!1);return[o,c]}function H(t,a,r,n){let l=B;return n||(a=e.negate(a,a)),l=e.add(t,a,l),[l.x,l.y,l.z,r.x,r.y,r.z]}function T(t,a,r,n){let l=new Array(t.length),o=new Array(t.length),i=e.multiplyByScalar(a,r,B),s=e.negate(i,J),c=0,u=t.length-1;for(let y=0;y<t.length;y+=3){let a=e.fromArray(t,y,_),r=e.add(a,s,v);l[c++]=r.x,l[c++]=r.y,l[c++]=r.z;let n=e.add(a,i,v);o[u--]=n.z,o[u--]=n.y,o[u--]=n.x}return n.push(l,o),n}G.addAttribute=function(e,t,a,r){let n=t.x,l=t.y,o=t.z;j(a)&&(e[a]=n,e[a+1]=l,e[a+2]=o),j(r)&&(e[r]=o,e[r-1]=l,e[r-2]=n)};var le=new e,ce=new e;G.computePositions=function(t){let a=t.granularity,r=t.positions,n=t.ellipsoid,l=t.width/2,o=t.cornerType,i=t.saveAttributes,s=K,c=W,u=X,y=$,m=ee,d=te,p=ne,h=oe,f=re,w=se,x=[],A=i?[]:void 0,S=i?[]:void 0,D=r[0],E=r[1];c=e.normalize(e.subtract(E,D,c),c),s=n.geodeticSurfaceNormal(D,s),y=e.normalize(e.cross(s,c,y),y),i&&(A.push(y.x,y.y,y.z),S.push(s.x,s.y,s.z)),p=e.clone(D,p),D=E,u=e.negate(c,u);let N,b,j,k=[],v=r.length;for(b=1;b<v-1;b++){s=n.geodeticSurfaceNormal(D,s),E=r[b+1],c=e.normalize(e.subtract(E,D,c),c),m=e.normalize(e.add(c,u,m),m);let t=e.multiplyByScalar(s,e.dot(c,s),le);e.subtract(c,t,t),e.normalize(t,t);let j=e.multiplyByScalar(s,e.dot(u,s),ce);if(e.subtract(u,j,j),e.normalize(j,j),!O.equalsEpsilon(Math.abs(e.dot(t,j)),1,O.EPSILON7)){m=e.cross(m,s,m),m=e.cross(s,m,m),m=e.normalize(m,m);let t=l/Math.max(.25,e.magnitude(e.cross(m,u,B))),r=q.angleIsGreaterThanPi(c,u,D,n);m=e.multiplyByScalar(m,t,m),r?(h=e.add(D,m,h),w=e.add(h,e.multiplyByScalar(y,l,w),w),f=e.add(h,e.multiplyByScalar(y,2*l,f),f),g[0]=e.clone(p,g[0]),g[1]=e.clone(w,g[1]),N=U.generateArc({positions:g,granularity:a,ellipsoid:n}),x=T(N,y,l,x),i&&(A.push(y.x,y.y,y.z),S.push(s.x,s.y,s.z)),d=e.clone(f,d),y=e.normalize(e.cross(s,c,y),y),f=e.add(h,e.multiplyByScalar(y,2*l,f),f),p=e.add(h,e.multiplyByScalar(y,l,p),p),o===z.ROUNDED||o===z.BEVELED?k.push({leftPositions:V(h,d,f,o,r)}):k.push({leftPositions:H(D,e.negate(m,m),f,r)})):(f=e.add(D,m,f),w=e.add(f,e.negate(e.multiplyByScalar(y,l,w),w),w),h=e.add(f,e.negate(e.multiplyByScalar(y,2*l,h),h),h),g[0]=e.clone(p,g[0]),g[1]=e.clone(w,g[1]),N=U.generateArc({positions:g,granularity:a,ellipsoid:n}),x=T(N,y,l,x),i&&(A.push(y.x,y.y,y.z),S.push(s.x,s.y,s.z)),d=e.clone(h,d),y=e.normalize(e.cross(s,c,y),y),h=e.add(f,e.negate(e.multiplyByScalar(y,2*l,h),h),h),p=e.add(f,e.negate(e.multiplyByScalar(y,l,p),p),p),o===z.ROUNDED||o===z.BEVELED?k.push({rightPositions:V(f,d,h,o,r)}):k.push({rightPositions:H(D,m,h,r)})),u=e.negate(c,u)}D=E}return s=n.geodeticSurfaceNormal(D,s),g[0]=e.clone(p,g[0]),g[1]=e.clone(D,g[1]),N=U.generateArc({positions:g,granularity:a,ellipsoid:n}),x=T(N,y,l,x),i&&(A.push(y.x,y.y,y.z),S.push(s.x,s.y,s.z)),o===z.ROUNDED&&(j=ae(x)),{positions:x,corners:k,lefts:A,normals:S,endPositions:j}};var we=G;export{we as a};