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
import{a as R}from"./chunk-L5JEMK3W.js";import{a as It}from"./chunk-4FSMRIBR.js";import{a as M}from"./chunk-K62YE2WO.js";import{a as bt}from"./chunk-ED2EM7ZX.js";import"./chunk-TLL4Q2KI.js";import"./chunk-4IWHN7T4.js";import"./chunk-PT2EMSIG.js";import"./chunk-REUYHR24.js";import{a as W}from"./chunk-RQXB4B4V.js";import"./chunk-3FEM743H.js";import{h as z}from"./chunk-CMXCDAKR.js";import"./chunk-77ESX6BV.js";import{a as o,b as nt,d as j}from"./chunk-LJCGAQ64.js";import{a as et}from"./chunk-JFG572S7.js";import"./chunk-JZYZ7RT4.js";import"./chunk-IRDBGNMC.js";import"./chunk-42NIXFVW.js";import"./chunk-5YVCOCPP.js";import{e as A}from"./chunk-U73D6PDD.js";var kt=new o,Bt=new j,Nt=new z,E={min:void 0,max:void 0,indexBytesPerElement:void 0};function Pt(t){let e=new Float64Array(t),n=0;E.indexBytesPerElement=e[n++],E.min=e[n++],E.max=e[n++],o.unpack(e,n,kt),n+=o.packedLength,j.unpack(e,n,Bt),n+=j.packedLength,z.unpack(e,n,Nt)}function Tt(t){let e=t.length,n=0;for(let r=0;r<e;++r)n+=R.packedLength+3+t[r].batchIds.length;return n}function Ct(t,e,n){let r=e.length,o=2+r*M.packedLength+1+Tt(n),a=new Float64Array(o),i=0;a[i++]=t,a[i++]=r;for(let f=0;f<r;++f)M.pack(e[f],a,i),i+=M.packedLength;let s=n.length;a[i++]=s;for(let f=0;f<s;++f){let t=n[f];R.pack(t.color,a,i),i+=R.packedLength,a[i++]=t.offset,a[i++]=t.count;let e=t.batchIds,r=e.length;a[i++]=r;for(let n=0;n<r;++n)a[i++]=e[n]}return a}var yt=32767,wt=new o,Ht=new o,St=new o,Ut=new o,Ft=new o,Lt=new nt,Mt=new z;function Rt(t,e){let n;Pt(t.packedBuffer),n=2===E.indexBytesPerElement?new Uint16Array(t.indices):new Uint32Array(t.indices);let r=new Uint16Array(t.positions),a=new Uint32Array(t.counts),i=new Uint32Array(t.indexCounts),s=new Uint32Array(t.batchIds),f=new Uint32Array(t.batchTableColors),c=new Array(a.length),h=kt,l=Bt,u=Nt,m=E.min,p=E.max,d=t.minimumHeights,k=t.maximumHeights;A(d)&&A(k)&&(d=new Float32Array(d),k=new Float32Array(k));let I,g,w,b=r.length/2,y=r.subarray(0,b),N=r.subarray(b,2*b);bt.zigZagDeltaDecode(y,N);let j=new Float64Array(3*b);for(I=0;I<b;++I){let t=y[I],e=N[I],n=et.lerp(u.west,u.east,t/yt),r=et.lerp(u.south,u.north,e/yt),a=nt.fromRadians(n,r,0,Lt),i=l.cartographicToCartesian(a,wt);o.pack(i,j,3*I)}let x=a.length,L=new Array(x),T=new Array(x),B=0,F=0;for(I=0;I<x;++I)L[I]=B,T[I]=F,B+=a[I],F+=i[I];let S=new Float32Array(3*b*2),U=new Uint16Array(2*b),P=new Uint32Array(T.length),C=new Uint32Array(i.length),O=[],D={};for(I=0;I<x;++I)w=f[I],A(D[w])?(D[w].positionLength+=a[I],D[w].indexLength+=i[I],D[w].batchIds.push(I)):D[w]={positionLength:a[I],indexLength:i[I],offset:0,indexOffset:0,batchIds:[I]};let G,Y=0,H=0;for(w in D)if(D.hasOwnProperty(w)){G=D[w],G.offset=Y,G.indexOffset=H;let t=2*G.positionLength,e=2*G.indexLength+6*G.positionLength;Y+=t,H+=e,G.indexLength=e}let V=[];for(w in D)D.hasOwnProperty(w)&&(G=D[w],V.push({color:R.fromRgba(parseInt(w)),offset:G.indexOffset,count:G.indexLength,batchIds:G.batchIds}));for(I=0;I<x;++I){w=f[I],G=D[w];let t=G.offset,e=3*t,r=t,b=L[I],y=a[I],E=s[I],N=m,x=p;A(d)&&A(k)&&(N=d[I],x=k[I]);let R=Number.POSITIVE_INFINITY,B=Number.NEGATIVE_INFINITY,F=Number.POSITIVE_INFINITY,Y=Number.NEGATIVE_INFINITY;for(g=0;g<y;++g){let t=o.unpack(j,3*b+3*g,wt);l.scaleToGeodeticSurface(t,t);let n=l.cartesianToCartographic(t,Lt),a=n.latitude,i=n.longitude;R=Math.min(a,R),B=Math.max(a,B),F=Math.min(i,F),Y=Math.max(i,Y);let s=l.geodeticSurfaceNormal(t,Ht),f=o.multiplyByScalar(s,N,St),c=o.add(t,f,Ut);f=o.multiplyByScalar(s,x,f);let u=o.add(t,f,Ft);o.subtract(u,h,u),o.subtract(c,h,c),o.pack(u,S,e),o.pack(c,S,e+3),U[r]=E,U[r+1]=E,e+=6,r+=2}u=Mt,u.west=F,u.east=Y,u.south=R,u.north=B,c[I]=M.fromRectangle(u,m,p,l);let H=G.indexOffset,V=T[I],W=i[I];for(P[I]=H,g=0;g<W;g+=3){let e=n[V+g]-b,r=n[V+g+1]-b,o=n[V+g+2]-b;O[H++]=2*e+t,O[H++]=2*r+t,O[H++]=2*o+t,O[H++]=2*o+1+t,O[H++]=2*r+1+t,O[H++]=2*e+1+t}for(g=0;g<y;++g){let e=g,n=(g+1)%y;O[H++]=2*e+1+t,O[H++]=2*n+t,O[H++]=2*e+t,O[H++]=2*e+1+t,O[H++]=2*n+1+t,O[H++]=2*n+t}G.offset+=2*y,G.indexOffset=H,C[I]=H-P[I]}O=W.createTypedArray(S.length/3,O);let _=V.length;for(let o=0;o<_;++o){let t=V[o].batchIds,e=0,n=t.length;for(let r=0;r<n;++r)e+=C[t[r]];V[o].count=e}let v=2===O.BYTES_PER_ELEMENT?W.UNSIGNED_SHORT:W.UNSIGNED_INT,J=Ct(v,c,V);return e.push(S.buffer,O.buffer,P.buffer,C.buffer,U.buffer,J.buffer),{positions:S.buffer,indices:O.buffer,indexOffsets:P.buffer,indexCounts:C.buffer,batchIds:U.buffer,packedBuffer:J.buffer}}var Jt=It(Rt);export{Jt as default};