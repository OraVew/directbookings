(()=>{var e={};e.id=437,e.ids=[437,660],e.modules={1323:(e,t)=>{"use strict";Object.defineProperty(t,"l",{enumerable:!0,get:function(){return function e(t,r){return r in t?t[r]:"then"in t&&"function"==typeof t.then?t.then(t=>e(t,r)):"function"==typeof t&&"default"===r?t:void 0}}})},7025:(e,t,r)=>{"use strict";r.r(t),r.d(t,{config:()=>_,default:()=>P,getServerSideProps:()=>m,getStaticPaths:()=>y,getStaticProps:()=>b,reportWebVitals:()=>S,routeModule:()=>O,unstable_getServerProps:()=>j,unstable_getServerSideProps:()=>R,unstable_getStaticParams:()=>x,unstable_getStaticPaths:()=>h,unstable_getStaticProps:()=>v});var n={};r.r(n),r.d(n,{default:()=>g});var o=r(7093),u=r(5244),i=r(1323),s=r(1682),a=r.n(s),l=r(8141),c=r.n(l),d=r(997),f=r(6689),p=r(9332);function g(){let[e,t]=(0,f.useState)(null),[r,n]=(0,f.useState)("");return"open"===e?(0,p.redirect)("/"):"complete"===e?d.jsx("section",{id:"success",children:(0,d.jsxs)("p",{children:["We appreciate your business! A confirmation email will be sent to ",r,". If you have any questions, please email ",d.jsx("a",{href:"mailto:orders@example.com",children:"orders@example.com"}),"."]})}):null}let P=(0,i.l)(n,"default"),b=(0,i.l)(n,"getStaticProps"),y=(0,i.l)(n,"getStaticPaths"),m=(0,i.l)(n,"getServerSideProps"),_=(0,i.l)(n,"config"),S=(0,i.l)(n,"reportWebVitals"),v=(0,i.l)(n,"unstable_getStaticProps"),h=(0,i.l)(n,"unstable_getStaticPaths"),x=(0,i.l)(n,"unstable_getStaticParams"),j=(0,i.l)(n,"unstable_getServerProps"),R=(0,i.l)(n,"unstable_getServerSideProps"),O=new o.PagesRouteModule({definition:{kind:u.x.PAGES,page:"/return",pathname:"/return",bundlePath:"",filename:""},components:{App:c(),Document:a()},userland:n})},2782:(e,t,r)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"bailoutToClientRendering",{enumerable:!0,get:function(){return u}});let n=r(5575),o=r(5869);function u(e){let t=o.staticGenerationAsyncStorage.getStore();if((null==t||!t.forceStatic)&&(null==t?void 0:t.isStaticGeneration))throw new n.BailoutToCSRError(e)}("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},31:(e,t,r)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var r in t)Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}(t,{ReadonlyURLSearchParams:function(){return a.ReadonlyURLSearchParams},RedirectType:function(){return a.RedirectType},ServerInsertedHTMLContext:function(){return l.ServerInsertedHTMLContext},notFound:function(){return a.notFound},permanentRedirect:function(){return a.permanentRedirect},redirect:function(){return a.redirect},useParams:function(){return p},usePathname:function(){return d},useRouter:function(){return f},useSearchParams:function(){return c},useSelectedLayoutSegment:function(){return P},useSelectedLayoutSegments:function(){return g},useServerInsertedHTML:function(){return l.useServerInsertedHTML}});let n=r(6689),o=r(7443),u=r(7583),i=r(6162),s=r(3737),a=r(6209),l=r(1575);function c(){let e=(0,n.useContext)(u.SearchParamsContext),t=(0,n.useMemo)(()=>e?new a.ReadonlyURLSearchParams(e):null,[e]);{let{bailoutToClientRendering:e}=r(2782);e("useSearchParams()")}return t}function d(){return(0,n.useContext)(u.PathnameContext)}function f(){let e=(0,n.useContext)(o.AppRouterContext);if(null===e)throw Error("invariant expected app router to be mounted");return e}function p(){return(0,n.useContext)(u.PathParamsContext)}function g(e){void 0===e&&(e="children");let t=(0,n.useContext)(o.LayoutRouterContext);return t?function e(t,r,n,o){let u;if(void 0===n&&(n=!0),void 0===o&&(o=[]),n)u=t[1][r];else{var a;let e=t[1];u=null!=(a=e.children)?a:Object.values(e)[0]}if(!u)return o;let l=u[0],c=(0,i.getSegmentValue)(l);return!c||c.startsWith(s.PAGE_SEGMENT_KEY)?o:(o.push(c),e(u,r,!1,o))}(t.tree,e):null}function P(e){void 0===e&&(e="children");let t=g(e);if(!t||0===t.length)return null;let r="children"===e?t[0]:t[t.length-1];return r===s.DEFAULT_SEGMENT_KEY?null:r}("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},6209:(e,t,r)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var r in t)Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}(t,{ReadonlyURLSearchParams:function(){return i},RedirectType:function(){return n.RedirectType},notFound:function(){return o.notFound},permanentRedirect:function(){return n.permanentRedirect},redirect:function(){return n.redirect}});let n=r(7878),o=r(5610);class u extends Error{constructor(){super("Method unavailable on `ReadonlyURLSearchParams`. Read more: https://nextjs.org/docs/app/api-reference/functions/use-search-params#updating-searchparams")}}class i extends URLSearchParams{append(){throw new u}delete(){throw new u}set(){throw new u}sort(){throw new u}}("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},5610:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var r in t)Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}(t,{isNotFoundError:function(){return o},notFound:function(){return n}});let r="NEXT_NOT_FOUND";function n(){let e=Error(r);throw e.digest=r,e}function o(e){return"object"==typeof e&&null!==e&&"digest"in e&&e.digest===r}("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},9598:(e,t)=>{"use strict";var r;Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"RedirectStatusCode",{enumerable:!0,get:function(){return r}}),function(e){e[e.SeeOther=303]="SeeOther",e[e.TemporaryRedirect=307]="TemporaryRedirect",e[e.PermanentRedirect=308]="PermanentRedirect"}(r||(r={})),("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},7878:(e,t,r)=>{"use strict";var n;Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var r in t)Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}(t,{RedirectType:function(){return n},getRedirectError:function(){return a},getRedirectStatusCodeFromError:function(){return g},getRedirectTypeFromError:function(){return p},getURLFromRedirectError:function(){return f},isRedirectError:function(){return d},permanentRedirect:function(){return c},redirect:function(){return l}});let o=r(4580),u=r(2934),i=r(9598),s="NEXT_REDIRECT";function a(e,t,r){void 0===r&&(r=i.RedirectStatusCode.TemporaryRedirect);let n=Error(s);n.digest=s+";"+t+";"+e+";"+r+";";let u=o.requestAsyncStorage.getStore();return u&&(n.mutableCookies=u.mutableCookies),n}function l(e,t){void 0===t&&(t="replace");let r=u.actionAsyncStorage.getStore();throw a(e,t,(null==r?void 0:r.isAction)?i.RedirectStatusCode.SeeOther:i.RedirectStatusCode.TemporaryRedirect)}function c(e,t){void 0===t&&(t="replace");let r=u.actionAsyncStorage.getStore();throw a(e,t,(null==r?void 0:r.isAction)?i.RedirectStatusCode.SeeOther:i.RedirectStatusCode.PermanentRedirect)}function d(e){if("object"!=typeof e||null===e||!("digest"in e)||"string"!=typeof e.digest)return!1;let[t,r,n,o]=e.digest.split(";",4),u=Number(o);return t===s&&("replace"===r||"push"===r)&&"string"==typeof n&&!isNaN(u)&&u in i.RedirectStatusCode}function f(e){return d(e)?e.digest.split(";",3)[2]:null}function p(e){if(!d(e))throw Error("Not a redirect error");return e.digest.split(";",2)[1]}function g(e){if(!d(e))throw Error("Not a redirect error");return Number(e.digest.split(";",4)[3])}(function(e){e.push="push",e.replace="replace"})(n||(n={})),("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},6162:(e,t)=>{"use strict";function r(e){return Array.isArray(e)?e[1]:e}Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"getSegmentValue",{enumerable:!0,get:function(){return r}}),("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},8141:(e,t,r)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"default",{enumerable:!0,get:function(){return a}});let n=r(5410),o=r(997),u=n._(r(6689)),i=r(5782);async function s(e){let{Component:t,ctx:r}=e;return{pageProps:await (0,i.loadGetInitialProps)(t,r)}}class a extends u.default.Component{render(){let{Component:e,pageProps:t}=this.props;return(0,o.jsx)(e,{...t})}}a.origGetInitialProps=s,a.getInitialProps=s,("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},5575:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var r in t)Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}(t,{BailoutToCSRError:function(){return n},isBailoutToCSRError:function(){return o}});let r="BAILOUT_TO_CLIENT_SIDE_RENDERING";class n extends Error{constructor(e){super("Bail out to client-side rendering: "+e),this.reason=e,this.digest=r}}function o(e){return"object"==typeof e&&null!==e&&"digest"in e&&e.digest===r}},5244:(e,t)=>{"use strict";var r;Object.defineProperty(t,"x",{enumerable:!0,get:function(){return r}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE"}(r||(r={}))},7443:(e,t,r)=>{"use strict";e.exports=r(7093).vendored.contexts.AppRouterContext},7583:(e,t,r)=>{"use strict";e.exports=r(7093).vendored.contexts.HooksClientContext},1575:(e,t,r)=>{"use strict";e.exports=r(7093).vendored.contexts.ServerInsertedHtml},9332:(e,t,r)=>{e.exports=r(31)},2934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},4580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},5869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},2785:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/pages.runtime.prod.js")},6689:e=>{"use strict";e.exports=require("react")},997:e=>{"use strict";e.exports=require("react/jsx-runtime")},1017:e=>{"use strict";e.exports=require("path")}};var t=require("../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),n=t.X(0,[682],()=>r(7025));module.exports=n})();