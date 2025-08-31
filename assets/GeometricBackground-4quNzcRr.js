import{c,u as g,r as f,j as e}from"./index-BEfNt5Qr.js";import{B as n}from"./building-2-BXDw061y.js";import{H as i}from"./handshake-DxoQt3Ch.js";import{T as r}from"./trending-up-B7FTWjE9.js";/**
 * @license lucide-react v0.541.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u=[["path",{d:"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8",key:"5wwlr5"}],["path",{d:"M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",key:"1d0kgt"}]],o=c("house",u);/**
 * @license lucide-react v0.541.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=[["path",{d:"M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z",key:"1s6t7t"}],["circle",{cx:"16.5",cy:"7.5",r:".5",fill:"currentColor",key:"w0ekpg"}]],l=c("key-round",k),v=()=>{const{settings:t}=g(),{show:d,lineOpacity:p,shapeOpacity:m,iconOpacity:h}=f.useMemo(()=>{const a=Math.max(0,Math.min(100,t.backgroundIntensity??40));return{show:(t.backgroundStyle||"geometric")==="geometric",lineOpacity:a/800,shapeOpacity:a/1e3+.02,iconOpacity:a/900}},[t.backgroundIntensity,t.backgroundStyle]);return d?e.jsxs("div",{"aria-hidden":"true",className:"pointer-events-none fixed inset-0 -z-10 [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.9),rgba(0,0,0,0.6)_40%,rgba(0,0,0,0.35)_75%,rgba(0,0,0,0.15))]",children:[e.jsx("style",{children:`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-16px); }
          100% { transform: translateY(0px); }
        }
        @keyframes polygonMove {
          0% { transform: translateX(0px) scale(1); }
          50% { transform: translateX(12px) scale(1.04); }
          100% { transform: translateX(0px) scale(1); }
        }
        @keyframes gridGlow {
          0%,100% { filter: drop-shadow(0 0 0px #fff); }
          50% { filter: drop-shadow(0 0 8px #3B82F6); }
        }
      `}),e.jsxs("svg",{className:"absolute inset-0 h-full w-full text-primary",role:"img",children:[e.jsx("defs",{children:e.jsx("pattern",{id:"grid",width:"48",height:"48",patternUnits:"userSpaceOnUse",children:e.jsx("path",{d:"M 48 0 L 0 0 0 48",fill:"none",stroke:"currentColor",strokeWidth:"1"})})}),e.jsx("rect",{width:"100%",height:"100%",fill:"hsl(var(--background))"}),e.jsx("rect",{width:"100%",height:"100%",fill:"url(#grid)",opacity:p,style:{animation:"gridGlow 4s ease-in-out infinite"}}),e.jsxs("g",{className:"text-accent",opacity:m,children:[e.jsx("polygon",{points:"0,120 220,0 0,0",fill:"currentColor",style:{animation:"polygonMove 6s ease-in-out infinite"}}),e.jsx("polygon",{points:"0,260 320,0 220,0 0,120",fill:"currentColor",style:{animation:"polygonMove 7s ease-in-out infinite",animationDelay:"1s"}})]})]}),t.showThemedIcons!==!1&&e.jsx("div",{className:"absolute inset-0 grid grid-cols-3 md:grid-cols-5 place-items-center gap-8",children:[{C:n,key:"b1"},{C:o,key:"h1"},{C:i,key:"hs1"},{C:r,key:"t1"},{C:l,key:"k1"},{C:o,key:"h2"},{C:n,key:"b2"},{C:r,key:"t2"},{C:i,key:"hs2"},{C:l,key:"k2"}].map(({C:a,key:y},s)=>e.jsx("div",{className:`hidden sm:block ${s%2===0?"text-primary":"text-accent"}`,style:{opacity:h,animation:`float ${5+s}s ease-in-out infinite`,animationDelay:`${s*.7}s`},children:e.jsx(a,{className:"w-16 h-16 md:w-20 md:h-20"})},y))})]}):null};export{v as G,o as H};
