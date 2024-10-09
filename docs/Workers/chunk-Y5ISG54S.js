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
import{f as C}from"./chunk-CMXCDAKR.js";import{a as n,e as b}from"./chunk-LJCGAQ64.js";import{a as w}from"./chunk-JFG572S7.js";var j={},q=new n,L=new n,Q=new C,G=new b;function W(e,t,r,a,o,i,l,s,y,c){let m=e+t;n.multiplyByScalar(a,Math.cos(m),q),n.multiplyByScalar(r,Math.sin(m),L),n.add(q,L,q);let u=Math.cos(e);u*=u;let w=Math.sin(e);w*=w;let x=i/Math.sqrt(l*u+o*w)/s;return C.fromAxisAngle(q,x,Q),b.fromQuaternion(Q,G),b.multiplyByVector(G,y,c),n.normalize(c,c),n.multiplyByScalar(c,s,c),c}var U=new n,Z=new n,N=new n,v=new n;j.raisePositionsToHeight=function(e,t,r){let a=t.ellipsoid,o=t.height,i=t.extrudedHeight,l=r?e.length/3*2:e.length/3,s=new Float64Array(3*l),y=e.length,c=r?y:0;for(let m=0;m<y;m+=3){let t=m+1,l=m+2,y=n.fromArray(e,m,U);a.scaleToGeodeticSurface(y,y);let u=n.clone(y,Z),w=a.geodeticSurfaceNormal(y,v),x=n.multiplyByScalar(w,o,N);n.add(y,x,y),r&&(n.multiplyByScalar(w,i,x),n.add(u,x,u),s[m+c]=u.x,s[t+c]=u.y,s[l+c]=u.z),s[m]=y.x,s[t]=y.y,s[l]=y.z}return s};var D=new n,J=new n,K=new n;j.computeEllipsePositions=function(e,t,r){let a=e.semiMinorAxis,o=e.semiMajorAxis,i=e.rotation,l=e.center,s=8*e.granularity,y=a*a,c=o*o,m=o*a,u=n.magnitude(l),x=n.normalize(l,D),h=n.cross(n.UNIT_Z,l,J);h=n.normalize(h,h);let f=n.cross(x,h,K),z=1+Math.ceil(w.PI_OVER_TWO/s),_=w.PI_OVER_TWO/(z-1),p=w.PI_OVER_TWO-z*_;p<0&&(z-=Math.ceil(Math.abs(p)/_));let O,d,P,M,I,T=z*(z+2)*2,g=t?new Array(3*T):void 0,A=0,E=U,R=Z,V=4*z*3,j=V-1,v=0,S=r?new Array(V):void 0;for(p=w.PI_OVER_TWO,E=W(p,i,f,h,y,m,c,u,x,E),t&&(g[A++]=E.x,g[A++]=E.y,g[A++]=E.z),r&&(S[j--]=E.z,S[j--]=E.y,S[j--]=E.x),p=w.PI_OVER_TWO-_,O=1;O<z+1;++O){if(E=W(p,i,f,h,y,m,c,u,x,E),R=W(Math.PI-p,i,f,h,y,m,c,u,x,R),t){for(g[A++]=E.x,g[A++]=E.y,g[A++]=E.z,P=2*O+2,d=1;d<P-1;++d)M=d/(P-1),I=n.lerp(E,R,M,N),g[A++]=I.x,g[A++]=I.y,g[A++]=I.z;g[A++]=R.x,g[A++]=R.y,g[A++]=R.z}r&&(S[j--]=E.z,S[j--]=E.y,S[j--]=E.x,S[v++]=R.x,S[v++]=R.y,S[v++]=R.z),p=w.PI_OVER_TWO-(O+1)*_}for(O=z;O>1;--O){if(p=w.PI_OVER_TWO-(O-1)*_,E=W(-p,i,f,h,y,m,c,u,x,E),R=W(p+Math.PI,i,f,h,y,m,c,u,x,R),t){for(g[A++]=E.x,g[A++]=E.y,g[A++]=E.z,P=2*(O-1)+2,d=1;d<P-1;++d)M=d/(P-1),I=n.lerp(E,R,M,N),g[A++]=I.x,g[A++]=I.y,g[A++]=I.z;g[A++]=R.x,g[A++]=R.y,g[A++]=R.z}r&&(S[j--]=E.z,S[j--]=E.y,S[j--]=E.x,S[v++]=R.x,S[v++]=R.y,S[v++]=R.z)}p=w.PI_OVER_TWO,E=W(-p,i,f,h,y,m,c,u,x,E);let q={};return t&&(g[A++]=E.x,g[A++]=E.y,g[A++]=E.z,q.positions=g,q.numPts=z),r&&(S[j--]=E.z,S[j--]=E.y,S[j--]=E.x,q.outerPositions=S),q};var tt=j;export{tt as a};