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
import{a as O}from"./chunk-3FEM743H.js";import{h as I,i as V}from"./chunk-CMXCDAKR.js";import{a as W,b as v}from"./chunk-LJCGAQ64.js";import{a as R}from"./chunk-JFG572S7.js";import{a as k}from"./chunk-5YVCOCPP.js";import{e as N}from"./chunk-U73D6PDD.js";var z=Math.cos,Z=Math.sin,D=Math.sqrt,L={computePosition:function(t,n,a,r,o,s,e){let i=n.radiiSquared,g=t.nwCorner,h=t.boundingRectangle,l=g.latitude-t.granYCos*r+o*t.granXSin,u=z(l),c=Z(l),C=i.z*c,S=g.longitude+r*t.granYSin+o*t.granXCos,w=u*z(S),m=u*Z(S),R=i.x*w,d=i.y*m,O=D(R*w+d*m+C*c);if(s.x=R/O,s.y=d/O,s.z=C/O,a){let n=t.stNwCorner;N(n)?(l=n.latitude-t.stGranYCos*r+o*t.stGranXSin,S=n.longitude+r*t.stGranYSin+o*t.stGranXCos,e.x=(S-t.stWest)*t.lonScalar,e.y=(l-t.stSouth)*t.latScalar):(e.x=(S-h.west)*t.lonScalar,e.y=(l-h.south)*t.latScalar)}}},A=new V,g=new W,F=new v,b=new W,q=new O;function B(t,n,a,r,o,s,e){let i=Math.cos(n),h=r*i,l=a*i,u=Math.sin(n),c=r*u,C=a*u;g=q.project(t,g),g=W.subtract(g,b,g);let S=V.fromRotation(n,A);g=V.multiplyByVector(S,g,g),g=W.add(g,b,g),t=q.unproject(g,t),s-=1,e-=1;let w=t.latitude,m=w+s*C,R=w-h*e,d=w-h*e+s*C,O=Math.max(w,m,R,d),p=Math.min(w,m,R,d),X=t.longitude,Y=X+s*l,f=X+e*c,I=X+e*c+s*l,_=Math.max(X,Y,f,I),M=Math.min(X,Y,f,I);return{north:O,south:p,east:_,west:M,granYCos:h,granYSin:c,granXCos:l,granXSin:C,nwCorner:t}}L.computeOptions=function(t,n,a,r,o,s,e){let i=t.east,g=t.west,h=t.north,l=t.south,u=!1,c=!1;h===R.PI_OVER_TWO&&(u=!0),l===-R.PI_OVER_TWO&&(c=!0);let C,S=h-l;C=g>i?R.TWO_PI-g+i:i-g;let w=Math.ceil(C/n)+1,m=Math.ceil(S/n)+1,d=C/(w-1),O=S/(m-1),p=I.northwest(t,s),X=I.center(t,F);(0!==a||0!==r)&&(X.longitude<p.longitude&&(X.longitude+=R.TWO_PI),b=q.project(X,b));let Y=O,W=d,f=0,_=0,M=I.clone(t,o),P={granYCos:Y,granYSin:f,granXCos:W,granXSin:_,nwCorner:p,boundingRectangle:M,width:w,height:m,northCap:u,southCap:c};if(0!==a){let t=B(p,a,d,O,X,w,m);if(h=t.north,l=t.south,i=t.east,g=t.west,h<-R.PI_OVER_TWO||h>R.PI_OVER_TWO||l<-R.PI_OVER_TWO||l>R.PI_OVER_TWO)throw new k("Rotated rectangle is invalid.  It crosses over either the north or south pole.");P.granYCos=t.granYCos,P.granYSin=t.granYSin,P.granXCos=t.granXCos,P.granXSin=t.granXSin,M.north=h,M.south=l,M.east=i,M.west=g}if(0!==r){a-=r;let t=I.northwest(M,e),n=B(t,a,d,O,X,w,m);P.stGranYCos=n.granYCos,P.stGranXCos=n.granXCos,P.stGranYSin=n.granYSin,P.stGranXSin=n.granXSin,P.stNwCorner=t,P.stWest=n.west,P.stSouth=n.south}return P};var nt=L;export{nt as a};