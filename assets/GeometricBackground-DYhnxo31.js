import{u as h,r as g,j as e}from"./index-CrDTbQSZ.js";import{B as i}from"./building-2-Lq2HeLu3.js";import{H as n,a as r,K as o}from"./key-round-C84UPOmz.js";import{T as l}from"./trending-up-DbqeOlPB.js";const j=()=>{const{settings:t}=h(),{show:c,lineOpacity:d,shapeOpacity:m,iconOpacity:p}=g.useMemo(()=>{const s=Math.max(0,Math.min(100,t.backgroundIntensity??40));return{show:(t.backgroundStyle||"geometric")==="geometric",lineOpacity:s/800,shapeOpacity:s/1e3+.02,iconOpacity:s/900}},[t.backgroundIntensity,t.backgroundStyle]);return c?e.jsxs("div",{"aria-hidden":"true",className:"pointer-events-none fixed inset-0 -z-10 [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.9),rgba(0,0,0,0.6)_40%,rgba(0,0,0,0.35)_75%,rgba(0,0,0,0.15))]",children:[e.jsx("style",{children:`
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
      `}),e.jsxs("svg",{className:"absolute inset-0 h-full w-full text-primary",role:"img",children:[e.jsx("defs",{children:e.jsx("pattern",{id:"grid",width:"48",height:"48",patternUnits:"userSpaceOnUse",children:e.jsx("path",{d:"M 48 0 L 0 0 0 48",fill:"none",stroke:"currentColor",strokeWidth:"1"})})}),e.jsx("rect",{width:"100%",height:"100%",fill:"hsl(var(--background))"}),e.jsx("rect",{width:"100%",height:"100%",fill:"url(#grid)",opacity:d,style:{animation:"gridGlow 4s ease-in-out infinite"}}),e.jsxs("g",{className:"text-accent",opacity:m,children:[e.jsx("polygon",{points:"0,120 220,0 0,0",fill:"currentColor",style:{animation:"polygonMove 6s ease-in-out infinite"}}),e.jsx("polygon",{points:"0,260 320,0 220,0 0,120",fill:"currentColor",style:{animation:"polygonMove 7s ease-in-out infinite",animationDelay:"1s"}})]})]}),t.showThemedIcons!==!1&&e.jsx("div",{className:"absolute inset-0 grid grid-cols-3 md:grid-cols-5 place-items-center gap-8",children:[{C:i,key:"b1"},{C:n,key:"h1"},{C:r,key:"hs1"},{C:l,key:"t1"},{C:o,key:"k1"},{C:n,key:"h2"},{C:i,key:"b2"},{C:l,key:"t2"},{C:r,key:"hs2"},{C:o,key:"k2"}].map(({C:s,key:y},a)=>e.jsx("div",{className:`hidden sm:block ${a%2===0?"text-primary":"text-accent"}`,style:{opacity:p,animation:`float ${5+a}s ease-in-out infinite`,animationDelay:`${a*.7}s`},children:e.jsx(s,{className:"w-16 h-16 md:w-20 md:h-20"})},y))})]}):null};export{j as G};
