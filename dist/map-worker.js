var qo=Object.create;var Ki=Object.defineProperty;var Yo=Object.getOwnPropertyDescriptor;var Zo=Object.getOwnPropertyNames;var $o=Object.getPrototypeOf,Jo=Object.prototype.hasOwnProperty;var Ko=(s,t)=>()=>(t||s((t={exports:{}}).exports,t),t.exports),jo=(s,t)=>{for(var e in t)Ki(s,e,{get:t[e],enumerable:!0})},Qo=(s,t,e,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of Zo(t))!Jo.call(s,i)&&i!==e&&Ki(s,i,{get:()=>t[i],enumerable:!(n=Yo(t,i))||n.enumerable});return s};var qn=(s,t,e)=>(e=s!=null?qo($o(s)):{},Qo(t||!s||!s.__esModule?Ki(e,"default",{value:s,enumerable:!0}):e,s));var yn=Ko((ts,es)=>{(function(s,t){typeof ts=="object"&&typeof es<"u"?es.exports=t():typeof define=="function"&&define.amd?define(t):(s=typeof globalThis<"u"?globalThis:s||self,s.polygonClipping=t())})(ts,(function(){"use strict";function s(y,h){var f={label:0,sent:function(){if(p[0]&1)throw p[1];return p[1]},trys:[],ops:[]},m,_,p,M;return M={next:S(0),throw:S(1),return:S(2)},typeof Symbol=="function"&&(M[Symbol.iterator]=function(){return this}),M;function S(C){return function(k){return D([C,k])}}function D(C){if(m)throw new TypeError("Generator is already executing.");for(;f;)try{if(m=1,_&&(p=C[0]&2?_.return:C[0]?_.throw||((p=_.return)&&p.call(_),0):_.next)&&!(p=p.call(_,C[1])).done)return p;switch(_=0,p&&(C=[C[0]&2,p.value]),C[0]){case 0:case 1:p=C;break;case 4:return f.label++,{value:C[1],done:!1};case 5:f.label++,_=C[1],C=[0];continue;case 7:C=f.ops.pop(),f.trys.pop();continue;default:if(p=f.trys,!(p=p.length>0&&p[p.length-1])&&(C[0]===6||C[0]===2)){f=0;continue}if(C[0]===3&&(!p||C[1]>p[0]&&C[1]<p[3])){f.label=C[1];break}if(C[0]===6&&f.label<p[1]){f.label=p[1],p=C;break}if(p&&f.label<p[2]){f.label=p[2],f.ops.push(C);break}p[2]&&f.ops.pop(),f.trys.pop();continue}C=h.call(y,f)}catch(k){C=[6,k],_=0}finally{m=p=0}if(C[0]&5)throw C[1];return{value:C[0]?C[1]:void 0,done:!0}}}var t=(function(){function y(h,f){this.next=null,this.key=h,this.data=f,this.left=null,this.right=null}return y})();function e(y,h){return y>h?1:y<h?-1:0}function n(y,h,f){for(var m=new t(null,null),_=m,p=m;;){var M=f(y,h.key);if(M<0){if(h.left===null)break;if(f(y,h.left.key)<0){var S=h.left;if(h.left=S.right,S.right=h,h=S,h.left===null)break}p.left=h,p=h,h=h.left}else if(M>0){if(h.right===null)break;if(f(y,h.right.key)>0){var S=h.right;if(h.right=S.left,S.left=h,h=S,h.right===null)break}_.right=h,_=h,h=h.right}else break}return _.right=h.left,p.left=h.right,h.left=m.right,h.right=m.left,h}function i(y,h,f,m){var _=new t(y,h);if(f===null)return _.left=_.right=null,_;f=n(y,f,m);var p=m(y,f.key);return p<0?(_.left=f.left,_.right=f,f.left=null):p>=0&&(_.right=f.right,_.left=f,f.right=null),_}function r(y,h,f){var m=null,_=null;if(h){h=n(y,h,f);var p=f(h.key,y);p===0?(m=h.left,_=h.right):p<0?(_=h.right,h.right=null,m=h):(m=h.left,h.left=null,_=h)}return{left:m,right:_}}function o(y,h,f){return h===null?y:(y===null||(h=n(y.key,h,f),h.left=y),h)}function c(y,h,f,m,_){if(y){m(""+h+(f?"\u2514\u2500\u2500 ":"\u251C\u2500\u2500 ")+_(y)+`
`);var p=h+(f?"    ":"\u2502   ");y.left&&c(y.left,p,!1,m,_),y.right&&c(y.right,p,!0,m,_)}}var l=(function(){function y(h){h===void 0&&(h=e),this._root=null,this._size=0,this._comparator=h}return y.prototype.insert=function(h,f){return this._size++,this._root=i(h,f,this._root,this._comparator)},y.prototype.add=function(h,f){var m=new t(h,f);this._root===null&&(m.left=m.right=null,this._size++,this._root=m);var _=this._comparator,p=n(h,this._root,_),M=_(h,p.key);return M===0?this._root=p:(M<0?(m.left=p.left,m.right=p,p.left=null):M>0&&(m.right=p.right,m.left=p,p.right=null),this._size++,this._root=m),this._root},y.prototype.remove=function(h){this._root=this._remove(h,this._root,this._comparator)},y.prototype._remove=function(h,f,m){var _;if(f===null)return null;f=n(h,f,m);var p=m(h,f.key);return p===0?(f.left===null?_=f.right:(_=n(h,f.left,m),_.right=f.right),this._size--,_):f},y.prototype.pop=function(){var h=this._root;if(h){for(;h.left;)h=h.left;return this._root=n(h.key,this._root,this._comparator),this._root=this._remove(h.key,this._root,this._comparator),{key:h.key,data:h.data}}return null},y.prototype.findStatic=function(h){for(var f=this._root,m=this._comparator;f;){var _=m(h,f.key);if(_===0)return f;_<0?f=f.left:f=f.right}return null},y.prototype.find=function(h){return this._root&&(this._root=n(h,this._root,this._comparator),this._comparator(h,this._root.key)!==0)?null:this._root},y.prototype.contains=function(h){for(var f=this._root,m=this._comparator;f;){var _=m(h,f.key);if(_===0)return!0;_<0?f=f.left:f=f.right}return!1},y.prototype.forEach=function(h,f){for(var m=this._root,_=[],p=!1;!p;)m!==null?(_.push(m),m=m.left):_.length!==0?(m=_.pop(),h.call(f,m),m=m.right):p=!0;return this},y.prototype.range=function(h,f,m,_){for(var p=[],M=this._comparator,S=this._root,D;p.length!==0||S;)if(S)p.push(S),S=S.left;else{if(S=p.pop(),D=M(S.key,f),D>0)break;if(M(S.key,h)>=0&&m.call(_,S))return this;S=S.right}return this},y.prototype.keys=function(){var h=[];return this.forEach(function(f){var m=f.key;return h.push(m)}),h},y.prototype.values=function(){var h=[];return this.forEach(function(f){var m=f.data;return h.push(m)}),h},y.prototype.min=function(){return this._root?this.minNode(this._root).key:null},y.prototype.max=function(){return this._root?this.maxNode(this._root).key:null},y.prototype.minNode=function(h){if(h===void 0&&(h=this._root),h)for(;h.left;)h=h.left;return h},y.prototype.maxNode=function(h){if(h===void 0&&(h=this._root),h)for(;h.right;)h=h.right;return h},y.prototype.at=function(h){for(var f=this._root,m=!1,_=0,p=[];!m;)if(f)p.push(f),f=f.left;else if(p.length>0){if(f=p.pop(),_===h)return f;_++,f=f.right}else m=!0;return null},y.prototype.next=function(h){var f=this._root,m=null;if(h.right){for(m=h.right;m.left;)m=m.left;return m}for(var _=this._comparator;f;){var p=_(h.key,f.key);if(p===0)break;p<0?(m=f,f=f.left):f=f.right}return m},y.prototype.prev=function(h){var f=this._root,m=null;if(h.left!==null){for(m=h.left;m.right;)m=m.right;return m}for(var _=this._comparator;f;){var p=_(h.key,f.key);if(p===0)break;p<0?f=f.left:(m=f,f=f.right)}return m},y.prototype.clear=function(){return this._root=null,this._size=0,this},y.prototype.toList=function(){return d(this._root)},y.prototype.load=function(h,f,m){f===void 0&&(f=[]),m===void 0&&(m=!1);var _=h.length,p=this._comparator;if(m&&v(h,f,0,_-1,p),this._root===null)this._root=a(h,f,0,_),this._size=_;else{var M=x(this.toList(),u(h,f),p);_=this._size+_,this._root=g({head:M},0,_)}return this},y.prototype.isEmpty=function(){return this._root===null},Object.defineProperty(y.prototype,"size",{get:function(){return this._size},enumerable:!0,configurable:!0}),Object.defineProperty(y.prototype,"root",{get:function(){return this._root},enumerable:!0,configurable:!0}),y.prototype.toString=function(h){h===void 0&&(h=function(m){return String(m.key)});var f=[];return c(this._root,"",!0,function(m){return f.push(m)},h),f.join("")},y.prototype.update=function(h,f,m){var _=this._comparator,p=r(h,this._root,_),M=p.left,S=p.right;_(h,f)<0?S=i(f,m,S,_):M=i(f,m,M,_),this._root=o(M,S,_)},y.prototype.split=function(h){return r(h,this._root,this._comparator)},y.prototype[Symbol.iterator]=function(){var h,f,m;return s(this,function(_){switch(_.label){case 0:h=this._root,f=[],m=!1,_.label=1;case 1:return m?[3,6]:h===null?[3,2]:(f.push(h),h=h.left,[3,5]);case 2:return f.length===0?[3,4]:(h=f.pop(),[4,h]);case 3:return _.sent(),h=h.right,[3,5];case 4:m=!0,_.label=5;case 5:return[3,1];case 6:return[2]}})},y})();function a(y,h,f,m){var _=m-f;if(_>0){var p=f+Math.floor(_/2),M=y[p],S=h[p],D=new t(M,S);return D.left=a(y,h,f,p),D.right=a(y,h,p+1,m),D}return null}function u(y,h){for(var f=new t(null,null),m=f,_=0;_<y.length;_++)m=m.next=new t(y[_],h[_]);return m.next=null,f.next}function d(y){for(var h=y,f=[],m=!1,_=new t(null,null),p=_;!m;)h?(f.push(h),h=h.left):f.length>0?(h=p=p.next=f.pop(),h=h.right):m=!0;return p.next=null,_.next}function g(y,h,f){var m=f-h;if(m>0){var _=h+Math.floor(m/2),p=g(y,h,_),M=y.head;return M.left=p,y.head=y.head.next,M.right=g(y,_+1,f),M}return null}function x(y,h,f){for(var m=new t(null,null),_=m,p=y,M=h;p!==null&&M!==null;)f(p.key,M.key)<0?(_.next=p,p=p.next):(_.next=M,M=M.next),_=_.next;return p!==null?_.next=p:M!==null&&(_.next=M),m.next}function v(y,h,f,m,_){if(!(f>=m)){for(var p=y[f+m>>1],M=f-1,S=m+1;;){do M++;while(_(y[M],p)<0);do S--;while(_(y[S],p)>0);if(M>=S)break;var D=y[M];y[M]=y[S],y[S]=D,D=h[M],h[M]=h[S],h[S]=D}v(y,h,f,S,_),v(y,h,S+1,m,_)}}let b=(y,h)=>y.ll.x<=h.x&&h.x<=y.ur.x&&y.ll.y<=h.y&&h.y<=y.ur.y,E=(y,h)=>{if(h.ur.x<y.ll.x||y.ur.x<h.ll.x||h.ur.y<y.ll.y||y.ur.y<h.ll.y)return null;let f=y.ll.x<h.ll.x?h.ll.x:y.ll.x,m=y.ur.x<h.ur.x?y.ur.x:h.ur.x,_=y.ll.y<h.ll.y?h.ll.y:y.ll.y,p=y.ur.y<h.ur.y?y.ur.y:h.ur.y;return{ll:{x:f,y:_},ur:{x:m,y:p}}},A=Number.EPSILON;A===void 0&&(A=Math.pow(2,-52));let w=A*A,I=(y,h)=>{if(-A<y&&y<A&&-A<h&&h<A)return 0;let f=y-h;return f*f<w*y*h?0:y<h?-1:1};class T{constructor(){this.reset()}reset(){this.xRounder=new U,this.yRounder=new U}round(h,f){return{x:this.xRounder.round(h),y:this.yRounder.round(f)}}}class U{constructor(){this.tree=new l,this.round(0)}round(h){let f=this.tree.add(h),m=this.tree.prev(f);if(m!==null&&I(f.key,m.key)===0)return this.tree.remove(h),m.key;let _=this.tree.next(f);return _!==null&&I(f.key,_.key)===0?(this.tree.remove(h),_.key):h}}let N=new T,z=11102230246251565e-32,B=134217729,G=(3+8*z)*z;function J(y,h,f,m,_){let p,M,S,D,C=h[0],k=m[0],P=0,F=0;k>C==k>-C?(p=C,C=h[++P]):(p=k,k=m[++F]);let O=0;if(P<y&&F<f)for(k>C==k>-C?(M=C+p,S=p-(M-C),C=h[++P]):(M=k+p,S=p-(M-k),k=m[++F]),p=M,S!==0&&(_[O++]=S);P<y&&F<f;)k>C==k>-C?(M=p+C,D=M-p,S=p-(M-D)+(C-D),C=h[++P]):(M=p+k,D=M-p,S=p-(M-D)+(k-D),k=m[++F]),p=M,S!==0&&(_[O++]=S);for(;P<y;)M=p+C,D=M-p,S=p-(M-D)+(C-D),C=h[++P],p=M,S!==0&&(_[O++]=S);for(;F<f;)M=p+k,D=M-p,S=p-(M-D)+(k-D),k=m[++F],p=M,S!==0&&(_[O++]=S);return(p!==0||O===0)&&(_[O++]=p),O}function j(y,h){let f=h[0];for(let m=1;m<y;m++)f+=h[m];return f}function et(y){return new Float64Array(y)}let nt=(3+16*z)*z,st=(2+12*z)*z,ut=(9+64*z)*z*z,_t=et(4),Dt=et(8),at=et(12),mt=et(16),pt=et(4);function It(y,h,f,m,_,p,M){let S,D,C,k,P,F,O,W,q,Z,Y,K,tt,it,lt,ct,gt,ft,yt=y-_,At=f-_,bt=h-p,Ft=m-p;it=yt*Ft,F=B*yt,O=F-(F-yt),W=yt-O,F=B*Ft,q=F-(F-Ft),Z=Ft-q,lt=W*Z-(it-O*q-W*q-O*Z),ct=bt*At,F=B*bt,O=F-(F-bt),W=bt-O,F=B*At,q=F-(F-At),Z=At-q,gt=W*Z-(ct-O*q-W*q-O*Z),Y=lt-gt,P=lt-Y,_t[0]=lt-(Y+P)+(P-gt),K=it+Y,P=K-it,tt=it-(K-P)+(Y-P),Y=tt-ct,P=tt-Y,_t[1]=tt-(Y+P)+(P-ct),ft=K+Y,P=ft-K,_t[2]=K-(ft-P)+(Y-P),_t[3]=ft;let qt=j(4,_t),fe=st*M;if(qt>=fe||-qt>=fe||(P=y-yt,S=y-(yt+P)+(P-_),P=f-At,C=f-(At+P)+(P-_),P=h-bt,D=h-(bt+P)+(P-p),P=m-Ft,k=m-(Ft+P)+(P-p),S===0&&D===0&&C===0&&k===0)||(fe=ut*M+G*Math.abs(qt),qt+=yt*k+Ft*S-(bt*C+At*D),qt>=fe||-qt>=fe))return qt;it=S*Ft,F=B*S,O=F-(F-S),W=S-O,F=B*Ft,q=F-(F-Ft),Z=Ft-q,lt=W*Z-(it-O*q-W*q-O*Z),ct=D*At,F=B*D,O=F-(F-D),W=D-O,F=B*At,q=F-(F-At),Z=At-q,gt=W*Z-(ct-O*q-W*q-O*Z),Y=lt-gt,P=lt-Y,pt[0]=lt-(Y+P)+(P-gt),K=it+Y,P=K-it,tt=it-(K-P)+(Y-P),Y=tt-ct,P=tt-Y,pt[1]=tt-(Y+P)+(P-ct),ft=K+Y,P=ft-K,pt[2]=K-(ft-P)+(Y-P),pt[3]=ft;let $i=J(4,_t,4,pt,Dt);it=yt*k,F=B*yt,O=F-(F-yt),W=yt-O,F=B*k,q=F-(F-k),Z=k-q,lt=W*Z-(it-O*q-W*q-O*Z),ct=bt*C,F=B*bt,O=F-(F-bt),W=bt-O,F=B*C,q=F-(F-C),Z=C-q,gt=W*Z-(ct-O*q-W*q-O*Z),Y=lt-gt,P=lt-Y,pt[0]=lt-(Y+P)+(P-gt),K=it+Y,P=K-it,tt=it-(K-P)+(Y-P),Y=tt-ct,P=tt-Y,pt[1]=tt-(Y+P)+(P-ct),ft=K+Y,P=ft-K,pt[2]=K-(ft-P)+(Y-P),pt[3]=ft;let Ji=J($i,Dt,4,pt,at);it=S*k,F=B*S,O=F-(F-S),W=S-O,F=B*k,q=F-(F-k),Z=k-q,lt=W*Z-(it-O*q-W*q-O*Z),ct=D*C,F=B*D,O=F-(F-D),W=D-O,F=B*C,q=F-(F-C),Z=C-q,gt=W*Z-(ct-O*q-W*q-O*Z),Y=lt-gt,P=lt-Y,pt[0]=lt-(Y+P)+(P-gt),K=it+Y,P=K-it,tt=it-(K-P)+(Y-P),Y=tt-ct,P=tt-Y,pt[1]=tt-(Y+P)+(P-ct),ft=K+Y,P=ft-K,pt[2]=K-(ft-P)+(Y-P),pt[3]=ft;let Xo=J(Ji,at,4,pt,mt);return mt[Xo-1]}function Bt(y,h,f,m,_,p){let M=(h-p)*(f-_),S=(y-_)*(m-p),D=M-S,C=Math.abs(M+S);return Math.abs(D)>=nt*C?D:-It(y,h,f,m,_,p,C)}let Vt=(y,h)=>y.x*h.y-y.y*h.x,Qt=(y,h)=>y.x*h.x+y.y*h.y,se=(y,h,f)=>{let m=Bt(y.x,y.y,h.x,h.y,f.x,f.y);return m>0?-1:m<0?1:0},We=y=>Math.sqrt(Qt(y,y)),Gi=(y,h,f)=>{let m={x:h.x-y.x,y:h.y-y.y},_={x:f.x-y.x,y:f.y-y.y};return Vt(_,m)/We(_)/We(m)},Wi=(y,h,f)=>{let m={x:h.x-y.x,y:h.y-y.y},_={x:f.x-y.x,y:f.y-y.y};return Qt(_,m)/We(_)/We(m)},Gn=(y,h,f)=>h.y===0?null:{x:y.x+h.x/h.y*(f-y.y),y:f},pn=(y,h,f)=>h.x===0?null:{x:f,y:y.y+h.y/h.x*(f-y.x)},Xi=(y,h,f,m)=>{if(h.x===0)return pn(f,m,y.x);if(m.x===0)return pn(y,h,f.x);if(h.y===0)return Gn(f,m,y.y);if(m.y===0)return Gn(y,h,f.y);let _=Vt(h,m);if(_==0)return null;let p={x:f.x-y.x,y:f.y-y.y},M=Vt(p,h)/_,S=Vt(p,m)/_,D=y.x+S*h.x,C=f.x+M*m.x,k=y.y+S*h.y,P=f.y+M*m.y,F=(D+C)/2,O=(k+P)/2;return{x:F,y:O}};class Xt{static compare(h,f){let m=Xt.comparePoints(h.point,f.point);return m!==0?m:(h.point!==f.point&&h.link(f),h.isLeft!==f.isLeft?h.isLeft?1:-1:ue.compare(h.segment,f.segment))}static comparePoints(h,f){return h.x<f.x?-1:h.x>f.x?1:h.y<f.y?-1:h.y>f.y?1:0}constructor(h,f){h.events===void 0?h.events=[this]:h.events.push(this),this.point=h,this.isLeft=f}link(h){if(h.point===this.point)throw new Error("Tried to link already linked events");let f=h.point.events;for(let m=0,_=f.length;m<_;m++){let p=f[m];this.point.events.push(p),p.point=this.point}this.checkForConsuming()}checkForConsuming(){let h=this.point.events.length;for(let f=0;f<h;f++){let m=this.point.events[f];if(m.segment.consumedBy===void 0)for(let _=f+1;_<h;_++){let p=this.point.events[_];p.consumedBy===void 0&&m.otherSE.point.events===p.otherSE.point.events&&m.segment.consume(p.segment)}}}getAvailableLinkedEvents(){let h=[];for(let f=0,m=this.point.events.length;f<m;f++){let _=this.point.events[f];_!==this&&!_.segment.ringOut&&_.segment.isInResult()&&h.push(_)}return h}getLeftmostComparator(h){let f=new Map,m=_=>{let p=_.otherSE;f.set(_,{sine:Gi(this.point,h.point,p.point),cosine:Wi(this.point,h.point,p.point)})};return(_,p)=>{f.has(_)||m(_),f.has(p)||m(p);let{sine:M,cosine:S}=f.get(_),{sine:D,cosine:C}=f.get(p);return M>=0&&D>=0?S<C?1:S>C?-1:0:M<0&&D<0?S<C?-1:S>C?1:0:D<M?-1:D>M?1:0}}}let qi=0;class ue{static compare(h,f){let m=h.leftSE.point.x,_=f.leftSE.point.x,p=h.rightSE.point.x,M=f.rightSE.point.x;if(M<m)return 1;if(p<_)return-1;let S=h.leftSE.point.y,D=f.leftSE.point.y,C=h.rightSE.point.y,k=f.rightSE.point.y;if(m<_){if(D<S&&D<C)return 1;if(D>S&&D>C)return-1;let P=h.comparePoint(f.leftSE.point);if(P<0)return 1;if(P>0)return-1;let F=f.comparePoint(h.rightSE.point);return F!==0?F:-1}if(m>_){if(S<D&&S<k)return-1;if(S>D&&S>k)return 1;let P=f.comparePoint(h.leftSE.point);if(P!==0)return P;let F=h.comparePoint(f.rightSE.point);return F<0?1:F>0?-1:1}if(S<D)return-1;if(S>D)return 1;if(p<M){let P=f.comparePoint(h.rightSE.point);if(P!==0)return P}if(p>M){let P=h.comparePoint(f.rightSE.point);if(P<0)return 1;if(P>0)return-1}if(p!==M){let P=C-S,F=p-m,O=k-D,W=M-_;if(P>F&&O<W)return 1;if(P<F&&O>W)return-1}return p>M?1:p<M||C<k?-1:C>k?1:h.id<f.id?-1:h.id>f.id?1:0}constructor(h,f,m,_){this.id=++qi,this.leftSE=h,h.segment=this,h.otherSE=f,this.rightSE=f,f.segment=this,f.otherSE=h,this.rings=m,this.windings=_}static fromRing(h,f,m){let _,p,M,S=Xt.comparePoints(h,f);if(S<0)_=h,p=f,M=1;else if(S>0)_=f,p=h,M=-1;else throw new Error(`Tried to create degenerate segment at [${h.x}, ${h.y}]`);let D=new Xt(_,!0),C=new Xt(p,!1);return new ue(D,C,[m],[M])}replaceRightSE(h){this.rightSE=h,this.rightSE.segment=this,this.rightSE.otherSE=this.leftSE,this.leftSE.otherSE=this.rightSE}bbox(){let h=this.leftSE.point.y,f=this.rightSE.point.y;return{ll:{x:this.leftSE.point.x,y:h<f?h:f},ur:{x:this.rightSE.point.x,y:h>f?h:f}}}vector(){return{x:this.rightSE.point.x-this.leftSE.point.x,y:this.rightSE.point.y-this.leftSE.point.y}}isAnEndpoint(h){return h.x===this.leftSE.point.x&&h.y===this.leftSE.point.y||h.x===this.rightSE.point.x&&h.y===this.rightSE.point.y}comparePoint(h){if(this.isAnEndpoint(h))return 0;let f=this.leftSE.point,m=this.rightSE.point,_=this.vector();if(f.x===m.x)return h.x===f.x?0:h.x<f.x?1:-1;let p=(h.y-f.y)/_.y,M=f.x+p*_.x;if(h.x===M)return 0;let S=(h.x-f.x)/_.x,D=f.y+S*_.y;return h.y===D?0:h.y<D?-1:1}getIntersection(h){let f=this.bbox(),m=h.bbox(),_=E(f,m);if(_===null)return null;let p=this.leftSE.point,M=this.rightSE.point,S=h.leftSE.point,D=h.rightSE.point,C=b(f,S)&&this.comparePoint(S)===0,k=b(m,p)&&h.comparePoint(p)===0,P=b(f,D)&&this.comparePoint(D)===0,F=b(m,M)&&h.comparePoint(M)===0;if(k&&C)return F&&!P?M:!F&&P?D:null;if(k)return P&&p.x===D.x&&p.y===D.y?null:p;if(C)return F&&M.x===S.x&&M.y===S.y?null:S;if(F&&P)return null;if(F)return M;if(P)return D;let O=Xi(p,this.vector(),S,h.vector());return O===null||!b(_,O)?null:N.round(O.x,O.y)}split(h){let f=[],m=h.events!==void 0,_=new Xt(h,!0),p=new Xt(h,!1),M=this.rightSE;this.replaceRightSE(p),f.push(p),f.push(_);let S=new ue(_,M,this.rings.slice(),this.windings.slice());return Xt.comparePoints(S.leftSE.point,S.rightSE.point)>0&&S.swapEvents(),Xt.comparePoints(this.leftSE.point,this.rightSE.point)>0&&this.swapEvents(),m&&(_.checkForConsuming(),p.checkForConsuming()),f}swapEvents(){let h=this.rightSE;this.rightSE=this.leftSE,this.leftSE=h,this.leftSE.isLeft=!0,this.rightSE.isLeft=!1;for(let f=0,m=this.windings.length;f<m;f++)this.windings[f]*=-1}consume(h){let f=this,m=h;for(;f.consumedBy;)f=f.consumedBy;for(;m.consumedBy;)m=m.consumedBy;let _=ue.compare(f,m);if(_!==0){if(_>0){let p=f;f=m,m=p}if(f.prev===m){let p=f;f=m,m=p}for(let p=0,M=m.rings.length;p<M;p++){let S=m.rings[p],D=m.windings[p],C=f.rings.indexOf(S);C===-1?(f.rings.push(S),f.windings.push(D)):f.windings[C]+=D}m.rings=null,m.windings=null,m.consumedBy=f,m.leftSE.consumedBy=f.leftSE,m.rightSE.consumedBy=f.rightSE}}prevInResult(){return this._prevInResult!==void 0?this._prevInResult:(this.prev?this.prev.isInResult()?this._prevInResult=this.prev:this._prevInResult=this.prev.prevInResult():this._prevInResult=null,this._prevInResult)}beforeState(){if(this._beforeState!==void 0)return this._beforeState;if(!this.prev)this._beforeState={rings:[],windings:[],multiPolys:[]};else{let h=this.prev.consumedBy||this.prev;this._beforeState=h.afterState()}return this._beforeState}afterState(){if(this._afterState!==void 0)return this._afterState;let h=this.beforeState();this._afterState={rings:h.rings.slice(0),windings:h.windings.slice(0),multiPolys:[]};let f=this._afterState.rings,m=this._afterState.windings,_=this._afterState.multiPolys;for(let S=0,D=this.rings.length;S<D;S++){let C=this.rings[S],k=this.windings[S],P=f.indexOf(C);P===-1?(f.push(C),m.push(k)):m[P]+=k}let p=[],M=[];for(let S=0,D=f.length;S<D;S++){if(m[S]===0)continue;let C=f[S],k=C.poly;if(M.indexOf(k)===-1)if(C.isExterior)p.push(k);else{M.indexOf(k)===-1&&M.push(k);let P=p.indexOf(C.poly);P!==-1&&p.splice(P,1)}}for(let S=0,D=p.length;S<D;S++){let C=p[S].multiPoly;_.indexOf(C)===-1&&_.push(C)}return this._afterState}isInResult(){if(this.consumedBy)return!1;if(this._isInResult!==void 0)return this._isInResult;let h=this.beforeState().multiPolys,f=this.afterState().multiPolys;switch($t.type){case"union":{let m=h.length===0,_=f.length===0;this._isInResult=m!==_;break}case"intersection":{let m,_;h.length<f.length?(m=h.length,_=f.length):(m=f.length,_=h.length),this._isInResult=_===$t.numMultiPolys&&m<_;break}case"xor":{let m=Math.abs(h.length-f.length);this._isInResult=m%2===1;break}case"difference":{let m=_=>_.length===1&&_[0].isSubject;this._isInResult=m(h)!==m(f);break}default:throw new Error(`Unrecognized operation type found ${$t.type}`)}return this._isInResult}}class mn{constructor(h,f,m){if(!Array.isArray(h)||h.length===0)throw new Error("Input geometry is not a valid Polygon or MultiPolygon");if(this.poly=f,this.isExterior=m,this.segments=[],typeof h[0][0]!="number"||typeof h[0][1]!="number")throw new Error("Input geometry is not a valid Polygon or MultiPolygon");let _=N.round(h[0][0],h[0][1]);this.bbox={ll:{x:_.x,y:_.y},ur:{x:_.x,y:_.y}};let p=_;for(let M=1,S=h.length;M<S;M++){if(typeof h[M][0]!="number"||typeof h[M][1]!="number")throw new Error("Input geometry is not a valid Polygon or MultiPolygon");let D=N.round(h[M][0],h[M][1]);D.x===p.x&&D.y===p.y||(this.segments.push(ue.fromRing(p,D,this)),D.x<this.bbox.ll.x&&(this.bbox.ll.x=D.x),D.y<this.bbox.ll.y&&(this.bbox.ll.y=D.y),D.x>this.bbox.ur.x&&(this.bbox.ur.x=D.x),D.y>this.bbox.ur.y&&(this.bbox.ur.y=D.y),p=D)}(_.x!==p.x||_.y!==p.y)&&this.segments.push(ue.fromRing(p,_,this))}getSweepEvents(){let h=[];for(let f=0,m=this.segments.length;f<m;f++){let _=this.segments[f];h.push(_.leftSE),h.push(_.rightSE)}return h}}class gn{constructor(h,f){if(!Array.isArray(h))throw new Error("Input geometry is not a valid Polygon or MultiPolygon");this.exteriorRing=new mn(h[0],this,!0),this.bbox={ll:{x:this.exteriorRing.bbox.ll.x,y:this.exteriorRing.bbox.ll.y},ur:{x:this.exteriorRing.bbox.ur.x,y:this.exteriorRing.bbox.ur.y}},this.interiorRings=[];for(let m=1,_=h.length;m<_;m++){let p=new mn(h[m],this,!1);p.bbox.ll.x<this.bbox.ll.x&&(this.bbox.ll.x=p.bbox.ll.x),p.bbox.ll.y<this.bbox.ll.y&&(this.bbox.ll.y=p.bbox.ll.y),p.bbox.ur.x>this.bbox.ur.x&&(this.bbox.ur.x=p.bbox.ur.x),p.bbox.ur.y>this.bbox.ur.y&&(this.bbox.ur.y=p.bbox.ur.y),this.interiorRings.push(p)}this.multiPoly=f}getSweepEvents(){let h=this.exteriorRing.getSweepEvents();for(let f=0,m=this.interiorRings.length;f<m;f++){let _=this.interiorRings[f].getSweepEvents();for(let p=0,M=_.length;p<M;p++)h.push(_[p])}return h}}class Xe{constructor(h,f){if(!Array.isArray(h))throw new Error("Input geometry is not a valid Polygon or MultiPolygon");try{typeof h[0][0][0]=="number"&&(h=[h])}catch{}this.polys=[],this.bbox={ll:{x:Number.POSITIVE_INFINITY,y:Number.POSITIVE_INFINITY},ur:{x:Number.NEGATIVE_INFINITY,y:Number.NEGATIVE_INFINITY}};for(let m=0,_=h.length;m<_;m++){let p=new gn(h[m],this);p.bbox.ll.x<this.bbox.ll.x&&(this.bbox.ll.x=p.bbox.ll.x),p.bbox.ll.y<this.bbox.ll.y&&(this.bbox.ll.y=p.bbox.ll.y),p.bbox.ur.x>this.bbox.ur.x&&(this.bbox.ur.x=p.bbox.ur.x),p.bbox.ur.y>this.bbox.ur.y&&(this.bbox.ur.y=p.bbox.ur.y),this.polys.push(p)}this.isSubject=f}getSweepEvents(){let h=[];for(let f=0,m=this.polys.length;f<m;f++){let _=this.polys[f].getSweepEvents();for(let p=0,M=_.length;p<M;p++)h.push(_[p])}return h}}class qe{static factory(h){let f=[];for(let m=0,_=h.length;m<_;m++){let p=h[m];if(!p.isInResult()||p.ringOut)continue;let M=null,S=p.leftSE,D=p.rightSE,C=[S],k=S.point,P=[];for(;M=S,S=D,C.push(S),S.point!==k;)for(;;){let F=S.getAvailableLinkedEvents();if(F.length===0){let q=C[0].point,Z=C[C.length-1].point;throw new Error(`Unable to complete output ring starting at [${q.x}, ${q.y}]. Last matching segment found ends at [${Z.x}, ${Z.y}].`)}if(F.length===1){D=F[0].otherSE;break}let O=null;for(let q=0,Z=P.length;q<Z;q++)if(P[q].point===S.point){O=q;break}if(O!==null){let q=P.splice(O)[0],Z=C.splice(q.index);Z.unshift(Z[0].otherSE),f.push(new qe(Z.reverse()));continue}P.push({index:C.length,point:S.point});let W=S.getLeftmostComparator(M);D=F.sort(W)[0].otherSE;break}f.push(new qe(C))}return f}constructor(h){this.events=h;for(let f=0,m=h.length;f<m;f++)h[f].segment.ringOut=this;this.poly=null}getGeom(){let h=this.events[0].point,f=[h];for(let C=1,k=this.events.length-1;C<k;C++){let P=this.events[C].point,F=this.events[C+1].point;se(P,h,F)!==0&&(f.push(P),h=P)}if(f.length===1)return null;let m=f[0],_=f[1];se(m,h,_)===0&&f.shift(),f.push(f[0]);let p=this.isExteriorRing()?1:-1,M=this.isExteriorRing()?0:f.length-1,S=this.isExteriorRing()?f.length:-1,D=[];for(let C=M;C!=S;C+=p)D.push([f[C].x,f[C].y]);return D}isExteriorRing(){if(this._isExteriorRing===void 0){let h=this.enclosingRing();this._isExteriorRing=h?!h.isExteriorRing():!0}return this._isExteriorRing}enclosingRing(){return this._enclosingRing===void 0&&(this._enclosingRing=this._calcEnclosingRing()),this._enclosingRing}_calcEnclosingRing(){let h=this.events[0];for(let _=1,p=this.events.length;_<p;_++){let M=this.events[_];Xt.compare(h,M)>0&&(h=M)}let f=h.segment.prevInResult(),m=f?f.prevInResult():null;for(;;){if(!f)return null;if(!m)return f.ringOut;if(m.ringOut!==f.ringOut)return m.ringOut.enclosingRing()!==f.ringOut?f.ringOut:f.ringOut.enclosingRing();f=m.prevInResult(),m=f?f.prevInResult():null}}}class xn{constructor(h){this.exteriorRing=h,h.poly=this,this.interiorRings=[]}addInterior(h){this.interiorRings.push(h),h.poly=this}getGeom(){let h=[this.exteriorRing.getGeom()];if(h[0]===null)return null;for(let f=0,m=this.interiorRings.length;f<m;f++){let _=this.interiorRings[f].getGeom();_!==null&&h.push(_)}return h}}class Wn{constructor(h){this.rings=h,this.polys=this._composePolys(h)}getGeom(){let h=[];for(let f=0,m=this.polys.length;f<m;f++){let _=this.polys[f].getGeom();_!==null&&h.push(_)}return h}_composePolys(h){let f=[];for(let m=0,_=h.length;m<_;m++){let p=h[m];if(!p.poly)if(p.isExteriorRing())f.push(new xn(p));else{let M=p.enclosingRing();M.poly||f.push(new xn(M)),M.poly.addInterior(p)}}return f}}class Yi{constructor(h){let f=arguments.length>1&&arguments[1]!==void 0?arguments[1]:ue.compare;this.queue=h,this.tree=new l(f),this.segments=[]}process(h){let f=h.segment,m=[];if(h.consumedBy)return h.isLeft?this.queue.remove(h.otherSE):this.tree.remove(f),m;let _=h.isLeft?this.tree.add(f):this.tree.find(f);if(!_)throw new Error(`Unable to find segment #${f.id} [${f.leftSE.point.x}, ${f.leftSE.point.y}] -> [${f.rightSE.point.x}, ${f.rightSE.point.y}] in SweepLine tree.`);let p=_,M=_,S,D;for(;S===void 0;)p=this.tree.prev(p),p===null?S=null:p.key.consumedBy===void 0&&(S=p.key);for(;D===void 0;)M=this.tree.next(M),M===null?D=null:M.key.consumedBy===void 0&&(D=M.key);if(h.isLeft){let C=null;if(S){let P=S.getIntersection(f);if(P!==null&&(f.isAnEndpoint(P)||(C=P),!S.isAnEndpoint(P))){let F=this._splitSafely(S,P);for(let O=0,W=F.length;O<W;O++)m.push(F[O])}}let k=null;if(D){let P=D.getIntersection(f);if(P!==null&&(f.isAnEndpoint(P)||(k=P),!D.isAnEndpoint(P))){let F=this._splitSafely(D,P);for(let O=0,W=F.length;O<W;O++)m.push(F[O])}}if(C!==null||k!==null){let P=null;C===null?P=k:k===null?P=C:P=Xt.comparePoints(C,k)<=0?C:k,this.queue.remove(f.rightSE),m.push(f.rightSE);let F=f.split(P);for(let O=0,W=F.length;O<W;O++)m.push(F[O])}m.length>0?(this.tree.remove(f),m.push(h)):(this.segments.push(f),f.prev=S)}else{if(S&&D){let C=S.getIntersection(D);if(C!==null){if(!S.isAnEndpoint(C)){let k=this._splitSafely(S,C);for(let P=0,F=k.length;P<F;P++)m.push(k[P])}if(!D.isAnEndpoint(C)){let k=this._splitSafely(D,C);for(let P=0,F=k.length;P<F;P++)m.push(k[P])}}}this.tree.remove(f)}return m}_splitSafely(h,f){this.tree.remove(h);let m=h.rightSE;this.queue.remove(m);let _=h.split(f);return _.push(m),h.consumedBy===void 0&&this.tree.add(h),_}}let Xn=typeof process<"u"&&process.env.POLYGON_CLIPPING_MAX_QUEUE_SIZE||1e6,_n=typeof process<"u"&&process.env.POLYGON_CLIPPING_MAX_SWEEPLINE_SEGMENTS||1e6;class Zi{run(h,f,m){$t.type=h,N.reset();let _=[new Xe(f,!0)];for(let P=0,F=m.length;P<F;P++)_.push(new Xe(m[P],!1));if($t.numMultiPolys=_.length,$t.type==="difference"){let P=_[0],F=1;for(;F<_.length;)E(_[F].bbox,P.bbox)!==null?F++:_.splice(F,1)}if($t.type==="intersection")for(let P=0,F=_.length;P<F;P++){let O=_[P];for(let W=P+1,q=_.length;W<q;W++)if(E(O.bbox,_[W].bbox)===null)return[]}let p=new l(Xt.compare);for(let P=0,F=_.length;P<F;P++){let O=_[P].getSweepEvents();for(let W=0,q=O.length;W<q;W++)if(p.insert(O[W]),p.size>Xn)throw new Error("Infinite loop when putting segment endpoints in a priority queue (queue size too big).")}let M=new Yi(p),S=p.size,D=p.pop();for(;D;){let P=D.key;if(p.size===S){let O=P.segment;throw new Error(`Unable to pop() ${P.isLeft?"left":"right"} SweepEvent [${P.point.x}, ${P.point.y}] from segment #${O.id} [${O.leftSE.point.x}, ${O.leftSE.point.y}] -> [${O.rightSE.point.x}, ${O.rightSE.point.y}] from queue.`)}if(p.size>Xn)throw new Error("Infinite loop when passing sweep line over endpoints (queue size too big).");if(M.segments.length>_n)throw new Error("Infinite loop when passing sweep line over endpoints (too many sweep line segments).");let F=M.process(P);for(let O=0,W=F.length;O<W;O++){let q=F[O];q.consumedBy===void 0&&p.insert(q)}S=p.size,D=p.pop()}N.reset();let C=qe.factory(M.segments);return new Wn(C).getGeom()}}let $t=new Zi;var R={union:function(y){for(var h=arguments.length,f=new Array(h>1?h-1:0),m=1;m<h;m++)f[m-1]=arguments[m];return $t.run("union",y,f)},intersection:function(y){for(var h=arguments.length,f=new Array(h>1?h-1:0),m=1;m<h;m++)f[m-1]=arguments[m];return $t.run("intersection",y,f)},xor:function(y){for(var h=arguments.length,f=new Array(h>1?h-1:0),m=1;m<h;m++)f[m-1]=arguments[m];return $t.run("xor",y,f)},difference:function(y){for(var h=arguments.length,f=new Array(h>1?h-1:0),m=1;m<h;m++)f[m-1]=arguments[m];return $t.run("difference",y,f)}};return R}))});function re(s,t){this.x=s,this.y=t}re.prototype={clone(){return new re(this.x,this.y)},add(s){return this.clone()._add(s)},sub(s){return this.clone()._sub(s)},multByPoint(s){return this.clone()._multByPoint(s)},divByPoint(s){return this.clone()._divByPoint(s)},mult(s){return this.clone()._mult(s)},div(s){return this.clone()._div(s)},rotate(s){return this.clone()._rotate(s)},rotateAround(s,t){return this.clone()._rotateAround(s,t)},matMult(s){return this.clone()._matMult(s)},unit(){return this.clone()._unit()},perp(){return this.clone()._perp()},round(){return this.clone()._round()},mag(){return Math.sqrt(this.x*this.x+this.y*this.y)},equals(s){return this.x===s.x&&this.y===s.y},dist(s){return Math.sqrt(this.distSqr(s))},distSqr(s){let t=s.x-this.x,e=s.y-this.y;return t*t+e*e},angle(){return Math.atan2(this.y,this.x)},angleTo(s){return Math.atan2(this.y-s.y,this.x-s.x)},angleWith(s){return this.angleWithSep(s.x,s.y)},angleWithSep(s,t){return Math.atan2(this.x*t-this.y*s,this.x*s+this.y*t)},_matMult(s){let t=s[0]*this.x+s[1]*this.y,e=s[2]*this.x+s[3]*this.y;return this.x=t,this.y=e,this},_add(s){return this.x+=s.x,this.y+=s.y,this},_sub(s){return this.x-=s.x,this.y-=s.y,this},_mult(s){return this.x*=s,this.y*=s,this},_div(s){return this.x/=s,this.y/=s,this},_multByPoint(s){return this.x*=s.x,this.y*=s.y,this},_divByPoint(s){return this.x/=s.x,this.y/=s.y,this},_unit(){return this._div(this.mag()),this},_perp(){let s=this.y;return this.y=this.x,this.x=-s,this},_rotate(s){let t=Math.cos(s),e=Math.sin(s),n=t*this.x-e*this.y,i=e*this.x+t*this.y;return this.x=n,this.y=i,this},_rotateAround(s,t){let e=Math.cos(s),n=Math.sin(s),i=t.x+e*(this.x-t.x)-n*(this.y-t.y),r=t.y+n*(this.x-t.x)+e*(this.y-t.y);return this.x=i,this.y=r,this},_round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this},constructor:re};re.convert=function(s){if(s instanceof re)return s;if(Array.isArray(s))return new re(+s[0],+s[1]);if(s.x!==void 0&&s.y!==void 0)return new re(+s.x,+s.y);throw new Error("Expected [x, y] or {x, y} point format")};var Yn=class{constructor(t,e,n,i,r){for(this.properties=Object.create(null),this.extent=n,this.type=0,this.id=void 0,this._pbf=t,this._geometry=-1,this._keys=i,this._values=r;t.pos<e;){let o=t.readVarint();if(o===8)this.id=t.readVarint();else if(o===18){let c=t.readVarint()+t.pos;for(;t.pos<c;){let l=i[t.readVarint()],a=r[t.readVarint()];this.properties[l]=a}}else o===24?this.type=t.readVarint():(o===34&&(this._geometry=t.pos),t.skip(o))}}loadGeometry(){if(this._geometry<0)throw new Error("feature has no geometry");let t=this._pbf;t.pos=this._geometry;let e=t.readVarint()+t.pos,n=[],i,r=1,o=0,c=0,l=0;for(;t.pos<e;){if(o<=0){let a=t.readVarint();if(r=a&7,o=a>>3,o===0)continue}if(o--,r===1)c+=t.readSVarint(),l+=t.readSVarint(),i&&n.push(i),i=[new re(c,l)];else if(r===2)c+=t.readSVarint(),l+=t.readSVarint(),i&&i.push(new re(c,l));else if(r===7)i&&i.push(i[0].clone());else throw new Error(`unknown command ${r}`)}return i&&n.push(i),n}bbox(){if(this._geometry<0)throw new Error("feature has no geometry");let t=this._pbf;t.pos=this._geometry;let e=t.readVarint()+t.pos,n=1,i=0,r=0,o=0,c=1/0,l=-1/0,a=1/0,u=-1/0;for(;t.pos<e;){if(i<=0){let d=t.readVarint();if(n=d&7,i=d>>3,i===0)continue}if(i--,n===1||n===2)r+=t.readSVarint(),o+=t.readSVarint(),r<c&&(c=r),r>l&&(l=r),o<a&&(a=o),o>u&&(u=o);else if(n!==7)throw new Error(`unknown command ${n}`)}return[c,a,l,u]}toGeoJSON(t,e,n){let i=this.extent*Math.pow(2,n),r=this.extent*t,o=this.extent*e,c=this.loadGeometry();function l(g){return[(g.x+r)*360/i-180,360/Math.PI*Math.atan(Math.exp((1-(g.y+o)*2/i)*Math.PI))-90]}function a(g){return g.map(l)}let u;if(this.type===1){let g=[];for(let v of c)g.push(v[0]);let x=a(g);u=g.length===1?{type:"Point",coordinates:x[0]}:{type:"MultiPoint",coordinates:x}}else if(this.type===2){let g=c.map(a);u=g.length===1?{type:"LineString",coordinates:g[0]}:{type:"MultiLineString",coordinates:g}}else if(this.type===3){let g=Qi(c),x=[];for(let v of g)x.push(v.map(a));u=x.length===1?{type:"Polygon",coordinates:x[0]}:{type:"MultiPolygon",coordinates:x}}else throw new Error("unknown feature type");let d={type:"Feature",geometry:u,properties:this.properties};return this.id!=null&&(d.id=this.id),d}};Yn.types=["Unknown","Point","LineString","Polygon"];function Qi(s){let t=s.length;if(t<=1)return[s];let e=[],n,i;for(let r=0;r<t;r++){let o=ta(s[r]);o!==0&&(i===void 0&&(i=o<0),i===o<0?(n&&e.push(n),n=[s[r]]):n&&n.push(s[r]))}return n&&e.push(n),e}function ta(s){let t=0;for(let e=0,n=s.length,i=n-1,r,o;e<n;i=e++)r=s[e],o=s[i],t+=(o.x-r.x)*(r.y+o.y);return t}var ji=class{constructor(t,e){for(this.version=1,this.name="",this.extent=4096,this.length=0,this._pbf=t,this._keys=[],this._values=[],this._features=[],e===void 0&&(e=t.length);t.pos<e;){let n=t.readVarint();n===10?this.name=t.readString():n===18?(this._features.push(t.pos),t.skip(n)):n===26?this._keys.push(t.readString()):n===34?this._values.push(ea(t)):n===40?this.extent=t.readVarint():n===120?this.version=t.readVarint():t.skip(n)}this.length=this._features.length}feature(t){if(t<0||t>=this._features.length)throw new Error("feature index out of bounds");this._pbf.pos=this._features[t];let e=this._pbf.readVarint()+this._pbf.pos;return new Yn(this._pbf,e,this.extent,this._keys,this._values)}};function ea(s){let t=null,e=s.readVarint()+s.pos;for(;s.pos<e;){let n=s.readVarint();t=n===10?s.readString():n===21?s.readFloat():n===25?s.readDouble():n===32?s.readVarint(!0):n===40?s.readVarint():n===48?s.readSVarint():n===56?s.readBoolean():(s.skip(n),null)}if(t==null)throw new Error("unknown feature value");return t}var Zn=class{constructor(t,e=t.length){let n=Object.create(null);for(;t.pos<e;){let i=t.readVarint();if(i===26){let r=new ji(t,t.readVarint()+t.pos);r.length&&(n[r.name]=r)}else t.skip(i)}this.layers=n}};var na=12,Rr=typeof TextDecoder>"u"?null:new TextDecoder("utf-8"),ia=0,sa=1,Cr=2,ra=5,$n=class{constructor(t){this.buf=ArrayBuffer.isView(t)?t:new Uint8Array(t),this.dataView=new DataView(this.buf.buffer,this.buf.byteOffset,this.buf.byteLength),this.pos=0,this.type=0,this._valueStart=-1,this.length=this.buf.length}readFields(t,e,n=this.length){let i;for(;i=this.nextField(n);)t(i,e,this);return e}readMessage(t,e){return this.readFields(t,e,this.readVarint()+this.pos)}readFixed32(){let t=this.dataView.getUint32(this.pos,!0);return this.pos+=4,t}readSFixed32(){let t=this.dataView.getInt32(this.pos,!0);return this.pos+=4,t}readFixed64(){let t=this.dataView.getUint32(this.pos,!0)+this.dataView.getUint32(this.pos+4,!0)*4294967296;return this.pos+=8,t}readSFixed64(){let t=this.dataView.getUint32(this.pos,!0)+this.dataView.getInt32(this.pos+4,!0)*4294967296;return this.pos+=8,t}readFloat(){let t=this.dataView.getFloat32(this.pos,!0);return this.pos+=4,t}readDouble(){let t=this.dataView.getFloat64(this.pos,!0);return this.pos+=8,t}readVarint(t){let e=this.buf,n=e[this.pos++];if(n<128)return n;let i=n&127,r;return r=e[this.pos++],i|=(r&127)<<7,r<128||(r=e[this.pos++],i|=(r&127)<<14,r<128)||(r=e[this.pos++],i|=(r&127)<<21,r<128)?i:(r=e[this.pos],i|=(r&15)<<28,oa(i,t,this))}readSVarint(){let t=this.readVarint();return t%2===1?(t+1)/-2:t/2}readBoolean(){return!!this.readVarint()}readString(){let t=this.readVarint()+this.pos,e=this.pos;return this.pos=t,t-e>=na&&Rr?Rr.decode(this.buf.subarray(e,t)):aa(this.buf,e,t)}readBytes(){let t=this.readVarint()+this.pos,e=this.buf.subarray(this.pos,t);return this.pos=t,e}readPackedVarint(t=[],e){let n=this.readPackedEnd();for(;this.pos<n;)t.push(this.readVarint(e));return t}readPackedSVarint(t=[]){let e=this.readPackedEnd();for(;this.pos<e;)t.push(this.readSVarint());return t}readPackedBoolean(t=[]){let e=this.readPackedEnd();for(;this.pos<e;)t.push(this.readBoolean());return t}readPackedFloat(t=[]){let e=this.readPackedEnd();for(;this.pos<e;)t.push(this.readFloat());return t}readPackedDouble(t=[]){let e=this.readPackedEnd();for(;this.pos<e;)t.push(this.readDouble());return t}readPackedFixed32(t=[]){let e=this.readPackedEnd();for(;this.pos<e;)t.push(this.readFixed32());return t}readPackedSFixed32(t=[]){let e=this.readPackedEnd();for(;this.pos<e;)t.push(this.readSFixed32());return t}readPackedFixed64(t=[]){let e=this.readPackedEnd();for(;this.pos<e;)t.push(this.readFixed64());return t}readPackedSFixed64(t=[]){let e=this.readPackedEnd();for(;this.pos<e;)t.push(this.readSFixed64());return t}readPackedEnd(){return this.type===Cr?this.readVarint()+this.pos:this.pos+1}nextField(t=this.length){if(this.pos===this._valueStart&&this.skip(this.type),this.pos>=t)return 0;let e=this.readVarint();return this.type=e&7,this._valueStart=this.pos,e>>>3}skip(t){let e=t&7;if(e===ia)for(;this.buf[this.pos++]>127;);else if(e===Cr)this.pos=this.readVarint()+this.pos;else if(e===ra)this.pos+=4;else if(e===sa)this.pos+=8;else throw new Error(`Unimplemented type: ${e}`)}};function oa(s,t,e){let n=e.buf,i,r;if(r=n[e.pos++],i=(r&112)>>4,r<128||(r=n[e.pos++],i|=(r&127)<<3,r<128)||(r=n[e.pos++],i|=(r&127)<<10,r<128)||(r=n[e.pos++],i|=(r&127)<<17,r<128)||(r=n[e.pos++],i|=(r&127)<<24,r<128)||(r=n[e.pos++],i|=(r&1)<<31,r<128))return Ye(s,i,t);throw new Error("Expected varint not more than 10 bytes")}function Ye(s,t,e){return e?t*4294967296+(s>>>0):(t>>>0)*4294967296+(s>>>0)}function aa(s,t,e){let n="",i=t;for(;i<e;){let r=s[i],o=null,c=r>239?4:r>223?3:r>191?2:1;if(i+c>e)break;let l,a,u;c===1?r<128&&(o=r):c===2?(l=s[i+1],(l&192)===128&&(o=(r&31)<<6|l&63,o<=127&&(o=null))):c===3?(l=s[i+1],a=s[i+2],(l&192)===128&&(a&192)===128&&(o=(r&15)<<12|(l&63)<<6|a&63,(o<=2047||o>=55296&&o<=57343)&&(o=null))):c===4&&(l=s[i+1],a=s[i+2],u=s[i+3],(l&192)===128&&(a&192)===128&&(u&192)===128&&(o=(r&15)<<18|(l&63)<<12|(a&63)<<6|u&63,(o<=65535||o>=1114112)&&(o=null))),o===null?(o=65533,c=1):o>65535&&(o-=65536,n+=String.fromCharCode(o>>>10&1023|55296),o=56320|o&1023),n+=String.fromCharCode(o),i+=c}return n}var vn=qn(yn(),1),la="https://tiles.openfreemap.org/planet",Ir=new Map;function ns([s,t,e,n]){return[[[s,t],[e,t],[e,n],[s,n],[s,t]]]}function is(s,t){let[e,n,i,r]=t,o=[],c=[];for(let l=1;l<s.length;l++){let a=s[l-1],u=s[l],d=u[0]-a[0],g=u[1]-a[1],x=0,v=1,b=!0,E=[-d,d,-g,g],A=[a[0]-e,i-a[0],a[1]-n,r-a[1]];for(let T=0;T<4;T++){if(E[T]===0){A[T]<0&&(b=!1);continue}let U=A[T]/E[T];E[T]<0?x=Math.max(x,U):v=Math.min(v,U)}if(!b||x>v){c.length>1&&o.push(c),c=[];continue}let w=[a[0]+x*d,a[1]+x*g],I=[a[0]+v*d,a[1]+v*g];c.length&&Math.hypot(c.at(-1)[0]-w[0],c.at(-1)[1]-w[1])>1e-8&&(c.length>1&&o.push(c),c=[]),c.length||c.push(w),c.push(I)}return c.length>1&&o.push(c),o}var ca=new Set(["waste_basket","bollard","bicycle_parking","bus","post","drinking_water","bench","entrance","shelter","recycling","art_gallery","restaurant","cafe","fast_food","bar","ice_cream","fuel","telephone","toilets","fountain","playground","parking","information","shop","pub","bakery","supermarket","convenience","grocery","clothes","shoes","books","florist","hairdresser","beauty","pharmacy","optician","bicycle","butcher","greengrocer","deli","gift","jewelry","electronics","department_store"]),Jn=new Set(["attraction","viewpoint","museum","monument","memorial","castle","historic","archaeological_site","cinema","theatre","theater","stadium","sports_centre","zoo","theme_park","park","art_gallery","library","college","university","place_of_worship","parking"]),Pr=s=>typeof(s.name||s["name:en"]||s.name_en||s.ref)=="string"?String(s.name||s["name:en"]||s.name_en||s.ref).slice(0,120):"",Lr=new Set(["grass","park","garden","flowerbed","meadow","recreation_ground","allotments","village_green","wood","forest","scrub","heath","sand","beach","rock","bare_rock","scree","wetland","ice","glacier","farmland","farm","orchard","vineyard","cemetery","pitch","playground","track","stadium","school","kindergarten","college","university","hospital","commercial","retail","industrial","railway","garages","military","zoo","theme_park","parking","residential","apron","runway","taxiway","dog_park","golf_course"]);function Dr(s,t){if(s==="transportation_name"){let e=Pr(t);return e&&t.brunnel!=="tunnel"&&t.class!=="rail"?{labelType:"street",name:e,roadClass:t.class||"minor"}:null}if(s==="building"){if(t.hide_3d===!0||t.hide_3d===1||t.hide_3d==="true")return null;let e=Number(t.render_height),n=Number(t.render_min_height);return{building:"yes",...Number.isFinite(e)&&e>0?{height:String(e)}:{},min_height:String(Number.isFinite(n)&&n>0?n:0),...typeof t.colour=="string"?{colour:t.colour}:{}}}if(s==="water")return t.brunnel==="tunnel"?null:{natural:"water",...t.class?{water:t.class}:{}};if(s==="waterway")return t.brunnel==="tunnel"?null:{waterway:t.class||"stream"};if(s==="transportation"){if(t.brunnel==="tunnel"||Number(t.indoor)===1)return null;let e={...t.brunnel==="bridge"?{bridge:"yes"}:{},...Number(t.oneway)!==0&&t.oneway!=null?{oneway:"yes"}:{},...t.service?{service:t.service}:{},...t.surface?{surface:t.surface}:{}};if(t.class==="rail"||t.class==="transit")return{railway:t.subclass||"rail",...e};if(t.class==="pier")return{man_made:"pier"};if(t.class==="path")return{highway:{cycleway:"cycleway",steps:"steps",pedestrian:"pedestrian",platform:"platform",bridleway:"path",path:"path"}[t.subclass]||"footway",...e};let n={motorway:"motorway",trunk:"trunk",primary:"primary",secondary:"secondary",tertiary:"tertiary",minor:"residential",service:"service",track:"track",raceway:"service",busway:"service"}[t.class];return n?{highway:n,...e}:null}if(s==="landcover"||s==="landuse"||s==="aeroway"){let e=Lr.has(t.subclass)?t.subclass:t.class;return Lr.has(e)?{area:e}:null}if(s==="poi"){let e=t.class,n=t.subclass,i=Pr(t);return!ca.has(e)&&!(i&&(Jn.has(e)||Jn.has(n)))?null:{poi:e,...n?{subclass:n}:{},...i?{name:i}:{},...t.level!=null?{level:String(t.level)}:{},...i&&(Jn.has(e)||Jn.has(n))?{labelType:"attraction",rank:Number(t.rank)||20}:{}}}return null}function ha(s){let t=2166136261;for(let e of s)t=Math.imul(t^e.charCodeAt(0),16777619);return t>>>0}var Pt=8,ua=["water","waterway","landcover","landuse","aeroway","transportation","transportation_name","building","poi"];function ss(s,t,e,n){let i=n/Pt,r=s.x*n+t*i,o=s.y*n+e*i;return[r,o,r+i,o+i]}function rs(s){let t=1/0,e=1/0,n=-1/0,i=-1/0;for(let r of s)for(let[o,c]of r)t=Math.min(t,o),e=Math.min(e,c),n=Math.max(n,o),i=Math.max(i,c);return[t,e,n,i]}function fa(s,t){let e=new Zn(new $n(s)),n=4096,i=n*2**t.z,r=[t.x*n,t.y*n,(t.x+1)*n,(t.y+1)*n],o=d=>d.map(([g,x])=>({lon:g/i*360-180,lat:Math.atan(Math.sinh(Math.PI*(1-2*x/i)))*180/Math.PI})),c=(d,g)=>{let x=n/Pt;return Math.min(Pt-1,Math.max(0,Math.floor((d-r[0])/x)))+Math.min(Pt-1,Math.max(0,Math.floor((g-r[1])/x)))*Pt},l=([d,g,x,v])=>{let b=n/Pt,E=[],A=Math.max(0,Math.floor((d-r[0])/b)),w=Math.min(Pt-1,Math.floor((x-r[0])/b)),I=Math.max(0,Math.floor((g-r[1])/b)),T=Math.min(Pt-1,Math.floor((v-r[1])/b));for(let U=I;U<=T;U++)for(let N=A;N<=w;N++)E.push([N,U]);return E},a=[],u=new Map;for(let d of ua){let g=e.layers[d];if(g)for(let x=0;x<g.length;x++){let v=g.feature(x),b=Dr(d,v.properties);if(!b)continue;let E=n/v.extent,A=T=>T.map(U=>[t.x*n+U.x*E,t.y*n+U.y*E]),w=v.loadGeometry(),I=ha(d+":"+(v.id??x)+":"+JSON.stringify(b));if(v.type===1)for(let T of w)for(let U of A(T))U[0]>=r[0]&&U[0]<r[2]&&U[1]>=r[1]&&U[1]<r[3]&&a.push({id:I,tags:b,kind:2,chunk:c(U[0],U[1]),geometry:o([U])});else if(v.type===2)for(let T of w)for(let U of is(A(T),r))for(let[N,z]of l(rs([U])))for(let B of is(U,ss(t,N,z,n)))a.push({id:I,tags:b,kind:0,chunk:N+z*Pt,geometry:o(B)});else if(v.type===3){let T=vn.default.intersection(Qi(w).map(N=>N.map(A)),ns(r));if(!T.length)continue;let U=d+":"+(v.id??"n"+x)+":"+JSON.stringify(b);u.has(U)||u.set(U,{id:I,tags:b,polygons:[]}),u.get(U).polygons.push(...T)}}}for(let{id:d,tags:g,polygons:x}of u.values()){let v=x.length>1?vn.default.union(...x):x;for(let b of v){let E=rs(b),A=l(E);if(g.building||A.length===1){let[w,...I]=b;a.push({id:d,tags:g,kind:1,chunk:c((E[0]+E[2])/2,(E[1]+E[3])/2),geometry:o(w),holes:I.map(o)});continue}for(let[w,I]of A)for(let[T,...U]of vn.default.intersection([b],ns(ss(t,w,I,n))))a.push({id:d,tags:g,kind:1,chunk:w+I*Pt,geometry:o(T),holes:U.map(o)})}}return a}async function os(s,t){let e=Ir.get(s);if(!e||Date.now()-e.loadedAt>900*1e3){let n=await(await Nr(s,t)).json();if(!Array.isArray(n.tiles)||!n.tiles[0]||n.maxzoom<13)throw new Error("This map source does not provide the detailed vector tiles needed for the 3D world.");e={data:n,loadedAt:Date.now()},Ir.set(s,e)}return e.data}async function Fr(s,{signal:t,tileJSONUrl:e=la}={}){let n=AbortSignal.any([...t?[t]:[],AbortSignal.timeout(3e4)]),i=await os(e,n),o=new URL(i.tiles[0],e).href.replace(/\{z\}|%7Bz%7D/gi,String(s.z)).replace(/\{x\}|%7Bx%7D/gi,String(s.x)).replace(/\{y\}|%7By%7D/gi,String(i.scheme==="tms"?2**s.z-1-s.y:s.y)),c=new Uint8Array(await(await Nr(o,n)).arrayBuffer());return n.throwIfAborted(),fa(c,s)}function da(s={}){return s.building||s["building:part"]?{...s,building:s.building||s["building:part"],...s["building:colour"]?{colour:s["building:colour"]}:{},min_height:s.min_height||(parseFloat(s["building:min_level"])*3.4||0).toString()}:s.highway?Dr("transportation",{class:{residential:"minor",unclassified:"minor",living_street:"minor",footway:"path",path:"path",pedestrian:"path",cycleway:"path",steps:"path"}[s.highway]||s.highway,subclass:s.highway,...s.bridge==="yes"?{brunnel:"bridge"}:{}}):s.natural==="water"||s.waterway==="riverbank"?{natural:"water"}:s.leisure==="park"?{area:"park"}:s.landuse==="grass"?{area:"grass"}:null}function Ur(s,t=14){let e=new Map,n=4096,i=n*2**t,r=({lat:l,lon:a})=>[(a+180)/360*i,(1-Math.asinh(Math.tan(l*Math.PI/180))/Math.PI)/2*i],o=l=>l.map(([a,u])=>({lon:a/i*360-180,lat:Math.atan(Math.sinh(Math.PI*(1-2*u/i)))*180/Math.PI})),c=l=>(e.has(l)||e.set(l,[]),e.get(l));for(let l of s){let a=da(l.tags);if(!a||!l.geometry?.length)continue;let u=l.geometry.map(r),d=(l.holes||[]).map(A=>A.map(r)),g=u.length>3&&u[0][0]===u.at(-1)[0]&&u[0][1]===u.at(-1)[1],[x,v,b,E]=rs([u]);if(a.building){let A=(x+b)/2,w=(v+E)/2,I=Math.floor(A/n),T=Math.floor(w/n),U=Math.min(7,Math.floor((A/n-I)*Pt))+Math.min(7,Math.floor((w/n-T)*Pt))*Pt;c(I+"/"+T).push({id:l.id||0,tags:a,kind:1,chunk:U,geometry:l.geometry,holes:l.holes||[]});continue}for(let A=Math.floor(x/n);A<=Math.floor(b/n);A++)for(let w=Math.floor(v/n);w<=Math.floor(E/n);w++){let I={x:A,y:w,z:t};for(let T=0;T<Pt;T++)for(let U=0;U<Pt;U++){let N=ss(I,U,T,n);if(b<N[0]||x>N[2]||E<N[1]||v>N[3])continue;let z=U+T*Pt;if(g&&!a.highway)for(let[B,...G]of vn.default.intersection([[u,...d]],ns(N)))c(A+"/"+w).push({id:l.id||0,tags:a,kind:1,chunk:z,geometry:o(B),holes:G.map(o)});else for(let B of is(u,N))c(A+"/"+w).push({id:l.id||0,tags:a,kind:0,chunk:z,geometry:o(B)})}}}return e}async function Nr(s,t){let e=await fetch(s,{signal:t});if(!e.ok)throw new Error("OpenFreeMap is unavailable right now. Please try again shortly.");return e}function Or(s){let t=[],e=new Map,n=0,i=0;for(let b of s)n+=1+(b.holes?.length||0),i+=b.geometry.length+(b.holes||[]).reduce((E,A)=>E+A.length,0);let r=new Float64Array(s.length),o=new Uint32Array(s.length),c=new Uint8Array(s.length),l=new Uint8Array(s.length),a=new Uint32Array(s.length+1),u=new Uint32Array(n+1),d=new Float64Array(i*2),g=0,x=0,v=b=>{for(let E of b)d[x*2]=E.lat,d[x*2+1]=E.lon,x++;u[++g]=x};return s.forEach((b,E)=>{let A=JSON.stringify(b.tags);e.has(A)||(e.set(A,t.length),t.push(b.tags)),r[E]=b.id,o[E]=e.get(A),c[E]=b.kind??(Array.isArray(b.holes)?1:0),l[E]=b.chunk??0,v(b.geometry),(b.holes||[]).forEach(v),a[E+1]=g}),{tagTable:t,ids:r,tagIndex:o,kind:c,chunk:l,elementRings:a,ringPoints:u,coords:d}}var as=class{constructor(t,e){this.packed=t,this.index=e,this.id=t.ids[e],this.tags=t.tagTable[t.tagIndex[e]],this.kind=t.kind[e],this.chunk=t.chunk[e]}ring(t){let{ringPoints:e,coords:n}=this.packed,i=[];for(let r=e[t];r<e[t+1];r++)i.push({lat:n[r*2],lon:n[r*2+1]});return i}get first(){let t=this.packed.ringPoints[this.packed.elementRings[this.index]];return{lat:this.packed.coords[t*2],lon:this.packed.coords[t*2+1]}}get geometry(){return this._geometry??=this.ring(this.packed.elementRings[this.index])}get holes(){if(this.kind!==1)return;let t=[];for(let e=this.packed.elementRings[this.index]+1;e<this.packed.elementRings[this.index+1];e++)t.push(this.ring(e));return t}};function pa(s){return Array.from({length:s.ids.length},(t,e)=>new as(s,e))}function Br(s){let t=new Map;return pa(s).forEach(e=>{t.has(e.chunk)||t.set(e.chunk,[]),t.get(e.chunk).push(e)}),t}var Ds=0,Fs=1,Us=2,Ns=3,Os=4,Bs=5,ks=6,zs=7;var Vs=300;var _s=1e3,Tn=1001,ys=1002;var Qr=1006;var to=1008;var eo=1009;var no=1015;var io=1023;var Cn=2300,ci=2301,ai=2302,vs=2400,Ms=2401,Ss=2402;var Hs="",ne="srgb",bs="srgb-linear",ws="linear",li="srgb";var Es=35044;var An=2e3,Ts=2001;var sn=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){let n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){let n=this._listeners;if(n===void 0)return;let i=n[t];if(i!==void 0){let r=i.indexOf(e);r!==-1&&i.splice(r,1)}}dispatchEvent(t){let e=this._listeners;if(e===void 0)return;let n=e[t.type];if(n!==void 0){t.target=this;let i=n.slice(0);for(let r=0,o=i.length;r<o;r++)i[r].call(this,t);t.target=null}}},kt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var Eu=Math.PI/180,ma=180/Math.PI;function Ei(){let s=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(kt[s&255]+kt[s>>8&255]+kt[s>>16&255]+kt[s>>24&255]+"-"+kt[t&255]+kt[t>>8&255]+"-"+kt[t>>16&15|64]+kt[t>>24&255]+"-"+kt[e&63|128]+kt[e>>8&255]+"-"+kt[e>>16&255]+kt[e>>24&255]+kt[n&255]+kt[n>>8&255]+kt[n>>16&255]+kt[n>>24&255]).toLowerCase()}function vt(s,t,e){return Math.max(t,Math.min(e,s))}function ga(s,t){return(s%t+t)%t}function ls(s,t,e){return(1-e)*s+e*t}function Mn(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function Yt(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}var Rt=class s{constructor(t=0,e=0){s.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,i=t.elements;return this.x=i[0]*e+i[3]*n+i[6],this.y=i[1]*e+i[4]*n+i[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=vt(this.x,t.x,e.x),this.y=vt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=vt(this.x,t,e),this.y=vt(this.y,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(vt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(vt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),i=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*i+t.x,this.y=r*i+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},le=class{constructor(t=0,e=0,n=0,i=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=i}static slerpFlat(t,e,n,i,r,o,c){let l=n[i+0],a=n[i+1],u=n[i+2],d=n[i+3],g=r[o+0],x=r[o+1],v=r[o+2],b=r[o+3];if(c===0){t[e+0]=l,t[e+1]=a,t[e+2]=u,t[e+3]=d;return}if(c===1){t[e+0]=g,t[e+1]=x,t[e+2]=v,t[e+3]=b;return}if(d!==b||l!==g||a!==x||u!==v){let E=1-c,A=l*g+a*x+u*v+d*b,w=A>=0?1:-1,I=1-A*A;if(I>Number.EPSILON){let U=Math.sqrt(I),N=Math.atan2(U,A*w);E=Math.sin(E*N)/U,c=Math.sin(c*N)/U}let T=c*w;if(l=l*E+g*T,a=a*E+x*T,u=u*E+v*T,d=d*E+b*T,E===1-c){let U=1/Math.sqrt(l*l+a*a+u*u+d*d);l*=U,a*=U,u*=U,d*=U}}t[e]=l,t[e+1]=a,t[e+2]=u,t[e+3]=d}static multiplyQuaternionsFlat(t,e,n,i,r,o){let c=n[i],l=n[i+1],a=n[i+2],u=n[i+3],d=r[o],g=r[o+1],x=r[o+2],v=r[o+3];return t[e]=c*v+u*d+l*x-a*g,t[e+1]=l*v+u*g+a*d-c*x,t[e+2]=a*v+u*x+c*g-l*d,t[e+3]=u*v-c*d-l*g-a*x,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,i){return this._x=t,this._y=e,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,i=t._y,r=t._z,o=t._order,c=Math.cos,l=Math.sin,a=c(n/2),u=c(i/2),d=c(r/2),g=l(n/2),x=l(i/2),v=l(r/2);switch(o){case"XYZ":this._x=g*u*d+a*x*v,this._y=a*x*d-g*u*v,this._z=a*u*v+g*x*d,this._w=a*u*d-g*x*v;break;case"YXZ":this._x=g*u*d+a*x*v,this._y=a*x*d-g*u*v,this._z=a*u*v-g*x*d,this._w=a*u*d+g*x*v;break;case"ZXY":this._x=g*u*d-a*x*v,this._y=a*x*d+g*u*v,this._z=a*u*v+g*x*d,this._w=a*u*d-g*x*v;break;case"ZYX":this._x=g*u*d-a*x*v,this._y=a*x*d+g*u*v,this._z=a*u*v-g*x*d,this._w=a*u*d+g*x*v;break;case"YZX":this._x=g*u*d+a*x*v,this._y=a*x*d+g*u*v,this._z=a*u*v-g*x*d,this._w=a*u*d-g*x*v;break;case"XZY":this._x=g*u*d-a*x*v,this._y=a*x*d-g*u*v,this._z=a*u*v+g*x*d,this._w=a*u*d+g*x*v;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,i=Math.sin(n);return this._x=t.x*i,this._y=t.y*i,this._z=t.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],i=e[4],r=e[8],o=e[1],c=e[5],l=e[9],a=e[2],u=e[6],d=e[10],g=n+c+d;if(g>0){let x=.5/Math.sqrt(g+1);this._w=.25/x,this._x=(u-l)*x,this._y=(r-a)*x,this._z=(o-i)*x}else if(n>c&&n>d){let x=2*Math.sqrt(1+n-c-d);this._w=(u-l)/x,this._x=.25*x,this._y=(i+o)/x,this._z=(r+a)/x}else if(c>d){let x=2*Math.sqrt(1+c-n-d);this._w=(r-a)/x,this._x=(i+o)/x,this._y=.25*x,this._z=(l+u)/x}else{let x=2*Math.sqrt(1+d-n-c);this._w=(o-i)/x,this._x=(r+a)/x,this._y=(l+u)/x,this._z=.25*x}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(vt(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let i=Math.min(1,e/n);return this.slerp(t,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,i=t._y,r=t._z,o=t._w,c=e._x,l=e._y,a=e._z,u=e._w;return this._x=n*u+o*c+i*a-r*l,this._y=i*u+o*l+r*c-n*a,this._z=r*u+o*a+n*l-i*c,this._w=o*u-n*c-i*l-r*a,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);let n=this._x,i=this._y,r=this._z,o=this._w,c=o*t._w+n*t._x+i*t._y+r*t._z;if(c<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,c=-c):this.copy(t),c>=1)return this._w=o,this._x=n,this._y=i,this._z=r,this;let l=1-c*c;if(l<=Number.EPSILON){let x=1-e;return this._w=x*o+e*this._w,this._x=x*n+e*this._x,this._y=x*i+e*this._y,this._z=x*r+e*this._z,this.normalize(),this}let a=Math.sqrt(l),u=Math.atan2(a,c),d=Math.sin((1-e)*u)/a,g=Math.sin(e*u)/a;return this._w=o*d+this._w*g,this._x=n*d+this._x*g,this._y=i*d+this._y*g,this._z=r*d+this._z*g,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(t),i*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},X=class s{constructor(t=0,e=0,n=0){s.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(kr.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(kr.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*i,this.y=r[1]*e+r[4]*n+r[7]*i,this.z=r[2]*e+r[5]*n+r[8]*i,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,i=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*i+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*i+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*i+r[14])*o,this}applyQuaternion(t){let e=this.x,n=this.y,i=this.z,r=t.x,o=t.y,c=t.z,l=t.w,a=2*(o*i-c*n),u=2*(c*e-r*i),d=2*(r*n-o*e);return this.x=e+l*a+o*d-c*u,this.y=n+l*u+c*a-r*d,this.z=i+l*d+r*u-o*a,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*i,this.y=r[1]*e+r[5]*n+r[9]*i,this.z=r[2]*e+r[6]*n+r[10]*i,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=vt(this.x,t.x,e.x),this.y=vt(this.y,t.y,e.y),this.z=vt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=vt(this.x,t,e),this.y=vt(this.y,t,e),this.z=vt(this.z,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(vt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,i=t.y,r=t.z,o=e.x,c=e.y,l=e.z;return this.x=i*l-r*c,this.y=r*o-n*l,this.z=n*c-i*o,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return cs.copy(this).projectOnVector(t),this.sub(cs)}reflect(t){return this.sub(cs.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(vt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,i=this.z-t.z;return e*e+n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let i=Math.sin(e)*t;return this.x=i*Math.sin(n),this.y=Math.cos(e)*t,this.z=i*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),i=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=i,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},cs=new X,kr=new le,ot=class s{constructor(t,e,n,i,r,o,c,l,a){s.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,o,c,l,a)}set(t,e,n,i,r,o,c,l,a){let u=this.elements;return u[0]=t,u[1]=i,u[2]=c,u[3]=e,u[4]=r,u[5]=l,u[6]=n,u[7]=o,u[8]=a,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,i=e.elements,r=this.elements,o=n[0],c=n[3],l=n[6],a=n[1],u=n[4],d=n[7],g=n[2],x=n[5],v=n[8],b=i[0],E=i[3],A=i[6],w=i[1],I=i[4],T=i[7],U=i[2],N=i[5],z=i[8];return r[0]=o*b+c*w+l*U,r[3]=o*E+c*I+l*N,r[6]=o*A+c*T+l*z,r[1]=a*b+u*w+d*U,r[4]=a*E+u*I+d*N,r[7]=a*A+u*T+d*z,r[2]=g*b+x*w+v*U,r[5]=g*E+x*I+v*N,r[8]=g*A+x*T+v*z,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],c=t[5],l=t[6],a=t[7],u=t[8];return e*o*u-e*c*a-n*r*u+n*c*l+i*r*a-i*o*l}invert(){let t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],c=t[5],l=t[6],a=t[7],u=t[8],d=u*o-c*a,g=c*l-u*r,x=a*r-o*l,v=e*d+n*g+i*x;if(v===0)return this.set(0,0,0,0,0,0,0,0,0);let b=1/v;return t[0]=d*b,t[1]=(i*a-u*n)*b,t[2]=(c*n-i*o)*b,t[3]=g*b,t[4]=(u*e-i*l)*b,t[5]=(i*r-c*e)*b,t[6]=x*b,t[7]=(n*l-a*e)*b,t[8]=(o*e-n*r)*b,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,i,r,o,c){let l=Math.cos(r),a=Math.sin(r);return this.set(n*l,n*a,-n*(l*o+a*c)+o+t,-i*a,i*l,-i*(-a*o+l*c)+c+e,0,0,1),this}scale(t,e){return this.premultiply(hs.makeScale(t,e)),this}rotate(t){return this.premultiply(hs.makeRotation(-t)),this}translate(t,e){return this.premultiply(hs.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let i=0;i<9;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}},hs=new ot;function so(s){for(let t=s.length-1;t>=0;--t)if(s[t]>=65535)return!0;return!1}function As(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}var zr={};function Rs(s){s in zr||(zr[s]=!0,console.warn(s))}var Vr=new ot().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Hr=new ot().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function xa(){let s={enabled:!0,workingColorSpace:bs,spaces:{},convert:function(i,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===li&&(i.r=_e(i.r),i.g=_e(i.g),i.b=_e(i.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(i.applyMatrix3(this.spaces[r].toXYZ),i.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===li&&(i.r=nn(i.r),i.g=nn(i.g),i.b=nn(i.b))),i},workingToColorSpace:function(i,r){return this.convert(i,this.workingColorSpace,r)},colorSpaceToWorking:function(i,r){return this.convert(i,r,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===Hs?ws:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,r=this.workingColorSpace){return i.fromArray(this.spaces[r].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,r,o){return i.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,r){return Rs("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),s.workingToColorSpace(i,r)},toWorkingColorSpace:function(i,r){return Rs("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),s.colorSpaceToWorking(i,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return s.define({[bs]:{primaries:t,whitePoint:n,transfer:ws,toXYZ:Vr,fromXYZ:Hr,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:ne},outputColorSpaceConfig:{drawingBufferColorSpace:ne}},[ne]:{primaries:t,whitePoint:n,transfer:li,toXYZ:Vr,fromXYZ:Hr,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:ne}}}),s}var ee=xa();function _e(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function nn(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}var Ze,hi=class{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{Ze===void 0&&(Ze=As("canvas")),Ze.width=t.width,Ze.height=t.height;let i=Ze.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),n=Ze}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=As("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let i=n.getImageData(0,0,t.width,t.height),r=i.data;for(let o=0;o<r.length;o++)r[o]=_e(r[o]/255)*255;return n.putImageData(i,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(_e(e[n]/255)*255):e[n]=_e(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},_a=0,ui=class{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:_a++}),this.uuid=Ei(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){let e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let o=0,c=i.length;o<c;o++)i[o].isDataTexture?r.push(us(i[o].image)):r.push(us(i[o]))}else r=us(i);n.url=r}return e||(t.images[this.uuid]=n),n}};function us(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?hi.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var ya=0,fs=new X,rn=class s extends sn{constructor(t=s.DEFAULT_IMAGE,e=s.DEFAULT_MAPPING,n=Tn,i=Tn,r=Qr,o=to,c=io,l=eo,a=s.DEFAULT_ANISOTROPY,u=Hs){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:ya++}),this.uuid=Ei(),this.name="",this.source=new ui(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=o,this.anisotropy=a,this.format=c,this.internalFormat=null,this.type=l,this.offset=new Rt(0,0),this.repeat=new Rt(1,1),this.center=new Rt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ot,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(fs).x}get height(){return this.source.getSize(fs).y}get depth(){return this.source.getSize(fs).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(let e in t){let n=t[e];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${e}' has value of undefined.`);continue}let i=this[e];if(i===void 0){console.warn(`THREE.Texture.setValues(): property '${e}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Vs)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case _s:t.x=t.x-Math.floor(t.x);break;case Tn:t.x=t.x<0?0:1;break;case ys:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case _s:t.y=t.y-Math.floor(t.y);break;case Tn:t.y=t.y<0?0:1;break;case ys:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};rn.DEFAULT_IMAGE=null;rn.DEFAULT_MAPPING=Vs;rn.DEFAULT_ANISOTROPY=1;var Re=class{constructor(t=new X(1/0,1/0,1/0),e=new X(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(oe.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(oe.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=oe.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,c=r.count;o<c;o++)t.isMesh===!0?t.getVertexPosition(o,oe):oe.fromBufferAttribute(r,o),oe.applyMatrix4(t.matrixWorld),this.expandByPoint(oe);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Kn.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Kn.copy(n.boundingBox)),Kn.applyMatrix4(t.matrixWorld),this.union(Kn)}let i=t.children;for(let r=0,o=i.length;r<o;r++)this.expandByObject(i[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,oe),oe.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Sn),jn.subVectors(this.max,Sn),$e.subVectors(t.a,Sn),Je.subVectors(t.b,Sn),Ke.subVectors(t.c,Sn),we.subVectors(Je,$e),Ee.subVectors(Ke,Je),Fe.subVectors($e,Ke);let e=[0,-we.z,we.y,0,-Ee.z,Ee.y,0,-Fe.z,Fe.y,we.z,0,-we.x,Ee.z,0,-Ee.x,Fe.z,0,-Fe.x,-we.y,we.x,0,-Ee.y,Ee.x,0,-Fe.y,Fe.x,0];return!ds(e,$e,Je,Ke,jn)||(e=[1,0,0,0,1,0,0,0,1],!ds(e,$e,Je,Ke,jn))?!1:(Qn.crossVectors(we,Ee),e=[Qn.x,Qn.y,Qn.z],ds(e,$e,Je,Ke,jn))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,oe).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(oe).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(ge[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),ge[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),ge[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),ge[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),ge[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),ge[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),ge[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),ge[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(ge),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}},ge=[new X,new X,new X,new X,new X,new X,new X,new X],oe=new X,Kn=new Re,$e=new X,Je=new X,Ke=new X,we=new X,Ee=new X,Fe=new X,Sn=new X,jn=new X,Qn=new X,Ue=new X;function ds(s,t,e,n,i){for(let r=0,o=s.length-3;r<=o;r+=3){Ue.fromArray(s,r);let c=i.x*Math.abs(Ue.x)+i.y*Math.abs(Ue.y)+i.z*Math.abs(Ue.z),l=t.dot(Ue),a=e.dot(Ue),u=n.dot(Ue);if(Math.max(-Math.max(l,a,u),Math.min(l,a,u))>c)return!1}return!0}var va=new Re,bn=new X,ps=new X,fi=class{constructor(t=new X,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):va.setFromPoints(t).getCenter(n);let i=0;for(let r=0,o=t.length;r<o;r++)i=Math.max(i,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(i),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;bn.subVectors(t,this.center);let e=bn.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),i=(n-this.radius)*.5;this.center.addScaledVector(bn,i/n),this.radius+=i}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(ps.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(bn.copy(t.center).add(ps)),this.expandByPoint(bn.copy(t.center).sub(ps))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}};var Ot=class s{constructor(t,e,n,i,r,o,c,l,a,u,d,g,x,v,b,E){s.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,o,c,l,a,u,d,g,x,v,b,E)}set(t,e,n,i,r,o,c,l,a,u,d,g,x,v,b,E){let A=this.elements;return A[0]=t,A[4]=e,A[8]=n,A[12]=i,A[1]=r,A[5]=o,A[9]=c,A[13]=l,A[2]=a,A[6]=u,A[10]=d,A[14]=g,A[3]=x,A[7]=v,A[11]=b,A[15]=E,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new s().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){let e=this.elements,n=t.elements,i=1/je.setFromMatrixColumn(t,0).length(),r=1/je.setFromMatrixColumn(t,1).length(),o=1/je.setFromMatrixColumn(t,2).length();return e[0]=n[0]*i,e[1]=n[1]*i,e[2]=n[2]*i,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,i=t.y,r=t.z,o=Math.cos(n),c=Math.sin(n),l=Math.cos(i),a=Math.sin(i),u=Math.cos(r),d=Math.sin(r);if(t.order==="XYZ"){let g=o*u,x=o*d,v=c*u,b=c*d;e[0]=l*u,e[4]=-l*d,e[8]=a,e[1]=x+v*a,e[5]=g-b*a,e[9]=-c*l,e[2]=b-g*a,e[6]=v+x*a,e[10]=o*l}else if(t.order==="YXZ"){let g=l*u,x=l*d,v=a*u,b=a*d;e[0]=g+b*c,e[4]=v*c-x,e[8]=o*a,e[1]=o*d,e[5]=o*u,e[9]=-c,e[2]=x*c-v,e[6]=b+g*c,e[10]=o*l}else if(t.order==="ZXY"){let g=l*u,x=l*d,v=a*u,b=a*d;e[0]=g-b*c,e[4]=-o*d,e[8]=v+x*c,e[1]=x+v*c,e[5]=o*u,e[9]=b-g*c,e[2]=-o*a,e[6]=c,e[10]=o*l}else if(t.order==="ZYX"){let g=o*u,x=o*d,v=c*u,b=c*d;e[0]=l*u,e[4]=v*a-x,e[8]=g*a+b,e[1]=l*d,e[5]=b*a+g,e[9]=x*a-v,e[2]=-a,e[6]=c*l,e[10]=o*l}else if(t.order==="YZX"){let g=o*l,x=o*a,v=c*l,b=c*a;e[0]=l*u,e[4]=b-g*d,e[8]=v*d+x,e[1]=d,e[5]=o*u,e[9]=-c*u,e[2]=-a*u,e[6]=x*d+v,e[10]=g-b*d}else if(t.order==="XZY"){let g=o*l,x=o*a,v=c*l,b=c*a;e[0]=l*u,e[4]=-d,e[8]=a*u,e[1]=g*d+b,e[5]=o*u,e[9]=x*d-v,e[2]=v*d-x,e[6]=c*u,e[10]=b*d+g}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Ma,t,Sa)}lookAt(t,e,n){let i=this.elements;return Jt.subVectors(t,e),Jt.lengthSq()===0&&(Jt.z=1),Jt.normalize(),Te.crossVectors(n,Jt),Te.lengthSq()===0&&(Math.abs(n.z)===1?Jt.x+=1e-4:Jt.z+=1e-4,Jt.normalize(),Te.crossVectors(n,Jt)),Te.normalize(),ti.crossVectors(Jt,Te),i[0]=Te.x,i[4]=ti.x,i[8]=Jt.x,i[1]=Te.y,i[5]=ti.y,i[9]=Jt.y,i[2]=Te.z,i[6]=ti.z,i[10]=Jt.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,i=e.elements,r=this.elements,o=n[0],c=n[4],l=n[8],a=n[12],u=n[1],d=n[5],g=n[9],x=n[13],v=n[2],b=n[6],E=n[10],A=n[14],w=n[3],I=n[7],T=n[11],U=n[15],N=i[0],z=i[4],B=i[8],G=i[12],J=i[1],j=i[5],et=i[9],nt=i[13],st=i[2],ut=i[6],_t=i[10],Dt=i[14],at=i[3],mt=i[7],pt=i[11],It=i[15];return r[0]=o*N+c*J+l*st+a*at,r[4]=o*z+c*j+l*ut+a*mt,r[8]=o*B+c*et+l*_t+a*pt,r[12]=o*G+c*nt+l*Dt+a*It,r[1]=u*N+d*J+g*st+x*at,r[5]=u*z+d*j+g*ut+x*mt,r[9]=u*B+d*et+g*_t+x*pt,r[13]=u*G+d*nt+g*Dt+x*It,r[2]=v*N+b*J+E*st+A*at,r[6]=v*z+b*j+E*ut+A*mt,r[10]=v*B+b*et+E*_t+A*pt,r[14]=v*G+b*nt+E*Dt+A*It,r[3]=w*N+I*J+T*st+U*at,r[7]=w*z+I*j+T*ut+U*mt,r[11]=w*B+I*et+T*_t+U*pt,r[15]=w*G+I*nt+T*Dt+U*It,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],i=t[8],r=t[12],o=t[1],c=t[5],l=t[9],a=t[13],u=t[2],d=t[6],g=t[10],x=t[14],v=t[3],b=t[7],E=t[11],A=t[15];return v*(+r*l*d-i*a*d-r*c*g+n*a*g+i*c*x-n*l*x)+b*(+e*l*x-e*a*g+r*o*g-i*o*x+i*a*u-r*l*u)+E*(+e*a*d-e*c*x-r*o*d+n*o*x+r*c*u-n*a*u)+A*(-i*c*u-e*l*d+e*c*g+i*o*d-n*o*g+n*l*u)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let i=this.elements;return t.isVector3?(i[12]=t.x,i[13]=t.y,i[14]=t.z):(i[12]=t,i[13]=e,i[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],c=t[5],l=t[6],a=t[7],u=t[8],d=t[9],g=t[10],x=t[11],v=t[12],b=t[13],E=t[14],A=t[15],w=d*E*a-b*g*a+b*l*x-c*E*x-d*l*A+c*g*A,I=v*g*a-u*E*a-v*l*x+o*E*x+u*l*A-o*g*A,T=u*b*a-v*d*a+v*c*x-o*b*x-u*c*A+o*d*A,U=v*d*l-u*b*l-v*c*g+o*b*g+u*c*E-o*d*E,N=e*w+n*I+i*T+r*U;if(N===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let z=1/N;return t[0]=w*z,t[1]=(b*g*r-d*E*r-b*i*x+n*E*x+d*i*A-n*g*A)*z,t[2]=(c*E*r-b*l*r+b*i*a-n*E*a-c*i*A+n*l*A)*z,t[3]=(d*l*r-c*g*r-d*i*a+n*g*a+c*i*x-n*l*x)*z,t[4]=I*z,t[5]=(u*E*r-v*g*r+v*i*x-e*E*x-u*i*A+e*g*A)*z,t[6]=(v*l*r-o*E*r-v*i*a+e*E*a+o*i*A-e*l*A)*z,t[7]=(o*g*r-u*l*r+u*i*a-e*g*a-o*i*x+e*l*x)*z,t[8]=T*z,t[9]=(v*d*r-u*b*r-v*n*x+e*b*x+u*n*A-e*d*A)*z,t[10]=(o*b*r-v*c*r+v*n*a-e*b*a-o*n*A+e*c*A)*z,t[11]=(u*c*r-o*d*r-u*n*a+e*d*a+o*n*x-e*c*x)*z,t[12]=U*z,t[13]=(u*b*i-v*d*i+v*n*g-e*b*g-u*n*E+e*d*E)*z,t[14]=(v*c*i-o*b*i-v*n*l+e*b*l+o*n*E-e*c*E)*z,t[15]=(o*d*i-u*c*i+u*n*l-e*d*l-o*n*g+e*c*g)*z,this}scale(t){let e=this.elements,n=t.x,i=t.y,r=t.z;return e[0]*=n,e[4]*=i,e[8]*=r,e[1]*=n,e[5]*=i,e[9]*=r,e[2]*=n,e[6]*=i,e[10]*=r,e[3]*=n,e[7]*=i,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],i=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,i))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),i=Math.sin(e),r=1-n,o=t.x,c=t.y,l=t.z,a=r*o,u=r*c;return this.set(a*o+n,a*c-i*l,a*l+i*c,0,a*c+i*l,u*c+n,u*l-i*o,0,a*l-i*c,u*l+i*o,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,i,r,o){return this.set(1,n,r,0,t,1,o,0,e,i,1,0,0,0,0,1),this}compose(t,e,n){let i=this.elements,r=e._x,o=e._y,c=e._z,l=e._w,a=r+r,u=o+o,d=c+c,g=r*a,x=r*u,v=r*d,b=o*u,E=o*d,A=c*d,w=l*a,I=l*u,T=l*d,U=n.x,N=n.y,z=n.z;return i[0]=(1-(b+A))*U,i[1]=(x+T)*U,i[2]=(v-I)*U,i[3]=0,i[4]=(x-T)*N,i[5]=(1-(g+A))*N,i[6]=(E+w)*N,i[7]=0,i[8]=(v+I)*z,i[9]=(E-w)*z,i[10]=(1-(g+b))*z,i[11]=0,i[12]=t.x,i[13]=t.y,i[14]=t.z,i[15]=1,this}decompose(t,e,n){let i=this.elements,r=je.set(i[0],i[1],i[2]).length(),o=je.set(i[4],i[5],i[6]).length(),c=je.set(i[8],i[9],i[10]).length();this.determinant()<0&&(r=-r),t.x=i[12],t.y=i[13],t.z=i[14],ae.copy(this);let a=1/r,u=1/o,d=1/c;return ae.elements[0]*=a,ae.elements[1]*=a,ae.elements[2]*=a,ae.elements[4]*=u,ae.elements[5]*=u,ae.elements[6]*=u,ae.elements[8]*=d,ae.elements[9]*=d,ae.elements[10]*=d,e.setFromRotationMatrix(ae),n.x=r,n.y=o,n.z=c,this}makePerspective(t,e,n,i,r,o,c=An,l=!1){let a=this.elements,u=2*r/(e-t),d=2*r/(n-i),g=(e+t)/(e-t),x=(n+i)/(n-i),v,b;if(l)v=r/(o-r),b=o*r/(o-r);else if(c===An)v=-(o+r)/(o-r),b=-2*o*r/(o-r);else if(c===Ts)v=-o/(o-r),b=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+c);return a[0]=u,a[4]=0,a[8]=g,a[12]=0,a[1]=0,a[5]=d,a[9]=x,a[13]=0,a[2]=0,a[6]=0,a[10]=v,a[14]=b,a[3]=0,a[7]=0,a[11]=-1,a[15]=0,this}makeOrthographic(t,e,n,i,r,o,c=An,l=!1){let a=this.elements,u=2/(e-t),d=2/(n-i),g=-(e+t)/(e-t),x=-(n+i)/(n-i),v,b;if(l)v=1/(o-r),b=o/(o-r);else if(c===An)v=-2/(o-r),b=-(o+r)/(o-r);else if(c===Ts)v=-1/(o-r),b=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+c);return a[0]=u,a[4]=0,a[8]=0,a[12]=g,a[1]=0,a[5]=d,a[9]=0,a[13]=x,a[2]=0,a[6]=0,a[10]=v,a[14]=b,a[3]=0,a[7]=0,a[11]=0,a[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let i=0;i<16;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}},je=new X,ae=new Ot,Ma=new X(0,0,0),Sa=new X(1,1,1),Te=new X,ti=new X,Jt=new X,Gr=new Ot,Wr=new le,Ne=class s{constructor(t=0,e=0,n=0,i=s.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=i}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,i=this._order){return this._x=t,this._y=e,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let i=t.elements,r=i[0],o=i[4],c=i[8],l=i[1],a=i[5],u=i[9],d=i[2],g=i[6],x=i[10];switch(e){case"XYZ":this._y=Math.asin(vt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-u,x),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(g,a),this._z=0);break;case"YXZ":this._x=Math.asin(-vt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(c,x),this._z=Math.atan2(l,a)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(vt(g,-1,1)),Math.abs(g)<.9999999?(this._y=Math.atan2(-d,x),this._z=Math.atan2(-o,a)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-vt(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(g,x),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,a));break;case"YZX":this._z=Math.asin(vt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,a),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(c,x));break;case"XZY":this._z=Math.asin(-vt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(g,a),this._y=Math.atan2(c,r)):(this._x=Math.atan2(-u,x),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Gr.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Gr,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Wr.setFromEuler(this),this.setFromQuaternion(Wr,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Ne.DEFAULT_ORDER="XYZ";var di=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},ba=0,Xr=new X,Qe=new le,xe=new Ot,ei=new X,wn=new X,wa=new X,Ea=new le,qr=new X(1,0,0),Yr=new X(0,1,0),Zr=new X(0,0,1),$r={type:"added"},Ta={type:"removed"},tn={type:"childadded",child:null},ms={type:"childremoved",child:null},Oe=class s extends sn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:ba++}),this.uuid=Ei(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=s.DEFAULT_UP.clone();let t=new X,e=new Ne,n=new le,i=new X(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Ot},normalMatrix:{value:new ot}}),this.matrix=new Ot,this.matrixWorld=new Ot,this.matrixAutoUpdate=s.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=s.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new di,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Qe.setFromAxisAngle(t,e),this.quaternion.multiply(Qe),this}rotateOnWorldAxis(t,e){return Qe.setFromAxisAngle(t,e),this.quaternion.premultiply(Qe),this}rotateX(t){return this.rotateOnAxis(qr,t)}rotateY(t){return this.rotateOnAxis(Yr,t)}rotateZ(t){return this.rotateOnAxis(Zr,t)}translateOnAxis(t,e){return Xr.copy(t).applyQuaternion(this.quaternion),this.position.add(Xr.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(qr,t)}translateY(t){return this.translateOnAxis(Yr,t)}translateZ(t){return this.translateOnAxis(Zr,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(xe.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?ei.copy(t):ei.set(t,e,n);let i=this.parent;this.updateWorldMatrix(!0,!1),wn.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?xe.lookAt(wn,ei,this.up):xe.lookAt(ei,wn,this.up),this.quaternion.setFromRotationMatrix(xe),i&&(xe.extractRotation(i.matrixWorld),Qe.setFromRotationMatrix(xe),this.quaternion.premultiply(Qe.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent($r),tn.child=t,this.dispatchEvent(tn),tn.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Ta),ms.child=t,this.dispatchEvent(ms),ms.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),xe.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),xe.multiply(t.parent.matrixWorld)),t.applyMatrix4(xe),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent($r),tn.child=t,this.dispatchEvent(tn),tn.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,i=this.children.length;n<i;n++){let o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);let i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(wn,t,wa),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(wn,Ea,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);let e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){let n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){let i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].updateWorldMatrix(!1,!0)}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(c=>({...c,boundingBox:c.boundingBox?c.boundingBox.toJSON():void 0,boundingSphere:c.boundingSphere?c.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(c=>({...c})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(t),i.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function r(c,l){return c[l.uuid]===void 0&&(c[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(t.geometries,this.geometry);let c=this.geometry.parameters;if(c!==void 0&&c.shapes!==void 0){let l=c.shapes;if(Array.isArray(l))for(let a=0,u=l.length;a<u;a++){let d=l[a];r(t.shapes,d)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let c=[];for(let l=0,a=this.material.length;l<a;l++)c.push(r(t.materials,this.material[l]));i.material=c}else i.material=r(t.materials,this.material);if(this.children.length>0){i.children=[];for(let c=0;c<this.children.length;c++)i.children.push(this.children[c].toJSON(t).object)}if(this.animations.length>0){i.animations=[];for(let c=0;c<this.animations.length;c++){let l=this.animations[c];i.animations.push(r(t.animations,l))}}if(e){let c=o(t.geometries),l=o(t.materials),a=o(t.textures),u=o(t.images),d=o(t.shapes),g=o(t.skeletons),x=o(t.animations),v=o(t.nodes);c.length>0&&(n.geometries=c),l.length>0&&(n.materials=l),a.length>0&&(n.textures=a),u.length>0&&(n.images=u),d.length>0&&(n.shapes=d),g.length>0&&(n.skeletons=g),x.length>0&&(n.animations=x),v.length>0&&(n.nodes=v)}return n.object=i,n;function o(c){let l=[];for(let a in c){let u=c[a];delete u.metadata,l.push(u)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let i=t.children[n];this.add(i.clone())}return this}};Oe.DEFAULT_UP=new X(0,1,0);Oe.DEFAULT_MATRIX_AUTO_UPDATE=!0;Oe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var ro={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ae={h:0,s:0,l:0},ni={h:0,s:0,l:0};function gs(s,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?s+(t-s)*6*e:e<1/2?t:e<2/3?s+(t-s)*6*(2/3-e):s}var Et=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let i=t;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=ne){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ee.colorSpaceToWorking(this,e),this}setRGB(t,e,n,i=ee.workingColorSpace){return this.r=t,this.g=e,this.b=n,ee.colorSpaceToWorking(this,i),this}setHSL(t,e,n,i=ee.workingColorSpace){if(t=ga(t,1),e=vt(e,0,1),n=vt(n,0,1),e===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=gs(o,r,t+1/3),this.g=gs(o,r,t),this.b=gs(o,r,t-1/3)}return ee.colorSpaceToWorking(this,i),this}setStyle(t,e=ne){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,o=i[1],c=i[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(c))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(c))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(c))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=i[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=ne){let n=ro[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=_e(t.r),this.g=_e(t.g),this.b=_e(t.b),this}copyLinearToSRGB(t){return this.r=nn(t.r),this.g=nn(t.g),this.b=nn(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=ne){return ee.workingToColorSpace(zt.copy(this),t),Math.round(vt(zt.r*255,0,255))*65536+Math.round(vt(zt.g*255,0,255))*256+Math.round(vt(zt.b*255,0,255))}getHexString(t=ne){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ee.workingColorSpace){ee.workingToColorSpace(zt.copy(this),e);let n=zt.r,i=zt.g,r=zt.b,o=Math.max(n,i,r),c=Math.min(n,i,r),l,a,u=(c+o)/2;if(c===o)l=0,a=0;else{let d=o-c;switch(a=u<=.5?d/(o+c):d/(2-o-c),o){case n:l=(i-r)/d+(i<r?6:0);break;case i:l=(r-n)/d+2;break;case r:l=(n-i)/d+4;break}l/=6}return t.h=l,t.s=a,t.l=u,t}getRGB(t,e=ee.workingColorSpace){return ee.workingToColorSpace(zt.copy(this),e),t.r=zt.r,t.g=zt.g,t.b=zt.b,t}getStyle(t=ne){ee.workingToColorSpace(zt.copy(this),t);let e=zt.r,n=zt.g,i=zt.b;return t!==ne?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(t,e,n){return this.getHSL(Ae),this.setHSL(Ae.h+t,Ae.s+e,Ae.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Ae),t.getHSL(ni);let n=ls(Ae.h,ni.h,e),i=ls(Ae.s,ni.s,e),r=ls(Ae.l,ni.l,e);return this.setHSL(n,i,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,i=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*i,this.g=r[1]*e+r[4]*n+r[7]*i,this.b=r[2]*e+r[5]*n+r[8]*i,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},zt=new Et;Et.NAMES=ro;var Lt=new X,ii=new Rt,Aa=0,Ct=class{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Aa++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Es,this.updateRanges=[],this.gpuType=no,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[t+i]=e.array[n+i];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)ii.fromBufferAttribute(this,e),ii.applyMatrix3(t),this.setXY(e,ii.x,ii.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Lt.fromBufferAttribute(this,e),Lt.applyMatrix3(t),this.setXYZ(e,Lt.x,Lt.y,Lt.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Lt.fromBufferAttribute(this,e),Lt.applyMatrix4(t),this.setXYZ(e,Lt.x,Lt.y,Lt.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Lt.fromBufferAttribute(this,e),Lt.applyNormalMatrix(t),this.setXYZ(e,Lt.x,Lt.y,Lt.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Lt.fromBufferAttribute(this,e),Lt.transformDirection(t),this.setXYZ(e,Lt.x,Lt.y,Lt.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Mn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Yt(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Mn(e,this.array)),e}setX(t,e){return this.normalized&&(e=Yt(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Mn(e,this.array)),e}setY(t,e){return this.normalized&&(e=Yt(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Mn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Yt(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Mn(e,this.array)),e}setW(t,e){return this.normalized&&(e=Yt(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Yt(e,this.array),n=Yt(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,i){return t*=this.itemSize,this.normalized&&(e=Yt(e,this.array),n=Yt(n,this.array),i=Yt(i,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this}setXYZW(t,e,n,i,r){return t*=this.itemSize,this.normalized&&(e=Yt(e,this.array),n=Yt(n,this.array),i=Yt(i,this.array),r=Yt(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Es&&(t.usage=this.usage),t}};var pi=class extends Ct{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var mi=class extends Ct{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var Ut=class extends Ct{constructor(t,e,n){super(new Float32Array(t),e,n)}},Ra=0,te=new Ot,xs=new Oe,en=new X,Kt=new Re,En=new Re,Nt=new X,ce=class s extends sn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Ra++}),this.uuid=Ei(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(so(t)?mi:pi)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new ot().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}let i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(t),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return te.makeRotationFromQuaternion(t),this.applyMatrix4(te),this}rotateX(t){return te.makeRotationX(t),this.applyMatrix4(te),this}rotateY(t){return te.makeRotationY(t),this.applyMatrix4(te),this}rotateZ(t){return te.makeRotationZ(t),this.applyMatrix4(te),this}translate(t,e,n){return te.makeTranslation(t,e,n),this.applyMatrix4(te),this}scale(t,e,n){return te.makeScale(t,e,n),this.applyMatrix4(te),this}lookAt(t){return xs.lookAt(t),xs.updateMatrix(),this.applyMatrix4(xs.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(en).negate(),this.translate(en.x,en.y,en.z),this}setFromPoints(t){let e=this.getAttribute("position");if(e===void 0){let n=[];for(let i=0,r=t.length;i<r;i++){let o=t[i];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Ut(n,3))}else{let n=Math.min(t.length,e.count);for(let i=0;i<n;i++){let r=t[i];e.setXYZ(i,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Re);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new X(-1/0,-1/0,-1/0),new X(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,i=e.length;n<i;n++){let r=e[n];Kt.setFromBufferAttribute(r),this.morphTargetsRelative?(Nt.addVectors(this.boundingBox.min,Kt.min),this.boundingBox.expandByPoint(Nt),Nt.addVectors(this.boundingBox.max,Kt.max),this.boundingBox.expandByPoint(Nt)):(this.boundingBox.expandByPoint(Kt.min),this.boundingBox.expandByPoint(Kt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new fi);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new X,1/0);return}if(t){let n=this.boundingSphere.center;if(Kt.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){let c=e[r];En.setFromBufferAttribute(c),this.morphTargetsRelative?(Nt.addVectors(Kt.min,En.min),Kt.expandByPoint(Nt),Nt.addVectors(Kt.max,En.max),Kt.expandByPoint(Nt)):(Kt.expandByPoint(En.min),Kt.expandByPoint(En.max))}Kt.getCenter(n);let i=0;for(let r=0,o=t.count;r<o;r++)Nt.fromBufferAttribute(t,r),i=Math.max(i,n.distanceToSquared(Nt));if(e)for(let r=0,o=e.length;r<o;r++){let c=e[r],l=this.morphTargetsRelative;for(let a=0,u=c.count;a<u;a++)Nt.fromBufferAttribute(c,a),l&&(en.fromBufferAttribute(t,a),Nt.add(en)),i=Math.max(i,n.distanceToSquared(Nt))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=e.position,i=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ct(new Float32Array(4*n.count),4));let o=this.getAttribute("tangent"),c=[],l=[];for(let B=0;B<n.count;B++)c[B]=new X,l[B]=new X;let a=new X,u=new X,d=new X,g=new Rt,x=new Rt,v=new Rt,b=new X,E=new X;function A(B,G,J){a.fromBufferAttribute(n,B),u.fromBufferAttribute(n,G),d.fromBufferAttribute(n,J),g.fromBufferAttribute(r,B),x.fromBufferAttribute(r,G),v.fromBufferAttribute(r,J),u.sub(a),d.sub(a),x.sub(g),v.sub(g);let j=1/(x.x*v.y-v.x*x.y);isFinite(j)&&(b.copy(u).multiplyScalar(v.y).addScaledVector(d,-x.y).multiplyScalar(j),E.copy(d).multiplyScalar(x.x).addScaledVector(u,-v.x).multiplyScalar(j),c[B].add(b),c[G].add(b),c[J].add(b),l[B].add(E),l[G].add(E),l[J].add(E))}let w=this.groups;w.length===0&&(w=[{start:0,count:t.count}]);for(let B=0,G=w.length;B<G;++B){let J=w[B],j=J.start,et=J.count;for(let nt=j,st=j+et;nt<st;nt+=3)A(t.getX(nt+0),t.getX(nt+1),t.getX(nt+2))}let I=new X,T=new X,U=new X,N=new X;function z(B){U.fromBufferAttribute(i,B),N.copy(U);let G=c[B];I.copy(G),I.sub(U.multiplyScalar(U.dot(G))).normalize(),T.crossVectors(N,G);let j=T.dot(l[B])<0?-1:1;o.setXYZW(B,I.x,I.y,I.z,j)}for(let B=0,G=w.length;B<G;++B){let J=w[B],j=J.start,et=J.count;for(let nt=j,st=j+et;nt<st;nt+=3)z(t.getX(nt+0)),z(t.getX(nt+1)),z(t.getX(nt+2))}}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Ct(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let g=0,x=n.count;g<x;g++)n.setXYZ(g,0,0,0);let i=new X,r=new X,o=new X,c=new X,l=new X,a=new X,u=new X,d=new X;if(t)for(let g=0,x=t.count;g<x;g+=3){let v=t.getX(g+0),b=t.getX(g+1),E=t.getX(g+2);i.fromBufferAttribute(e,v),r.fromBufferAttribute(e,b),o.fromBufferAttribute(e,E),u.subVectors(o,r),d.subVectors(i,r),u.cross(d),c.fromBufferAttribute(n,v),l.fromBufferAttribute(n,b),a.fromBufferAttribute(n,E),c.add(u),l.add(u),a.add(u),n.setXYZ(v,c.x,c.y,c.z),n.setXYZ(b,l.x,l.y,l.z),n.setXYZ(E,a.x,a.y,a.z)}else for(let g=0,x=e.count;g<x;g+=3)i.fromBufferAttribute(e,g+0),r.fromBufferAttribute(e,g+1),o.fromBufferAttribute(e,g+2),u.subVectors(o,r),d.subVectors(i,r),u.cross(d),n.setXYZ(g+0,u.x,u.y,u.z),n.setXYZ(g+1,u.x,u.y,u.z),n.setXYZ(g+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Nt.fromBufferAttribute(t,e),Nt.normalize(),t.setXYZ(e,Nt.x,Nt.y,Nt.z)}toNonIndexed(){function t(c,l){let a=c.array,u=c.itemSize,d=c.normalized,g=new a.constructor(l.length*u),x=0,v=0;for(let b=0,E=l.length;b<E;b++){c.isInterleavedBufferAttribute?x=l[b]*c.data.stride+c.offset:x=l[b]*u;for(let A=0;A<u;A++)g[v++]=a[x++]}return new Ct(g,u,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new s,n=this.index.array,i=this.attributes;for(let c in i){let l=i[c],a=t(l,n);e.setAttribute(c,a)}let r=this.morphAttributes;for(let c in r){let l=[],a=r[c];for(let u=0,d=a.length;u<d;u++){let g=a[u],x=t(g,n);l.push(x)}e.morphAttributes[c]=l}e.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let c=0,l=o.length;c<l;c++){let a=o[c];e.addGroup(a.start,a.count,a.materialIndex)}return e}toJSON(){let t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let a in l)l[a]!==void 0&&(t[a]=l[a]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let l in n){let a=n[l];t.data.attributes[l]=a.toJSON(t.data)}let i={},r=!1;for(let l in this.morphAttributes){let a=this.morphAttributes[l],u=[];for(let d=0,g=a.length;d<g;d++){let x=a[d];u.push(x.toJSON(t.data))}u.length>0&&(i[l]=u,r=!0)}r&&(t.data.morphAttributes=i,t.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));let c=this.boundingSphere;return c!==null&&(t.data.boundingSphere=c.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone());let i=t.attributes;for(let a in i){let u=i[a];this.setAttribute(a,u.clone(e))}let r=t.morphAttributes;for(let a in r){let u=[],d=r[a];for(let g=0,x=d.length;g<x;g++)u.push(d[g].clone(e));this.morphAttributes[a]=u}this.morphTargetsRelative=t.morphTargetsRelative;let o=t.groups;for(let a=0,u=o.length;a<u;a++){let d=o[a];this.addGroup(d.start,d.count,d.materialIndex)}let c=t.boundingBox;c!==null&&(this.boundingBox=c.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}};var In=class s extends ce{constructor(t=1,e=1,n=1,i=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:i,heightSegments:r,depthSegments:o};let c=this;i=Math.floor(i),r=Math.floor(r),o=Math.floor(o);let l=[],a=[],u=[],d=[],g=0,x=0;v("z","y","x",-1,-1,n,e,t,o,r,0),v("z","y","x",1,-1,n,e,-t,o,r,1),v("x","z","y",1,1,t,n,e,i,o,2),v("x","z","y",1,-1,t,n,-e,i,o,3),v("x","y","z",1,-1,t,e,n,i,r,4),v("x","y","z",-1,-1,t,e,-n,i,r,5),this.setIndex(l),this.setAttribute("position",new Ut(a,3)),this.setAttribute("normal",new Ut(u,3)),this.setAttribute("uv",new Ut(d,2));function v(b,E,A,w,I,T,U,N,z,B,G){let J=T/z,j=U/B,et=T/2,nt=U/2,st=N/2,ut=z+1,_t=B+1,Dt=0,at=0,mt=new X;for(let pt=0;pt<_t;pt++){let It=pt*j-nt;for(let Bt=0;Bt<ut;Bt++){let Vt=Bt*J-et;mt[b]=Vt*w,mt[E]=It*I,mt[A]=st,a.push(mt.x,mt.y,mt.z),mt[b]=0,mt[E]=0,mt[A]=N>0?1:-1,u.push(mt.x,mt.y,mt.z),d.push(Bt/z),d.push(1-pt/B),Dt+=1}}for(let pt=0;pt<B;pt++)for(let It=0;It<z;It++){let Bt=g+It+ut*pt,Vt=g+It+ut*(pt+1),Qt=g+(It+1)+ut*(pt+1),se=g+(It+1)+ut*pt;l.push(Bt,Vt,se),l.push(Vt,Qt,se),at+=6}c.addGroup(x,at,G),x+=at,g+=Dt}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};function oo(s){let t={};for(let e in s){t[e]={};for(let n in s[e]){let i=s[e][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=i.clone():Array.isArray(i)?t[e][n]=i.slice():t[e][n]=i}}return t}function Ht(s){let t={};for(let e=0;e<s.length;e++){let n=oo(s[e]);for(let i in n)t[i]=n[i]}return t}var Be=class s extends ce{constructor(t=1,e=1,n=1,i=32,r=1,o=!1,c=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:i,heightSegments:r,openEnded:o,thetaStart:c,thetaLength:l};let a=this;i=Math.floor(i),r=Math.floor(r);let u=[],d=[],g=[],x=[],v=0,b=[],E=n/2,A=0;w(),o===!1&&(t>0&&I(!0),e>0&&I(!1)),this.setIndex(u),this.setAttribute("position",new Ut(d,3)),this.setAttribute("normal",new Ut(g,3)),this.setAttribute("uv",new Ut(x,2));function w(){let T=new X,U=new X,N=0,z=(e-t)/n;for(let B=0;B<=r;B++){let G=[],J=B/r,j=J*(e-t)+t;for(let et=0;et<=i;et++){let nt=et/i,st=nt*l+c,ut=Math.sin(st),_t=Math.cos(st);U.x=j*ut,U.y=-J*n+E,U.z=j*_t,d.push(U.x,U.y,U.z),T.set(ut,z,_t).normalize(),g.push(T.x,T.y,T.z),x.push(nt,1-J),G.push(v++)}b.push(G)}for(let B=0;B<i;B++)for(let G=0;G<r;G++){let J=b[G][B],j=b[G+1][B],et=b[G+1][B+1],nt=b[G][B+1];(t>0||G!==0)&&(u.push(J,j,nt),N+=3),(e>0||G!==r-1)&&(u.push(j,et,nt),N+=3)}a.addGroup(A,N,0),A+=N}function I(T){let U=v,N=new Rt,z=new X,B=0,G=T===!0?t:e,J=T===!0?1:-1;for(let et=1;et<=i;et++)d.push(0,E*J,0),g.push(0,J,0),x.push(.5,.5),v++;let j=v;for(let et=0;et<=i;et++){let st=et/i*l+c,ut=Math.cos(st),_t=Math.sin(st);z.x=G*_t,z.y=E*J,z.z=G*ut,d.push(z.x,z.y,z.z),g.push(0,J,0),N.x=ut*.5+.5,N.y=_t*.5*J+.5,x.push(N.x,N.y),v++}for(let et=0;et<i;et++){let nt=U+et,st=j+et;T===!0?u.push(st,st+1,nt):u.push(st+1,st,nt),B+=3}a.addGroup(A,B,T===!0?1:2),A+=B}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Pn=class s extends Be{constructor(t=1,e=1,n=32,i=1,r=!1,o=0,c=Math.PI*2){super(0,t,e,n,i,r,o,c),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:i,openEnded:r,thetaStart:o,thetaLength:c}}static fromJSON(t){return new s(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Ln=class s extends ce{constructor(t=[],e=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:i};let r=[],o=[];c(i),a(n),u(),this.setAttribute("position",new Ut(r,3)),this.setAttribute("normal",new Ut(r.slice(),3)),this.setAttribute("uv",new Ut(o,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function c(w){let I=new X,T=new X,U=new X;for(let N=0;N<e.length;N+=3)x(e[N+0],I),x(e[N+1],T),x(e[N+2],U),l(I,T,U,w)}function l(w,I,T,U){let N=U+1,z=[];for(let B=0;B<=N;B++){z[B]=[];let G=w.clone().lerp(T,B/N),J=I.clone().lerp(T,B/N),j=N-B;for(let et=0;et<=j;et++)et===0&&B===N?z[B][et]=G:z[B][et]=G.clone().lerp(J,et/j)}for(let B=0;B<N;B++)for(let G=0;G<2*(N-B)-1;G++){let J=Math.floor(G/2);G%2===0?(g(z[B][J+1]),g(z[B+1][J]),g(z[B][J])):(g(z[B][J+1]),g(z[B+1][J+1]),g(z[B+1][J]))}}function a(w){let I=new X;for(let T=0;T<r.length;T+=3)I.x=r[T+0],I.y=r[T+1],I.z=r[T+2],I.normalize().multiplyScalar(w),r[T+0]=I.x,r[T+1]=I.y,r[T+2]=I.z}function u(){let w=new X;for(let I=0;I<r.length;I+=3){w.x=r[I+0],w.y=r[I+1],w.z=r[I+2];let T=E(w)/2/Math.PI+.5,U=A(w)/Math.PI+.5;o.push(T,1-U)}v(),d()}function d(){for(let w=0;w<o.length;w+=6){let I=o[w+0],T=o[w+2],U=o[w+4],N=Math.max(I,T,U),z=Math.min(I,T,U);N>.9&&z<.1&&(I<.2&&(o[w+0]+=1),T<.2&&(o[w+2]+=1),U<.2&&(o[w+4]+=1))}}function g(w){r.push(w.x,w.y,w.z)}function x(w,I){let T=w*3;I.x=t[T+0],I.y=t[T+1],I.z=t[T+2]}function v(){let w=new X,I=new X,T=new X,U=new X,N=new Rt,z=new Rt,B=new Rt;for(let G=0,J=0;G<r.length;G+=9,J+=6){w.set(r[G+0],r[G+1],r[G+2]),I.set(r[G+3],r[G+4],r[G+5]),T.set(r[G+6],r[G+7],r[G+8]),N.set(o[J+0],o[J+1]),z.set(o[J+2],o[J+3]),B.set(o[J+4],o[J+5]),U.copy(w).add(I).add(T).divideScalar(3);let j=E(U);b(N,J+0,w,j),b(z,J+2,I,j),b(B,J+4,T,j)}}function b(w,I,T,U){U<0&&w.x===1&&(o[I]=w.x-1),T.x===0&&T.z===0&&(o[I]=U/2/Math.PI+.5)}function E(w){return Math.atan2(w.z,-w.x)}function A(w){return Math.atan2(-w.y,Math.sqrt(w.x*w.x+w.z*w.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.vertices,t.indices,t.radius,t.details)}};function Ca(s,t,e=2){let n=t&&t.length,i=n?t[0]*e:s.length,r=ao(s,0,i,e,!0),o=[];if(!r||r.next===r.prev)return o;let c,l,a;if(n&&(r=Fa(s,t,r,e)),s.length>80*e){c=1/0,l=1/0;let u=-1/0,d=-1/0;for(let g=e;g<i;g+=e){let x=s[g],v=s[g+1];x<c&&(c=x),v<l&&(l=v),x>u&&(u=x),v>d&&(d=v)}a=Math.max(u-c,d-l),a=a!==0?32767/a:0}return Dn(r,o,e,c,l,a,0),o}function ao(s,t,e,n,i){let r;if(i===Xa(s,t,e,n)>0)for(let o=t;o<e;o+=n)r=Jr(o/n|0,s[o],s[o+1],r);else for(let o=e-n;o>=t;o-=n)r=Jr(o/n|0,s[o],s[o+1],r);return r&&on(r,r.next)&&(Un(r),r=r.next),r}function ke(s,t){if(!s)return s;t||(t=s);let e=s,n;do if(n=!1,!e.steiner&&(on(e,e.next)||wt(e.prev,e,e.next)===0)){if(Un(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function Dn(s,t,e,n,i,r,o){if(!s)return;!o&&r&&ka(s,n,i,r);let c=s;for(;s.prev!==s.next;){let l=s.prev,a=s.next;if(r?Pa(s,n,i,r):Ia(s)){t.push(l.i,s.i,a.i),Un(s),s=a.next,c=a.next;continue}if(s=a,s===c){o?o===1?(s=La(ke(s),t),Dn(s,t,e,n,i,r,2)):o===2&&Da(s,t,e,n,i,r):Dn(ke(s),t,e,n,i,r,1);break}}}function Ia(s){let t=s.prev,e=s,n=s.next;if(wt(t,e,n)>=0)return!1;let i=t.x,r=e.x,o=n.x,c=t.y,l=e.y,a=n.y,u=Math.min(i,r,o),d=Math.min(c,l,a),g=Math.max(i,r,o),x=Math.max(c,l,a),v=n.next;for(;v!==t;){if(v.x>=u&&v.x<=g&&v.y>=d&&v.y<=x&&Rn(i,c,r,l,o,a,v.x,v.y)&&wt(v.prev,v,v.next)>=0)return!1;v=v.next}return!0}function Pa(s,t,e,n){let i=s.prev,r=s,o=s.next;if(wt(i,r,o)>=0)return!1;let c=i.x,l=r.x,a=o.x,u=i.y,d=r.y,g=o.y,x=Math.min(c,l,a),v=Math.min(u,d,g),b=Math.max(c,l,a),E=Math.max(u,d,g),A=Cs(x,v,t,e,n),w=Cs(b,E,t,e,n),I=s.prevZ,T=s.nextZ;for(;I&&I.z>=A&&T&&T.z<=w;){if(I.x>=x&&I.x<=b&&I.y>=v&&I.y<=E&&I!==i&&I!==o&&Rn(c,u,l,d,a,g,I.x,I.y)&&wt(I.prev,I,I.next)>=0||(I=I.prevZ,T.x>=x&&T.x<=b&&T.y>=v&&T.y<=E&&T!==i&&T!==o&&Rn(c,u,l,d,a,g,T.x,T.y)&&wt(T.prev,T,T.next)>=0))return!1;T=T.nextZ}for(;I&&I.z>=A;){if(I.x>=x&&I.x<=b&&I.y>=v&&I.y<=E&&I!==i&&I!==o&&Rn(c,u,l,d,a,g,I.x,I.y)&&wt(I.prev,I,I.next)>=0)return!1;I=I.prevZ}for(;T&&T.z<=w;){if(T.x>=x&&T.x<=b&&T.y>=v&&T.y<=E&&T!==i&&T!==o&&Rn(c,u,l,d,a,g,T.x,T.y)&&wt(T.prev,T,T.next)>=0)return!1;T=T.nextZ}return!0}function La(s,t){let e=s;do{let n=e.prev,i=e.next.next;!on(n,i)&&co(n,e,e.next,i)&&Fn(n,i)&&Fn(i,n)&&(t.push(n.i,e.i,i.i),Un(e),Un(e.next),e=s=i),e=e.next}while(e!==s);return ke(e)}function Da(s,t,e,n,i,r){let o=s;do{let c=o.next.next;for(;c!==o.prev;){if(o.i!==c.i&&Ha(o,c)){let l=ho(o,c);o=ke(o,o.next),l=ke(l,l.next),Dn(o,t,e,n,i,r,0),Dn(l,t,e,n,i,r,0);return}c=c.next}o=o.next}while(o!==s)}function Fa(s,t,e,n){let i=[];for(let r=0,o=t.length;r<o;r++){let c=t[r]*n,l=r<o-1?t[r+1]*n:s.length,a=ao(s,c,l,n,!1);a===a.next&&(a.steiner=!0),i.push(Va(a))}i.sort(Ua);for(let r=0;r<i.length;r++)e=Na(i[r],e);return e}function Ua(s,t){let e=s.x-t.x;if(e===0&&(e=s.y-t.y,e===0)){let n=(s.next.y-s.y)/(s.next.x-s.x),i=(t.next.y-t.y)/(t.next.x-t.x);e=n-i}return e}function Na(s,t){let e=Oa(s,t);if(!e)return t;let n=ho(e,s);return ke(n,n.next),ke(e,e.next)}function Oa(s,t){let e=t,n=s.x,i=s.y,r=-1/0,o;if(on(s,e))return e;do{if(on(s,e.next))return e.next;if(i<=e.y&&i>=e.next.y&&e.next.y!==e.y){let d=e.x+(i-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=n&&d>r&&(r=d,o=e.x<e.next.x?e:e.next,d===n))return o}e=e.next}while(e!==t);if(!o)return null;let c=o,l=o.x,a=o.y,u=1/0;e=o;do{if(n>=e.x&&e.x>=l&&n!==e.x&&lo(i<a?n:r,i,l,a,i<a?r:n,i,e.x,e.y)){let d=Math.abs(i-e.y)/(n-e.x);Fn(e,s)&&(d<u||d===u&&(e.x>o.x||e.x===o.x&&Ba(o,e)))&&(o=e,u=d)}e=e.next}while(e!==c);return o}function Ba(s,t){return wt(s.prev,s,t.prev)<0&&wt(t.next,s,s.next)<0}function ka(s,t,e,n){let i=s;do i.z===0&&(i.z=Cs(i.x,i.y,t,e,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==s);i.prevZ.nextZ=null,i.prevZ=null,za(i)}function za(s){let t,e=1;do{let n=s,i;s=null;let r=null;for(t=0;n;){t++;let o=n,c=0;for(let a=0;a<e&&(c++,o=o.nextZ,!!o);a++);let l=e;for(;c>0||l>0&&o;)c!==0&&(l===0||!o||n.z<=o.z)?(i=n,n=n.nextZ,c--):(i=o,o=o.nextZ,l--),r?r.nextZ=i:s=i,i.prevZ=r,r=i;n=o}r.nextZ=null,e*=2}while(t>1);return s}function Cs(s,t,e,n,i){return s=(s-e)*i|0,t=(t-n)*i|0,s=(s|s<<8)&16711935,s=(s|s<<4)&252645135,s=(s|s<<2)&858993459,s=(s|s<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,s|t<<1}function Va(s){let t=s,e=s;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==s);return e}function lo(s,t,e,n,i,r,o,c){return(i-o)*(t-c)>=(s-o)*(r-c)&&(s-o)*(n-c)>=(e-o)*(t-c)&&(e-o)*(r-c)>=(i-o)*(n-c)}function Rn(s,t,e,n,i,r,o,c){return!(s===o&&t===c)&&lo(s,t,e,n,i,r,o,c)}function Ha(s,t){return s.next.i!==t.i&&s.prev.i!==t.i&&!Ga(s,t)&&(Fn(s,t)&&Fn(t,s)&&Wa(s,t)&&(wt(s.prev,s,t.prev)||wt(s,t.prev,t))||on(s,t)&&wt(s.prev,s,s.next)>0&&wt(t.prev,t,t.next)>0)}function wt(s,t,e){return(t.y-s.y)*(e.x-t.x)-(t.x-s.x)*(e.y-t.y)}function on(s,t){return s.x===t.x&&s.y===t.y}function co(s,t,e,n){let i=ri(wt(s,t,e)),r=ri(wt(s,t,n)),o=ri(wt(e,n,s)),c=ri(wt(e,n,t));return!!(i!==r&&o!==c||i===0&&si(s,e,t)||r===0&&si(s,n,t)||o===0&&si(e,s,n)||c===0&&si(e,t,n))}function si(s,t,e){return t.x<=Math.max(s.x,e.x)&&t.x>=Math.min(s.x,e.x)&&t.y<=Math.max(s.y,e.y)&&t.y>=Math.min(s.y,e.y)}function ri(s){return s>0?1:s<0?-1:0}function Ga(s,t){let e=s;do{if(e.i!==s.i&&e.next.i!==s.i&&e.i!==t.i&&e.next.i!==t.i&&co(e,e.next,s,t))return!0;e=e.next}while(e!==s);return!1}function Fn(s,t){return wt(s.prev,s,s.next)<0?wt(s,t,s.next)>=0&&wt(s,s.prev,t)>=0:wt(s,t,s.prev)<0||wt(s,s.next,t)<0}function Wa(s,t){let e=s,n=!1,i=(s.x+t.x)/2,r=(s.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&i<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==s);return n}function ho(s,t){let e=Is(s.i,s.x,s.y),n=Is(t.i,t.x,t.y),i=s.next,r=t.prev;return s.next=t,t.prev=s,e.next=i,i.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function Jr(s,t,e,n){let i=Is(s,t,e);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function Un(s){s.next.prev=s.prev,s.prev.next=s.next,s.prevZ&&(s.prevZ.nextZ=s.nextZ),s.nextZ&&(s.nextZ.prevZ=s.prevZ)}function Is(s,t,e){return{i:s,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Xa(s,t,e,n){let i=0;for(let r=t,o=e-n;r<e;r+=n)i+=(s[o]-s[r])*(s[r+1]+s[o+1]),o=r;return i}var Ps=class{static triangulate(t,e,n=2){return Ca(t,e,n)}},Nn=class s{static area(t){let e=t.length,n=0;for(let i=e-1,r=0;r<e;i=r++)n+=t[i].x*t[r].y-t[r].x*t[i].y;return n*.5}static isClockWise(t){return s.area(t)<0}static triangulateShape(t,e){let n=[],i=[],r=[];Kr(t),jr(n,t);let o=t.length;e.forEach(Kr);for(let l=0;l<e.length;l++)i.push(o),o+=e[l].length,jr(n,e[l]);let c=Ps.triangulate(n,i);for(let l=0;l<c.length;l+=3)r.push(c.slice(l,l+3));return r}};function Kr(s){let t=s.length;t>2&&s[t-1].equals(s[0])&&s.pop()}function jr(s,t){for(let e=0;e<t.length;e++)s.push(t[e].x),s.push(t[e].y)}var an=class s extends Ln{constructor(t=1,e=0){let n=(1+Math.sqrt(5))/2,i=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(i,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new s(t.radius,t.detail)}};var On=class s extends Ln{constructor(t=1,e=0){let n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],i=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,i,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new s(t.radius,t.detail)}};var ln=class s extends ce{constructor(t=1,e=32,n=16,i=0,r=Math.PI*2,o=0,c=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:i,phiLength:r,thetaStart:o,thetaLength:c},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));let l=Math.min(o+c,Math.PI),a=0,u=[],d=new X,g=new X,x=[],v=[],b=[],E=[];for(let A=0;A<=n;A++){let w=[],I=A/n,T=0;A===0&&o===0?T=.5/e:A===n&&l===Math.PI&&(T=-.5/e);for(let U=0;U<=e;U++){let N=U/e;d.x=-t*Math.cos(i+N*r)*Math.sin(o+I*c),d.y=t*Math.cos(o+I*c),d.z=t*Math.sin(i+N*r)*Math.sin(o+I*c),v.push(d.x,d.y,d.z),g.copy(d).normalize(),b.push(g.x,g.y,g.z),E.push(N+T,1-I),w.push(a++)}u.push(w)}for(let A=0;A<n;A++)for(let w=0;w<e;w++){let I=u[A][w+1],T=u[A][w],U=u[A+1][w],N=u[A+1][w+1];(A!==0||o>0)&&x.push(I,T,N),(A!==n-1||l<Math.PI)&&x.push(T,U,N)}this.setIndex(x),this.setAttribute("position",new Ut(v,3)),this.setAttribute("normal",new Ut(b,3)),this.setAttribute("uv",new Ut(E,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};var Bn=class s extends ce{constructor(t=1,e=.4,n=12,i=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:i,arc:r},n=Math.floor(n),i=Math.floor(i);let o=[],c=[],l=[],a=[],u=new X,d=new X,g=new X;for(let x=0;x<=n;x++)for(let v=0;v<=i;v++){let b=v/i*r,E=x/n*Math.PI*2;d.x=(t+e*Math.cos(E))*Math.cos(b),d.y=(t+e*Math.cos(E))*Math.sin(b),d.z=e*Math.sin(E),c.push(d.x,d.y,d.z),u.x=t*Math.cos(b),u.y=t*Math.sin(b),g.subVectors(d,u).normalize(),l.push(g.x,g.y,g.z),a.push(v/i),a.push(x/n)}for(let x=1;x<=n;x++)for(let v=1;v<=i;v++){let b=(i+1)*x+v-1,E=(i+1)*(x-1)+v-1,A=(i+1)*(x-1)+v,w=(i+1)*x+v;o.push(b,E,w),o.push(E,A,w)}this.setIndex(o),this.setAttribute("position",new Ut(c,3)),this.setAttribute("normal",new Ut(l,3)),this.setAttribute("uv",new Ut(a,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}};function oi(s,t){return!s||s.constructor===t?s:typeof t.BYTES_PER_ELEMENT=="number"?new t(s):Array.prototype.slice.call(s)}function qa(s){return ArrayBuffer.isView(s)&&!(s instanceof DataView)}var ze=class{constructor(t,e,n,i){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,i=e[n],r=e[n-1];n:{t:{let o;e:{i:if(!(t<i)){for(let c=n+2;;){if(i===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===c)break;if(r=i,i=e[++n],t<i)break t}o=e.length;break e}if(!(t>=r)){let c=e[1];t<c&&(n=2,r=c);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(i=r,r=e[--n-1],t>=r)break t}o=n,n=0;break e}break n}for(;n<o;){let c=n+o>>>1;t<e[c]?o=c:n=c+1}if(i=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,i)}return this.interpolate_(n,r,t,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=t*i;for(let o=0;o!==i;++o)e[o]=n[r+o];return e}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},gi=class extends ze{constructor(t,e,n,i){super(t,e,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:vs,endingEnd:vs}}intervalChanged_(t,e,n){let i=this.parameterPositions,r=t-2,o=t+1,c=i[r],l=i[o];if(c===void 0)switch(this.getSettings_().endingStart){case Ms:r=t,c=2*e-n;break;case Ss:r=i.length-2,c=e+i[r]-i[r+1];break;default:r=t,c=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Ms:o=t,l=2*n-e;break;case Ss:o=1,l=n+i[1]-i[0];break;default:o=t-1,l=e}let a=(n-e)*.5,u=this.valueSize;this._weightPrev=a/(e-c),this._weightNext=a/(l-n),this._offsetPrev=r*u,this._offsetNext=o*u}interpolate_(t,e,n,i){let r=this.resultBuffer,o=this.sampleValues,c=this.valueSize,l=t*c,a=l-c,u=this._offsetPrev,d=this._offsetNext,g=this._weightPrev,x=this._weightNext,v=(n-e)/(i-e),b=v*v,E=b*v,A=-g*E+2*g*b-g*v,w=(1+g)*E+(-1.5-2*g)*b+(-.5+g)*v+1,I=(-1-x)*E+(1.5+x)*b+.5*v,T=x*E-x*b;for(let U=0;U!==c;++U)r[U]=A*o[u+U]+w*o[a+U]+I*o[l+U]+T*o[d+U];return r}},xi=class extends ze{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t,e,n,i){let r=this.resultBuffer,o=this.sampleValues,c=this.valueSize,l=t*c,a=l-c,u=(n-e)/(i-e),d=1-u;for(let g=0;g!==c;++g)r[g]=o[a+g]*d+o[l+g]*u;return r}},_i=class extends ze{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t){return this.copySampleValue_(t-1)}},jt=class{constructor(t,e,n,i){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=oi(e,this.TimeBufferType),this.values=oi(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:oi(t.times,Array),values:oi(t.values,Array)};let i=t.getInterpolation();i!==t.DefaultInterpolation&&(n.interpolation=i)}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new _i(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new xi(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new gi(this.times,this.values,this.getValueSize(),t)}setInterpolation(t){let e;switch(t){case Cn:e=this.InterpolantFactoryMethodDiscrete;break;case ci:e=this.InterpolantFactoryMethodLinear;break;case ai:e=this.InterpolantFactoryMethodSmooth;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Cn;case this.InterpolantFactoryMethodLinear:return ci;case this.InterpolantFactoryMethodSmooth:return ai}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,i=e.length;n!==i;++n)e[n]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,i=e.length;n!==i;++n)e[n]*=t}return this}trim(t,e){let n=this.times,i=n.length,r=0,o=i-1;for(;r!==i&&n[r]<t;)++r;for(;o!==-1&&n[o]>e;)--o;if(++o,r!==0||o!==i){r>=o&&(o=Math.max(o,1),r=o-1);let c=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*c,o*c)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,i=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),t=!1);let o=null;for(let c=0;c!==r;c++){let l=n[c];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,c,l),t=!1;break}if(o!==null&&o>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,c,l,o),t=!1;break}o=l}if(i!==void 0&&qa(i))for(let c=0,l=i.length;c!==l;++c){let a=i[c];if(isNaN(a)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,c,a),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===ai,r=t.length-1,o=1;for(let c=1;c<r;++c){let l=!1,a=t[c],u=t[c+1];if(a!==u&&(c!==1||a!==t[0]))if(i)l=!0;else{let d=c*n,g=d-n,x=d+n;for(let v=0;v!==n;++v){let b=e[d+v];if(b!==e[g+v]||b!==e[x+v]){l=!0;break}}}if(l){if(c!==o){t[o]=t[c];let d=c*n,g=o*n;for(let x=0;x!==n;++x)e[g+x]=e[d+x]}++o}}if(r>0){t[o]=t[r];for(let c=r*n,l=o*n,a=0;a!==n;++a)e[l+a]=e[c+a];++o}return o!==t.length?(this.times=t.slice(0,o),this.values=e.slice(0,o*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,i=new n(this.name,t,e);return i.createInterpolant=this.createInterpolant,i}};jt.prototype.ValueTypeName="";jt.prototype.TimeBufferType=Float32Array;jt.prototype.ValueBufferType=Float32Array;jt.prototype.DefaultInterpolation=ci;var Ce=class extends jt{constructor(t,e,n){super(t,e,n)}};Ce.prototype.ValueTypeName="bool";Ce.prototype.ValueBufferType=Array;Ce.prototype.DefaultInterpolation=Cn;Ce.prototype.InterpolantFactoryMethodLinear=void 0;Ce.prototype.InterpolantFactoryMethodSmooth=void 0;var yi=class extends jt{constructor(t,e,n,i){super(t,e,n,i)}};yi.prototype.ValueTypeName="color";var vi=class extends jt{constructor(t,e,n,i){super(t,e,n,i)}};vi.prototype.ValueTypeName="number";var Mi=class extends ze{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t,e,n,i){let r=this.resultBuffer,o=this.sampleValues,c=this.valueSize,l=(n-e)/(i-e),a=t*c;for(let u=a+c;a!==u;a+=4)le.slerpFlat(r,0,o,a-c,o,a,l);return r}},kn=class extends jt{constructor(t,e,n,i){super(t,e,n,i)}InterpolantFactoryMethodLinear(t){return new Mi(this.times,this.values,this.getValueSize(),t)}};kn.prototype.ValueTypeName="quaternion";kn.prototype.InterpolantFactoryMethodSmooth=void 0;var Ie=class extends jt{constructor(t,e,n){super(t,e,n)}};Ie.prototype.ValueTypeName="string";Ie.prototype.ValueBufferType=Array;Ie.prototype.DefaultInterpolation=Cn;Ie.prototype.InterpolantFactoryMethodLinear=void 0;Ie.prototype.InterpolantFactoryMethodSmooth=void 0;var Si=class extends jt{constructor(t,e,n,i){super(t,e,n,i)}};Si.prototype.ValueTypeName="vector";var bi=class{constructor(t,e,n){let i=this,r=!1,o=0,c=0,l,a=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this.abortController=new AbortController,this.itemStart=function(u){c++,r===!1&&i.onStart!==void 0&&i.onStart(u,o,c),r=!0},this.itemEnd=function(u){o++,i.onProgress!==void 0&&i.onProgress(u,o,c),o===c&&(r=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(u){i.onError!==void 0&&i.onError(u)},this.resolveURL=function(u){return l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,d){return a.push(u,d),this},this.removeHandler=function(u){let d=a.indexOf(u);return d!==-1&&a.splice(d,2),this},this.getHandler=function(u){for(let d=0,g=a.length;d<g;d+=2){let x=a[d],v=a[d+1];if(x.global&&(x.lastIndex=0),x.test(u))return v}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}},uo=new bi,wi=class{constructor(t){this.manager=t!==void 0?t:uo,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){let n=this;return new Promise(function(i,r){n.load(t,i,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}};wi.DEFAULT_MATERIAL_NAME="__DEFAULT";var Gs="\\[\\]\\.:\\/",Ya=new RegExp("["+Gs+"]","g"),Ws="[^"+Gs+"]",Za="[^"+Gs.replace("\\.","")+"]",$a=/((?:WC+[\/:])*)/.source.replace("WC",Ws),Ja=/(WCOD+)?/.source.replace("WCOD",Za),Ka=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Ws),ja=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Ws),Qa=new RegExp("^"+$a+Ja+Ka+ja+"$"),tl=["material","materials","bones","map"],Ls=class{constructor(t,e,n){let i=n||Mt.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,i)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,r=n.length;i!==r;++i)n[i].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},Mt=class s{constructor(t,e,n){this.path=e,this.parsedPath=n||s.parseTrackName(e),this.node=s.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new s.Composite(t,e,n):new s(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(Ya,"")}static parseTrackName(t){let e=Qa.exec(t);if(e===null)throw new Error("PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){let r=n.nodeName.substring(i+1);tl.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(r){for(let o=0;o<r.length;o++){let c=r[o];if(c.name===e||c.uuid===e)return c;let l=n(c.children);if(l)return l}return null},i=n(t.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)t[e++]=n[i]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,i=e.propertyName,r=e.propertyIndex;if(t||(t=s.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let a=e.objectIndex;switch(n){case"materials":if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let u=0;u<t.length;u++)if(t[u].name===a){a=u;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(a!==void 0){if(t[a]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[a]}}let o=t[i];if(o===void 0){let a=e.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+a+"."+i+" but it wasn't found.",t);return}let c=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?c=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(c=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(i==="morphTargetInfluences"){if(!t.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][c]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Mt.Composite=Ls;Mt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Mt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Mt.prototype.GetterByBindingType=[Mt.prototype._getValue_direct,Mt.prototype._getValue_array,Mt.prototype._getValue_arrayElement,Mt.prototype._getValue_toArray];Mt.prototype.SetterByBindingTypeAndVersioning=[[Mt.prototype._setValue_direct,Mt.prototype._setValue_direct_setNeedsUpdate,Mt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Mt.prototype._setValue_array,Mt.prototype._setValue_array_setNeedsUpdate,Mt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Mt.prototype._setValue_arrayElement,Mt.prototype._setValue_arrayElement_setNeedsUpdate,Mt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Mt.prototype._setValue_fromArray,Mt.prototype._setValue_fromArray_setNeedsUpdate,Mt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Tu=new Float32Array(1);typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"180"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="180");var nl=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,il=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,sl=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,rl=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,ol=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,al=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,ll=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,cl=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,hl=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,ul=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,fl=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,dl=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,pl=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,ml=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,gl=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,xl=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,_l=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,yl=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,vl=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Ml=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Sl=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,bl=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,wl=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,El=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Tl=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Al=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Rl=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Cl=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Il=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Pl=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Ll="gl_FragColor = linearToOutputTexel( gl_FragColor );",Dl=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Fl=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Ul=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Nl=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Ol=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Bl=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,kl=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,zl=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Vl=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Hl=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Gl=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Wl=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Xl=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,ql=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Yl=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Zl=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,$l=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Jl=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Kl=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,jl=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Ql=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,tc=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,ec=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,nc=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,ic=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,sc=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,rc=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,oc=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,ac=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,lc=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,cc=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,hc=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,uc=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,fc=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,dc=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,pc=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,mc=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,gc=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,xc=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,_c=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,yc=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,vc=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Mc=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Sc=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,bc=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,wc=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Ec=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Tc=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Ac=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Rc=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Cc=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Ic=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Pc=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Lc=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Dc=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Fc=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Uc=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Nc=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Oc=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Bc=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,kc=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,zc=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Vc=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Hc=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Gc=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Wc=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Xc=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,qc=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Yc=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Zc=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,$c=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Jc=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Kc=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,jc=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Qc=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,th=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,eh=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,nh=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ih=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,sh=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,rh=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,oh=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ah=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,lh=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,ch=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,hh=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,uh=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,fh=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,dh=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,ph=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,mh=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,gh=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,xh=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,_h=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,yh=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,vh=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Mh=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Sh=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,bh=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,wh=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Eh=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Th=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ah=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Rh=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ch=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Ih=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Ph=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Lh=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Dh=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Fh=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,dt={alphahash_fragment:nl,alphahash_pars_fragment:il,alphamap_fragment:sl,alphamap_pars_fragment:rl,alphatest_fragment:ol,alphatest_pars_fragment:al,aomap_fragment:ll,aomap_pars_fragment:cl,batching_pars_vertex:hl,batching_vertex:ul,begin_vertex:fl,beginnormal_vertex:dl,bsdfs:pl,iridescence_fragment:ml,bumpmap_pars_fragment:gl,clipping_planes_fragment:xl,clipping_planes_pars_fragment:_l,clipping_planes_pars_vertex:yl,clipping_planes_vertex:vl,color_fragment:Ml,color_pars_fragment:Sl,color_pars_vertex:bl,color_vertex:wl,common:El,cube_uv_reflection_fragment:Tl,defaultnormal_vertex:Al,displacementmap_pars_vertex:Rl,displacementmap_vertex:Cl,emissivemap_fragment:Il,emissivemap_pars_fragment:Pl,colorspace_fragment:Ll,colorspace_pars_fragment:Dl,envmap_fragment:Fl,envmap_common_pars_fragment:Ul,envmap_pars_fragment:Nl,envmap_pars_vertex:Ol,envmap_physical_pars_fragment:Zl,envmap_vertex:Bl,fog_vertex:kl,fog_pars_vertex:zl,fog_fragment:Vl,fog_pars_fragment:Hl,gradientmap_pars_fragment:Gl,lightmap_pars_fragment:Wl,lights_lambert_fragment:Xl,lights_lambert_pars_fragment:ql,lights_pars_begin:Yl,lights_toon_fragment:$l,lights_toon_pars_fragment:Jl,lights_phong_fragment:Kl,lights_phong_pars_fragment:jl,lights_physical_fragment:Ql,lights_physical_pars_fragment:tc,lights_fragment_begin:ec,lights_fragment_maps:nc,lights_fragment_end:ic,logdepthbuf_fragment:sc,logdepthbuf_pars_fragment:rc,logdepthbuf_pars_vertex:oc,logdepthbuf_vertex:ac,map_fragment:lc,map_pars_fragment:cc,map_particle_fragment:hc,map_particle_pars_fragment:uc,metalnessmap_fragment:fc,metalnessmap_pars_fragment:dc,morphinstance_vertex:pc,morphcolor_vertex:mc,morphnormal_vertex:gc,morphtarget_pars_vertex:xc,morphtarget_vertex:_c,normal_fragment_begin:yc,normal_fragment_maps:vc,normal_pars_fragment:Mc,normal_pars_vertex:Sc,normal_vertex:bc,normalmap_pars_fragment:wc,clearcoat_normal_fragment_begin:Ec,clearcoat_normal_fragment_maps:Tc,clearcoat_pars_fragment:Ac,iridescence_pars_fragment:Rc,opaque_fragment:Cc,packing:Ic,premultiplied_alpha_fragment:Pc,project_vertex:Lc,dithering_fragment:Dc,dithering_pars_fragment:Fc,roughnessmap_fragment:Uc,roughnessmap_pars_fragment:Nc,shadowmap_pars_fragment:Oc,shadowmap_pars_vertex:Bc,shadowmap_vertex:kc,shadowmask_pars_fragment:zc,skinbase_vertex:Vc,skinning_pars_vertex:Hc,skinning_vertex:Gc,skinnormal_vertex:Wc,specularmap_fragment:Xc,specularmap_pars_fragment:qc,tonemapping_fragment:Yc,tonemapping_pars_fragment:Zc,transmission_fragment:$c,transmission_pars_fragment:Jc,uv_pars_fragment:Kc,uv_pars_vertex:jc,uv_vertex:Qc,worldpos_vertex:th,background_vert:eh,background_frag:nh,backgroundCube_vert:ih,backgroundCube_frag:sh,cube_vert:rh,cube_frag:oh,depth_vert:ah,depth_frag:lh,distanceRGBA_vert:ch,distanceRGBA_frag:hh,equirect_vert:uh,equirect_frag:fh,linedashed_vert:dh,linedashed_frag:ph,meshbasic_vert:mh,meshbasic_frag:gh,meshlambert_vert:xh,meshlambert_frag:_h,meshmatcap_vert:yh,meshmatcap_frag:vh,meshnormal_vert:Mh,meshnormal_frag:Sh,meshphong_vert:bh,meshphong_frag:wh,meshphysical_vert:Eh,meshphysical_frag:Th,meshtoon_vert:Ah,meshtoon_frag:Rh,points_vert:Ch,points_frag:Ih,shadow_vert:Ph,shadow_frag:Lh,sprite_vert:Dh,sprite_frag:Fh},Q={common:{diffuse:{value:new Et(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ot},alphaMap:{value:null},alphaMapTransform:{value:new ot},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ot}},envmap:{envMap:{value:null},envMapRotation:{value:new ot},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ot}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ot}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ot},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ot},normalScale:{value:new Rt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ot},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ot}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ot}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ot}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Et(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Et(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ot},alphaTest:{value:0},uvTransform:{value:new ot}},sprite:{diffuse:{value:new Et(16777215)},opacity:{value:1},center:{value:new Rt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ot},alphaMap:{value:null},alphaMapTransform:{value:new ot},alphaTest:{value:0}}},fo={basic:{uniforms:Ht([Q.common,Q.specularmap,Q.envmap,Q.aomap,Q.lightmap,Q.fog]),vertexShader:dt.meshbasic_vert,fragmentShader:dt.meshbasic_frag},lambert:{uniforms:Ht([Q.common,Q.specularmap,Q.envmap,Q.aomap,Q.lightmap,Q.emissivemap,Q.bumpmap,Q.normalmap,Q.displacementmap,Q.fog,Q.lights,{emissive:{value:new Et(0)}}]),vertexShader:dt.meshlambert_vert,fragmentShader:dt.meshlambert_frag},phong:{uniforms:Ht([Q.common,Q.specularmap,Q.envmap,Q.aomap,Q.lightmap,Q.emissivemap,Q.bumpmap,Q.normalmap,Q.displacementmap,Q.fog,Q.lights,{emissive:{value:new Et(0)},specular:{value:new Et(1118481)},shininess:{value:30}}]),vertexShader:dt.meshphong_vert,fragmentShader:dt.meshphong_frag},standard:{uniforms:Ht([Q.common,Q.envmap,Q.aomap,Q.lightmap,Q.emissivemap,Q.bumpmap,Q.normalmap,Q.displacementmap,Q.roughnessmap,Q.metalnessmap,Q.fog,Q.lights,{emissive:{value:new Et(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:dt.meshphysical_vert,fragmentShader:dt.meshphysical_frag},toon:{uniforms:Ht([Q.common,Q.aomap,Q.lightmap,Q.emissivemap,Q.bumpmap,Q.normalmap,Q.displacementmap,Q.gradientmap,Q.fog,Q.lights,{emissive:{value:new Et(0)}}]),vertexShader:dt.meshtoon_vert,fragmentShader:dt.meshtoon_frag},matcap:{uniforms:Ht([Q.common,Q.bumpmap,Q.normalmap,Q.displacementmap,Q.fog,{matcap:{value:null}}]),vertexShader:dt.meshmatcap_vert,fragmentShader:dt.meshmatcap_frag},points:{uniforms:Ht([Q.points,Q.fog]),vertexShader:dt.points_vert,fragmentShader:dt.points_frag},dashed:{uniforms:Ht([Q.common,Q.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:dt.linedashed_vert,fragmentShader:dt.linedashed_frag},depth:{uniforms:Ht([Q.common,Q.displacementmap]),vertexShader:dt.depth_vert,fragmentShader:dt.depth_frag},normal:{uniforms:Ht([Q.common,Q.bumpmap,Q.normalmap,Q.displacementmap,{opacity:{value:1}}]),vertexShader:dt.meshnormal_vert,fragmentShader:dt.meshnormal_frag},sprite:{uniforms:Ht([Q.sprite,Q.fog]),vertexShader:dt.sprite_vert,fragmentShader:dt.sprite_frag},background:{uniforms:{uvTransform:{value:new ot},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:dt.background_vert,fragmentShader:dt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ot}},vertexShader:dt.backgroundCube_vert,fragmentShader:dt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:dt.cube_vert,fragmentShader:dt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:dt.equirect_vert,fragmentShader:dt.equirect_frag},distanceRGBA:{uniforms:Ht([Q.common,Q.displacementmap,{referencePosition:{value:new X},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:dt.distanceRGBA_vert,fragmentShader:dt.distanceRGBA_frag},shadow:{uniforms:Ht([Q.lights,Q.fog,{color:{value:new Et(0)},opacity:{value:1}}]),vertexShader:dt.shadow_vert,fragmentShader:dt.shadow_frag}};fo.physical={uniforms:Ht([fo.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ot},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ot},clearcoatNormalScale:{value:new Rt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ot},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ot},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ot},sheen:{value:0},sheenColor:{value:new Et(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ot},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ot},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ot},transmissionSamplerSize:{value:new Rt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ot},attenuationDistance:{value:0},attenuationColor:{value:new Et(0)},specularColor:{value:new Et(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ot},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ot},anisotropyVector:{value:new Rt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ot}}]),vertexShader:dt.meshphysical_vert,fragmentShader:dt.meshphysical_frag};var Ve=(1+Math.sqrt(5))/2,cn=1/Ve,Y0=[new X(-Ve,cn,0),new X(Ve,cn,0),new X(-cn,0,Ve),new X(cn,0,Ve),new X(0,Ve,-cn),new X(0,Ve,cn),new X(-1,1,-1),new X(1,1,-1),new X(-1,1,1),new X(1,1,1)];var Z0=new Float32Array(16),$0=new Float32Array(9),J0=new Float32Array(4);var K0={[Ds]:Fs,[Us]:ks,[Os]:zs,[Ns]:Bs,[Fs]:Ds,[ks]:Us,[zs]:Os,[Bs]:Ns};function Tt(s,t,e){return[((t-e.lon+540)%360-180)*111320*Math.cos(e.lat*Math.PI/180),-(s-e.lat)*110540]}function ye(s={}){let t=parseFloat(s.height);if(Number.isFinite(t)&&t>0)return Math.min(1e4,/(?:ft|feet|')/i.test(String(s.height))?t*.3048:t);let e=parseFloat(s["building:levels"]);return Number.isFinite(e)&&e>0?Math.min(1e4,e*3.4):{house:8,residential:14,apartments:20,commercial:24,church:24,garage:4,industrial:9}[s.building]||15}function ht(s,t,e){let n=!1;for(let i=0,r=e.length-1;i<e.length;r=i++){let[o,c]=e[i],[l,a]=e[r];c>t!=a>t&&s<(l-o)*(t-c)/(a-c)+o&&(n=!n)}return n}var Uh=[[7572892,9545389,6783889,9084329,8492444],[14998471,13420733,15657435,12960699,14272166,11845060],[11957851,10576206,9598310,13010795,13345659,11501667],[15262936,14207405,13094852,14930877,12564134,14012355]];function ve(s){let t=(s|0)^2654435769;return t=Math.imul(t^t>>>16,73244475),t=Math.imul(t^t>>>16,73244475),((t^t>>>16)>>>0)/4294967296}function po(s,t,e=1){return s>=55?t<.62?0:1:s>=22?t<.22?0:t<.22+.48*e?2:1:s>=11?t<.55*e?2:1:3}function mo(s,t){let e=Uh[s];return new Et(e[Math.floor(t*7919)%e.length]).multiplyScalar(.9+t*13.7%1*.18)}var rt={OFFICE:0,STONE:1,BRICK:2,HOUSE:3,PLAIN:9,FOLIAGE:10,LAMP:11,GLASS:12,SIGNAL:13,SOLAR:14};var pr={};jo(pr,{CAR_COLORS:()=>ie,MeshBuilder:()=>Ti,arrayBuffers:()=>hn,base:()=>xt,bench:()=>zn,bikeRack:()=>js,bollard:()=>Ks,busShelter:()=>Ri,bush:()=>pe,cafeSet:()=>Ci,car:()=>Pe,carGeometry:()=>Zh,drinkingFountain:()=>er,flowers:()=>Me,geometryFromArrays:()=>$h,goal:()=>fr,hedge:()=>qh,hydrant:()=>tr,infoBoard:()=>sr,menuBoard:()=>lr,parkingSign:()=>ur,playground:()=>dr,postBox:()=>Qs,recyclingBins:()=>nr,rgb:()=>Ys,rock:()=>Zs,sculpture:()=>rr,shopPlanter:()=>ar,stopSign:()=>hr,storefront:()=>or,streetLight:()=>$s,subwayEntrance:()=>ir,trafficSignal:()=>cr,tree:()=>de,wasteBasket:()=>Js});var go=new Map;function Ys(s){let t=go.get(s);if(!t){let e=new Et,n=typeof s=="string"?s.trim().toLowerCase().replace(/[\s_-]/g,"").replace(/grey/g,"gray"):s;typeof n=="string"&&!/^#[0-9a-f]{3,8}$/.test(n)&&!(n in Et.NAMES)?e.set(13617339):e.set(n),t=[Math.round(Math.min(1,e.r)*255),Math.round(Math.min(1,e.g)*255),Math.round(Math.min(1,e.b)*255)],go.set(s,t)}return t}var Ti=class{constructor(t=8192){this.count=0,this.allocate(t)}allocate(t){let e=(n,i)=>{let r=new n.constructor(t*i);return r.set(n.subarray(0,this.count*i)),r};this.position?(this.position=e(this.position,3),this.normal=e(this.normal,3),this.uv=e(this.uv,2),this.info=e(this.info,2),this.color=e(this.color,3)):(this.position=new Float32Array(t*3),this.normal=new Float32Array(t*3),this.uv=new Float32Array(t*2),this.info=new Float32Array(t*2),this.color=new Uint8Array(t*3)),this.capacity=t}vertex(t,e,n,i,r,o,c,l,a,u,d){this.count>=this.capacity&&this.allocate(this.capacity*2);let g=this.count++;this.position[g*3]=t,this.position[g*3+1]=e,this.position[g*3+2]=n,this.normal[g*3]=i,this.normal[g*3+1]=r,this.normal[g*3+2]=o,this.color[g*3]=c[0],this.color[g*3+1]=c[1],this.color[g*3+2]=c[2],this.uv[g*2]=l,this.uv[g*2+1]=a,this.info[g*2]=u,this.info[g*2+1]=d}tri(t,e,n,i,r,o=rt.PLAIN,c=0,l=qs,a=qs,u=qs){let d=(e[1]-t[1])*(n[2]-t[2])-(e[2]-t[2])*(n[1]-t[1]),g=(e[2]-t[2])*(n[0]-t[0])-(e[0]-t[0])*(n[2]-t[2]),x=(e[0]-t[0])*(n[1]-t[1])-(e[1]-t[1])*(n[0]-t[0]);d*i[0]+g*i[1]+x*i[2]<0&&([e,n]=[n,e],[a,u]=[u,a]);for(let[v,b]of[[t,l],[e,a],[n,u]])this.vertex(v[0],v[1],v[2],i[0],i[1],i[2],r,b[0],b[1],o,c)}quad(t,e,n,i,r,o,c,l,a,u,d,g){this.tri(t,e,n,r,o,c,l,a,u,d),this.tri(t,n,i,r,o,c,l,a,d,g)}polygon(t,e,n,i,r=rt.PLAIN,o=0,c=!0){if(t.length<3)return;let l=t.map(([x,v])=>new Rt(x,v)),a=e.filter(x=>x.length>2).map(x=>x.map(([v,b])=>new Rt(v,b))),u;try{u=Nn.triangulateShape(l,a)}catch{return}let d=[...l,...a.flat()],g=c?Nh:Oh;for(let[x,v,b]of u)this.tri([d[x].x,n,d[x].y],[d[v].x,n,d[v].y],[d[b].x,n,d[b].y],g,i,r,o,[d[x].x,d[x].y],[d[v].x,d[v].y],[d[b].x,d[b].y])}shape(t,e,n,i=rt.PLAIN,r=0,o=0,c=0){let{position:l,normal:a}=xo[t]||(xo[t]=kh(t)),u=e.elements,d=Bh.getNormalMatrix(e).elements;for(let g=0;g<l.length;g+=3){let x=l[g],v=l[g+1],b=l[g+2],E=a[g],A=a[g+1],w=a[g+2],I=d[0]*E+d[3]*A+d[6]*w,T=d[1]*E+d[4]*A+d[7]*w,U=d[2]*E+d[5]*A+d[8]*w,N=Math.hypot(I,T,U)||1;I/=N,T/=N,U/=N,this.vertex(u[0]*x+u[4]*v+u[8]*b+u[12],u[1]*x+u[5]*v+u[9]*b+u[13],u[2]*x+u[6]*v+u[10]*b+u[14],I,T,U,n,c,o,i,r)}}arrays(){if(!this.count)return null;let t=this.count;return{position:this.position.slice(0,t*3),normal:this.normal.slice(0,t*3),color:this.color.slice(0,t*3),uv:this.uv.slice(0,t*2),info:this.info.slice(0,t*2)}}geometry(){if(!this.count)return null;let t=new ce,e=this.count;return t.setAttribute("position",new Ct(this.position.slice(0,e*3),3)),t.setAttribute("normal",new Ct(this.normal.slice(0,e*3),3)),t.setAttribute("color",new Ct(this.color.slice(0,e*3),3,!0)),t.setAttribute("facadeUv",new Ct(this.uv.slice(0,e*2),2)),t.setAttribute("facadeInfo",new Ct(this.info.slice(0,e*2),2)),t.computeBoundingSphere(),t}},qs=[0,0],Nh=[0,1,0],Oh=[0,-1,0],Bh=new ot,xo={};function kh(s){let t={box:()=>new In(1,1,1),cyl:()=>new Be(.5,.5,1,10),cyl6:()=>new Be(.5,.5,1,6),cone:()=>new Pn(.5,1,9),ico:()=>new an(1,1),ico0:()=>new an(1,0),sphere:()=>new ln(.5,10,7),oct:()=>new On(1,0),dome:()=>new ln(.5,10,5,0,Math.PI*2,0,Math.PI/2),torus:()=>new Bn(.5,.045,5,12)}[s]();return t.index?_o(t.toNonIndexed()):_o(t)}function _o(s){return{position:s.attributes.position.array,normal:s.attributes.normal.array}}var zh=new Ot,yo=new Ot,Vh=new Ot,Hh=new le,Gh=new Ne,Wh=new X,Xh=new X,nx=new X(0,1,0);function xt(s,t,e,n=0){return zh.makeRotationY(n).setPosition(s,t,e).clone()}function V(s,t,e,n,i,r,o,c=0,l=0,a=0){return yo.compose(Wh.set(t,e,n),Hh.setFromEuler(Gh.set(c,l,a)),Xh.set(i,r,o)),Vh.multiplyMatrices(s,yo)}var H=(s,t,e,n,i,r,o)=>s.shape(t,e,Ys(n),i,r,o),Ai=[5212732,6134336,4620086,6989128,4158516,7908687,5671994];function de(s,t,e,n,i,{kind:r="broadleaf",y:o=0,autumn:c=!1}={}){let l=xt(t,o,e,i()*6.28),a=i();if(r==="conifer"){H(s,"cyl6",V(l,0,n*.15,0,.28,n*.3,.28),5981235);let x=[3104054,3697468,2839858][Math.floor(i()*3)];for(let v=0;v<3;v++)H(s,"cone",V(l,0,n*(.32+v*.2),0,n*(.42-v*.1),n*.38,n*(.42-v*.1)),x,rt.FOLIAGE,a,.4+v*.3);return}if(r==="palm"){let x=(i()-.5)*.25;H(s,"cyl6",V(l,Math.sin(x)*n*.5,n*.5,0,.32,n,.32,0,0,-x),9073494);let v=Math.sin(x)*n;for(let b=0;b<7;b++){let E=b/7*Math.PI*2;H(s,"box",V(l,v+Math.cos(E)*1.4,n-.3,Math.sin(E)*1.4,3,.08,.7,0,-E,-.45),5214010,rt.FOLIAGE,a,1)}return}let u=.1+n*.014;H(s,"cyl6",V(l,0,n*.25,0,u*2,n*.5,u*2),6179386);let d=c?[13203247,14131258,11879982][Math.floor(i()*3)]:Ai[Math.floor(i()*Ai.length)],g=n*(.3+i()*.06);H(s,"ico",V(l,0,n*.64,0,g,g*1.05,g),d,rt.FOLIAGE,a,1),H(s,"ico0",V(l,g*.45,n*.76,g*.2,g*.62,g*.58,g*.62),d,rt.FOLIAGE,a,1)}function pe(s,t,e,n,i,r){let o=xt(t,0,e,i()*6.28);H(s,"ico0",V(o,0,n*.42,0,n*.62,n*.48,n*.62),r??Ai[Math.floor(i()*Ai.length)],rt.FOLIAGE,i(),.35)}function qh(s,t,e,n,i){H(s,"box",V(xt(t,0,e,i),0,.55,0,.7,1.1,n),4160053,rt.FOLIAGE,0,.15)}var Yh=[14826587,15895592,16175917,16777215,11557588,15364008,5078496,16734774];function Zs(s,t,e,n,i){let r=.2+i()*.5,o=xt(t,n+r*.18,e,i()*Math.PI*2);H(s,"ico0",V(o,0,0,0,r*1.3,r*.55,r,.12,0,.15),[8948600,10065030,8160377][Math.floor(i()*3)])}function Me(s,t,e,n,i=Yh){let r=xt(t,0,e,n()*6.28),o=i[Math.floor(n()*i.length)];H(s,"ico0",V(r,0,.1,0,.22,.14,.22),5016119,rt.FOLIAGE,n(),.2);for(let c=0;c<5;c++){let l=c*1.26+n();H(s,"oct",V(r,Math.cos(l)*.13,.26+n()*.08,Math.sin(l)*.13,.055,.05,.055),o,rt.FOLIAGE,n(),.5)}}function $s(s,t,e,n,{style:i="modern"}={}){let r=xt(t,.15,e,n);if(i==="classic"){H(s,"cyl6",V(r,0,2,0,.16,4,.16),2437936),H(s,"cyl6",V(r,0,.3,0,.34,.6,.34),2437936),H(s,"sphere",V(r,0,4.25,0,.48,.55,.48),16774360,rt.LAMP);return}H(s,"cyl6",V(r,0,3.6,0,.16,7.2,.16),5331804),H(s,"box",V(r,0,7.15,.8,.09,.09,1.7),5331804),H(s,"box",V(r,0,7.05,1.65,.32,.14,.62),3883844),H(s,"box",V(r,0,6.97,1.65,.26,.03,.52),16774102,rt.LAMP)}function zn(s,t,e,n){let i=xt(t,0,e,n);H(s,"box",V(i,0,.45,0,1.7,.06,.42),10512187),H(s,"box",V(i,0,.78,.2,1.7,.32,.05,-.12),10512187);for(let r of[-.72,.72])H(s,"box",V(i,r,.38,.02,.07,.76,.48),3093555)}function Js(s,t,e){let n=xt(t,0,e);H(s,"cyl",V(n,0,.45,0,.52,.9,.52),3037759),H(s,"cyl",V(n,0,.93,0,.56,.06,.56),2371880)}function Ks(s,t,e){let n=xt(t,0,e);H(s,"cyl6",V(n,0,.45,0,.2,.9,.2),3817281),H(s,"cyl6",V(n,0,.78,0,.21,.06,.21),14277071)}function js(s,t,e,n){let i=xt(t,0,e,n);for(let r of[-.8,0,.8]){for(let o of[-.3,.3])H(s,"box",V(i,r,.42,o,.05,.84,.05),9278870);H(s,"box",V(i,r,.84,0,.05,.05,.65),9278870)}for(let r of[-.7,.1]){let o=r<0?12347208:3504259;for(let c of[-.55,.55]){H(s,"torus",V(i,r,.35,c,.66,.66,.66,0,Math.PI/2),3028022),H(s,"torus",V(i,r,.35,c,.57,.57,.57,0,Math.PI/2),12042685);for(let l of[0,Math.PI/3,-Math.PI/3])H(s,"box",V(i,r,.35,c,.016,.58,.012,l),11450292)}for(let[c,l]of[[[.35,-.55],[.37,0]],[[.37,0],[.82,-.2]],[[.82,-.2],[.35,-.55]],[[.82,-.2],[.89,.39]],[[.89,.39],[.37,0]],[[.89,.39],[.35,.55]],[[.89,.39],[1.03,.36]]]){let a=l[0]-c[0],u=l[1]-c[1];H(s,"cyl6",V(i,r,(c[0]+l[0])/2,(c[1]+l[1])/2,.035,Math.hypot(a,u),.035,Math.atan2(u,a)),o)}H(s,"box",V(i,r,.86,-.23,.18,.065,.28),3421752),H(s,"box",V(i,r,1.03,.36,.46,.035,.04),3883844),H(s,"box",V(i,r,.36,0,.3,.045,.07),3883844)}}function Ri(s,t,e,n,i=3108787){let r=xt(t,.15,e,n);H(s,"box",V(r,0,2.5,0,3.6,.12,1.6),3950152),H(s,"box",V(r,0,1.3,-.72,3.4,2.2,.05),10470351,rt.GLASS),H(s,"box",V(r,-1.75,1.3,-.05,.05,2.2,1.3),10470351,rt.GLASS);for(let o of[-1.75,1.75])H(s,"box",V(r,o,1.25,.7,.08,2.5,.08),3950152);H(s,"box",V(r,0,.45,-.45,2.4,.06,.4),9080719),H(s,"cyl6",V(r,2.4,1.3,.6,.08,2.6,.08),7041650),H(s,"box",V(r,2.4,2.45,.6,.5,.5,.05),i)}function Qs(s,t,e,n){let i=xt(t,0,e,0);if(n==="us"){H(s,"box",V(i,0,.55,0,.48,1.1,.5),2772890),H(s,"cyl",V(i,0,1.1,0,.48,.5,.5,0,0,Math.PI/2),2772890);return}let r=n==="uk"||n==="jp"?13116959:15909166;if(n==="uk"||n==="jp"){H(s,"cyl",V(i,0,.7,0,.5,1.4,.5),r),H(s,"dome",V(i,0,1.4,0,.56,.3,.56),2039583);return}H(s,"cyl6",V(i,0,.5,0,.08,1,.08),5593947),H(s,"box",V(i,0,1.15,0,.45,.55,.35),r)}function tr(s,t,e){let n=xt(t,.15,e);H(s,"cyl",V(n,0,.32,0,.3,.64,.3),13119786),H(s,"dome",V(n,0,.64,0,.34,.2,.34),13119786),H(s,"cyl6",V(n,0,.42,0,.16,.16,.48,Math.PI/2),14277071)}function er(s,t,e){let n=xt(t,0,e);H(s,"box",V(n,0,.45,0,.35,.9,.35),7240310),H(s,"cyl",V(n,0,.93,0,.5,.08,.5),9280149)}function nr(s,t,e,n){let i=xt(t,0,e,n);[2911669,3967551,14726186].forEach((r,o)=>H(s,"box",V(i,(o-1)*1.3,.7,0,1.2,1.4,1),r))}function ir(s,t,e,n){let i=xt(t,.15,e,n);for(let r of[-1,1])H(s,"box",V(i,r*1,.55,0,.06,1.1,4),2907967),H(s,"box",V(i,r,1.1,0,.1,.06,4),2907967);H(s,"box",V(i,0,.55,-2,2,1.1,.06),2907967),H(s,"box",V(i,0,-.3,.2,1.9,.6,3.6),2501162);for(let r of[-1,1])H(s,"cyl6",V(i,r,1.6,-2,.1,1,.1),2907967),H(s,"sphere",V(i,r,2.25,-2,.35,.35,.35),8376714,rt.LAMP)}function sr(s,t,e,n){let i=xt(t,0,e,n);for(let r of[-.5,.5])H(s,"box",V(i,r,.9,0,.08,1.8,.08),3950152);H(s,"box",V(i,0,1.45,0,1.2,.9,.06),15328468)}function rr(s,t,e,n){let i=xt(t,0,e,n()*6.28);H(s,"box",V(i,0,.5,0,1.4,1,1.4),12104356);let r=[10251068,12597547,2977694,14267466][Math.floor(n()*4)];H(s,"sphere",V(i,0,1.9,0,1.6,1.6,1.6),r,rt.PLAIN),H(s,"box",V(i,0,2.9,0,.5,1.2,.5,.4,0,.5),r)}function Ci(s,t,e,n,i){let r=xt(t,.15,e,n),o=[12597547,3046747,15787730,2903942,14852918][Math.floor(i()*5)];H(s,"cyl",V(r,0,.72,0,.7,.04,.7),15262938),H(s,"cyl6",V(r,0,.36,0,.06,.72,.06),3027763);for(let c of[0,Math.PI]){let l=Math.cos(c)*.65,a=Math.sin(c)*.65;H(s,"box",V(r,l,.45,a,.42,.05,.42),3027763),H(s,"box",V(r,l*1.3,.72,a,.05,.55,.42),3027763)}H(s,"cyl6",V(r,0,1.3,0,.05,1.2,.05),14275783),H(s,"cone",V(r,0,2.15,0,2.6,.55,2.6),o)}function or(s,t,e){let{x:n,z:i,yaw:r,width:o}=t,c=xt(n,.15,i,r),l=3162951;H(s,"box",V(c,0,1.45,0,o,2.9,.13),15130574);let a=o*.28,u=o*.59;H(s,"box",V(c,-o*.17,1.4,.09,u,2.18,.07),3560803,rt.GLASS),H(s,"box",V(c,a,1.2,.12,.96,2.35,.09),l),H(s,"box",V(c,a,1.33,.18,.79,1.94,.03),6653585,rt.GLASS),H(s,"box",V(c,a+.27,1.15,.24,.035,.38,.06),14010019);for(let x of[-o*.47,-o*.17,o*.125])H(s,"box",V(c,x,1.42,.145,.07,2.28,.08),l);for(let x of[.3,2.5])H(s,"box",V(c,-o*.17,x,.15,u+.07,.075,.08),l);H(s,"box",V(c,0,.14,.12,o+.1,.23,.28),10198161),H(s,"box",V(c,0,2.94,.1,o,.52,.18),e),H(s,"box",V(c,0,3.26,.12,o+.18,.12,.3),l);let d=o*.97,g=Math.ceil(d/.42);for(let x=0;x<g;x++){let v=x%2?15985106:e,b=-d/2+(x+.5)*d/g;H(s,"box",V(c,b,2.67,.68,d/g,.07,1.3,.13),v),H(s,"box",V(c,b,2.47,1.3,d/g,.22,.07),v)}H(s,"box",V(c,-o*.17,2.4,.19,u-.15,.035,.06),16768940,rt.LAMP)}function ar(s,t,e,n,i,r){let o=xt(t,.15,e,n);H(s,"box",V(o,0,.24,0,.68,.48,.68),i),H(s,"box",V(o,0,.49,0,.6,.03,.6),5260340),H(s,"ico",V(o,0,.74,0,.72,.66,.72),6456906,rt.FOLIAGE,r(),.4)}function lr(s,t,e,n){let i=xt(t,.15,e,n);for(let r of[-1,1])H(s,"box",V(i,0,.55,r*.17,.55,1.04,.06,r*-.2),11766616);H(s,"box",V(i,0,.65,.2,.45,.66,.03,-.2),2506556);for(let r=0;r<4;r++)H(s,"box",V(i,-.025,.83-r*.105,.25+r*.021,.29-r%2*.08,.018,.012),15657166)}function cr(s,t,e,n,i,r){let o=xt(t,.15,e,n);H(s,"cyl6",V(o,0,2.2,0,.16,4.4,.16),3883072),H(s,"box",V(o,0,3.6,.2,.34,1,.26),3027506),[16726832,16756736,3461208].forEach((c,l)=>s.shape("sphere",V(o,0,3.92-l*.32,.34,.2,.2,.08),Ys(c),rt.SIGNAL,r,i,l))}function hr(s,t,e,n){let i=xt(t,.15,e,n);H(s,"cyl6",V(i,0,1.1,0,.07,2.2,.07),10133664),H(s,"cyl",V(i,0,2.3,.05,.75,.75,.04,Math.PI/2),12856099)}function ur(s,t,e,n){let i=xt(t,.15,e,n);H(s,"cyl6",V(i,0,1.1,0,.07,2.2,.07),10133664),H(s,"box",V(i,0,2.3,.05,.55,.55,.04),2777784)}function fr(s,t,e,n,i=7.3){let r=xt(t,.03,e,n);for(let o of[-i/2,i/2])H(s,"box",V(r,o,1.22,0,.12,2.44,.12),16119280);H(s,"box",V(r,0,2.44,0,i+.12,.12,.12),16119280)}function dr(s,t,e,n,i){let r=xt(t,.03,e,n);for(let[c,l]of[[-.6,-.6],[.6,-.6],[-.6,.6],[.6,.6]])H(s,"box",V(r,c,1,l,.1,2,.1),3108787);H(s,"box",V(r,0,1.5,0,1.4,.1,1.4),15250735),H(s,"box",V(r,0,2.2,0,1.5,.08,1.5),14173487),H(s,"box",V(r,0,.8,1.85,.7,.06,2.7,.58),14173487);let o=xt(0,0,0);o.multiplyMatrices(r,o.makeTranslation(4,0,0));for(let c of[-1.6,1.6])for(let l of[-.6,.6])H(s,"box",V(o,c,1.2,l*.7,.1,2.5,.1,l>0?-.25:.25),4165455);H(s,"box",V(o,0,2.4,0,3.4,.1,.1),4165455);for(let c of[-.7,.7]){H(s,"box",V(o,c,.5,0,.45,.05,.2),14173487);for(let l of[-.18,.18])H(s,"box",V(o,c+l,1.45,0,.02,1.9,.02),9278870)}i()<.7&&(H(s,"box",V(r,-3.5,.25,0,1.6,.5,1.6),12753499),H(s,"box",V(r,-3.5,.45,0,1.3,.1,1.3),14929816))}var ie=[15987695,2106149,11777978,6975862,11022127,3102340,15130572,4090450,8014476,14255663];function Pe(s,t,e,n){H(s,"box",V(t,0,.62,0,1.82,.62,4.5),e),H(s,"box",V(t,0,1.18,-.2,1.6,.55,2.3),e),H(s,"box",V(t,0,1.18,-.2,1.64,.44,2.1),7311267,rt.GLASS);for(let i of[-.82,.82])for(let r of[-1.45,1.45])H(s,"cyl6",V(t,i,.33,r,.66,.24,.66,0,0,Math.PI/2),1908512);for(let i of[-.6,.6])H(s,"box",V(t,i,.72,2.25,.38,.14,.03),16774358,rt.LAMP),H(s,"box",V(t,i,.78,-2.25,.36,.12,.03),12857387,rt.LAMP)}function Zh(){let s=new Ti(1024);return Pe(s,xt(0,0,0),16777215),s.geometry()}function $h(s){if(!s)return null;let t=new ce;return t.setAttribute("position",new Ct(s.position,3)),t.setAttribute("normal",new Ct(s.normal,3)),t.setAttribute("color",new Ct(s.color,3,!0)),t.setAttribute("facadeUv",new Ct(s.uv,2)),t.setAttribute("facadeInfo",new Ct(s.info,2)),t.computeBoundingSphere(),t}function hn(s){return s?[s.position.buffer,s.normal.buffer,s.color.buffer,s.uv.buffer,s.info.buffer]:[]}var Fi=qn(yn(),1);var mr=qn(yn(),1);var Jh="https://services2.arcgis.com/FiaPA4ga0iQKduv3/arcgis/rest/services/USA_Structures_View/FeatureServer/0/query";var gr=2e3,Kh=3,jh=[[24.4,49.5,-125,-66.8],[51,71.6,-180,-129.9],[18.8,22.4,-160.5,-154.6],[17.6,18.6,-67.4,-64.5],[13.2,13.7,144.6,145]],vo=(s,t)=>jh.some(([e,n,i,r])=>s>=e&&s<=n&&t>=i&&t<=r);function Qh(s,t=0){let e=new URL(Jh);for(let[n,i]of Object.entries({f:"geojson",where:"1=1",geometry:[s.west,s.south,s.east,s.north].map(r=>r.toFixed(6)).join(","),geometryType:"esriGeometryEnvelope",inSR:4326,outSR:4326,spatialRel:"esriSpatialRelIntersects",outFields:"OBJECTID,OCC_CLS,PRIM_OCC,HEIGHT,SOURCE",geometryPrecision:7,orderByFields:"OBJECTID",resultOffset:t,resultRecordCount:gr}))e.searchParams.set(n,i);return e.href}async function Mo(s,{signal:t}={}){let e=[];for(let n=0;n<Kh;n++){let i=await fetch(Qh(s,n*gr),{signal:AbortSignal.any([...t?[t]:[],AbortSignal.timeout(12e3)])});if(!i.ok)throw new Error("Building footprints are temporarily unavailable ("+i.status+").");let r=await i.json();if(r.error)throw new Error("The building footprint lookup could not finish.");if(e.push(...r.features||[]),!r.properties?.exceededTransferLimit&&!r.exceededTransferLimit&&(r.features||[]).length<gr)break}return eu(e)}function tu(s={}){let t=String(s.OCC_CLS||""),e=String(s.PRIM_OCC||""),n=/single family|manufactured|mobile/i.test(e)?"house":/multi/i.test(e)?"apartments":/nursing|dormitor|hotel|lodging/i.test(e)||t==="Residential"?"residential":t==="Commercial"?/retail/i.test(e)?"retail":"commercial":t==="Industrial"?"industrial":t==="Education"?/college|universit/i.test(e)?"university":"school":t==="Government"?"civic":t==="Agriculture"?"farm_auxiliary":t==="Assembly"?/relig|church|worship/i.test(e)?"church":"public":"yes",i={building:n,structure:"building",fillIn:"yes",footprintSource:"usa-structures"},r=Number(s.HEIGHT);if(Number.isFinite(r)&&r>=2.5&&r<400)i.height=String(Math.round(r*10)/10),i.heightSource="footprints";else{i.heightSource="estimated";let o={house:0,apartments:3,residential:3,university:3,school:2,industrial:0,church:0}[n]??2;o&&(i["building:levels"]=String(o))}return i}function eu(s=[]){let t=[];for(let e of s){let n=e.geometry,i=e.id??e.properties?.OBJECTID;if(!n||i==null)continue;(n.type==="Polygon"?[n.coordinates]:n.type==="MultiPolygon"?n.coordinates:[]).forEach((o,c)=>{let[l,...a]=o.map(u=>u.filter(d=>Number.isFinite(d[0])&&Number.isFinite(d[1])).map(([d,g])=>({lat:g,lon:d})));!l||l.length<4||t.push({id:-(1e9+Number(i)*4+c),osmId:"fp"+i+(c?":"+c:""),kind:1,tags:tu(e.properties),geometry:l,holes:a.filter(u=>u.length>=4)})})}return t}var nu=s=>{let t=111320*Math.cos(s*Math.PI/180);return e=>[e.lon*t,e.lat*110540]},Ii=(s,t,e)=>(t[0]-s[0])*(e[1]-s[1])-(t[1]-s[1])*(e[0]-s[0]),iu=(s,t,e,n)=>Ii(s,t,e)*Ii(s,t,n)<0&&Ii(e,n,s)*Ii(e,n,t)<0;function So(s,t){let e=nu(s.geometry[0].lat),n=s.geometry.map(e),i=(s.holes||[]).map(o=>o.map(e)),r=o=>ht(o[0],o[1],n)&&!i.some(c=>ht(o[0],o[1],c));for(let o of t){let c=o.tags||{};if(c.covered==="yes"||c.tunnel||c.indoor==="yes"||c.bridge||c.service==="drive-through"||Number(c.layer)>0||Number(c.layer)<0)continue;let l=o.geometry.map(e);for(let a=0;a<l.length;a++)if(r(l[a])||a&&n.filter((u,d)=>d&&iu(l[a-1],l[a],n[d-1],u)).length>=2)return!0}return!1}function bo(s,t){if(!t.length)return 0;let e=i=>i.map(r=>[Math.round(r.lon*1e7),Math.round(r.lat*1e7)]),n=i=>i.reduce((r,o,c)=>r+(c?-1:1)*Math.abs(o.reduce((l,a,u)=>{let d=o[(u+1)%o.length];return l+a[0]*d[1]-d[0]*a[1]},0))/2,0);try{let i=[e(s.geometry),...(s.holes||[]).map(e)],r=n(i);return r?mr.default.intersection([i],mr.default.union(...t.map(c=>[[e(c.geometry),...(c.holes||[]).map(e)]]))).reduce((c,l)=>c+n(l),0)/r:1}catch{return 1}}function xr(s={}){return s.structure?s.structure:s.building==="carport"?"carport":s.building==="roof"||s.amenity==="shelter"||s.building==="canopy"?"canopy":s["generator:source"]==="solar"&&(!s.building||s.building==="solar_panel")?"solar":s.building==="parking"||s.parking==="multi-storey"?"garage":s.building==="greenhouse"?"greenhouse":"building"}var Gt=s=>["canopy","carport","solar"].includes(xr(s));function Se(s={}){let t=xr(s),e=Gt(s),n=t==="solar"||s.solar==="yes",i=parseFloat(s.height),r=s.min_height!=null?su(s.min_height):parseFloat(s["building:min_level"])*3.4,o=Number.isFinite(i)&&i>0?ye(s):e?t==="solar"&&!s.parkingCanopy&&!s.rooftop?1.4:4:s.building==="shed"?3.5:t==="greenhouse"?4:ye(s);return{kind:t,solar:n,open:e,top:o,base:e?Math.max(0,Number.isFinite(r)&&r>0?Math.min(r,o-.12):o-.22):Math.min(o-.01,Math.max(0,Number.isFinite(r)?r:0))}}function su(s){let t=parseFloat(s);return/(?:ft|feet|')/i.test(String(s))?t*.3048:t}function Eo(s,t,e=[]){let n=Math.min(...s.map(a=>a[0])),i=Math.max(...s.map(a=>a[0])),r=Math.min(...s.map(a=>a[1])),o=Math.max(...s.map(a=>a[1])),c=[];for(let[a,u,d,g,x,v]of e){if(!v||Math.max(a,d)+x<n||Math.min(a,d)-x>i||Math.max(u,g)+x<r||Math.min(u,g)-x>o)continue;let b=d-a,E=g-u,A=Math.hypot(b,E);if(A<.1)continue;let w=x+.35,I=-E/A*w,T=b/A*w,U=b/A*.4,N=E/A*.4;c.push([[[a-U+I,u-N+T],[d+U+I,g+N+T],[d+U-I,g+N-T],[a-U-I,u-N-T],[a-U+I,u-N+T]]])}if(!c.length)return[[s,...t]];let l=a=>a.map(u=>u.map(([d,g])=>[Math.round(d*1e3),Math.round(g*1e3)]));try{return Fi.default.difference([l([s,...t])],...c.map(a=>[l(a)])).map(a=>a.map(u=>u.map(([d,g])=>[d/1e3,g/1e3])))}catch{return[[s,...t]]}}var Pi=s=>Math.abs(s.reduce((t,e,n)=>{let i=s[(n+1)%s.length];return t+e[0]*i[1]-i[0]*e[1]},0))/2,Li=s=>[s.geometry,...s.holes||[]].map(t=>t.map(e=>[Math.round(e.lon*1e7),Math.round(e.lat*1e7)]));function he(s,t){try{let e=Li(s),n=Li(t),i=Pi(e[0])-e.slice(1).reduce((r,o)=>r+Pi(o),0);return i?Fi.default.intersection([e],[n]).reduce((r,o)=>r+Pi(o[0])-o.slice(1).reduce((c,l)=>c+Pi(l),0),0)/i:0}catch{return 0}}var Di=s=>{let t=Ui(s);return{lat:(t.south+t.north)/2,lon:(t.west+t.east)/2}},Vn=(s,t)=>ht(t.lon,t.lat,s.geometry.map(e=>[e.lon,e.lat]))&&!(s.holes||[]).some(e=>ht(t.lon,t.lat,e.map(n=>[n.lon,n.lat])));function Ui(s){return s.geometry.reduce((t,e)=>({west:Math.min(t.west,e.lon),east:Math.max(t.east,e.lon),south:Math.min(t.south,e.lat),north:Math.max(t.north,e.lat)}),{west:1/0,east:-1/0,south:1/0,north:-1/0})}function fn(s){let t=new Map,e=[],n=i=>{let r=Ui(i),o=[];if((r.east-r.west)*(r.north-r.south)>.004)return null;for(let c=Math.floor(r.west*1e3);c<=Math.floor(r.east*1e3);c++)for(let l=Math.floor(r.south*1e3);l<=Math.floor(r.north*1e3);l++)o.push(c+","+l);return o};for(let i of s){let r=n(i);if(!r){e.push(i);continue}for(let o of r)t.has(o)||t.set(o,[]),t.get(o).push(i)}return i=>{let r=n(i);return r?[...new Set([...e,...r.flatMap(o=>t.get(o)||[])])]:s}}var un=(s,t)=>s&&t&&Math.abs(s.lat-t.lat)<1e-8&&Math.abs(s.lon-t.lon)<1e-8;function ru(s){let t=new Map((s.elements||[]).filter(n=>n.type==="node").map(n=>[n.id,{lat:n.lat,lon:n.lon}])),e=new Map((s.elements||[]).filter(n=>n.type==="way").map(n=>[n.id,{...n,geometry:n.geometry||(n.nodes?.every(i=>t.has(i))?n.nodes.map(i=>t.get(i)):void 0)}]));return{...s,elements:(s.elements||[]).map(n=>n.type==="way"?e.get(n.id):n.type==="relation"?{...n,members:(n.members||[]).map(i=>({...i,geometry:i.geometry||e.get(i.ref)?.geometry}))}:n)}}function wo(s){let t=s.filter(n=>n.geometry?.length>1).map(n=>n.geometry.slice()),e=[];for(;t.length;){let n=t.pop(),i=!0;for(;!un(n[0],n.at(-1))&&i;){i=!1;for(let r=0;r<t.length;r++){let o=t[r];if(un(n.at(-1),o.at(-1))&&(o=o.slice().reverse()),un(n.at(-1),o[0])){n.push(...o.slice(1)),t.splice(r,1),i=!0;break}if(un(n[0],o[0])&&(o=o.slice().reverse()),un(n[0],o.at(-1))){n=[...o.slice(0,-1),...n],t.splice(r,1),i=!0;break}}}n.length>=4&&un(n[0],n.at(-1))&&e.push(n)}return e}function _r(s){s=ru(s);let t=[],e=[],n=new Set;for(let o of s.elements||[]){if(o.type!=="relation"){e.push(o);continue}if(o.tags?.type!=="multipolygon")continue;let c=wo((o.members||[]).filter(a=>a.role!=="inner")),l=wo((o.members||[]).filter(a=>a.role==="inner"));if(c.length){for(let a of o.members||[])n.add(a.ref);c.forEach(a=>{let u=Ui({geometry:a});e.push({...o,id:-o.id,osmId:"r"+o.id+":"+u.west.toFixed(7)+":"+u.south.toFixed(7),geometry:a,holes:l.filter(d=>Vn({geometry:a},d[0]))})})}}for(let o of e){if(o.type!=="relation"&&n.has(o.id))continue;if(o.tags?.highway&&o.geometry?.length>=2){if(o.tags.tunnel==="yes"||o.tags.indoor==="yes"||Number(o.tags.layer)<0)continue;t.push({id:o.id,osmId:"w"+o.id,kind:0,tags:{...o.tags,detailRoad:"yes"},geometry:o.geometry});continue}if(!o.tags||!o.geometry||o.geometry.length<4)continue;let c=o.geometry.filter(u=>Number.isFinite(u.lat)&&Number.isFinite(u.lon));if(c.length<4||Math.hypot(c[0].lat-c.at(-1).lat,c[0].lon-c.at(-1).lon)>1e-6)continue;let l=o.tags,a={...l};if(!(l.building==="no"||l["building:part"]==="no"||l.location==="underground"||l.indoor==="yes")){if(l.amenity==="parking"&&!l.building&&!l["building:part"]&&l.parking!=="multi-storey"&&l.parking!=="underground")a.area="parking";else if(l.building||l["building:part"]||l.amenity==="shelter"||l["generator:source"]==="solar")a.building=l.building||l["building:part"]||(l["generator:source"]==="solar"?"solar_panel":"roof"),a.structure=xr(a),l["building:min_level"]&&!l.min_height&&(a.min_height=String(parseFloat(l["building:min_level"])*3.4)),a.heightSource=l.height?"measured":l["building:levels"]?"levels":"estimated";else continue;t.push({id:o.id,osmId:o.osmId||"w"+o.id,kind:1,tags:a,geometry:c,holes:o.holes||[]})}}let i=t.filter(o=>o.tags.area==="parking"),r=t.filter(o=>o.tags["generator:source"]==="solar");for(let o of t){if(o.tags.area||o.tags.detailRoad)continue;let c=Di(o),l=i.find(a=>Vn(a,c));l&&Gt(o.tags)&&(o.tags.parkingCanopy="yes",o.tags.height||(o.tags.height="4")),o.tags["generator:source"]==="solar"?(o.tags.solar="yes",Gt(o.tags)&&(o.tags["generator:location"]==="roof"||o.tags.location==="roof")&&(o.tags.rooftop="yes"),["roof","carport"].includes(o.tags.building)&&(o.tags.structure=o.tags.building==="carport"?"carport":"canopy",o.tags.parkingCanopy=l?"yes":o.tags.parkingCanopy)):Gt(o.tags)&&r.some(a=>he(o,a)>.1||he(a,o)>.8)&&(o.tags.solar="yes")}return t.filter(o=>o.tags.structure!=="solar"||!t.some(c=>c!==o&&["canopy","carport"].includes(c.tags.structure)&&he(o,c)>.8))}function To(s,t,e){let n=t.filter(w=>w.tags.fillIn);t=t.filter(w=>!w.tags.fillIn);let i=2**e.z,r=w=>{let I=(w.lon+180)/360*i,T=(1-Math.asinh(Math.tan(w.lat*Math.PI/180))/Math.PI)/2*i;return Math.floor(I)===e.x&&Math.floor(T)===e.y},o=w=>{let I=(w.lon+180)/360*i,T=(1-Math.asinh(Math.tan(w.lat*Math.PI/180))/Math.PI)/2*i;return Math.min(7,Math.floor((I-e.x)*8))+Math.min(7,Math.floor((T-e.y)*8))*8},c=t.filter(w=>w.tags.building),l=fn(c),a=fn(s.filter(w=>w.tags.building)),u=fn(t.filter(w=>w.tags.area==="parking")),d=new Set,g=[];for(let w of t){if(w.tags.detailRoad)continue;let I=Di(w);if(!r(I))continue;let T={...w,tags:{...w.tags}},U=a(w).filter(N=>he(w,N)>.65||he(N,w)>.85).sort((N,z)=>he(w,z)-he(w,N));if(T.tags.building&&!Gt(T.tags)&&!T.tags.height&&!T.tags["building:levels"]){let N=U.find(z=>parseFloat(z.tags.height)>0&&parseFloat(z.tags.height)!==5);N&&(T.tags.height=N.tags.height,T.tags.heightSource="tiles")}if(T.tags.rooftop&&!T.tags.parkingCanopy){let N=[...l(w),...a(w)].filter(z=>z!==w&&!Gt(z.tags)&&Vn(z,I)).sort((z,B)=>ye(B.tags)-ye(z.tags))[0];N&&(T.tags.height=String(ye(N.tags)+.35),T.tags.min_height=String(ye(N.tags)+.15))}T.chunk=o(I),g.push(T)}for(let w of s){if(w.tags.area==="parking"&&u(w).some(T=>he(w,T)>.72)&&d.add(w),!w.tags.building)continue;let I=Di(w);for(let T of l(w))if(!(T.tags.rooftop&&!T.tags.parkingCanopy)&&he(w,T)>.72){d.add(w);break}}let x=fn(g.filter(w=>w.tags["building:part"]&&!Gt(w.tags)&&Se(w.tags).base<.1)),v=g.flatMap(w=>{if(!w.tags.building||w.tags["building:part"]||Gt(w.tags))return[w];let I=x(w).filter(T=>he(T,w)>.9);if(!I.length)return[w];try{return Fi.default.difference([Li(w)],...I.map(T=>[Li(T)])).map(([T,...U])=>({...w,geometry:T.map(([N,z])=>({lon:N/1e7,lat:z/1e7})),holes:U.map(N=>N.map(([z,B])=>({lon:z/1e7,lat:B/1e7})))}))}catch{return[w]}}),b=fn(t.filter(w=>w.tags.detailRoad)),E=s.filter(w=>!d.has(w)).map(w=>{if(!w.tags.highway||w.kind!==0)return w;let I=b(w).map(N=>({r:N,score:au(w,N)})).filter(N=>N.score>.75).sort((N,z)=>z.score-N.score);if(!I.length)return w;let T=I[0].r.tags,U={...w.tags,highway:T.highway};for(let N of["width","lanes","surface","service","name"])T[N]&&(U[N]=T[N]);return T.oneway&&(U.oneway=["yes","1","-1"].includes(T.oneway)?"yes":void 0),{...w,tags:U}}),A=E.filter(w=>w.tags.building||w.tags.highway||w.tags.area==="parking");return[...E,...v,...ou(n,[...A,...v,...t.filter(w=>w.tags.detailRoad||w.tags.area==="parking")],r,o)]}function ou(s,t,e,n){if(!s.length)return[];let i=l=>Ui(l),r=(l,a)=>l.west<=a.east&&a.west<=l.east&&l.south<=a.north&&a.south<=l.north,o=fn(t),c=[];for(let l of s){let a=Di(l);if(!e(a))continue;let u=i(l),d=o(l).filter(v=>r(u,i(v))),g=d.filter(v=>v.tags.building&&v.kind===1),x=d.filter(v=>v.tags.highway&&v.kind===0&&v.geometry.length>1);g.some(v=>Vn(v,a))||bo(l,g)>.2||g.some(v=>he(v,l)>.3)||So(l,x)||!l.tags.height&&d.some(v=>v.tags.area==="parking"&&Vn(v,a))||c.push({...l,tags:{...l.tags},chunk:n(a)})}return c}function au(s,t){let e=Math.cos(s.geometry[0].lat*Math.PI/180),n=c=>[c.lon*111320*e,c.lat*110540],i=t.geometry.map(n),r=0,o=0;for(let c=1;c<s.geometry.length;c++){let l=n(s.geometry[c-1]),a=n(s.geometry[c]),u=a[0]-l[0],d=a[1]-l[1],g=Math.hypot(u,d);if(!g)continue;o+=g;let x=(l[0]+a[0])/2,v=(l[1]+a[1])/2;for(let b=1;b<i.length;b++){let E=i[b-1],A=i[b],w=A[0]-E[0],I=A[1]-E[1],T=Math.hypot(w,I);if(!T||Math.abs((u*w+d*I)/(g*T))<.94)continue;let U=Math.max(0,Math.min(1,((x-E[0])*w+(v-E[1])*I)/(T*T)));if(Math.hypot(x-E[0]-U*w,v-E[1]-U*I)<1.3){r+=g;break}}}return o?r/o:0}function Ao(s,t){return s.filter(e=>e.tags.name&&e.tags.labelType).map(e=>({name:e.tags.name,type:e.tags.labelType,kind:e.tags.poi||e.tags.roadClass,rank:e.tags.rank||20,points:e.geometry.map(n=>Tt(n.lat,n.lon,t))}))}var Ro=new Set(["shop","restaurant","cafe","fast_food","bar","pub","ice_cream","bakery","supermarket","convenience","grocery","clothes","shoes","books","florist","hairdresser","beauty","pharmacy","optician","bicycle","butcher","greengrocer","deli","gift","jewelry","electronics","department_store"]),Co=new Set(["restaurant","cafe","fast_food","bar","pub","ice_cream","bakery"]),yr=s=>Ro.has(s.subclass)?s.subclass:Ro.has(s.poi)?s.poi:null;function lu(s){s.length=0,s.cumulative=[0];for(let t=1;t<s.pts.length;t++)s.length+=Math.hypot(s.pts[t][0]-s.pts[t-1][0],s.pts[t][1]-s.pts[t-1][1]),s.cumulative.push(s.length);return s}function Io(s,{key:t,kind:e,width:n,sidewalk:i,bridge:r,blocked:o,roads:c,rect:l}){let a=["footway","path","pedestrian"].includes(e);if(r||!a&&!["residential","tertiary","secondary","primary"].includes(e))return[];let u=[];for(let d of a?[0]:[-1,1]){let g=[],x=0,v=()=>{if(g.length>1){let b=lu({id:`${t}:${d}:${x++}`,pts:g,y:a?.05:.15,path:a});b.length>=9&&u.push(b)}g=[]};for(let b=1;b<s.length;b++){let[E,A]=s[b-1],[w,I]=s[b],T=Math.hypot(w-E,I-A);if(T<.01)continue;let U=(w-E)/T,N=(I-A)/T,z=d*(n/2+Math.min(.95,i/2)),B=Math.ceil(T);for(let G=0;G<=B;G++){let J=E+(w-E)*G/B-N*z,j=A+(I-A)*G/B+U*z;if(J<l.minX||J>=l.maxX||j<l.minZ||j>=l.maxZ||c.onRoad(J,j,.48)||[[0,0],[.38,0],[-.38,0],[0,.38],[0,-.38]].some(([_t,Dt])=>o(J+_t,j+Dt))){v();continue}let st=g.at(-1),ut=st&&Math.hypot(J-st[0],j-st[1]);ut>1.6&&v(),(!g.length||ut>.05)&&g.push([J,j])}}v()}return u}function Ni(s,t,e){let n=s.filter(u=>u.kind===1&&u.tags.building).map(u=>{let d=Se(u.tags);return{e:u,levels:d,pts:u.geometry.map(g=>Tt(g.lat,g.lon,t)),holes:(u.holes||[]).map(g=>g.map(x=>Tt(x.lat,x.lon,t)))}}).filter(u=>!u.levels.open&&u.levels.kind==="building"&&u.levels.base<.3&&u.levels.top>=3.5),i=new Map,r=80;for(let u of n){let d=u.pts.map(x=>x[0]),g=u.pts.map(x=>x[1]);for(let x=Math.floor(Math.min(...d)/r);x<=Math.floor(Math.max(...d)/r);x++)for(let v=Math.floor(Math.min(...g)/r);v<=Math.floor(Math.max(...g)/r);v++){let b=x+","+v;i.has(b)||i.set(b,[]),i.get(b).push(u)}}let o=(u,d)=>i.get(Math.floor(u/r)+","+Math.floor(d/r))||[],c=(u,d)=>o(u,d).some(g=>ht(u,d,g.pts)&&!g.holes.some(x=>ht(u,d,x))),l=new Map,a=[];for(let u of s){let d=yr(u.tags);if(u.kind!==2||!d||!u.tags.name||Number(u.tags.level||0)!==0)continue;let[g,x]=Tt(u.geometry[0].lat,u.geometry[0].lon,t),v=null,b=new Set;for(let E=-1;E<=1;E++)for(let A=-1;A<=1;A++)for(let w of o(g+E*r,x+A*r))b.add(w);for(let E of b){let A=ht(g,x,E.pts)&&!E.holes.some(w=>ht(g,x,w));for(let w=0;w<E.pts.length;w++){let I=E.pts[w],T=E.pts[(w+1)%E.pts.length],U=T[0]-I[0],N=T[1]-I[1],z=Math.hypot(U,N);if(z<4.4)continue;let B=Math.min(6.4,z-1),G=(B/2+.3)/z,J=Math.max(G,Math.min(1-G,((g-I[0])*U+(x-I[1])*N)/(z*z))),j=I[0]+U*J,et=I[1]+N*J,nt=Math.hypot(j-g,et-x);if(nt>(A?65:9))continue;let st=-N/z,ut=U/z;ht(j+st*.3,et+ut*.3,E.pts)&&(st=-st,ut=-ut);let _t=e.nearest(j+st,et+ut,65,!1);if(!_t||(_t.x-j)*st+(_t.z-et)*ut<1||[-B/2,0,B/2].some(at=>c(j+st*.4+ut*at,et+ut*.4-st*at))||e.onRoad(j+st*.65,et+ut*.65,.2))continue;let Dt=nt+_t.distance*.3+(A?0:20);v&&Dt>=v.score||a.some(at=>Math.hypot(at.x-j,at.z-et)<(at.width+B)/2+.6)||(v={id:u.id,name:u.tags.name,kind:d,x:j+st*.08,z:et+ut*.08,nx:st,nz:ut,yaw:Math.atan2(st,ut),width:B,score:Dt})}}v&&(a.push(v),l.set(u,v))}return l}var Hn={GRASS:15,EARTH:16,SAND:17},vr=new Set(["grass","park","garden","meadow","village_green","recreation_ground","golf_course","orchard","allotments","cemetery","residential","school","college","university","kindergarten"]);function Po(s){return vr.has(s)?Hn.GRASS:["wood","forest","scrub","heath","flowerbed","farmland"].includes(s)?Hn.EARTH:["sand","beach"].includes(s)?Hn.SAND:9}function Oi(s,t){let e=new Map,n=60;for(let i of s){if(i.kind!==1||!(i.tags.natural==="water"||i.tags.highway||["parking","pitch","playground","track","apron","runway","taxiway","industrial","commercial","retail"].includes(i.tags.area)))continue;let r=i.geometry.map(u=>Tt(u.lat,u.lon,t)),o=(i.holes||[]).map(u=>u.map(d=>Tt(d.lat,d.lon,t))),c={pts:r,holes:o},l=r.map(u=>u[0]),a=r.map(u=>u[1]);for(let u=Math.floor(Math.min(...l)/n);u<=Math.floor(Math.max(...l)/n);u++)for(let d=Math.floor(Math.min(...a)/n);d<=Math.floor(Math.max(...a)/n);d++){let g=u+","+d;e.has(g)||e.set(g,[]),e.get(g).push(c)}}return(i,r)=>(e.get(Math.floor(i/n)+","+Math.floor(r/n))||[]).some(o=>ht(i,r,o.pts)&&!o.holes.some(c=>ht(i,r,c)))}var{MeshBuilder:Bi,rgb:St,base:Ge}=pr,cu={motorway:22,trunk:18,primary:14,secondary:12,tertiary:10,residential:8,service:4.5,track:3,footway:2.2,path:1.8,cycleway:2.2,pedestrian:5,steps:2.4,platform:3},Sr=new Set(["motorway","trunk","primary","secondary","tertiary"]),zi=new Set(["footway","path","cycleway","pedestrian","steps","platform","track"]),Lo=6.5,Do=2500,Fo=[6119782,5001043,7236712,6117973,5725283,7035468],$={base:.005,landuse:.012,campus:.015,green:.02,wood:.021,natural:.024,sport:.03,water:.03,service:.055,road:.06,path:.045,marking:.08,plaza:.12,sidewalk:.15},Uo={park:[7647831,$.green,"park"],grass:[8829793,$.green,"lawn"],village_green:[8829793,$.green,"lawn"],recreation_ground:[8829793,$.green,"lawn"],garden:[8042074,$.green+.002,"garden"],flowerbed:[6965813,$.green+.004,"flowerbed"],meadow:[10273900,$.green,"meadow"],allotments:[9412432,$.green,"allotments"],dog_park:[10919788,$.green,null],golf_course:[8373850,$.green,"lawn"],zoo:[9813359,$.green,"park"],theme_park:[12107686,$.landuse,null],wood:[5208893,$.wood,"wood"],forest:[5208893,$.wood,"wood"],scrub:[9149017,$.wood,"scrub"],heath:[10132066,$.wood,"scrub"],orchard:[10272874,$.green,"orchard"],vineyard:[9678172,$.green,"rows"],farmland:[13353852,$.green,"rows"],farm:[13353852,$.green,"rows"],wetland:[7311467,$.natural,"reeds"],sand:[15259816,$.natural,null],beach:[15588779,$.natural,null],rock:[10657173,$.natural,null],bare_rock:[10657173,$.natural,null],scree:[11644066,$.natural,null],ice:[15660280,$.natural,null],glacier:[15660280,$.natural,null],cemetery:[8366181,$.green,"cemetery"],pitch:[5217353,$.sport,"pitch"],playground:[13206627,$.sport,"playground"],track:[11883068,$.sport,null],stadium:[10724250,$.landuse,null],school:[12371365,$.campus,null],kindergarten:[12371365,$.campus,null],college:[12371365,$.campus,null],university:[12371365,$.campus,null],hospital:[13355970,$.campus,null],commercial:[13025976,$.landuse,null],retail:[13025976,$.landuse,null],industrial:[11184030,$.landuse,null],railway:[10722706,$.landuse,null],garages:[11184030,$.landuse,null],military:[10988182,$.landuse,null],residential:[10334340,$.landuse,"yard"],parking:[7369844,$.service,"parking"],apron:[9277584,$.landuse,null],runway:[7238258,$.landuse,null],taxiway:[8027774,$.landuse,null]},hu={ocean:3042444,bay:3042444,river:3833235,lake:4098208,pond:4885638,swimming_pool:5031900,reservoir:4098208,basin:4098208,dock:3501958},uu={river:14,canal:9,stream:2.4,ditch:1.2,drain:1.2,brook:1.6};function No(s,t){let e=t<-50&&s>15,n=s>49.8&&s<59.5&&t>-8.5&&t<2,i=t>128&&t<146&&s>30&&s<46,r=t>110&&t<155&&s<-10,o=s>35&&s<46&&t>-10&&t<30;return{us:e,uk:n,jp:i,americas:t<-30,leftDrive:n||i||r,mediterranean:o,tropical:Math.abs(s)<28,north:Math.abs(s)>52,brick:t<-30||s>49.5?1:.2,post:e?"us":n?"uk":i?"jp":"eu",roofs:e?[5001043,7032638,3950161,8011313,6117973]:o?[11884079,12871738,11029805,12546368]:i?[4082268,5595246,4869458]:[4935511,9190703,7027246,5593439],walls:e?[15855592,14275780,12372435,15194281,12108968,14074789,15328474]:o?[15786948,15321498,15986660,14464138,15258278]:[15328732,13616821,14207666,12564134,14867663]}}function Oo(s,t){let e=new Map,n=new Map,i=[],r=40,o=a=>{i.push(a);let[u,d,g,x,v]=a;for(let b=Math.floor((Math.min(u,g)-v)/r);b<=Math.floor((Math.max(u,g)+v)/r);b++)for(let E=Math.floor((Math.min(d,x)-v)/r);E<=Math.floor((Math.max(d,x)+v)/r);E++){let A=b+","+E;e.has(A)||e.set(A,[]),e.get(A).push(a)}};for(let a of s){let u=a.tags.highway;if(!u||a.kind!==0||a.tags.bridge)continue;let d=!zi.has(u),g=a.geometry.map(v=>Tt(v.lat,v.lon,t)),x=br(a.tags)/2;for(let v=0;v<g.length-1;v++){let[b,E]=g[v],[A,w]=g[v+1],I=Math.hypot(A-b,w-E);if(I&&(o([b,E,A,w,x,d,a.id,u]),!(!d||u==="service"||u==="track")))for(let[T,U,N,z]of[[b,E,(A-b)/I,(w-E)/I],[A,w,(b-A)/I,(E-w)/I]]){let B=Math.round(T*2)+","+Math.round(U*2);n.has(B)||n.set(B,{x:T,z:U,arms:[]});let G=n.get(B);G.arms.some(J=>J.ux*N+J.uz*z>.96)||G.arms.push({ux:N,uz:z,half:x,kind:u,major:Sr.has(u)})}}}let c=(a,u)=>e.get(Math.floor(a/r)+","+Math.floor(u/r))||[],l=[...n.values()].filter(a=>a.arms.length>=3);return{segments:i,intersections:l,onRoad(a,u,d=0,g=null,x=!0){for(let[v,b,E,A,w,I,T]of c(a,u)){if(x&&!I||T===g)continue;let U=E-v,N=A-b,z=Math.max(0,Math.min(1,((a-v)*U+(u-b)*N)/(U*U+N*N)));if(Math.hypot(a-v-U*z,u-b-N*z)<w+d)return!0}return!1},nearest(a,u,d=40,g=!0){let x=null;for(let v=Math.floor((a-d)/r);v<=Math.floor((a+d)/r);v++)for(let b=Math.floor((u-d)/r);b<=Math.floor((u+d)/r);b++)for(let[E,A,w,I,T,U,N,z]of e.get(v+","+b)||[]){if(g&&!U)continue;let B=w-E,G=I-A,J=Math.max(0,Math.min(1,((a-E)*B+(u-A)*G)/(B*B+G*G))),j=E+B*J,et=A+G*J,nt=Math.hypot(a-j,u-et);if(nt<d&&(!x||nt<x.distance)){let st=Math.hypot(B,G);x={x:j,z:et,distance:nt,half:T,ux:B/st,uz:G/st,id:N,kind:z}}}return x},nearIntersection(a,u,d){return l.some(g=>Math.hypot(g.x-a,g.z-u)<d)}}}function br(s){let t=parseFloat(s.width);if(t>0)return Math.min(60,/(?:ft|feet|')/i.test(s.width)?t*.3048:t);let e=parseFloat(s.lanes);if(e>0&&!zi.has(s.highway))return Math.min(60,e*3.1+.8);let n=cu[s.highway]??8;return s.oneway&&["motorway","trunk","primary"].includes(s.highway)?n*.55:n}function He(s){let t=0;for(let e=0,n=s.length-1;e<s.length;n=e++)t+=(s[n][0]+s[e][0])*(s[n][1]-s[e][1]);return t/2}function Le(s){let t=1/0,e=-1/0,n=1/0,i=-1/0;for(let[r,o]of s)t=Math.min(t,r),e=Math.max(e,r),n=Math.min(n,o),i=Math.max(i,o);return{minX:t,maxX:e,minZ:n,maxZ:i}}function ki(s){return s.length>1&&s[0][0]===s.at(-1)[0]&&s[0][1]===s.at(-1)[1]?s.slice(0,-1):s}function De(s){let t=null;for(let u=0;u<s.length;u++){let[d,g]=s[u],[x,v]=s[(u+1)%s.length],b=Math.hypot(x-d,v-g);if(b<.5)continue;let E=(x-d)/b,A=(v-g)/b,w=1/0,I=-1/0,T=1/0,U=-1/0;for(let[z,B]of s){let G=z*E+B*A,J=-z*A+B*E;w=Math.min(w,G),I=Math.max(I,G),T=Math.min(T,J),U=Math.max(U,J)}let N=(I-w)*(U-T);(!t||N<t.area)&&(t={area:N,ux:E,uz:A,minU:w,maxU:I,minV:T,maxV:U})}if(!t)return null;let{ux:e,uz:n,minU:i,maxU:r,minV:o,maxV:c}=t;c-o>r-i&&([e,n]=[-n,e],[i,r,o,c]=[o,c,-r,-i]);let l=(i+r)/2,a=(o+c)/2;return{area:t.area,cx:l*e-a*n,cz:l*n+a*e,ux:e,uz:n,halfLong:(r-i)/2,halfShort:(c-o)/2}}function Mr(s,t,e,n,i=12){for(let r=0;r<i;r++){let o=e.minX+n()*(e.maxX-e.minX),c=e.minZ+n()*(e.maxZ-e.minZ);if(ht(o,c,s)&&!t.some(l=>ht(o,c,l)))return[o,c]}return null}function Zt(s,t,e,n,i,{down:r=!1}={}){let o=e/2,c=St(i),l=t.map((a,u)=>{let d=t[Math.max(0,u-1)],g=t[Math.min(t.length-1,u+1)],x=Math.hypot(a[0]-d[0],a[1]-d[1]),v=Math.hypot(g[0]-a[0],g[1]-a[1]),b=x?[-(a[1]-d[1])/x,(a[0]-d[0])/x]:[-(g[1]-a[1])/(v||1),(g[0]-a[0])/(v||1)],E=v?[-(g[1]-a[1])/v,(g[0]-a[0])/v]:b,A=b[0]+E[0],w=b[1]+E[1],I=Math.hypot(A,w);if(I<.01)return b.map(U=>U*o);let T=Math.min(o*2,o/Math.max(.1,(A*E[0]+w*E[1])/I));return[A/I*T,w/I*T]});for(let a=0;a<t.length-1;a++){let[u,d]=t[a],[g,x]=t[a+1];if(!Math.hypot(g-u,x-d))continue;let[b,E]=l[a],[A,w]=l[a+1],I=[[u+b,n,d+E],[g+A,n,x+w],[g-A,n,x-w],[u-b,n,d-E]];s.quad(...I,[0,1,0],c,rt.PLAIN,0,[u,d],[g,x],[g,x],[u,d]),r&&s.quad(...I,[0,-1,0],c)}}function me(s,t,e,n){let i=e;for(let r=0;r<s.length-1;r++){let[o,c]=s[r],[l,a]=s[r+1],u=Math.hypot(l-o,a-c);if(!u)continue;let d=(l-o)/u,g=(a-c)/u;for(let x=i;x<u;x+=t)n(o+d*x,c+g*x,d,g);i=(i-u)%t,i<0&&(i+=t)}}function Wt(s,t,e,n,i,r,o,c,l,a=rt.PLAIN){let u=Ge(t,e,n,c);u.multiply(new Ot().makeScale(i,r,o)),s.shape("box",u,St(l),a)}function*Bo(s){let{elements:t,roads:e,origin:n,rect:i,region:r,landmarks:o=[]}=s,c=Math.floor(s.seed*2147483646)+1,l=()=>(c=c*16807%2147483647,(c-1)/2147483646),a=new Bi(16384),u=new Bi(16384),d=new Bi(8192),g=new Bi(1024),x=[],v=[],b=[],E=new Map,A={canopies:0,solar:0,garages:0,glass:0,parkedCars:0,storefronts:0},w=[],I=[],T=[],U=[],N={grassTufts:0,rocks:0,yardTrees:0,shrubs:0},z=L=>(E.has(L)||E.set(L,{pts:ki(L.geometry.map(R=>Tt(R.lat,R.lon,n))),holes:(L.holes||[]).map(R=>ki(R.map(y=>Tt(y.lat,y.lon,n))))}),E.get(L)),B=(L,R)=>v.some(y=>y.building&&y.minY<1.8&&L>=y.minX&&L<=y.maxX&&R>=y.minZ&&R<=y.maxZ&&ht(L,R,y.pts)&&!y.holes?.some(h=>ht(L,R,h))),G=(L,R)=>B(L,R)||(s.collides?s.collides(L,R):nt.some(y=>Se(y.tags).base<1.8&&ht(L,R,z(y).pts)&&!z(y).holes.some(h=>ht(L,R,h)))),J=new Map,j=(L,R,y=2.4)=>{let h=Math.floor(L/5),f=Math.floor(R/5);for(let _=-1;_<=1;_++)for(let p=-1;p<=1;p++)for(let[M,S]of J.get(h+_+","+(f+p))||[])if(Math.hypot(M-L,S-R)<y)return!1;let m=h+","+f;return J.has(m)||J.set(m,[]),J.get(m).push([L,R]),!0},et=L=>o.some(R=>R.clear&&L.some(([y,h])=>Math.hypot(y-R.at[0],h-R.at[1])<R.clear)),nt=t.filter(L=>L.tags.building&&L.kind===1),st=(L,R)=>s.coveredParking?.(L,R)||nt.some(y=>(y.tags.parkingCanopy||y.tags.building==="carport")&&ht(L,R,z(y).pts)&&!z(y).holes.some(h=>ht(L,R,h))),ut=0,_t=0;for(let L of nt){if(Gt(L.tags))continue;let R=Math.abs(He(z(L).pts));ut+=R,_t+=ye(L.tags)*R}let Dt=Math.max(1,(i.maxX-i.minX)*(i.maxZ-i.minZ)),at=ut/Dt>.3||_t/Math.max(1,ut)>20,mt=at?3.2:1.8,pt=s.excludesNature||Oi(t,n),It=new Set,[Bt,Vt,Qt,se]=[i.minX,i.maxX,i.minZ,i.maxZ];d.polygon([[Bt,Qt],[Vt,Qt],[Vt,se],[Bt,se]],[],$.base,St(at?12238255:9940339),at?9:Hn.GRASS),yield;for(let L of t){if(L.kind!==1||L.tags.building)continue;let{pts:R,holes:y}=z(L);if(R.length<3)continue;if(L.tags.natural==="water"){let p=hu[L.tags.water]??4098208;g.polygon(R,y,$.water,St(p)),L.tags.water==="swimming_pool"&&Zt(d,[...R,R[0]],.6,$.water+.004,15328472);continue}if(L.tags.highway&&zi.has(L.tags.highway)){d.polygon(R,y,$.plaza,St(14275009)),We(R,y);continue}if(L.tags.man_made==="pier"){d.polygon(R,y,.35,St(9071180));continue}let h=Uo[L.tags.area];if(!h)continue;let[f,m,_]=h;d.polygon(R,y,m,St(f),L.tags.area==="residential"&&at?9:Po(L.tags.area)),(vr.has(L.tags.area)||_==="wood"||_==="scrub")&&!(at&&L.tags.area==="residential")&&Gn(L,R,y,m),_&&Wi(_,R,y,m),yield}function We(L,R){let y=Le(L),h=(y.maxX-y.minX)*(y.maxZ-y.minZ);for(let f=0;f<Math.min(12,h/400);f++){let m=Mr(L,R,y,l);if(!m||G(...m))continue;let _=l();_<.45?zn(u,m[0],m[1],l()*6.28):_<.75?Gi(m[0],m[1]):de(a,m[0],m[1],7+l()*4,l,{y:$.plaza})}}function Gi(L,R){Wt(u,L,.4,R,1.6,.8,1.6,0,10261642),pe(u,L,R,1.1,l);for(let y=0;y<3;y++)Me(u,L+(l()-.5)*1.1,R+(l()-.5)*1.1,l)}function Wi(L,R,y,h){let f=Le(R),m=Math.abs(He(R)),_=(M,S)=>{for(let D=0;D<M;D++){let C=Mr(R,y,f,l);C&&!G(...C)&&!e.onRoad(C[0],C[1],.5,null,!1)&&S(C[0],C[1])}},p=()=>r.tropical&&l()<.5?"palm":r.north&&l()<.5||l()<.12?"conifer":"broadleaf";if(L==="park")_(Math.min(90,m/260),(M,S)=>de(a,M,S,8+l()*9,l,{kind:p()})),_(Math.min(20,m/1500),(M,S)=>zn(u,M,S,l()*6.28)),_(Math.min(40,m/500),(M,S)=>pe(u,M,S,1+l(),l)),pn(R,.04);else if(L==="lawn")_(Math.min(40,m/900),(M,S)=>de(a,M,S,7+l()*8,l,{kind:p()}));else if(L==="garden")_(Math.min(6,m/120),(M,S)=>pe(u,M,S,.8+l()*.8,l)),_(Math.min(4,m/250),(M,S)=>de(a,M,S,5+l()*6,l,{kind:p()})),pn(R,.35);else if(L==="flowerbed")_(Math.min(300,m*2.2),(M,S)=>Me(u,M,S,l));else if(L==="meadow")_(Math.min(120,m/40),(M,S)=>Me(u,M,S,l,[16175917,16777215,11557588,14826587]));else if(L==="wood")_(Math.min(260,m/55),(M,S)=>de(a,M,S,10+l()*12,l,{kind:r.north||l()<.3?"conifer":"broadleaf"}));else if(L==="scrub")_(Math.min(120,m/35),(M,S)=>pe(u,M,S,.7+l()*1.2,l,7309893));else if(L==="orchard")_(Math.min(150,m/40),(M,S)=>de(a,M,S,4+l()*2,l));else if(L==="allotments"||L==="rows")_(Math.min(160,m/30),(M,S)=>pe(u,M,S,.5,l,L==="rows"?9281867:6265406));else if(L==="reeds")_(Math.min(120,m/30),(M,S)=>pe(u,M,S,.9,l,8163150));else if(L==="cemetery")_(Math.min(220,m/18),(M,S)=>Wt(u,M,.45,S,.6,.9,.15,l()*.2,[10131600,11776168,8355192][Math.floor(l()*3)]));else if(L==="playground"){let M=De(R);M&&dr(u,M.cx,M.cz,Math.atan2(M.ux,M.uz),l)}else if(L==="pitch")Xi(R,h);else if(L==="parking"){let M=De(R);if(M){for(let S=-M.halfLong+3;S<M.halfLong-3;S+=2.6)for(let D of[-M.halfShort+2.6,M.halfShort-2.6])if(l()<.55&&M.halfShort>5){let C=M.cx+M.ux*S-M.uz*D,k=M.cz+M.uz*S+M.ux*D;ht(C,k,R)&&!y.some(P=>ht(C,k,P))&&!e.onRoad(C,k,1.5)&&!st(C,k)&&!G(C,k)&&j(C,k)&&Pe(u,Ge(C,$.service,k,Math.atan2(M.ux,M.uz)+Math.PI/2),ie[Math.floor(l()*ie.length)])}}}}function Gn(L,R,y,h){let f=Le(R),m=Math.max(0,Math.abs(He(R))-y.reduce((M,S)=>M+Math.abs(He(S)),0)),_=Math.min(Do-N.grassTufts,Math.ceil(m/7)),p=["meadow","wood","forest","scrub","park"].includes(L.tags.area);for(let M=0;M<_;M++){let S=Mr(R,y,f,l);if(!S)continue;let[D,C]=S;if(G(D,C)||pt(D,C)||e.onRoad(D,C,.35,null,!1))continue;let k=e.nearest(D,C,14);if(k&&k.distance<k.half+(k.kind==="service"?.8:mt+.25))continue;let P=Math.floor(D*1.2)+","+Math.floor(C*1.2);It.has(P)||(It.add(P),U.push(D,h+.012,C,(p?1.1:.6)+l()*.55,l()*Math.PI*2,l()),N.grassTufts++,p&&l()<.017&&Me(u,D+.25,C+.2,l,[15851184,15199728,10914753]),p&&l()<.003&&(Zs(u,D,C,h,l),N.rocks++))}}function pn(L,R){me([...L,L[0]],1.2,.5,(y,h,f,m)=>{if(l()<R){let _=y-m*.6,p=h+f*.6;G(_,p)||Me(u,_,p,l)}})}function Xi(L,R){let y=De(L);if(!y||y.halfShort<4)return;let h=y.halfLong<16,f=(p,M,S,D)=>Zt(d,[[y.cx+y.ux*p-y.uz*M,y.cz+y.uz*p+y.ux*M],[y.cx+y.ux*S-y.uz*D,y.cz+y.uz*S+y.ux*D]],.12,R+.004,16053486);h&&d.polygon([[-1,-1],[1,-1],[1,1],[-1,1]].map(([p,M])=>[y.cx+y.ux*p*(y.halfLong-.5)-y.uz*M*(y.halfShort-.5),y.cz+y.uz*p*(y.halfLong-.5)+y.ux*M*(y.halfShort-.5)]),[],R+.002,St(l()<.5?4029086:12871997));let m=y.halfLong-1,_=y.halfShort-1;if(f(-m,-_,m,-_),f(-m,_,m,_),f(-m,-_,-m,_),f(m,-_,m,_),f(0,-_,0,_),!h){for(let p=0;p<20;p++){let M=p/20*Math.PI*2,S=(p+1)/20*Math.PI*2,D=Math.min(9.15,_*.5);f(Math.cos(M)*D,Math.sin(M)*D,Math.cos(S)*D,Math.sin(S)*D)}for(let p of[-1,1])fr(u,y.cx+y.ux*m*p,y.cz+y.uz*m*p,Math.atan2(-y.ux,-y.uz),Math.min(7.3,_))}}for(let L of t){if(L.kind!==0)continue;let{pts:R}=z(L);if(R.length<2)continue;let y=L.tags;if(y.waterway){Zt(g,R,uu[y.waterway]??3,$.water+.002,y.waterway==="stream"?4885653:3833235);continue}if(y.man_made==="pier"){Zt(d,R,4,.35,9071180);continue}if(y.railway){["subway","monorail","funicular"].includes(y.railway)||Xt(R);continue}y.highway&&(qi(L,R,y),yield)}function Xt(L){Zt(d,L,3.4,$.road-.01,8747887),me(L,.65,.3,(R,y,h,f)=>Wt(u,R,$.road+.06,y,2.6,.14,.24,Math.atan2(h,f),6968387));for(let R of[-.72,.72])Zt(a,L.map(([y,h],f)=>{let[m,_]=L[Math.min(f+1,L.length-1)],[p,M]=L[Math.max(f-1,0)],S=Math.hypot(m-p,_-M)||1;return[y-(_-M)/S*R,h+(m-p)/S*R]}),.08,$.road+.16,10133667)}function qi(L,R,y){let h=y.highway,f=zi.has(h),m=y.bridge?Lo:0,_=br(y),p=_/2,M=y.surface&&/unpaved|dirt|gravel|ground|grass|sand|compacted/.test(y.surface);if(f){let F=M||h==="path"||h==="track"?12033914:h==="cycleway"?r.americas?6197091:10836299:13879990;Zt(d,R,_,$.path+m,F,{down:!!m}),h==="steps"&&me(R,.32,0,(O,W,q,Z)=>Wt(u,O,$.path+.05+m,W,_,.1,.05,Math.atan2(q,Z),11906459)),m&&mn(R,_);return}let S=h==="service"||h==="track",D=h==="motorway"||h==="trunk";if(Zt(d,R,_,(S?$.service:$.road)+m,M?10324586:S?7172721:5593435,{down:!!m}),m){mn(R,_);return}let C=0,k=[0];for(let F=1;F<R.length;F++)C+=Math.hypot(R[F][0]-R[F-1][0],R[F][1]-R[F-1][1]),k.push(C);if(S||b.push({pts:R,cumulative:k,length:C,width:_,major:Sr.has(h),oneway:!!y.oneway,y:$.road,left:r.leftDrive}),y.service==="parking_aisle"){ue(L,R,p);return}if(S)return;if(!y.oneway&&Sr.has(h)&&!D)for(let F of[-.15,.15])Zt(d,gn(R,F),.12,$.marking,r.americas?15120442:15789796);else me(R,9,3,(F,O,W,q)=>{e.nearIntersection(F,O,p+8)||Wt(d,F,$.marking,O,.13,.01,3,Math.atan2(W,q),r.americas&&!y.oneway?15120442:15789796)});if(D){for(let F of[-p+.4,p-.4])Zt(d,gn(R,F),.15,$.marking,15789796);return}for(let F of[-1,1])me(R,3,1.5,(O,W,q,Z)=>{let Y=p+mt/2,K=O-Z*Y*F,tt=W+q*Y*F;if(e.onRoad(K,tt,.3,L.id))return;let it=-Z*F,lt=q*F,ct=p,gt=p+mt,ft=1.5,yt=[[O+it*ct-q*ft,W+lt*ct-Z*ft],[O+it*ct+q*ft,W+lt*ct+Z*ft],[O+it*gt+q*ft,W+lt*gt+Z*ft],[O+it*gt-q*ft,W+lt*gt-Z*ft]];d.quad(...yt.map(([$i,Ji])=>[$i,$.sidewalk,Ji]),[0,1,0],St(at?13223354:12894648));let At=St(14605008),[bt,Ft]=yt,[,,qt,fe]=yt;d.quad([bt[0],$.road,bt[1]],[Ft[0],$.road,Ft[1]],[Ft[0],$.sidewalk,Ft[1]],[bt[0],$.sidewalk,bt[1]],[-it,0,-lt],At),d.quad([fe[0],0,fe[1]],[qt[0],0,qt[1]],[qt[0],$.sidewalk,qt[1]],[fe[0],$.sidewalk,fe[1]],[it,0,lt],At),v.push({pts:yt,holes:[],...Le(yt),minY:0,maxY:$.sidewalk,platform:!0})});let P=h!=="motorway"&&h!=="trunk";P&&me(R,at?30:42,10+l()*8,(F,O,W,q)=>{let Z=l()<.5?-1:1,Y=p+.45,K=F-q*Y*Z,tt=O+W*Y*Z;e.onRoad(K,tt,.2)||G(K,tt)||($s(a,K,tt,Math.atan2(q*Z,-W*Z),{style:r.mediterranean&&at?"classic":"modern"}),x.push([K+q*Z*1.65,tt-W*Z*1.65]))}),P&&h!=="primary"&&me(R,at?9:13,4+l()*4,(F,O,W,q)=>{for(let Z of[-1,1]){if(l()<(at?.45:.5))continue;let Y=at?p+mt*.6:p+mt+2.5,K=F-q*Y*Z,tt=O+W*Y*Z;e.onRoad(K,tt,1.5)||G(K,tt)||e.nearIntersection(K,tt,p+6)||(at&&d.polygon([[K-.7,tt-.7],[K+.7,tt-.7],[K+.7,tt+.7],[K-.7,tt+.7]],[],$.sidewalk+.004,St(6047285)),de(a,K,tt,(at?7:8)+l()*5,l,{y:at?$.sidewalk:0,kind:r.tropical&&l()<.4?"palm":"broadleaf"}))}}),r.us&&P&&me(R,80,20+l()*30,(F,O,W,q)=>{let Z=l()<.5?-1:1,Y=p+.6,K=F-q*Y*Z,tt=O+W*Y*Z;!e.onRoad(K,tt,.2)&&!G(K,tt)&&tr(u,K,tt)}),["residential","tertiary","secondary"].includes(h)&&_>=8&&me(R,6.3,4,(F,O,W,q)=>{for(let Z of[-1,1]){if(l()>(at?.55:.3))continue;let Y=p-1.15,K=F-q*Y*Z,tt=O+W*Y*Z;e.nearIntersection(K,tt,p+9)||e.onRoad(K,tt,.3,L.id)||st(K,tt)||G(K,tt)||!j(K,tt,4)||Pe(u,Ge(K,$.road,tt,Math.atan2(W,q)+(Z>0==!r.leftDrive?0:Math.PI)),ie[Math.floor(l()*ie.length)])}})}function ue(L,R,y){Zt(d,R,y*2+10,$.service-.003,7172721),me(R,2.6,1.3,(h,f,m,_)=>{for(let p of[-1,1]){let M=y+2.5,S=h-_*M*p,D=f+m*M*p;if(st(S,D)||G(S,D)||e.onRoad(S,D,.5,L.id,!1))continue;let C=S+m*1.3,k=D+_*1.3;Wt(d,C,$.marking-.01,k,.1,.01,5,Math.atan2(-_,m)+Math.PI/2,15789796),l()<.62&&j(S,D)&&Pe(u,Ge(S,$.service,D,Math.atan2(m,_)+Math.PI/2*p+(l()<.5?0:Math.PI)),ie[Math.floor(l()*ie.length)])}})}function mn(L,R){for(let y of[-1,1])Zt(a,gn(L,y*(R/2+.15)),.3,Lo+.6,9343373)}function gn(L,R){return L.map(([y,h],f)=>{let[m,_]=L[Math.min(f+1,L.length-1)],[p,M]=L[Math.max(f-1,0)],S=Math.hypot(m-p,_-M)||1;return[y-(_-M)/S*R,h+(m-p)/S*R]})}for(let L of e.intersections){if(L.x<Bt||L.x>=Vt||L.z<Qt||L.z>=se)continue;let R=L.arms.some(h=>h.major&&h.kind!=="motorway")&&L.arms.length>=3,y=Math.max(...L.arms.map(h=>h.half));L.arms.forEach((h,f)=>{if(h.kind==="motorway"||h.kind==="trunk")return;let m=y+2.2,_=L.x+h.ux*m,p=L.z+h.uz*m,M=Math.atan2(h.ux,h.uz);if(at||R)for(let P=-h.half+.5;P<h.half-.2;P+=1)Wt(d,_-h.uz*P,$.marking,p+h.ux*P,.5,.01,3,M,15921382);let S=r.leftDrive?-1:1,D=h.half+1.1,C=L.x+h.ux*(m+2.2)+h.uz*D*S,k=L.z+h.uz*(m+2.2)-h.ux*D*S;G(C,k)||e.onRoad(C,k,.2)||(R?cr(u,C,k,M,f%2,ve(Math.round(L.x)*31+Math.round(L.z))):r.us&&!at&&hr(u,C,k,M))})}yield;let Xe=0;for(let L of nt){let{pts:R,holes:y}=z(L);R.length<3||et(R)||(qe(L,R,y),Xe++,Xe%6===0&&(yield))}function qe(L,R,y){let h=L.tags,f=Se(h),m=f.top,_=f.base;if(f.open){let Y=De(R),K=f.solar&&h.parkingCanopy&&Y?.halfShort>9?Eo(R,y,e.segments):[[R,...y]];for(let[tt,...it]of K)Yi(L,ki(tt),it.map(ki),f);return}if(f.kind==="garage"){Xn(L,R,y,f);return}let p=Math.abs(He(R)),M=ve(L.id),S=Le(R),D=!at&&_===0&&p<280&&m<=12,C=D?De(R):null,k=D&&h["roof:shape"]==="gabled"&&C&&!y.length&&p/C.area>.97&&C.halfShort>2.2,P=f.kind==="greenhouse"||/glass|glazing|curtain_wall/i.test(h["building:material"]||h["facade:material"]||h.material||""),F=h["building:material"]||h["facade:material"]||h.material||"",O=P?rt.OFFICE:/brick/i.test(F)?rt.BRICK:/stone|concrete|plaster/i.test(F)?rt.STONE:D?rt.HOUSE:po(m,M,r.brick);P&&A.glass++;let W;if(h["building:colour"]||h.colour)W=St(h["building:colour"]||h.colour);else if(P)W=St(7839662);else if(D)W=St(r.walls[Math.floor(ve(L.id*7)*r.walls.length)]);else{let Y=mo(O,ve(L.id*31+7));W=[Math.round(Math.min(1,Y.r)*255),Math.round(Math.min(1,Y.g)*255),Math.round(Math.min(1,Y.b)*255)]}let q=k?Math.min(parseFloat(h["roof:height"])||C.halfShort*.6,m*.35):0,Z=m-q;for(let Y of[R,...y])_n(Y,_,Z,W,O,M,Y!==R,L);if(k)Zi(C,Z,W,M,q);else{let Y=h["roof:colour"]?St(h["roof:colour"]):h.fillIn&&!at&&/house|apartments|residential/.test(h.building)?St(Fo[Math.floor(M*97)%Fo.length]):null;for(let[K,...tt]of s.roofPolygons?.(L,R,y,Z)||[[R,...y]])a.polygon(K,tt,Z,Y||W,Y?rt.PLAIN:O,M)}_>0&&a.polygon(R,y,_,W,O,M,!1),v.push({pts:R,holes:y,...S,minY:_,maxY:Z,building:!0}),D&&$t(R,C,Z,M)}function xn(L,R,y,h,f,m,_=rt.PLAIN){for(let S of[R,...y])_n(S,h,f,St(m),rt.PLAIN,ve(L.id),S!==R,null);let p=a.count;a.polygon(R,y,f,St(m),_,ve(L.id));let M=De(R);if(M)for(let S=p;S<a.count;S++){let D=a.position[S*3]-M.cx,C=a.position[S*3+2]-M.cz;a.uv[S*2]=D*M.ux+C*M.uz,a.uv[S*2+1]=-D*M.uz+C*M.ux}a.polygon(R,y,h,St(11581884),rt.PLAIN,0,!1),v.push({pts:R,holes:y,...Le(R),minY:h,maxY:f,building:!0})}function Wn(L,R,y,h=.23){Wt(a,L,y/2,R,h,y,h,0,8886174);let f=[[L-h/2,R-h/2],[L+h/2,R-h/2],[L+h/2,R+h/2],[L-h/2,R+h/2]];v.push({pts:f,holes:[],...Le(f),minY:0,maxY:y,building:!0})}function Yi(L,R,y,h){let f=De(R),{top:m,base:_,solar:p}=h;if(!f||(A.canopies++,p&&A.solar++,xn(L,R,y,_,m,p?2382982:10858160,p?rt.SOLAR:rt.PLAIN),L.tags.rooftop))return;let M=(k,P,F=0)=>[[F,0],[-F,0],[0,F],[0,-F]].every(([O,W])=>ht(k+O,P+W,R)&&!y.some(q=>ht(k+O,P+W,q))),S=(k,P)=>[f.cx+f.ux*k-f.uz*P,f.cz+f.uz*k+f.ux*P],D=Math.max(1,Math.ceil(f.halfShort*2/10)),C=Math.max(1,Math.ceil(f.halfLong*2/7));for(let k=0;k<C;k++)for(let P=0;P<D;P++){let[F,O]=S(-f.halfLong+(k+.5)*f.halfLong*2/C,-f.halfShort+(P+.5)*f.halfShort*2/D);M(F,O,.3)&&!e.onRoad(F,O,.3)&&(Wn(F,O,_),j(F,O,.3))}if(L.tags.parkingCanopy||L.tags.building==="carport"){d.polygon(R,y,$.service,St(7502978));for(let k=-f.halfLong+1.5;k<f.halfLong-1.4;k+=2.8)for(let P=-f.halfShort+2.8;P<f.halfShort-2.3;P+=6){let[F,O]=S(k,P);if(!M(F,O,2.25)||e.onRoad(F,O,1.4)||!j(F,O,2.6))continue;let W=Math.atan2(-f.uz,f.ux);Wt(d,F+f.ux*1.35,$.marking,O+f.uz*1.35,.08,.012,4.8,W,15263191),l()<.62&&(Pe(u,Ge(F,$.service,O,W),ie[Math.floor(l()*ie.length)]),A.parkedCars++)}}}function Xn(L,R,y,h){A.garages++;let f=De(R);if(!f)return;let m=Math.max(1,Math.min(16,parseInt(L.tags["building:levels"])||Math.round(h.top/3.2))),_=h.top/m;for(let p=1;p<=m;p++)xn(L,R,y,p*_-.24,p*_,12633538);for(let p=-f.halfLong+1;p<f.halfLong;p+=7)for(let M=-f.halfShort+1;M<f.halfShort;M+=7){let S=f.cx+f.ux*p-f.uz*M,D=f.cz+f.uz*p+f.ux*M;ht(S,D,R)&&!y.some(C=>ht(S,D,C))&&Wn(S,D,h.top,.42)}for(let p=0;p<m;p++)for(let M of[R,...y])_n(M,p*_,p*_+.85,St(11779e3),rt.PLAIN,ve(L.id),M!==R,null)}function _n(L,R,y,h,f,m,_,p){let M=Math.sign(He(L))*(_?-1:1),S=0;for(let D=0;D<L.length;D++){let[C,k]=L[D],[P,F]=L[(D+1)%L.length],O=Math.hypot(P-C,F-k);if(O<.05)continue;let W=[-(F-k)/O*M,0,(P-C)/O*M],q=s.wallPanels?.(p,[C,k],[P,F],R,y,W)||[{t0:0,t1:1,y0:R,y1:y}];for(let Z of q){let{t0:Y,t1:K,y0:tt,y1:it}=Z,lt=C+(P-C)*Y,ct=k+(F-k)*Y,gt=C+(P-C)*K,ft=k+(F-k)*K,yt=S+O*Y,At=S+O*K;a.quad([lt,tt,ct],[gt,tt,ft],[gt,it,ft],[lt,it,ct],W,h,f,m,[yt,tt],[At,tt],[At,it],[yt,it])}S+=O}}function Zi(L,R,y,h,f){let{cx:m,cz:_,ux:p,uz:M}=L,S=L.halfLong,D=L.halfShort,C=St(r.roofs[Math.floor(h*97)%r.roofs.length]),k=(O,W,q)=>[m+p*O-M*W,q,_+M*O+p*W],P=R-.12,F=R+f;for(let O of[-1,1]){let W=[-M*O*f,D,p*O*f],q=Math.hypot(...W);a.quad(k(-S,O*D,P),k(S,O*D,P),k(S,0,F),k(-S,0,F),W.map(Z=>Z/q),C,rt.PLAIN,h),a.quad(k(-S,O*D,P),k(S,O*D,P),k(S,0,F),k(-S,0,F),W.map(Z=>-Z/q),C,rt.PLAIN,h),a.tri(k(O*L.halfLong,-L.halfShort,R),k(O*L.halfLong,L.halfShort,R),k(O*L.halfLong,0,R+f*L.halfShort/D),[p*O,0,M*O],y,rt.PLAIN,h)}}function $t(L,R,y,h){let f=R?.cx??L[0][0],m=R?.cz??L[0][1],_=e.nearest(f,m,45);if(!_)return;let p=null,M=null;for(let W=0;W<L.length;W++){let[q,Z]=L[W],[Y,K]=L[(W+1)%L.length],tt=Math.hypot(Y-q,K-Z);if(tt<2.2)continue;let it=(K-Z)/tt,lt=-(Y-q)/tt,ct=(q+Y)/2,gt=(Z+K)/2;(ct+it-f)*it+(gt+lt-m)*lt<0&&(it=-it,lt=-lt);let ft=_.x-ct,yt=_.z-gt,At=Math.hypot(ft,yt)||1,bt=(it*ft+lt*yt)/At,Ft={ax:q,az:Z,bx:Y,bz:K,length:tt,nx:it,nz:lt,mx:ct,mz:gt,facing:bt};(!p||bt>p.facing)&&(p=Ft),(!M||bt<M.facing)&&(M=Ft)}if(!p||p.facing<.3)return;let S=Math.atan2(p.nx,p.nz),D=[11024946,2968174,3104069,15921126,7031347,2040612][Math.floor(h*61)%6],C=p.mx+p.nx*.06,k=p.mz+p.nz*.06;Wt(u,C,1.05,k,1,2.1,.1,S,D),Wt(u,p.mx+p.nx*.55,.09,p.mz+p.nz*.55,1.6,.18,1,S,12170408),u.shape("sphere",Ge(C+(p.bx-p.ax)/p.length*.9,2.2,k+(p.bz-p.az)/p.length*.9).multiply(new Ot().makeScale(.18,.24,.18)),St(16773840),rt.LAMP);for(let W=.08;W<.92;W+=.09){if(Math.abs(W-.5)<.14)continue;let q=p.ax+(p.bx-p.ax)*W+p.nx*.5,Z=p.az+(p.bz-p.az)*W+p.nz*.5;G(q,Z)||Me(u,q,Z,l)}let P=p.mx+p.nx*1.05,F=p.mz+p.nz*1.05,O=e.nearest(P,F,40);if(O&&O.distance>O.half+.5){let W=(O.distance-O.half)/O.distance,q=P+(O.x-P)*W,Z=F+(O.z-F)*W;Zt(d,[[P,F],[q,Z]],1.2,$.path+.004,13155236);let Y=(p.bx-p.ax)/p.length,K=(p.bz-p.az)/p.length,tt=p.length/2+2,it=p.mx+Y*tt+p.nx*.5,lt=p.mz+K*tt+p.nz*.5;if(!G(it,lt)){let ct=e.nearest(it,lt,40);if(ct&&ct.distance<30){let gt=Math.max(0,(ct.distance-ct.half)/ct.distance),ft=it+(ct.x-it)*gt,yt=lt+(ct.z-lt)*gt;if(Zt(d,[[it-p.nx*3,lt-p.nz*3],[ft,yt]],3,$.path+.002,11973287),l()<.55&&Pe(u,Ge(it+p.nx*1.5,$.path,lt+p.nz*1.5,Math.atan2(p.nx,p.nz)+(l()<.5?0:Math.PI)),ie[Math.floor(l()*ie.length)]),r.us&&l()<.8){let At=ft+Y*2.2,bt=yt+K*2.2;Wt(u,At,.55,bt,.08,1.1,.08,0,7035466),Wt(u,At,1.15,bt,.25,.25,.5,Math.atan2(p.nx,p.nz),3093555)}}}for(let ct of[-1,1]){let gt=p.mx+Y*ct*(p.length/2+.6)+p.nx*.8,ft=p.mz+K*ct*(p.length/2+.6)+p.nz*.8;G(gt,ft)||pe(u,gt,ft,1+l()*.5,l)}}if(M&&M.facing<0&&M!==p){let W=(M.bx-M.ax)/M.length,q=(M.bz-M.az)/M.length,Z=Math.min(4.5,M.length*.7),Y=(tt,it)=>[M.mx+W*tt+M.nx*it,M.mz+q*tt+M.nz*it],K=[Y(-Z/2,.05),Y(Z/2,.05),Y(Z/2,3.4),Y(-Z/2,3.4)];if(!K.some(tt=>G(...tt))){d.polygon(K,[],$.path+.006,St([13219740,11050640,12166282][Math.floor(h*13)%3]));let[tt,it]=Y(0,1.8);l()<.7&&Ci(u,tt,it,Math.atan2(M.nx,M.nz),l)}}}yield;let Er=s.storefronts||Ni(t,n,e);for(let L of t){let R=Er.get(L);if(!R||w.length>=32)continue;let y=[3235673,9715512,3233653,7951929,6903675],h=y[Math.floor(ve(L.id)*y.length)],f={...R,color:h};or(u,f,h),w.push(f),A.storefronts++;let m=(p,M)=>[f.x+f.nz*p+f.nx*M,f.z-f.nx*p+f.nz*M],_=(p,M,S)=>[[0,0],[S,0],[-S,0],[0,S],[0,-S]].every(([D,C])=>!G(p+D,M+C)&&!e.onRoad(p+D,M+C,.25));for(let p of[-1,1]){let[M,S]=m(p*(f.width/2-.42),.65),D=e.nearest(M,S,12);_(M,S,.45)&&(!D||D.distance-D.half>2.1)&&j(M,S,1)&&(ar(u,M,S,f.yaw,h,l),T.push([M,S,.6]))}if(Co.has(f.kind)){let[p,M]=m(-f.width*.29,.75),S=e.nearest(p,M,15);_(p,M,.4)&&(!S||S.distance-S.half>2.1)&&j(p,M,.8)&&(lr(u,p,M,f.yaw),T.push([p,M,.5]));let[D,C]=m(-f.width*.27,2.5),k=e.nearest(D,C,20);_(D,C,1.45)&&(!k||k.distance-k.half>3.3)&&j(D,C,2.1)&&(Ci(u,D,C,f.yaw,l),T.push([D,C,1.5]))}}for(let L of t){if(L.kind!==2)continue;let[R,y]=Tt(L.geometry[0].lat,L.geometry[0].lon,n),h=e.nearest(R,y,35),f=h?Math.atan2(h.x-R,h.z-y):0,m=L.tags.poi,_=L.tags.subclass,p=(M=1.3)=>{if(!h)return!1;let S=h.distance||1,D=(R-h.x)/S,C=(y-h.z)/S;return R=h.x+D*(h.half+M),y=h.z+C*(h.half+M),f=Math.atan2(-D,-C),!0};yr(L.tags)||G(R,y)&&!p()||G(R,y)||e.onRoad(R,y,0)||(["bench","waste_basket","bollard","bicycle_parking","bus","shelter","post","recycling","information","fountain"].includes(m)&&T.push([R,y,["bus","shelter","fountain"].includes(m)?2:m==="bench"?1.1:.6]),m==="waste_basket"?Js(u,R,y):m==="bollard"?Ks(u,R,y):m==="bicycle_parking"?js(u,R,y,f+Math.PI/2):m==="bus"?Ri(u,R,y,f,r.uk?13116959:3108787):m==="shelter"?Ri(u,R,y,f,6978146):m==="post"?Qs(u,R,y,r.post):m==="drinking_water"?er(u,R,y):m==="bench"?zn(u,R,y,f):m==="recycling"?nr(u,R,y,f+Math.PI/2):m==="entrance"&&_==="subway_entrance"?ir(u,R,y,f):m==="art_gallery"&&_==="artwork"?rr(u,R,y,l):m==="information"?sr(u,R,y,f):m==="parking"?ur(u,R,y,f):m==="fountain"&&(Wt(a,R,.25,y,4,.5,4,0,12235686),g.polygon([[R-1.8,y-1.8],[R+1.8,y-1.8],[R+1.8,y+1.8],[R-1.8,y+1.8]],[],.45,St(6010316)),Wt(a,R,1,y,.4,2,.4,0,12235686)))}if(!at){let L=t.filter(m=>m.kind===1&&!m.tags.building&&(Uo[m.tags.area]||m.tags.natural==="water"||m.tags.highway)).map(m=>{let _=z(m);return{..._,...Le(_.pts),residential:m.tags.area==="residential"}}),R=(m,_,p)=>L.some(M=>(!p||!M.residential)&&m>=M.minX&&m<=M.maxX&&_>=M.minZ&&_<=M.maxZ&&ht(m,_,M.pts)&&!M.holes.some(S=>ht(m,_,S))),y=(m,_,p,M=!1)=>{if(G(m,_)||pt(m,_)||st(m,_)||R(m,_,M)||e.onRoad(m,_,.35,null,!1))return!1;let S=e.nearest(m,_,24);return!S||S.distance>S.half+p},h=Math.min(Do-N.grassTufts,Math.ceil(Dt/20));for(let m=0;m<h;m++){let _=Bt+l()*(Vt-Bt),p=Qt+l()*(se-Qt),M=Math.floor(_*1.2)+","+Math.floor(p*1.2);It.has(M)||!y(_,p,e.nearest(_,p,24)?.kind==="service"?.8:mt+.3)||(It.add(M),U.push(_,$.base+.012,p,.55+l()*.5,l()*Math.PI*2,l()),N.grassTufts++,l()<.006&&Me(u,_+.2,p-.2,l,[16179834,16777215,13017824]))}let f=()=>r.tropical&&l()<.5?"palm":r.north&&l()<.4||l()<.15?"conifer":"broadleaf";for(let m=0;m<Math.min(40,Dt/1600);m++){let _=Bt+l()*(Vt-Bt),p=Qt+l()*(se-Qt);!y(_,p,mt+3,!0)||[[3.5,0],[-3.5,0],[0,3.5],[0,-3.5]].some(([M,S])=>G(_+M,p+S))||!j(_,p,6)||(de(a,_,p,7+l()*8,l,{kind:f()}),N.yardTrees++)}for(let m of nt){if(N.shrubs>=120)break;if(!/house|apartments|residential|detached|terrace|semidetached_house|dormitory/.test(m.tags.building)||Gt(m.tags)||Se(m.tags).base>.5)continue;let{pts:_}=z(m);if(!(Math.abs(He(_))>6e3))for(let p=0;p<_.length;p++){let[M,S]=_[p],[D,C]=_[(p+1)%_.length],k=Math.hypot(D-M,C-S);if(k<3)continue;let P=-(C-S)/k,F=(D-M)/k;for(let O=1.2;O<k-1.2;O+=2.4+l()*3){if(N.shrubs>=120||l()<.55)continue;let W=M+(D-M)*O/k,q=S+(C-S)*O/k,Z=G(W+P*.9,q+F*.9)?-1:1,Y=W+P*.85*Z,K=q+F*.85*Z;!y(Y,K,mt+.6,!0)||!j(Y,K,1.1)||(pe(u,Y,K,.7+l()*.6,l),N.shrubs++)}}}}let Tr=t.filter(L=>L.kind===1&&L.tags.natural==="water").map(z),Ar=(L,R)=>G(L,R)||T.some(([y,h,f])=>Math.hypot(L-y,R-h)<f)||Tr.some(y=>ht(L,R,y.pts)&&!y.holes.some(h=>ht(L,R,h)));for(let L of t)if(L.kind===0&&L.tags.highway){let R=L.geometry[0],y=`${L.id}:${R.lat.toFixed(6)},${R.lon.toFixed(6)}`;I.push(...Io(z(L).pts,{key:y,kind:L.tags.highway,width:br(L.tags),sidewalk:mt,bridge:L.tags.bridge,blocked:Ar,roads:e,rect:i}))}return{solid:a.arrays(),detail:u.arrays(),ground:d.arrays(),water:g.arrays(),grass:new Float32Array(U),nature:N,glow:x,colliders:v,carRoads:b,pedestrianRoutes:I,shopSigns:w,buildingCount:Xe,urban:at,structures:A,mapLabels:Ao(t,n)}}var ko=qn(yn(),1);function zo(s,t){let n=new Map,i=new Map,r=function*(a){for(let u=Math.floor(a.minX/80);u<=Math.floor(a.maxX/80);u++)for(let d=Math.floor(a.minZ/80);d<=Math.floor(a.maxZ/80);d++)yield u+":"+d},o=a=>a.reduce((u,d,g)=>{let x=a[(g+1)%a.length];return u+d[0]*x[1]-x[0]*d[1]},0);for(let a of s){if(!a.tags.building||a.kind!==1||Gt(a.tags))continue;let u=[a.geometry,...a.holes||[]].map(v=>v.map(b=>Tt(b.lat,b.lon,t))),{top:d,base:g}=Se(a.tags),x={e:a,rings:u,top:d,base:g,rank:i.size,minX:1/0,maxX:-1/0,minZ:1/0,maxZ:-1/0,edges:[]};u.forEach((v,b)=>{let E=Math.sign(o(v))*(b?-1:1);v.forEach((A,w)=>{let I=v[(w+1)%v.length],T=I[0]-A[0],U=I[1]-A[1],N=Math.hypot(T,U);x.minX=Math.min(x.minX,A[0]),x.maxX=Math.max(x.maxX,A[0]),x.minZ=Math.min(x.minZ,A[1]),x.maxZ=Math.max(x.maxZ,A[1]),N>.01&&x.edges.push({p:A,q:I,nx:U/N*E,nz:-T/N*E})})}),i.set(a,x);for(let v of r(x))n.has(v)||n.set(v,[]),n.get(v).push(x)}let c=a=>{let u=new Set;for(let d of r(a))for(let g of n.get(d)||[])g.maxX>=a.minX-.02&&g.minX<=a.maxX+.02&&g.maxZ>=a.minZ-.02&&g.minZ<=a.maxZ+.02&&u.add(g);return u},l=(a,u)=>u.top>a.top||u.top===a.top&&(u.base<a.base||u.base===a.base&&u.rank<a.rank);return{wallPanels(a,u,d,g,x,v){let b=i.get(a);if(!b)return[{t0:0,t1:1,y0:g,y1:x}];let E=d[0]-u[0],A=d[1]-u[1],w=Math.hypot(E,A),I=E/w,T=A/w,U=[];for(let z of c({minX:Math.min(u[0],d[0]),maxX:Math.max(u[0],d[0]),minZ:Math.min(u[1],d[1]),maxZ:Math.max(u[1],d[1])}))if(!(z===b||z.base>=x||z.top<=g))for(let B of z.edges){let G=v[0]*B.nx+v[2]*B.nz;if(Math.abs(G)<.99999||G>0&&!l(b,z)||Math.abs((B.p[0]-u[0])*T-(B.p[1]-u[1])*I)>.02||Math.abs((B.q[0]-u[0])*T-(B.q[1]-u[1])*I)>.02)continue;let J=(B.p[0]-u[0])*I+(B.p[1]-u[1])*T,j=(B.q[0]-u[0])*I+(B.q[1]-u[1])*T,et=Math.max(0,Math.min(J,j)/w),nt=Math.min(1,Math.max(J,j)/w);nt-et>1e-6&&U.push({t0:et,t1:nt,y0:Math.max(g,z.base),y1:Math.min(x,z.top)})}let N=[{t0:0,t1:1,y0:g,y1:x}];for(let z of U)N=N.flatMap(B=>{let G=Math.max(B.t0,z.t0),J=Math.min(B.t1,z.t1),j=Math.max(B.y0,z.y0),et=Math.min(B.y1,z.y1);if(J<=G+1e-6||et<=j+.001)return[B];let nt=[];return G>B.t0+1e-6&&nt.push({...B,t1:G}),J<B.t1-1e-6&&nt.push({...B,t0:J}),j>B.y0+.001&&nt.push({t0:G,t1:J,y0:B.y0,y1:j}),et<B.y1-.001&&nt.push({t0:G,t1:J,y0:et,y1:B.y1}),nt});return N},roofPolygons(a,u,d,g){let x=i.get(a);if(!x)return[[u,...d]];let v=[...c(x)].filter(E=>E!==x&&E.base<g-.001&&E.top>=g&&(E.top>g||l(x,E)));if(!v.length)return[[u,...d]];let b=E=>E.map(A=>A.map(([w,I])=>[Math.round(w*1e3),Math.round(I*1e3)]));try{return ko.default.difference([b([u,...d])],...v.map(E=>[b(E.rings)])).map(E=>E.map(A=>A.map(([w,I])=>[w/1e3,I/1e3])))}catch{return[[u,...d]]}}}}var Vo="https://overpass-api.de/api/interpreter";function Vi(s,t,e=800){let n=e/110540,i=e/(111320*Math.max(.09,Math.cos(s*Math.PI/180))),r={south:Math.max(-85,s-n),north:Math.min(85,s+n),west:Math.max(-180,t-i),east:Math.min(180,t+i)},o=[r.south,r.west,r.north,r.east].map(l=>l.toFixed(6)).join(","),c=`[out:json][timeout:12];(wr["building"](${o});wr["building:part"](${o});wr["generator:source"="solar"](${o});wr["amenity"="parking"](${o});wr["amenity"="shelter"](${o});way["highway"](${o}););out tags geom;`;return{bounds:r,query:c}}async function fu(s,t,{url:e=Vo,signal:n}={}){let{bounds:i,query:r}=Vi(s,t);try{let o=await fetch(e,{method:"POST",body:new URLSearchParams({data:r}),signal:AbortSignal.any([...n?[n]:[],AbortSignal.timeout(14e3)])});if(!o.ok)throw new Error("Structure details are temporarily unavailable ("+o.status+").");let c=await o.json();if(c.remark)throw new Error("The structure lookup could not finish.");return{bounds:i,features:_r(c),source:"overpass",radius:800}}catch(o){if(n?.throwIfAborted(),e!==Vo)throw o;let{bounds:c}=Vi(s,t,350),l=[c.west,c.south,c.east,c.north].map(u=>u.toFixed(6)).join(","),a=await fetch("https://api.openstreetmap.org/api/0.6/map.json?bbox="+l,{signal:AbortSignal.any([...n?[n]:[],AbortSignal.timeout(1e4)])});if(!a.ok)throw o;return{bounds:c,features:_r(await a.json()),source:"osm-area",radius:350}}}async function Ho(s,t,{url:e,signal:n,footprints:i=!0}={}){let r=i&&vo(s,t)?Mo(Vi(s,t).bounds,{signal:n}).catch(l=>(n?.throwIfAborted(),console.warn(l),null)):Promise.resolve(null);r.catch(()=>{});let o;try{o=await fu(s,t,{url:e,signal:n})}catch(l){n?.throwIfAborted();let a=await r;if(!a?.length)throw l;return{bounds:Vi(s,t).bounds,features:a,source:"footprints",radius:800,footprints:a.length}}let c=await r;return{...o,features:c?[...o.features,...c]:o.features,footprints:c?.length||0}}var wr=new Map,be=new Map,dn=new Map,du=18,Wo=[];function Hi(s,t,e){let n=Br(Or(e?To(s,Wo,e):s));return{groups:n,all:[...n.values()].flat(),provider:t,indexes:new Map,baseElements:s,tile:e}}async function Go(s,t,e,n){let i=s.x+"/"+s.y;if(t==="snapshot")return dn.get(i)||(dn.set(i,Hi([],"snapshot")),dn.get(i));let r=(e||"default")+":"+i,o=be.get(r);if(o)be.delete(r),be.set(r,o);else for(o={promise:Fr(s,{tileJSONUrl:e}).then(c=>Object.assign(o,Hi(c,"openfreemap",s)))},be.set(r,o),o.promise.catch(()=>be.delete(r));be.size>du;)be.delete(be.keys().next().value);return await o.promise,o}function pu(s,t){let e=t.lat+","+t.lon;if(!s.indexes.has(e)){let n=new Map,i=[],r=40;for(let a of s.all){if((a.tags.parkingCanopy||a.tags.building==="carport")&&i.push({pts:a.geometry.map(E=>Tt(E.lat,E.lon,t)),holes:(a.holes||[]).map(E=>E.map(A=>Tt(A.lat,A.lon,t)))}),!a.tags.building||a.kind!==1||Gt(a.tags))continue;let u=a.geometry.map(E=>Tt(E.lat,E.lon,t)),d=1/0,g=-1/0,x=1/0,v=-1/0;for(let[E,A]of u)d=Math.min(d,E),g=Math.max(g,E),x=Math.min(x,A),v=Math.max(v,A);let b={pts:u,holes:(a.holes||[]).map(E=>E.map(A=>Tt(A.lat,A.lon,t))),minX:d,maxX:g,minZ:x,maxZ:v,low:(parseFloat(a.tags.min_height)||0)<2};for(let E=Math.floor(d/r);E<=Math.floor(g/r);E++)for(let A=Math.floor(x/r);A<=Math.floor(v/r);A++){let w=E+","+A;n.has(w)||n.set(w,[]),n.get(w).push(b)}}let o=(a,u)=>(n.get(Math.floor(a/r)+","+Math.floor(u/r))||[]).some(d=>d.low&&a>=d.minX&&a<=d.maxX&&u>=d.minZ&&u<=d.maxZ&&ht(a,u,d.pts)&&!d.holes.some(g=>ht(a,u,g))),c=(a,u)=>i.some(d=>ht(a,u,d.pts)&&!d.holes.some(g=>ht(a,u,g))),l=Oo(s.all,t);s.indexes.set(e,{roads:l,collides:o,coveredParking:c,excludesNature:Oi(s.all,t),storefronts:Ni(s.all,t,l),...zo(s.all,t)}),s.indexes.size>2&&s.indexes.delete(s.indexes.keys().next().value)}return s.indexes.get(e)}function mu(s,t,e){let n=4096*2**s.z,i=4096/Pt,r=t%Pt,o=Math.floor(t/Pt),c=(g,x)=>[Math.atan(Math.sinh(Math.PI*(1-2*x/n)))*180/Math.PI,g/n*360-180],[l,a]=Tt(...c(s.x*4096+r*i,s.y*4096+o*i),e),[u,d]=Tt(...c(s.x*4096+(r+1)*i,s.y*4096+(o+1)*i),e);return{minX:Math.min(l,u),maxX:Math.max(l,u),minZ:Math.min(a,d),maxZ:Math.max(a,d)}}self.onmessage=async({data:s})=>{if(s.type==="cancel"){wr.get(s.id)?.abort();return}let t=new AbortController;wr.set(s.id,t);try{if(s.type==="details"){let e=await Ho(s.lat,s.lon,{url:s.url,signal:t.signal,footprints:s.footprints!==!1});self.postMessage({id:s.id,type:"ready",details:e})}else if(s.type==="apply-details"){Wo=[...new Map(s.features.map(e=>[e.osmId,e])).values()];for(let e of be.values())e.baseElements&&Object.assign(e,Hi(e.baseElements,e.provider,e.tile));self.postMessage({id:s.id,type:"ready"})}else if(s.type==="tilejson")await os(s.tileJSONUrl,t.signal),self.postMessage({id:s.id,type:"ready"});else if(s.type==="snapshot"){let e=await fetch(s.url,{signal:AbortSignal.any([t.signal,AbortSignal.timeout(8e3)])});if(!e.ok)throw new Error("The offline snapshot is unavailable.");dn.clear();for(let[n,i]of Ur((await e.json()).elements||[]))dn.set(n,Hi(i,"snapshot"));self.postMessage({id:s.id,type:"ready",tiles:dn.size})}else if(s.type==="tile")await Go(s.tile,s.source,s.tileJSONUrl,t.signal),self.postMessage({id:s.id,type:"ready"});else if(s.type==="chunk"){let{tile:e,chunk:n,origin:i,source:r,tileJSONUrl:o,landmarks:c}=s,l=await Go(e,r,o,t.signal);t.signal.throwIfAborted();let a=Bo({elements:l.groups.get(n)||[],...pu(l,i),origin:i,rect:mu(e,n,i),region:No(i.lat,i.lon),seed:((e.x*73856093^e.y*19349663^n*83492791)>>>0)/4294967296||.5,landmarks:c}),u;for(;!(u=a.next()).done;)t.signal.throwIfAborted();let d={...u.value,provider:l.provider};self.postMessage({id:s.id,type:"ready",chunk:d},[...hn(d.solid),...hn(d.detail),...hn(d.ground),...hn(d.water),d.grass.buffer])}}catch(e){self.postMessage({id:s.id,type:"error",name:e.name,message:e.message})}finally{wr.delete(s.id)}};
/*! Bundled license information:

polygon-clipping/dist/polygon-clipping.umd.js:
  (**
   * splaytree v3.1.2
   * Fast Splay tree for Node and browser
   *
   * @author Alexander Milevski <info@w8r.name>
   * @license MIT
   * @preserve
   *)
  (*! *****************************************************************************
      Copyright (c) Microsoft Corporation. All rights reserved.
      Licensed under the Apache License, Version 2.0 (the "License"); you may not use
      this file except in compliance with the License. You may obtain a copy of the
      License at http://www.apache.org/licenses/LICENSE-2.0
  
      THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
      KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
      WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
      MERCHANTABLITY OR NON-INFRINGEMENT.
  
      See the Apache Version 2.0 License for specific language governing permissions
      and limitations under the License.
      ***************************************************************************** *)

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2025 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
