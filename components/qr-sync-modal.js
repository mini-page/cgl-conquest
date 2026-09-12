/**
 * QrSyncModal Component
 * Universal two-way peer device synchronization via high-density QR code.
 * Works seamlessly across mobile & laptop, offline/file:// protocol and HTTPS.
 * 
 * Features:
 * - Offline-First QR Generation & Camera Scanning (local vendor engines)
 * - Canonical State Serialization & Schema Versioning
 * - Security & Payload Integrity Guard
 * - Conflict-Resilient State Merger (monotonic progress union)
 * - Semantic Change Detector ("What's New")
 * - Parent / Guardian Progress Report Card & Shareable Formatter
 * - Focused QR Viewport with Secondary Manual Fallback Drawer
 */

(function () {
    // ── 0. OFFLINE STANDALONE QR MATRIX ENGINE (FAILSAFE EMBEDDED) ───────────
    const _inlinedQrCode = (function () {
        var qrcode=function(){var t=function(t,r){var e=t,n=g[r],o=null,i=0,a=null,u=[],f={},c=function(t,r){o=function(t){for(var r=new Array(t),e=0;e<t;e+=1){r[e]=new Array(t);for(var n=0;n<t;n+=1)r[e][n]=null}return r}(i=4*e+17),l(0,0),l(i-7,0),l(0,i-7),s(),h(),d(t,r),e>=7&&v(t),null==a&&(a=p(e,n,u)),w(a,r)},l=function(t,r){for(var e=-1;e<=7;e+=1)if(!(t+e<=-1||i<=t+e))for(var n=-1;n<=7;n+=1)r+n<=-1||i<=r+n||(o[t+e][r+n]=0<=e&&e<=6&&(0==n||6==n)||0<=n&&n<=6&&(0==e||6==e)||2<=e&&e<=4&&2<=n&&n<=4)},h=function(){for(var t=8;t<i-8;t+=1)null==o[t][6]&&(o[t][6]=t%2==0);for(var r=8;r<i-8;r+=1)null==o[6][r]&&(o[6][r]=r%2==0)},s=function(){for(var t=B.getPatternPosition(e),r=0;r<t.length;r+=1)for(var n=0;n<t.length;n+=1){var i=t[r],a=t[n];if(null==o[i][a])for(var u=-2;u<=2;u+=1)for(var f=-2;f<=2;f+=1)o[i+u][a+f]=-2==u||2==u||-2==f||2==f||0==u&&0==f}},v=function(t){for(var r=B.getBCHTypeNumber(e),n=0;n<18;n+=1){var a=!t&&1==(r>>n&1);o[Math.floor(n/3)][n%3+i-8-3]=a}for(n=0;n<18;n+=1){a=!t&&1==(r>>n&1);o[n%3+i-8-3][Math.floor(n/3)]=a}},d=function(t,r){for(var e=n<<3|r,a=B.getBCHTypeInfo(e),u=0;u<15;u+=1){var f=!t&&1==(a>>u&1);u<6?o[u][8]=f:u<8?o[u+1][8]=f:o[i-15+u][8]=f}for(u=0;u<15;u+=1){f=!t&&1==(a>>u&1);u<8?o[8][i-u-1]=f:u<9?o[8][15-u-1+1]=f:o[8][15-u-1]=f}o[i-8][8]=!t},w=function(t,r){for(var e=-1,n=i-1,a=7,u=0,f=B.getMaskFunction(r),c=i-1;c>0;c-=2)for(6==c&&(c-=1);;){for(var g=0;g<2;g+=1)if(null==o[n][c-g]){var l=!1;u<t.length&&(l=1==(t[u]>>>a&1)),f(n,c-g)&&(l=!l),o[n][c-g]=l,-1==(a-=1)&&(u+=1,a=7)}if((n+=e)<0||i<=n){n-=e,e=-e;break}}},p=function(t,r,e){for(var n=A.getRSBlocks(t,r),o=b(),i=0;i<e.length;i+=1){var a=e[i];o.put(a.getMode(),4),o.put(a.getLength(),B.getLengthInBits(a.getMode(),t)),a.write(o)}var u=0;for(i=0;i<n.length;i+=1)u+=n[i].dataCount;if(o.getLengthInBits()>8*u)throw"code length overflow. ("+o.getLengthInBits()+">"+8*u+")";for(o.getLengthInBits()+4<=8*u&&o.put(0,4);o.getLengthInBits()%8!=0;)o.putBit(!1);for(;!(o.getLengthInBits()>=8*u||(o.put(236,8),o.getLengthInBits()>=8*u));)o.put(17,8);return function(t,r){for(var e=0,n=0,o=0,i=new Array(r.length),a=new Array(r.length),u=0;u<r.length;u+=1){var f=r[u].dataCount,c=r[u].totalCount-f;n=Math.max(n,f),o=Math.max(o,c),i[u]=new Array(f);for(var g=0;g<i[u].length;g+=1)i[u][g]=255&t.getBuffer()[g+e];e+=f;var l=B.getErrorCorrectPolynomial(c),h=k(i[u],l.getLength()-1).mod(l);for(a[u]=new Array(l.getLength()-1),g=0;g<a[u].length;g+=1){var s=g+h.getLength()-a[u].length;a[u][g]=s>=0?h.getAt(s):0}}var v=0;for(g=0;g<r.length;g+=1)v+=r[g].totalCount;var d=new Array(v),w=0;for(g=0;g<n;g+=1)for(u=0;u<r.length;u+=1)g<i[u].length&&(d[w]=i[u][g],w+=1);for(g=0;g<o;g+=1)for(u=0;u<r.length;u+=1)g<a[u].length&&(d[w]=a[u][g],w+=1);return d}(o,n)};f.addData=function(t,r){var e=null;switch(r=r||"Byte"){case"Numeric":e=M(t);break;case"Alphanumeric":e=x(t);break;case"Byte":e=m(t);break;case"Kanji":e=L(t);break;default:throw"mode:"+r}u.push(e),a=null},f.isDark=function(t,r){if(t<0||i<=t||r<0||i<=r)throw t+","+r;return o[t][r]},f.getModuleCount=function(){return i},f.make=function(){if(e<1){for(var t=1;t<40;t++){for(var r=A.getRSBlocks(t,n),o=b(),i=0;i<u.length;i++){var a=u[i];o.put(a.getMode(),4),o.put(a.getLength(),B.getLengthInBits(a.getMode(),t)),a.write(o)}var g=0;for(i=0;i<r.length;i++)g+=r[i].dataCount;if(o.getLengthInBits()<=8*g)break}e=t}c(!1,function(){for(var t=0,r=0,e=0;e<8;e+=1){c(!0,e);var n=B.getLostPoint(f);(0==e||t>n)&&(t=n,r=e)}return r}())},f.createTableTag=function(t,r){t=t||2;var e="";e+='<table style="',e+=" border-width: 0px; border-style: none;",e+=" border-collapse: collapse;",e+=" padding: 0px; margin: "+(r=void 0===r?4*t:r)+"px;",e+='">',e+="<tbody>";for(var n=0;n<f.getModuleCount();n+=1){e+="<tr>";for(var o=0;o<f.getModuleCount();o+=1)e+='<td style="',e+=" border-width: 0px; border-style: none;",e+=" border-collapse: collapse;",e+=" padding: 0px; margin: 0px;",e+=" width: "+t+"px;",e+=" height: "+t+"px;",e+=" background-color: ",e+=f.isDark(n,o)?"#000000":"#ffffff",e+=";",e+='"/>';e+="</tr>"}return e+="</tbody>",e+="</table>"},f.createSvgTag=function(t,r,e,n){var o={};"object"==typeof arguments[0]&&(t=(o=arguments[0]).cellSize,r=o.margin,e=o.alt,n=o.title),t=t||2,r=void 0===r?4*t:r,(e="string"==typeof e?{text:e}:e||{}).text=e.text||null,e.id=e.text?e.id||"qrcode-description":null,(n="string"==typeof n?{text:n}:n||{}).text=n.text||null,n.id=n.text?n.id||"qrcode-title":null;var i,a,u,c,g=f.getModuleCount()*t+2*r,l="";for(c="l"+t+",0 0,"+t+" -"+t+",0 0,-"+t+"z ",l+='<svg version="1.1" xmlns="http://www.w3.org/2000/svg"',l+=o.scalable?"":' width="'+g+'px" height="'+g+'px"',l+=' viewBox="0 0 '+g+" "+g+'" ',l+=' preserveAspectRatio="xMinYMin meet"',l+=n.text||e.text?' role="img" aria-labelledby="'+y([n.id,e.id].join(" ").trim())+'"':"",l+=">",l+=n.text?'<title id="'+y(n.id)+'">'+y(n.text)+"</title>":"",l+=e.text?'<description id="'+y(e.id)+'">'+y(e.text)+"</description>":"",l+='<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>',l+='<path d="',a=0;a<f.getModuleCount();a+=1)for(u=a*t+r,i=0;i<f.getModuleCount();i+=1)f.isDark(a,i)&&(l+="M"+(i*t+r)+","+u+c);return l+='" stroke="transparent" fill="black"/>',l+="</svg>"},f.createDataURL=function(t,r){t=t||2,r=void 0===r?4*t:r;var e=f.getModuleCount()*t+2*r,n=r,o=e-r;return I(e,e,(function(r,e){if(n<=r&&r<o&&n<=e&&e<o){var i=Math.floor((r-n)/t),a=Math.floor((e-n)/t);return f.isDark(a,i)?0:1}return 1}))},f.createImgTag=function(t,r,e){t=t||2,r=void 0===r?4*t:r;var n=f.getModuleCount()*t+2*r,o="";return o+="<img",o+=' src="',o+=f.createDataURL(t,r),o+='"',o+=' width="',o+=n,o+='"',o+=' height="',o+=n,o+='"',e&&(o+=' alt="',o+=y(e),o+='"'),o+="/>"};var y=function(t){for(var r="",e=0;e<t.length;e+=1){var n=t.charAt(e);switch(n){case"<":r+="&lt;";break;case">":r+="&gt;";break;case"&":r+="&amp;";break;case'"':r+="&quot;";break;default:r+=n}}return r};return f.createASCII=function(t,r){if((t=t||1)<2)return function(t){t=void 0===t?2:t;var r,e,n,o,i,a=1*f.getModuleCount()+2*t,u=t,c=a-t,g={"██":"█","█ ":"▀"," █":"▄","  ":" "},l={"██":"▀","█ ":"▀"," █":" ","  ":" "},h="";for(r=0;r<a;r+=2){for(n=Math.floor((r-u)/1),o=Math.floor((r+1-u)/1),e=0;e<a;e+=1)i="█",u<=e&&e<c&&u<=r&&r<c&&f.isDark(n,Math.floor((e-u)/1))&&(i=" "),u<=e&&e<c&&u<=r+1&&r+1<c&&f.isDark(o,Math.floor((e-u)/1))?i+=" ":i+="█",h+=t<1&&r+1>=c?l[i]:g[i];h+="\n"}return a%2&&t>0?h.substring(0,h.length-a-1)+Array(a+1).join("▀"):h.substring(0,h.length-1)}(r);t-=1,r=void 0===r?2*t:r;var e,n,o,i,a=f.getModuleCount()*t+2*r,u=r,c=a-r,g=Array(t+1).join("██"),l=Array(t+1).join("  "),h="",s="";for(e=0;e<a;e+=1){for(o=Math.floor((e-u)/t),s="",n=0;n<a;n+=1)i=1,u<=n&&n<c&&u<=e&&e<c&&f.isDark(o,Math.floor((n-u)/t))&&(i=0),s+=i?g:l;for(o=0;o<t;o+=1)h+=s+"\n"}return h.substring(0,h.length-1)},f.renderTo2dContext=function(t,r){r=r||2;for(var e=f.getModuleCount(),n=0;n<e;n++)for(var o=0;o<e;o++)t.fillStyle=f.isDark(n,o)?"black":"white",t.fillRect(n*r,o*r,r,r)},f};t.stringToBytes=(t.stringToBytesFuncs={default:function(t){for(var r=[],e=0;e<t.length;e+=1){var n=t.charCodeAt(e);r.push(255&n)}return r}}).default,t.createStringToBytes=function(t,r){var e=function(){for(var e=S(t),n=function(){var t=e.read();if(-1==t)throw"eof";return t},o=0,i={};;){var a=e.read();if(-1==a)break;var u=n(),f=n()<<8|n();i[String.fromCharCode(a<<8|u)]=f,o+=1}if(o!=r)throw o+" != "+r;return i}(),n="?".charCodeAt(0);return function(t){for(var r=[],o=0;o<t.length;o+=1){var i=t.charCodeAt(o);if(i<128)r.push(i);else{var a=e[t.charAt(o)];"number"==typeof a?(255&a)==a?r.push(a):(r.push(a>>>8),r.push(255&a)):r.push(n)}}return r}};var r,e,n,o,i,a=1,u=2,f=4,c=8,g={L:1,M:0,Q:3,H:2},l=0,h=1,s=2,v=3,d=4,w=5,p=6,y=7,B=(r=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],e=1335,n=7973,i=function(t){for(var r=0;0!=t;)r+=1,t>>>=1;return r},(o={}).getBCHTypeInfo=function(t){for(var r=t<<10;i(r)-i(e)>=0;)r^=e<<i(r)-i(e);return 21522^(t<<10|r)},o.getBCHTypeNumber=function(t){for(var r=t<<12;i(r)-i(n)>=0;)r^=n<<i(r)-i(n);return t<<12|r},o.getPatternPosition=function(t){return r[t-1]},o.getMaskFunction=function(t){switch(t){case l:return function(t,r){return(t+r)%2==0};case h:return function(t,r){return t%2==0};case s:return function(t,r){return r%3==0};case v:return function(t,r){return(t+r)%3==0};case d:return function(t,r){return(Math.floor(t/2)+Math.floor(r/3))%2==0};case w:return function(t,r){return t*r%2+t*r%3==0};case p:return function(t,r){return(t*r%2+t*r%3)%2==0};case y:return function(t,r){return(t*r%3+(t+r)%2)%2==0};default:throw"bad maskPattern:"+t}},o.getErrorCorrectPolynomial=function(t){for(var r=k([1],0),e=0;e<t;e+=1)r=r.multiply(k([1,C.gexp(e)],0));return r},o.getLengthInBits=function(t,r){if(1<=r&&r<10)switch(t){case a:return 10;case u:return 9;case f:case c:return 8;default:throw"mode:"+t}else if(r<27)switch(t){case a:return 12;case u:return 11;case f:return 16;case c:return 10;default:throw"mode:"+t}else{if(!(r<41))throw"type:"+r;switch(t){case a:return 14;case u:return 13;case f:return 16;case c:return 12;default:throw"mode:"+t}}},o.getLostPoint=function(t){for(var r=t.getModuleCount(),e=0,n=0;n<r;n+=1)for(var o=0;o<r;o+=1){for(var i=0,a=t.isDark(n,o),u=-1;u<=1;u+=1)if(!(n+u<0||r<=n+u))for(var f=-1;f<=1;f+=1)o+f<0||r<=o+f||0==u&&0==f||a==t.isDark(n+u,o+f)&&(i+=1);i>5&&(e+=3+i-5)}for(n=0;n<r-1;n+=1)for(o=0;o<r-1;o+=1){var c=0;t.isDark(n,o)&&(c+=1),t.isDark(n+1,o)&&(c+=1),t.isDark(n,o+1)&&(c+=1),t.isDark(n+1,o+1)&&(c+=1),0!=c&&4!=c||(e+=3)}for(n=0;n<r;n+=1)for(o=0;o<r-6;o+=1)t.isDark(n,o)&&!t.isDark(n,o+1)&&t.isDark(n,o+2)&&t.isDark(n,o+3)&&t.isDark(n,o+4)&&!t.isDark(n,o+5)&&t.isDark(n,o+6)&&(e+=40);for(o=0;o<r;o+=1)for(n=0;n<r-6;n+=1)t.isDark(n,o)&&!t.isDark(n+1,o)&&t.isDark(n+2,o)&&t.isDark(n+3,o)&&t.isDark(n+4,o)&&!t.isDark(n+5,o)&&t.isDark(n+6,o)&&(e+=40);var g=0;for(o=0;o<r;o+=1)for(n=0;n<r;n+=1)t.isDark(n,o)&&(g+=1);return e+=Math.abs(100*g/r/r-50)/5*10},o),C=function(){for(var t=new Array(256),r=new Array(256),e=0;e<8;e+=1)t[e]=1<<e;for(e=8;e<256;e+=1)t[e]=t[e-4]^t[e-5]^t[e-6]^t[e-8];for(e=0;e<255;e+=1)r[t[e]]=e;var n={glog:function(t){if(t<1)throw"glog("+t+")";return r[t]},gexp:function(r){for(;r<0;)r+=255;for(;r>=256;)r-=255;return t[r]}};return n}();function k(t,r){if(void 0===t.length)throw t.length+"/"+r;var e=function(){for(var e=0;e<t.length&&0==t[e];)e+=1;for(var n=new Array(t.length-e+r),o=0;o<t.length-e;o+=1)n[o]=t[o+e];return n}(),n={getAt:function(t){return e[t]},getLength:function(){return e.length},multiply:function(t){for(var r=new Array(n.getLength()+t.getLength()-1),e=0;e<n.getLength();e+=1)for(var o=0;o<t.getLength();o+=1)r[e+o]^=C.gexp(C.glog(n.getAt(e))+C.glog(t.getAt(o)));return k(r,0)},mod:function(t){if(n.getLength()-t.getLength()<0)return n;for(var r=C.glog(n.getAt(0))-C.glog(t.getAt(0)),e=new Array(n.getLength()),o=0;o<n.getLength();o+=1)e[o]=n.getAt(o);for(o=0;o<t.getLength();o+=1)e[o]^=C.gexp(C.glog(t.getAt(o))+r);return k(e,0).mod(t)}};return n}var A=function(){var t=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],r=function(t,r){var e={};return e.totalCount=t,e.dataCount=r,e},e={};return e.getRSBlocks=function(e,n){var o=function(r,e){switch(e){case g.L:return t[4*(r-1)+0];case g.M:return t[4*(r-1)+1];case g.Q:return t[4*(r-1)+2];case g.H:return t[4*(r-1)+3];default:return}}(e,n);if(void 0===o)throw"bad rs block @ typeNumber:"+e+"/errorCorrectionLevel:"+n;for(var i=o.length/3,a=[],u=0;u<i;u+=1)for(var f=o[3*u+0],c=o[3*u+1],l=o[3*u+2],h=0;h<f;h+=1)a.push(r(c,l));return a},e}(),b=function(){var t=[],r=0,e={getBuffer:function(){return t},getAt:function(r){var e=Math.floor(r/8);return 1==(t[e]>>>7-r%8&1)},put:function(t,r){for(var n=0;n<r;n+=1)e.putBit(1==(t>>>r-n-1&1))},getLengthInBits:function(){return r},putBit:function(e){var n=Math.floor(r/8);t.length<=n&&t.push(0),e&&(t[n]|=128>>>r%8),r+=1}};return e},M=function(t){var r=a,e=t,n={getMode:function(){return r},getLength:function(t){return e.length},write:function(t){for(var r=e,n=0;n+2<r.length;)t.put(o(r.substring(n,n+3)),10),n+=3;n<r.length&&(r.length-n==1?t.put(o(r.substring(n,n+1)),4):r.length-n==2&&t.put(o(r.substring(n,n+2)),7))}},o=function(t){for(var r=0,e=0;e<t.length;e+=1)r=10*r+i(t.charAt(e));return r},i=function(t){if("0"<=t&&t<="9")return t.charCodeAt(0)-"0".charCodeAt(0);throw"illegal char :"+t};return n},x=function(t){var r=u,e=t,n={getMode:function(){return r},getLength:function(t){return e.length},write:function(t){for(var r=e,n=0;n+1<r.length;)t.put(45*o(r.charAt(n))+o(r.charAt(n+1)),11),n+=2;n<r.length&&t.put(o(r.charAt(n)),6)}},o=function(t){if("0"<=t&&t<="9")return t.charCodeAt(0)-"0".charCodeAt(0);if("A"<=t&&t<="Z")return t.charCodeAt(0)-"A".charCodeAt(0)+10;switch(t){case" ":return 36;case"$":return 37;case"%":return 38;case"*":return 39;case"+":return 40;case"-":return 41;case".":return 42;case"/":return 43;case":":return 44;default:throw"illegal char :"+t}};return n},m=function(r){var e=f,n=t.stringToBytes(r),o={getMode:function(){return e},getLength:function(t){return n.length},write:function(t){for(var r=0;r<n.length;r+=1)t.put(n[r],8)}};return o},L=function(r){var e=c,n=t.stringToBytesFuncs.SJIS;if(!n)throw"sjis not supported.";!function(){var t=n("友");if(2!=t.length||38726!=(t[0]<<8|t[1]))throw"sjis not supported."}();var o=n(r),i={getMode:function(){return e},getLength:function(t){return~~(o.length/2)},write:function(t){for(var r=o,e=0;e+1<r.length;){var n=(255&r[e])<<8|255&r[e+1];if(33088<=n&&n<=40956)n-=33088;else{if(!(57408<=n&&n<=60351))throw"illegal char at "+(e+1)+"/"+n;n-=49472}n=192*(n>>>8&255)+(255&n),t.put(n,13),e+=2}if(e<r.length)throw"illegal char at "+(e+1)}};return i},D=function(){var t=[],r={writeByte:function(r){t.push(255&r)},writeShort:function(t){r.writeByte(t),r.writeByte(t>>>8)},writeBytes:function(t,e,n){e=e||0,n=n||t.length;for(var o=0;o<n;o+=1)r.writeByte(t[o+e])},writeString:function(t){for(var e=0;e<t.length;e+=1)r.writeByte(t.charCodeAt(e))},toByteArray:function(){return t},toString:function(){var r="";r+="[";for(var e=0;e<t.length;e+=1)e>0&&(r+=","),r+=t[e];return r+="]"}};return r},S=function(t){var r=t,e=0,n=0,o=0,i={read:function(){for(;o<8;){if(e>=r.length){if(0==o)return-1;throw"unexpected end of file./"+o}var t=r.charAt(e);if(e+=1,"="==t)return o=0,-1;t.match(/^\s$/)||(n=n<<6|a(t.charCodeAt(0)),o+=6)}var i=n>>>o-8&255;return o-=8,i}},a=function(t){if(65<=t&&t<=90)return t-65;if(97<=t&&t<=122)return t-97+26;if(48<=t&&t<=57)return t-48+52;if(43==t)return 62;if(47==t)return 63;throw"c:"+t};return i},I=function(t,r,e){for(var n=function(t,r){var e=t,n=r,o=new Array(t*r),i={setPixel:function(t,r,n){o[r*e+t]=n},write:function(t){t.writeString("GIF87a"),t.writeShort(e),t.writeShort(n),t.writeByte(128),t.writeByte(0),t.writeByte(0),t.writeByte(0),t.writeByte(0),t.writeByte(0),t.writeByte(255),t.writeByte(255),t.writeByte(255),t.writeString(","),t.writeShort(0),t.writeShort(0),t.writeShort(e),t.writeShort(n),t.writeByte(0);var r=a(2);t.writeByte(2);for(var o=0;r.length-o>255;)t.writeByte(255),t.writeBytes(r,o,255),o+=255;t.writeByte(r.length-o),t.writeBytes(r,o,r.length-o),t.writeByte(0),t.writeString(";")}},a=function(t){for(var r=1<<t,e=1+(1<<t),n=t+1,i=u(),a=0;a<r;a+=1)i.add(String.fromCharCode(a));i.add(String.fromCharCode(r)),i.add(String.fromCharCode(e));var f,c,g,l=D(),h=(f=l,c=0,g=0,{write:function(t,r){if(t>>>r!=0)throw"length over";for(;c+r>=8;)f.writeByte(255&(t<<c|g)),r-=8-c,t>>>=8-c,g=0,c=0;g|=t<<c,c+=r},flush:function(){c>0&&f.writeByte(g)}});h.write(r,n);var s=0,v=String.fromCharCode(o[s]);for(s+=1;s<o.length;){var d=String.fromCharCode(o[s]);s+=1,i.contains(v+d)?v+=d:(h.write(i.indexOf(v),n),i.size()<4095&&(i.size()==1<<n&&(n+=1),i.add(v+d)),v=d)}return h.write(i.indexOf(v),n),h.write(e,n),h.flush(),l.toByteArray()},u=function(){var t={},r=0,e={add:function(n){if(e.contains(n))throw"dup key:"+n;t[n]=r,r+=1},size:function(){return r},indexOf:function(r){return t[r]},contains:function(r){return void 0!==t[r]}};return e};return i}(t,r),o=0;o<r;o+=1)for(var i=0;i<t;i+=1)n.setPixel(i,o,e(i,o));var a=D();n.write(a);for(var u=function(){var t=0,r=0,e=0,n="",o={},i=function(t){n+=String.fromCharCode(a(63&t))},a=function(t){if(t<0);else{if(t<26)return 65+t;if(t<52)return t-26+97;if(t<62)return t-52+48;if(62==t)return 43;if(63==t)return 47}throw"n:"+t};return o.writeByte=function(n){for(t=t<<8|255&n,r+=8,e+=1;r>=6;)i(t>>>r-6),r-=6},o.flush=function(){if(r>0&&(i(t<<6-r),t=0,r=0),e%3!=0)for(var o=3-e%3,a=0;a<o;a+=1)n+="="},o.toString=function(){return n},o}(),f=a.toByteArray(),c=0;c<f.length;c+=1)u.writeByte(f[c]);return u.flush(),"data:image/gif;base64,"+u};return t}();qrcode.stringToBytesFuncs["UTF-8"]=function(t){return function(t){for(var r=[],e=0;e<t.length;e++){var n=t.charCodeAt(e);n<128?r.push(n):n<2048?r.push(192|n>>6,128|63&n):n<55296||n>=57344?r.push(224|n>>12,128|n>>6&63,128|63&n):(e++,n=65536+((1023&n)<<10|1023&t.charCodeAt(e)),r.push(240|n>>18,128|n>>12&63,128|n>>6&63,128|63&n))}return r}(t)},function(t){"function"==typeof define&&define.amd?define([],t):"object"==typeof exports&&(module.exports=t())}((function(){return qrcode}));if(typeof window!=="undefined"){window.qrcode=qrcode;}if(typeof globalThis!=="undefined"){globalThis.qrcode=qrcode;}
        return qrcode;
    })();
    if (typeof window !== 'undefined' && typeof window.qrcode !== 'function') {
        window.qrcode = _inlinedQrCode;
    }
    if (typeof globalThis !== 'undefined' && typeof globalThis.qrcode !== 'function') {
        globalThis.qrcode = _inlinedQrCode;
    }

    // ── 1. COMPACT SERIALIZATION DICTIONARY ────────────────────────────────────
    function extractCompactPayload(state) {
        // Compress syllabusProgress: only active topics encoded as numeric stages (1=L, 2=P, 3=M)
        const compactSyllabus = {};
        if (state && state.syllabusProgress) {
            Object.entries(state.syllabusProgress).forEach(([id, f]) => {
                if (!f) return;
                let stage = 0;
                if (f.mastered) stage = 3;
                else if (f.practiced) stage = 2;
                else if (f.learned) stage = 1;
                if (stage > 0) {
                    compactSyllabus[id] = stage;
                }
            });
        }

        return {
            v: 1, // sync protocol version
            t: Date.now(),
            sp: compactSyllabus,
            m: Array.isArray(state.mocks) ? state.mocks.slice(-25).map(m => ({
                id: m.id,
                name: m.name,
                score: m.score,
                date: m.date,
                accuracy: m.accuracy,
                rank: m.rank,
                breakdown: m.breakdown
            })) : [],
            n: Array.isArray(state.notes) ? state.notes.slice(-20).map(n => ({
                id: n.id,
                title: n.title,
                content: n.content,
                text: n.text ? n.text.slice(0, 300) : undefined,
                tag: n.tag
            })) : (Array.isArray(state.customNotes) ? state.customNotes.slice(-20) : []),
            w: state.weakAlerts || {},
            srs: state.srsRecords || {},
            cd: Number(state.currentDay) || 1,
            dc: Number(state.dayCounter) || 1,
            ed: state.examDate || '2026-08-15',
            en: state.examName || 'Conquest',
            et: Number(state.examTier) || 1,
            st: Number(state.streak) || 1,
            la: state.lastActiveDate || '',
            dr: state.dailyRituals || { drill: false, vocab: false, ca: false, computer: false },
            th: state.theme || 'dark',
            mh: state.mobileNavHand || 'center',
            spk: state.speechEnabled !== false,
            tst: state.toastEnabled !== false,
            snd: state.soundEnabled !== false,
            foc: Boolean(state.focusModeActive),
            rew: state.rewards ? {
                c: Number(state.rewards.coins) || 0,
                p: Number(state.rewards.points) || 0,
                s: Number(state.rewards.stars) || 0,
                u: Array.isArray(state.rewards.unlockedCosmics) ? state.rewards.unlockedCosmics : (Array.isArray(state.rewards.unlocked) ? state.rewards.unlocked : ['title_aspirant', 'accent_blue']),
                ct: Array.isArray(state.rewards.claimedTrophies) ? state.rewards.claimedTrophies : [],
                stk: Array.isArray(state.rewards.unlockedStickers) ? state.rewards.unlockedStickers : [],
                eqs: state.rewards.equippedSticker || '',
                eq: state.rewards.equipped || { title: 'Aspirant', themeAccent: 'accent_blue' },
                pw: state.rewards.powers || {},
                act: Array.isArray(state.rewards.todayActivity) ? state.rewards.todayActivity.slice(0, 10) : [],
                pen: Array.isArray(state.rewards.penalties) ? state.rewards.penalties.slice(0, 5) : []
            } : undefined,
            dh: state.drillHeatmap || undefined,
            fm: state.factMaturation || undefined,
            spb: state.speedPersonalBests || (typeof localStorage !== 'undefined' ? {
                blitz: parseInt(localStorage.getItem('speed_blitz_pb') || '0', 10),
                suddenDeath: parseInt(localStorage.getItem('speed_sudden_death_pb') || '0', 10)
            } : undefined)
        };
    }

    function extractRewardsOnlyPayload(state) {
        return {
            v: 2,
            type: 'rewards_only',
            t: Date.now(),
            st: Number(state.streak) || 0,
            c: Number(state.rewards?.coins) || 0,
            p: Number(state.rewards?.points) || 0,
            s: Number(state.rewards?.stars) || 0,
            u: Array.isArray(state.rewards?.unlockedCosmics) ? state.rewards.unlockedCosmics : (Array.isArray(state.rewards?.unlocked) ? state.rewards.unlocked : ['title_aspirant', 'accent_blue']),
            ct: Array.isArray(state.rewards?.claimedTrophies) ? state.rewards.claimedTrophies : [],
            stk: Array.isArray(state.rewards?.unlockedStickers) ? state.rewards.unlockedStickers : [],
            eqs: state.rewards?.equippedSticker || '',
            eq: state.rewards?.equipped || { title: 'Aspirant', themeAccent: 'accent_blue' },
            pw: state.rewards?.powers || {},
            act: Array.isArray(state.rewards?.todayActivity) ? state.rewards.todayActivity.slice(0, 10) : [],
            pen: Array.isArray(state.rewards?.penalties) ? state.rewards.penalties.slice(0, 5) : []
        };
    }

    // ── 2. VALIDATION & PAYLOAD INTEGRITY GUARD ────────────────────────────────
    function validateSyncPayload(raw) {
        if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
            return { valid: false, error: 'Malformed sync payload: expected an object' };
        }

        // Guard against prototype pollution
        if (raw.__proto__ !== Object.prototype && raw.__proto__ !== null) {
            return { valid: false, error: 'Security violation: illegal object prototype' };
        }
        if ('constructor' in raw && typeof raw.constructor !== 'function') {
            return { valid: false, error: 'Security violation: constructor override' };
        }

        // Version validation
        const v = raw.v;
        if (v !== 1 && v !== 2 && v !== 3) {
            return { valid: false, error: `Unsupported sync schema version (${v})` };
        }

        // Streak sanity range check
        if (raw.st !== undefined) {
            const streak = Number(raw.st);
            if (isNaN(streak) || streak < 0 || streak > 3650) {
                return { valid: false, error: 'Invalid streak value' };
            }
        }

        // Rewards sanity range check
        if (raw.rew && typeof raw.rew === 'object') {
            const c = Number(raw.rew.c);
            const p = Number(raw.rew.p);
            const s = Number(raw.rew.s);
            if (!isNaN(c) && (c < 0 || c > 10000000)) return { valid: false, error: 'Invalid coins amount' };
            if (!isNaN(p) && (p < 0 || p > 10000000)) return { valid: false, error: 'Invalid XP points amount' };
            if (!isNaN(s) && (s < 0 || s > 1000000)) return { valid: false, error: 'Invalid stars amount' };
        }

        // Syllabus dictionary sanity check
        if (raw.sp && typeof raw.sp !== 'object') {
            return { valid: false, error: 'Invalid syllabus progress structure' };
        }

        return { valid: true };
    }

    // ── 3. STATE EXPANSION ────────────────────────────────────────────────────
    function expandCompactPayload(raw) {
        if (!raw || typeof raw !== 'object') return raw;

        if (raw.v === 2 && raw.type === 'rewards_only') {
            return {
                _isRewardsOnlySync: true,
                streak: Number(raw.st) || 0,
                rewards: {
                    coins: Number(raw.c) || 0,
                    points: Number(raw.p) || 0,
                    stars: Number(raw.s) || 0,
                    unlockedCosmics: Array.isArray(raw.u) ? raw.u : ['title_aspirant', 'accent_blue'],
                    unlocked: Array.isArray(raw.u) ? raw.u : ['title_aspirant', 'accent_blue'],
                    claimedTrophies: Array.isArray(raw.ct) ? raw.ct : [],
                    unlockedStickers: Array.isArray(raw.stk) ? raw.stk : [],
                    equippedSticker: raw.eqs || '',
                    equipped: raw.eq || { title: 'Aspirant', themeAccent: 'accent_blue' },
                    powers: raw.pw || {},
                    todayActivity: Array.isArray(raw.act) ? raw.act : [],
                    penalties: Array.isArray(raw.pen) ? raw.pen : []
                }
            };
        }

        if (raw.v === 1 || raw.v === 3) {
            const expandedSyllabus = {};
            // Initialize from SYLLABUS_DATA if present
            if (typeof SYLLABUS_DATA !== 'undefined' && Array.isArray(SYLLABUS_DATA)) {
                SYLLABUS_DATA.forEach(topic => {
                    (topic.subtopics || []).forEach(sub => {
                        expandedSyllabus[sub.id] = { learned: false, practiced: false, mastered: false };
                    });
                });
            }

            if (raw.sp && typeof raw.sp === 'object') {
                Object.entries(raw.sp).forEach(([id, val]) => {
                    if (typeof val === 'number') {
                        expandedSyllabus[id] = {
                            learned: val >= 1,
                            practiced: val >= 2,
                            mastered: val >= 3
                        };
                    } else if (typeof val === 'object' && val !== null) {
                        expandedSyllabus[id] = {
                            learned: Boolean(val.learned),
                            practiced: Boolean(val.practiced),
                            mastered: Boolean(val.mastered)
                        };
                    }
                });
            }

            return {
                syllabusProgress: expandedSyllabus,
                mocks: Array.isArray(raw.m) ? raw.m : [],
                notes: Array.isArray(raw.n) ? raw.n : [],
                weakAlerts: raw.w && typeof raw.w === 'object' ? raw.w : {},
                srsRecords: raw.srs && typeof raw.srs === 'object' ? raw.srs : {},
                currentDay: Number(raw.cd) || 1,
                dayCounter: Number(raw.dc) || Number(raw.cd) || 1,
                examDate: raw.ed || '2026-08-15',
                examName: raw.en || 'Conquest',
                examTier: Number(raw.et) || 1,
                streak: Number(raw.st) || 1,
                lastActiveDate: raw.la || '',
                dailyRituals: raw.dr && typeof raw.dr === 'object' ? raw.dr : { drill: false, vocab: false, ca: false, computer: false },
                theme: raw.th || 'dark',
                mobileNavHand: raw.mh || 'center',
                speechEnabled: raw.spk !== false,
                toastEnabled: raw.tst !== false,
                soundEnabled: raw.snd !== undefined ? (raw.snd !== false) : true,
                focusModeActive: Boolean(raw.foc),
                rewards: raw.rew ? {
                    coins: Number(raw.rew.c) || 0,
                    points: Number(raw.rew.p) || 0,
                    stars: Number(raw.rew.s) || 0,
                    unlockedCosmics: Array.isArray(raw.rew.u) ? raw.rew.u : ['title_aspirant', 'accent_blue'],
                    unlocked: Array.isArray(raw.rew.u) ? raw.rew.u : ['title_aspirant', 'accent_blue'],
                    claimedTrophies: Array.isArray(raw.rew.ct) ? raw.rew.ct : [],
                    unlockedStickers: Array.isArray(raw.rew.stk) ? raw.rew.stk : [],
                    equippedSticker: raw.rew.eqs || '',
                    equipped: raw.rew.eq || { title: 'Aspirant', themeAccent: 'accent_blue' },
                    powers: raw.rew.pw || {},
                    todayActivity: Array.isArray(raw.rew.act) ? raw.rew.act : [],
                    penalties: Array.isArray(raw.rew.pen) ? raw.rew.pen : []
                } : {
                    coins: 0,
                    points: 0,
                    stars: 0,
                    unlockedCosmics: ['title_aspirant', 'accent_blue'],
                    unlocked: ['title_aspirant', 'accent_blue'],
                    claimedTrophies: [],
                    unlockedStickers: [],
                    equippedSticker: '',
                    equipped: { title: 'Aspirant', themeAccent: 'accent_blue' },
                    powers: {},
                    todayActivity: [],
                    penalties: []
                },
                drillHeatmap: raw.dh && typeof raw.dh === 'object' ? raw.dh : { date: new Date().toISOString().split('T')[0], records: {} },
                factMaturation: raw.fm && typeof raw.fm === 'object' ? raw.fm : {},
                speedPersonalBests: raw.spb && typeof raw.spb === 'object' ? raw.spb : { blitz: 0, suddenDeath: 0 }
            };
        }
        return raw;
    }

    // ── 4. CONFLICT-RESILIENT STATE MERGER (MONOTONIC UNION) ──────────────────
    function mergeSyncState(localState, incomingState) {
        const local = localState || {};
        const incoming = incomingState || {};

        // Deep clone baseline to prevent reference mutation
        const merged = JSON.parse(JSON.stringify(local));

        // 1. Dedicated Rewards-Only sync mode
        if (incoming._isRewardsOnlySync) {
            if (!merged.rewards) merged.rewards = {};
            const inRew = incoming.rewards || {};
            merged.rewards.coins = Math.max(Number(merged.rewards.coins) || 0, Number(inRew.coins) || 0);
            merged.rewards.points = Math.max(Number(merged.rewards.points) || 0, Number(inRew.points) || 0);
            merged.rewards.stars = Math.max(Number(merged.rewards.stars) || 0, Number(inRew.stars) || 0);
            
            merged.rewards.claimedTrophies = Array.from(new Set([
                ...(merged.rewards.claimedTrophies || []),
                ...(inRew.claimedTrophies || [])
            ]));
            merged.rewards.unlockedCosmics = Array.from(new Set([
                ...(merged.rewards.unlockedCosmics || []),
                ...(inRew.unlockedCosmics || [])
            ]));
            merged.rewards.unlockedStickers = Array.from(new Set([
                ...(merged.rewards.unlockedStickers || []),
                ...(inRew.unlockedStickers || [])
            ]));
            if (inRew.equippedSticker) merged.rewards.equippedSticker = inRew.equippedSticker;
            if (inRew.equipped) merged.rewards.equipped = inRew.equipped;
            if (inRew.powers) merged.rewards.powers = Object.assign({}, merged.rewards.powers, inRew.powers);
            
            if (typeof incoming.streak === 'number') {
                merged.streak = Math.max(Number(merged.streak) || 0, Number(incoming.streak) || 0);
            }
            return merged;
        }

        // 2. Syllabus Progress: Monotonic Union (Never demotes mastered or practiced)
        if (incoming.syllabusProgress && typeof incoming.syllabusProgress === 'object') {
            if (!merged.syllabusProgress) merged.syllabusProgress = {};
            Object.entries(incoming.syllabusProgress).forEach(([id, inFlags]) => {
                if (!inFlags) return;
                const curFlags = merged.syllabusProgress[id] || { learned: false, practiced: false, mastered: false };
                const isMastered = Boolean(curFlags.mastered || inFlags.mastered);
                const isPracticed = Boolean(curFlags.practiced || inFlags.practiced || isMastered);
                const isLearned = Boolean(curFlags.learned || inFlags.learned || isPracticed || isMastered);
                merged.syllabusProgress[id] = {
                    learned: isLearned,
                    practiced: isPracticed,
                    mastered: isMastered
                };
            });
        }

        // 3. Mock Tests: Unique merge by id or date+score+name
        if (Array.isArray(incoming.mocks)) {
            if (!Array.isArray(merged.mocks)) merged.mocks = [];
            const existingKeys = new Set(merged.mocks.map(m => m.id ? String(m.id) : `${m.name}_${m.date}_${m.score}`));
            incoming.mocks.forEach(m => {
                const key = m.id ? String(m.id) : `${m.name}_${m.date}_${m.score}`;
                if (!existingKeys.has(key)) {
                    merged.mocks.push(m);
                    existingKeys.add(key);
                }
            });
        }

        // 4. Notes: Unique merge by id or title
        if (Array.isArray(incoming.notes)) {
            if (!Array.isArray(merged.notes)) merged.notes = [];
            const existingNoteKeys = new Set(merged.notes.map(n => n.id ? String(n.id) : `${n.title}_${n.tag || ''}`));
            incoming.notes.forEach(n => {
                const key = n.id ? String(n.id) : `${n.title}_${n.tag || ''}`;
                if (!existingNoteKeys.has(key)) {
                    merged.notes.push(n);
                    existingNoteKeys.add(key);
                }
            });
        }

        // 5. Weak Alerts & SRS
        if (incoming.weakAlerts && typeof incoming.weakAlerts === 'object') {
            merged.weakAlerts = Object.assign({}, merged.weakAlerts || {}, incoming.weakAlerts);
        }
        if (incoming.srsRecords && typeof incoming.srsRecords === 'object') {
            merged.srsRecords = Object.assign({}, merged.srsRecords || {}, incoming.srsRecords);
        }

        // 6. Streak & Active Date
        const localStreak = Number(merged.streak) || 1;
        const inStreak = Number(incoming.streak) || 1;
        const localDate = merged.lastActiveDate || '';
        const inDate = incoming.lastActiveDate || '';

        if (inDate > localDate) {
            merged.streak = inStreak;
            merged.lastActiveDate = inDate;
        } else if (inDate === localDate) {
            merged.streak = Math.max(localStreak, inStreak);
        }

        // 7. Exam target & plan day
        if (incoming.currentDay) merged.currentDay = Math.max(Number(merged.currentDay) || 1, Number(incoming.currentDay));
        if (incoming.dayCounter) merged.dayCounter = Math.max(Number(merged.dayCounter) || 1, Number(incoming.dayCounter));
        if (incoming.examDate) merged.examDate = incoming.examDate;
        if (incoming.examName) merged.examName = incoming.examName;
        if (incoming.examTier) merged.examTier = incoming.examTier;

        // 8. Daily Rituals (Logical OR for today's tasks)
        if (incoming.dailyRituals && typeof incoming.dailyRituals === 'object') {
            if (!merged.dailyRituals) merged.dailyRituals = { drill: false, vocab: false, ca: false, computer: false };
            merged.dailyRituals.drill = Boolean(merged.dailyRituals.drill || incoming.dailyRituals.drill);
            merged.dailyRituals.vocab = Boolean(merged.dailyRituals.vocab || incoming.dailyRituals.vocab);
            merged.dailyRituals.ca = Boolean(merged.dailyRituals.ca || incoming.dailyRituals.ca);
            merged.dailyRituals.computer = Boolean(merged.dailyRituals.computer || incoming.dailyRituals.computer);
        }

        // 9. Rewards Union
        if (incoming.rewards && typeof incoming.rewards === 'object') {
            if (!merged.rewards) merged.rewards = {};
            const inR = incoming.rewards;
            merged.rewards.coins = Math.max(Number(merged.rewards.coins) || 0, Number(inR.coins) || 0);
            merged.rewards.points = Math.max(Number(merged.rewards.points) || 0, Number(inR.points) || 0);
            merged.rewards.stars = Math.max(Number(merged.rewards.stars) || 0, Number(inR.stars) || 0);

            merged.rewards.claimedTrophies = Array.from(new Set([
                ...(merged.rewards.claimedTrophies || []),
                ...(inR.claimedTrophies || [])
            ]));
            merged.rewards.unlockedCosmics = Array.from(new Set([
                ...(merged.rewards.unlockedCosmics || []),
                ...(inR.unlockedCosmics || [])
            ]));
            merged.rewards.unlockedStickers = Array.from(new Set([
                ...(merged.rewards.unlockedStickers || []),
                ...(inR.unlockedStickers || [])
            ]));
            if (inR.equippedSticker) merged.rewards.equippedSticker = inR.equippedSticker;
            if (inR.equipped) merged.rewards.equipped = inR.equipped;
            if (inR.powers) merged.rewards.powers = Object.assign({}, merged.rewards.powers, inR.powers);

            if (Array.isArray(inR.todayActivity)) {
                const existingActs = new Set((merged.rewards.todayActivity || []).map(a => `${a.type}_${a.dedupKey || a.title || ''}_${a.timestamp || ''}`));
                inR.todayActivity.forEach(a => {
                    const key = `${a.type}_${a.dedupKey || a.title || ''}_${a.timestamp || ''}`;
                    if (!existingActs.has(key)) {
                        if (!merged.rewards.todayActivity) merged.rewards.todayActivity = [];
                        merged.rewards.todayActivity.push(a);
                        existingActs.add(key);
                    }
                });
            }
        }

        // 10. Speed Drills Telemetry & Personal Bests
        if (incoming.speedPersonalBests && typeof incoming.speedPersonalBests === 'object') {
            if (!merged.speedPersonalBests) merged.speedPersonalBests = { blitz: 0, suddenDeath: 0 };
            merged.speedPersonalBests.blitz = Math.max(Number(merged.speedPersonalBests.blitz) || 0, Number(incoming.speedPersonalBests.blitz) || 0);
            merged.speedPersonalBests.suddenDeath = Math.max(Number(merged.speedPersonalBests.suddenDeath) || 0, Number(incoming.speedPersonalBests.suddenDeath) || 0);
        }
        if (incoming.drillHeatmap && typeof incoming.drillHeatmap === 'object') {
            if (!merged.drillHeatmap) merged.drillHeatmap = incoming.drillHeatmap;
            else if (incoming.drillHeatmap.records) {
                merged.drillHeatmap.records = Object.assign({}, merged.drillHeatmap.records || {}, incoming.drillHeatmap.records);
            }
        }
        if (incoming.factMaturation && typeof incoming.factMaturation === 'object') {
            merged.factMaturation = Object.assign({}, merged.factMaturation || {}, incoming.factMaturation);
        }

        // 11. Preferences (incoming takes precedence if defined)
        if (incoming.theme) merged.theme = incoming.theme;
        if (incoming.mobileNavHand) merged.mobileNavHand = incoming.mobileNavHand;
        if (incoming.speechEnabled !== undefined) merged.speechEnabled = incoming.speechEnabled;
        if (incoming.toastEnabled !== undefined) merged.toastEnabled = incoming.toastEnabled;
        if (incoming.soundEnabled !== undefined) merged.soundEnabled = incoming.soundEnabled;
        if (incoming.focusModeActive !== undefined) merged.focusModeActive = incoming.focusModeActive;

        return merged;
    }

    // ── 5. SEMANTIC CHANGE DETECTOR ("WHAT'S NEW") ────────────────────────────
    function detectSyncChanges(previousState, newState, incomingPayload) {
        const prev = previousState || {};
        const curr = newState || {};

        const prevPoints = Number(prev.rewards?.points) || 0;
        const currPoints = Number(curr.rewards?.points) || 0;
        const xpGain = Math.max(0, currPoints - prevPoints);

        const prevCoins = Number(prev.rewards?.coins) || 0;
        const currCoins = Number(curr.rewards?.coins) || 0;
        const coinsGain = Math.max(0, currCoins - prevCoins);

        const prevStars = Number(prev.rewards?.stars) || 0;
        const currStars = Number(curr.rewards?.stars) || 0;
        const starsGain = Math.max(0, currStars - prevStars);

        const prevStreak = Number(prev.streak) || 0;
        const currStreak = Number(curr.streak) || 0;
        const streakDiff = currStreak - prevStreak;

        function getLevelFromPoints(p) {
            if (p >= 3500) return { level: 7, title: 'Apex Conqueror' };
            if (p >= 2000) return { level: 6, title: 'Executive Marshal' };
            if (p >= 1100) return { level: 5, title: 'Vanguard Commander' };
            if (p >= 550) return { level: 4, title: 'Elite Combatant' };
            if (p >= 250) return { level: 3, title: 'Tactical Strategist' };
            if (p >= 100) return { level: 2, title: 'Disciplined Cadet' };
            return { level: 1, title: 'Novice Aspirant' };
        }
        const prevLvl = getLevelFromPoints(prevPoints);
        const currLvl = getLevelFromPoints(currPoints);
        const levelChanged = currLvl.level > prevLvl.level;

        // Syllabus changes
        const prevSyllabus = prev.syllabusProgress || {};
        const currSyllabus = curr.syllabusProgress || {};
        const newlyMasteredIds = [];
        const newlyPracticedIds = [];

        Object.keys(currSyllabus).forEach(id => {
            const c = currSyllabus[id];
            const p = prevSyllabus[id] || { learned: false, practiced: false, mastered: false };
            if (c && c.mastered && !p.mastered) {
                newlyMasteredIds.push(id);
            } else if (c && c.practiced && !p.practiced) {
                newlyPracticedIds.push(id);
            }
        });

        const topicNameMap = {};
        if (typeof SYLLABUS_DATA !== 'undefined' && Array.isArray(SYLLABUS_DATA)) {
            SYLLABUS_DATA.forEach(top => {
                (top.subtopics || []).forEach(sub => {
                    topicNameMap[sub.id] = sub.name;
                });
            });
        }
        const newlyMasteredNames = newlyMasteredIds.map(id => topicNameMap[id] || id);

        // Mocks changes
        const prevMocks = Array.isArray(prev.mocks) ? prev.mocks : [];
        const currMocks = Array.isArray(curr.mocks) ? curr.mocks : [];
        const prevMockKeys = new Set(prevMocks.map(m => m.id ? String(m.id) : `${m.name}_${m.date}_${m.score}`));
        const newMocks = currMocks.filter(m => {
            const k = m.id ? String(m.id) : `${m.name}_${m.date}_${m.score}`;
            return !prevMockKeys.has(k);
        });

        // Trophies changes
        const prevTrophies = new Set(prev.rewards?.claimedTrophies || []);
        const currTrophies = curr.rewards?.claimedTrophies || [];
        const newTrophyIds = currTrophies.filter(id => !prevTrophies.has(id));

        const trophyTitles = {
            trophy_bronze_1: 'First Step',
            trophy_bronze_2: 'Momentum',
            trophy_bronze_3: 'Breakthrough',
            trophy_silver_1: 'Routine Builder',
            trophy_silver_2: 'Subject Explorer',
            trophy_silver_3: 'Clean Sweep',
            trophy_gold_1: 'Methodical Mind',
            trophy_gold_2: 'Subject Adapt',
            trophy_gold_3: 'Exam Ready'
        };
        const newTrophies = newTrophyIds.map(id => ({ id, title: trophyTitles[id] || id.replace(/_/g, ' ').replace('trophy ', '') }));

        // Stickers changes
        const prevStickers = new Set(prev.rewards?.unlockedStickers || []);
        const currStickers = curr.rewards?.unlockedStickers || [];
        const newStickers = currStickers.filter(s => !prevStickers.has(s));

        const isIdentical = xpGain === 0 && coinsGain === 0 && starsGain === 0 &&
                            streakDiff === 0 && newlyMasteredIds.length === 0 &&
                            newMocks.length === 0 && newTrophyIds.length === 0 &&
                            newStickers.length === 0 && !levelChanged;

        return {
            isIdentical,
            xpGain,
            coinsGain,
            starsGain,
            streakDiff,
            oldStreak: prevStreak,
            newStreak: currStreak,
            oldLevel: prevLvl.level,
            newLevel: currLvl.level,
            oldRankTitle: prevLvl.title,
            newRankTitle: currLvl.title,
            levelChanged,
            newlyMasteredCount: newlyMasteredIds.length,
            newlyMasteredNames,
            newlyPracticedCount: newlyPracticedIds.length,
            newMocksCount: newMocks.length,
            newMocksSummaries: newMocks.map(m => `${m.name || 'Mock'} (${m.score || 0} pts)`),
            newTrophies,
            newStickers
        };
    }

    // ── 6. PROGRESS REPORT & SHAREABLE FORMATTER ───────────────────────────────
    function generateProgressReport(state, diff) {
        const s = state || {};
        const d = diff || {};

        let masteredCount = 0;
        let activeCount = 0;
        if (s.syllabusProgress) {
            Object.values(s.syllabusProgress).forEach(f => {
                if (f && f.mastered) masteredCount++;
                if (f && (f.learned || f.practiced || f.mastered)) activeCount++;
            });
        }

        const rituals = s.dailyRituals || { drill: false, vocab: false, ca: false, computer: false };
        const ritualsCompleted = [rituals.drill, rituals.vocab, rituals.ca, rituals.computer].filter(Boolean).length;
        const ritualNames = [];
        if (rituals.drill) ritualNames.push('Speed Drill');
        if (rituals.vocab) ritualNames.push('Vocabulary');
        if (rituals.ca) ritualNames.push('Current Affairs');
        if (rituals.computer) ritualNames.push('Computer / Typist');
        const ritualsLabel = ritualsCompleted === 4 
            ? 'All 4 daily targets completed (Speed, Vocab, CA, Computer).' 
            : (ritualsCompleted > 0 ? `Completed: ${ritualNames.join(', ')}.` : 'No daily routine logged yet today.');

        const streak = Number(s.streak) || 1;
        const streakLabel = streak > 1 
            ? `${streak} days unbroken study habit.` 
            : 'Starting fresh on daily streak routine.';

        function getLevelFromPoints(p) {
            if (p >= 3500) return { level: 7, title: 'Apex Conqueror' };
            if (p >= 2000) return { level: 6, title: 'Executive Marshal' };
            if (p >= 1100) return { level: 5, title: 'Vanguard Commander' };
            if (p >= 550) return { level: 4, title: 'Elite Combatant' };
            if (p >= 250) return { level: 3, title: 'Tactical Strategist' };
            if (p >= 100) return { level: 2, title: 'Disciplined Cadet' };
            return { level: 1, title: 'Novice Aspirant' };
        }
        const currentPoints = Number(s.rewards?.points) || 0;
        const rankInfo = getLevelFromPoints(currentPoints);

        const examName = s.examName || 'SSC CGL Target 2026';
        const examTier = s.examTier || 1;
        const currentDay = s.currentDay || s.dayCounter || 1;
        const mocksCount = Array.isArray(s.mocks) ? s.mocks.length : 0;
        const coins = Number(s.rewards?.coins) || 0;
        const stars = Number(s.rewards?.stars) || 0;
        const claimedTrophiesCount = (s.rewards?.claimedTrophies || []).length;

        // Generate Shareable Text (clean formatting for WhatsApp / SMS / Email to parents or mentors)
        const todayDateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        let changesBulletText = '';
        if (d.isIdentical) {
            changesBulletText = '• All progress fully synchronized across devices.';
        } else {
            const bullets = [];
            if (d.xpGain > 0) bullets.push(`• +${d.xpGain} XP earned`);
            if (d.coinsGain > 0) bullets.push(`• +${d.coinsGain} Coins added`);
            if (d.starsGain > 0) bullets.push(`• +${d.starsGain} Stars gained`);
            if (d.levelChanged) bullets.push(`• Promoted to Level ${d.newLevel} (${d.newRankTitle})`);
            if (d.streakDiff > 0) bullets.push(`• 🔥 Streak increased from ${d.oldStreak} to ${d.newStreak} days`);
            if (d.newlyMasteredCount > 0) bullets.push(`• 📚 +${d.newlyMasteredCount} Topics Mastered (${d.newlyMasteredNames.slice(0, 2).join(', ')}${d.newlyMasteredNames.length > 2 ? '...' : ''})`);
            if (d.newMocksCount > 0) bullets.push(`• 📝 +${d.newMocksCount} Mock Test(s) Added`);
            if (d.newTrophies && d.newTrophies.length > 0) bullets.push(`• 🏆 New Trophy: ${d.newTrophies.map(t => t.title).join(', ')}`);
            changesBulletText = bullets.join('\n');
        }

        const shareableText = 
`📊 CGL CONQUEST — PROGRESS REPORT
Date: ${todayDateStr}
Target: ${examName} (Tier ${examTier}) • Day ${currentDay} of 40

📈 EFFORT & CONSISTENCY:
• Study Streak: 🔥 ${streak} Days Active
• Rank: Level ${rankInfo.level} (${rankInfo.title}) • ${currentPoints} XP
• Currency: 🪙 ${coins} Coins • ⭐ ${stars} Stars

🎯 STUDY PROGRESS:
• Daily Routine: ${ritualsCompleted}/4 Targets Completed (${ritualsLabel})
• Syllabus: ${masteredCount} Topics Mastered (${activeCount} Active)
• Mocks: ${mocksCount} Tests Logged • 🏆 ${claimedTrophiesCount} Trophies

✨ WHAT CHANGED IN THIS SYNC:
${changesBulletText}

Status: Verified on-device via Conquest P2P Sync.`;

        return {
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            dateStr: todayDateStr,
            todayRitualsCompleted: ritualsCompleted,
            ritualsLabel,
            streak,
            streakLabel,
            masteredTopicsCount: masteredCount,
            activeTopicsCount: activeCount,
            examName,
            examTier,
            currentDay,
            mocksCount,
            coins,
            stars,
            currentPoints,
            rankLevel: rankInfo.level,
            rankTitle: rankInfo.title,
            claimedTrophiesCount,
            shareableText
        };
    }

    // ── 7. QR SYNC MODAL UI COMPONENT ─────────────────────────────────────────
    class QrSyncModal {
        constructor(options = {}) {
            this.getState = options.getState || (() => ({}));
            this.onApplyState = options.onApplyState || (() => {});
            this.onToast = options.onToast || ((msg) => alert(msg));
            this.isOpen = false;
            this.isFullscreen = false;
            this.activeTab = 'scan';
            this.videoStream = null;
            this.animFrameId = null;
            this.currentPayload = '';
            this.scannedState = null;
            this.latestReport = null;
            this.latestDiff = null;
            this.isManualCodeOpen = false;

            this._ensureDependencies();
            this._buildDOM();
        }

        _ensureDependencies() {
            // Local fallback vendor script loader for offline or file:// protocol
            if (typeof window.qrcode === 'undefined' && !document.getElementById('script-qrcode-gen-local')) {
                const s = document.createElement('script');
                s.id = 'script-qrcode-gen-local';
                s.src = 'js/vendor/qrcode.min.js';
                s.onerror = () => {
                    // CDN fallback if local path isn't reached
                    const cdn = document.createElement('script');
                    cdn.id = 'script-qrcode-gen-cdn';
                    cdn.src = 'https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js';
                    document.head.appendChild(cdn);
                };
                document.head.appendChild(s);
            }
            if (typeof window.jsQR === 'undefined' && !document.getElementById('script-jsqr-local')) {
                const s = document.createElement('script');
                s.id = 'script-jsqr-local';
                s.src = 'js/vendor/jsqr.min.js';
                s.onerror = () => {
                    const cdn = document.createElement('script');
                    cdn.id = 'script-jsqr-cdn';
                    cdn.src = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js';
                    document.head.appendChild(cdn);
                };
                document.head.appendChild(s);
            }
        }

        async _compress(str) {
            if (!str || typeof str !== 'string') return '';
            
            const toB64 = (s) => {
                if (typeof btoa === 'function') {
                    try { return btoa(unescape(encodeURIComponent(s))); } catch (e) { return btoa(s); }
                }
                if (typeof Buffer !== 'undefined') {
                    return Buffer.from(s, 'utf8').toString('base64');
                }
                return '';
            };

            // Fast path: for small payloads (<= 400 chars), Base64 is tiny and produces instant QR
            if (str.length <= 400) {
                return 'B64:' + toB64(str);
            }

            // Gzip compression via modern Web Streams API (Chrome, Edge, Safari, Firefox)
            if (typeof window !== 'undefined' && 'CompressionStream' in window) {
                try {
                    const stream = new Blob([str]).stream().pipeThrough(new CompressionStream('gzip'));
                    const response = new Response(stream);
                    const blob = await response.blob();
                    const buffer = await blob.arrayBuffer();
                    const bytes = new Uint8Array(buffer);
                    let binary = '';
                    for (let i = 0; i < bytes.byteLength; i++) {
                        binary += String.fromCharCode(bytes[i]);
                    }
                    const gzPayload = 'GZ:' + (typeof btoa === 'function' ? btoa(binary) : Buffer.from(binary, 'binary').toString('base64'));
                    if (gzPayload.length > 5) {
                        return gzPayload;
                    }
                } catch (e) {
                    console.warn('CompressionStream failed, using Base64 fallback', e);
                }
            }

            // Node.js fallback for test runner
            if (typeof require !== 'undefined') {
                try {
                    const zlib = require('zlib');
                    const gzipped = zlib.gzipSync(Buffer.from(str, 'utf8'));
                    return 'GZ:' + gzipped.toString('base64');
                } catch (e) {}
            }

            return 'B64:' + toB64(str);
        }

        async _decompress(payload) {
            if (!payload || typeof payload !== 'string') return null;
            const trimmed = payload.trim();
            if (trimmed.startsWith('GZ:')) {
                if (typeof window !== 'undefined' && 'DecompressionStream' in window) {
                    try {
                        const base64 = trimmed.slice(3);
                        const binary = atob(base64);
                        const bytes = new Uint8Array(binary.length);
                        for (let i = 0; i < binary.length; i++) {
                            bytes[i] = binary.charCodeAt(i);
                        }
                        const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
                        const response = new Response(stream);
                        return await response.text();
                    } catch (e) {
                        console.warn('DecompressionStream error:', e);
                    }
                }
                if (typeof require !== 'undefined') {
                    try {
                        const zlib = require('zlib');
                        const buffer = Buffer.from(trimmed.slice(3), 'base64');
                        return zlib.gunzipSync(buffer).toString('utf8');
                    } catch (e) {}
                }
                throw new Error('Could not decompress gzip sync data');
            } else if (trimmed.startsWith('B64:')) {
                const b64 = trimmed.slice(4);
                if (typeof atob === 'function') {
                    try {
                        return decodeURIComponent(escape(atob(b64)));
                    } catch (e) {
                        return atob(b64);
                    }
                }
                if (typeof Buffer !== 'undefined') {
                    return Buffer.from(b64, 'base64').toString('utf8');
                }
                return b64;
            } else if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
                return trimmed;
            }
            try {
                return decodeURIComponent(escape(atob(trimmed)));
            } catch (e) {
                return trimmed;
            }
        }

        _buildDOM() {
            this.overlay = document.createElement('div');
            this.overlay.id = 'modal-qr-sync';
            this.overlay.className = 'fixed inset-0 z-[999999] bg-black/80 backdrop-blur-xl flex items-center justify-center p-3 sm:p-4 opacity-0 pointer-events-none transition-all duration-200 hidden select-none';

            this.card = document.createElement('div');
            this.card.className = 'bg-slate-900 text-gray-100 border border-blue-500/30 rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto scrollbar-none transform scale-95 transition-all duration-300';

            this.card.innerHTML = `
                <!-- Modal Top Header -->
                <div id="qr-modal-header" class="flex items-center justify-between border-b border-white/10 pb-3 transition-all duration-200">
                    <div class="flex items-center gap-2.5">
                        <div class="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400 flex items-center justify-center text-xs shadow-inner">
                            <i class="fa-solid fa-qrcode"></i>
                        </div>
                        <div>
                            <h3 class="font-heading font-black text-sm text-white uppercase tracking-wider">Conquest Sync</h3>
                            <p class="text-[10px] text-gray-400">P2P Encrypted Full System Sync</p>
                        </div>
                    </div>

                    <!-- Top Action Controls -->
                    <div class="flex items-center gap-1.5">
                        <button type="button" id="btn-qr-fullscreen" class="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 flex items-center justify-center text-xs transition cursor-pointer" title="Toggle Fullscreen (F)">
                            <i class="fa-solid fa-expand"></i>
                        </button>
                        <button type="button" id="btn-qr-close" class="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 flex items-center justify-center text-xs transition cursor-pointer" title="Close (Esc)">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                </div>

                <!-- Tab Switcher Pill (Always accent blue bg-blue-600) -->
                <div id="qr-tab-switcher-wrap" class="flex items-center gap-1 p-1 bg-slate-950/80 border border-white/10 rounded-2xl shadow-inner max-w-xs mx-auto w-full transition-all duration-200">
                    <button type="button" id="tab-qr-scan" class="flex-1 py-1.5 px-3 rounded-xl text-xs font-black transition duration-200 text-white bg-blue-600 shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5 cursor-pointer">
                        <i class="fa-solid fa-camera text-xs"></i>
                        <span>Scan / Paste</span>
                    </button>
                    <button type="button" id="tab-qr-show" class="flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition duration-200 text-gray-400 hover:text-white bg-transparent flex items-center justify-center gap-1.5 cursor-pointer">
                        <i class="fa-solid fa-qrcode text-xs"></i>
                        <span>Show My QR</span>
                    </button>
                </div>

                <!-- Main Center Stage Viewport (Occupies 70-80% in Fullscreen) -->
                <div id="qr-main-viewport" class="flex-1 flex flex-col items-center justify-center min-h-0 w-full transition-all duration-300">
                    <!-- TAB 1: SCAN QR PANEL -->
                    <div id="panel-qr-scan" class="space-y-3 w-full flex flex-col items-center justify-center">
                        <div class="relative bg-black rounded-2xl overflow-hidden aspect-square max-w-[260px] w-full mx-auto border border-blue-500/30 shadow-2xl flex items-center justify-center transition-all duration-300">
                            <video id="qr-scanner-video" playsinline class="w-full h-full object-cover"></video>
                            <div class="absolute inset-0 pointer-events-none flex items-center justify-center">
                                <div class="w-48 h-48 sm:w-56 sm:h-56 border-2 border-dashed border-blue-400/80 rounded-3xl shadow-[0_0_35px_rgba(37,99,235,0.4)] animate-pulse"></div>
                            </div>
                            <div id="qr-camera-prompt" class="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center gap-2 p-4 text-center">
                                <i class="fa-solid fa-video text-2xl text-blue-400"></i>
                                <span id="qr-camera-status" class="text-xs font-bold text-gray-300">Point camera at QR code</span>
                                <button type="button" id="btn-start-camera" class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold shadow-lg shadow-blue-500/25 transition cursor-pointer">Start Camera</button>
                            </div>
                        </div>

                        <div class="w-full max-w-[280px] flex items-center justify-between gap-2">
                            <label class="flex-1 px-3 py-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-white/10 hover:border-blue-500/30 text-xs font-bold text-gray-300 hover:text-white shadow-inner transition flex items-center justify-center gap-1.5 cursor-pointer text-center">
                                <i class="fa-solid fa-file-image text-blue-400"></i>
                                <span>Upload QR Image</span>
                                <input type="file" id="input-qr-file" accept="image/*" class="hidden">
                            </label>
                        </div>

                        <!-- Direct Code Paste Fallback -->
                        <div class="w-full max-w-[320px] pt-2 border-t border-white/10 space-y-1.5">
                            <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider block text-center">Or Paste Sync Code Manually</label>
                            <div class="flex gap-2">
                                <input type="text" id="input-manual-code" placeholder="Paste GZ: or B64: code here..." class="flex-1 bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 font-mono">
                                <button type="button" id="btn-apply-manual-code" class="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold rounded-xl transition shadow cursor-pointer">
                                    Load
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- TAB 2: SHOW QR PANEL (QR code is primary and central) -->
                    <div id="panel-qr-show" class="hidden space-y-3 w-full flex flex-col items-center justify-center">
                        <div class="bg-white p-4 sm:p-5 rounded-2xl max-w-[260px] w-full mx-auto shadow-2xl flex items-center justify-center aspect-square transition-all duration-300" id="qr-code-canvas-container">
                            <span class="text-xs text-gray-500 font-mono">Generating QR...</span>
                        </div>
                        <p id="qr-sync-mode-desc" class="text-center text-[10.5px] text-gray-300 font-medium max-w-xs">Scan with any mobile device to replicate entire progress, syllabus & rewards instantly.</p>
                        
                        <!-- Floating Action Toolbar Dock (Responsive Pill) -->
                        <div id="qr-actions-toolbar" class="grid grid-cols-2 sm:flex sm:flex-wrap sm:items-center sm:justify-center gap-2 max-w-full transition-all duration-300">
                            <button type="button" id="btn-copy-sync-code" class="px-3 py-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-white/10 hover:border-blue-500/30 text-xs font-bold text-gray-300 hover:text-white shadow-inner transition flex items-center justify-center gap-1.5 cursor-pointer" title="Copy raw sync code string to clipboard">
                                <i class="fa-solid fa-copy text-blue-400"></i>
                                <span>Copy Code</span>
                            </button>
                            <button type="button" id="btn-copy-qr-image" class="px-3 py-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-white/10 hover:border-blue-500/30 text-xs font-bold text-gray-300 hover:text-white shadow-inner transition flex items-center justify-center gap-1.5 cursor-pointer" title="Copy clean QR image to clipboard">
                                <i class="fa-solid fa-image text-cyan-300"></i>
                                <span>Copy Image</span>
                            </button>
                            <button type="button" id="btn-download-qr" class="px-3 py-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-white/10 hover:border-blue-500/30 text-xs font-bold text-gray-300 hover:text-white shadow-inner transition flex items-center justify-center gap-1.5 cursor-pointer" title="Download QR as PNG image file">
                                <i class="fa-solid fa-download text-emerald-400"></i>
                                <span>Save PNG</span>
                            </button>
                            <button type="button" id="btn-share-qr" class="px-3 py-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-white/10 hover:border-blue-500/30 text-xs font-bold text-gray-300 hover:text-white shadow-inner transition flex items-center justify-center gap-1.5 cursor-pointer" title="Share via System Share API">
                                <i class="fa-solid fa-share-nodes text-indigo-400"></i>
                                <span>Share</span>
                            </button>
                            <button type="button" id="btn-refresh-qr" class="col-span-2 sm:col-span-1 px-3 py-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-white/10 hover:border-blue-500/30 text-xs font-bold text-gray-300 hover:text-white shadow-inner transition flex items-center justify-center gap-1.5 cursor-pointer" title="Refresh QR code with latest state">
                                <i class="fa-solid fa-arrows-rotate text-amber-400"></i>
                                <span>Refresh</span>
                            </button>
                            <button type="button" id="btn-qr-exit-dock" class="hidden px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-bold text-rose-300 hover:text-rose-200 transition items-center justify-center gap-1.5 cursor-pointer" title="Exit QR Workspace">
                                <i class="fa-solid fa-door-open text-rose-400"></i>
                                <span>Exit</span>
                            </button>
                        </div>

                        <!-- Secondary Actions: Progress Report Preview & Manual Sync Code -->
                        <div class="w-full max-w-xs pt-1 flex flex-col items-center gap-1">
                            <button type="button" id="btn-view-current-report" class="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1.5 py-1 px-2.5 rounded-lg hover:bg-white/5 transition cursor-pointer" title="Preview parent progress snapshot and summary">
                                <i class="fa-solid fa-file-invoice text-[10px]"></i>
                                <span>Preview Progress Report Card</span>
                            </button>
                            <button type="button" id="btn-toggle-raw-code" class="text-[11px] text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1.5 py-1 px-2.5 rounded-lg hover:bg-white/5 transition cursor-pointer" title="View or select raw sync code string">
                                <i class="fa-solid fa-code text-[10px]"></i>
                                <span>View Raw Sync Code</span>
                                <i class="fa-solid fa-chevron-down text-[9px] transition-transform duration-200" id="icon-raw-code-chevron"></i>
                            </button>
                            <div id="drawer-raw-code" class="hidden w-full space-y-1.5 pt-1">
                                <div class="flex gap-1.5">
                                    <textarea readonly id="ta-raw-code" class="flex-1 h-14 bg-slate-950 border border-white/10 rounded-xl p-2 text-[9px] font-mono text-gray-400 resize-none select-all focus:outline-none scrollbar-none"></textarea>
                                    <button type="button" id="btn-drawer-copy-code" class="px-3 py-1 bg-slate-950/90 hover:bg-slate-900 border border-white/10 hover:border-blue-500/30 text-xs font-bold text-gray-300 hover:text-white rounded-xl transition flex flex-col items-center justify-center gap-1 shrink-0 cursor-pointer shadow-inner" title="Copy raw sync code string">
                                        <i class="fa-solid fa-copy text-blue-400"></i>
                                        <span class="text-[9px]">Copy</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- PANEL 3: CONFIRMATION SUMMARY CARD -->
                <div id="panel-qr-confirm" class="hidden bg-slate-950/90 border border-emerald-500/30 rounded-2xl p-4 space-y-3">
                    <div class="flex items-center gap-2 text-emerald-400 text-xs font-black uppercase">
                        <i class="fa-solid fa-circle-check"></i>
                        <span>Sync Payload Verified</span>
                    </div>
                    <div id="qr-confirm-stats" class="grid grid-cols-2 gap-2 text-xs font-mono"></div>
                    <p class="text-[10px] text-amber-300 font-medium">⚠️ Merging will synchronize all data with the incoming payload.</p>
                    <div class="flex gap-2 pt-1">
                        <button type="button" id="btn-qr-apply" class="flex-[2] py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase shadow-lg shadow-emerald-500/20 transition cursor-pointer">
                            Confirm & Sync
                        </button>
                        <button type="button" id="btn-qr-reject" class="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 text-xs font-bold uppercase transition cursor-pointer">
                            Cancel
                        </button>
                    </div>
                </div>

                <!-- PANEL 4: SYNC COMPLETE & PROGRESS REPORT CARD -->
                <div id="panel-qr-report" class="hidden space-y-3 w-full">
                    <div class="flex items-center justify-between border-b border-white/10 pb-2">
                        <div class="flex items-center gap-2">
                            <span class="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-xs">
                                <i class="fa-solid fa-check"></i>
                            </span>
                            <div>
                                <h4 class="text-xs font-black uppercase tracking-wider text-white">Sync Complete</h4>
                                <p class="text-[9.5px] text-gray-400">Progress updated just now</p>
                            </div>
                        </div>
                        <span class="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">Active Sync</span>
                    </div>

                    <!-- Compact Stat Pills Strip -->
                    <div id="report-stat-strip" class="grid grid-cols-4 gap-1.5 text-center"></div>

                    <!-- Sub-view Pill Toggle: What's New | Parent View -->
                    <div class="flex items-center gap-1 p-0.5 bg-slate-950/80 border border-white/10 rounded-xl max-w-xs mx-auto w-full">
                        <button type="button" id="tab-report-diff" class="flex-1 py-1 px-2 rounded-lg text-xs font-black transition duration-200 text-white bg-blue-600 shadow-sm cursor-pointer">
                            <span>What's New</span>
                        </button>
                        <button type="button" id="tab-report-parent" class="flex-1 py-1 px-2 rounded-lg text-xs font-bold transition duration-200 text-gray-400 hover:text-white bg-transparent cursor-pointer">
                            <span>Parent View</span>
                        </button>
                    </div>

                    <!-- View 1: What's New (Semantic Diff) -->
                    <div id="view-report-diff" class="space-y-1.5 max-h-48 overflow-y-auto pr-1 custom-scrollbar text-xs"></div>

                    <!-- View 2: Parent / Guardian View (Concise Progress Snapshot) -->
                    <div id="view-report-parent" class="hidden space-y-1.5 max-h-48 overflow-y-auto pr-1 custom-scrollbar text-xs"></div>

                    <!-- Report Actions -->
                    <div class="flex items-center gap-2 pt-2 border-t border-white/10">
                        <button type="button" id="btn-copy-progress-report" class="flex-1 py-2 px-3 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-white/10 hover:border-blue-500/30 text-xs font-bold text-gray-300 hover:text-white shadow-inner transition flex items-center justify-center gap-1.5 cursor-pointer" title="Copy clean text summary to share with parents or mentors">
                            <i class="fa-solid fa-copy text-blue-400"></i>
                            <span>Copy Summary</span>
                        </button>
                        <button type="button" id="btn-close-report" class="flex-1 py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-1.5 cursor-pointer">
                            <i class="fa-solid fa-check"></i>
                            <span>Done</span>
                        </button>
                    </div>
                </div>
            `;

            this.overlay.appendChild(this.card);
            document.body.appendChild(this.overlay);

            this._bindEvents();
        }

        _bindEvents() {
            this.card.querySelector('#btn-qr-close').onclick = () => this.close();
            const btnFs = this.card.querySelector('#btn-qr-fullscreen');
            if (btnFs) {
                btnFs.onclick = () => this.toggleFullscreen();
            }

            this.overlay.onclick = (e) => {
                if (e.target === this.overlay) this.close();
            };

            // Keyboard navigation: Escape exits fullscreen then closes, F toggles fullscreen, X closes
            this._keyHandler = (e) => {
                if (!this.isOpen) return;
                const tag = document.activeElement ? document.activeElement.tagName : '';
                const isInput = tag === 'INPUT' || tag === 'TEXTAREA' || (document.activeElement && document.activeElement.isContentEditable);

                if (e.key === 'Escape') {
                    if (this.isFullscreen) {
                        this.toggleFullscreen(false);
                    } else {
                        this.close();
                    }
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                }

                if (!isInput && (e.key === 'f' || e.key === 'F')) {
                    this.toggleFullscreen();
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                }

                if (!isInput && (e.key === 'x' || e.key === 'X')) {
                    this.close();
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                }
            };
            window.addEventListener('keydown', this._keyHandler, true);

            document.addEventListener('fullscreenchange', () => {
                if (!document.fullscreenElement && this.isFullscreen) {
                    this.toggleFullscreen(false);
                }
            });

            const tabScan = this.card.querySelector('#tab-qr-scan');
            const tabShow = this.card.querySelector('#tab-qr-show');

            tabScan.onclick = () => this.setTab('scan');
            tabShow.onclick = () => this.setTab('show');

            this.card.querySelector('#btn-start-camera').onclick = () => this._startCamera();

            // Image file upload scanner
            const fileInput = this.card.querySelector('#input-qr-file');
            fileInput.onchange = (e) => this._handleImageUpload(e);

            // Manual paste code
            this.card.querySelector('#btn-apply-manual-code').onclick = () => {
                const code = this.card.querySelector('#input-manual-code').value.trim();
                if (code) {
                    this._onCodeDetected(code);
                } else {
                    this.onToast('Please paste a sync code first', 'warning');
                }
            };

            // Preview Progress Report Card from Show QR screen
            const btnPreviewReport = this.card.querySelector('#btn-view-current-report');
            if (btnPreviewReport) {
                btnPreviewReport.onclick = () => {
                    const currentState = this.getState();
                    const diff = detectSyncChanges(currentState, currentState, currentState);
                    const report = generateProgressReport(currentState, diff);
                    this.latestReport = report;
                    this.latestDiff = diff;
                    this._showProgressReport(report, diff);
                };
            }

            // Secondary manual code toggle
            const btnToggleRaw = this.card.querySelector('#btn-toggle-raw-code');
            const drawerRaw = this.card.querySelector('#drawer-raw-code');
            const iconChevron = this.card.querySelector('#icon-raw-code-chevron');
            if (btnToggleRaw && drawerRaw) {
                btnToggleRaw.onclick = () => {
                    this.isManualCodeOpen = !this.isManualCodeOpen;
                    if (this.isManualCodeOpen) {
                        drawerRaw.classList.remove('hidden');
                        if (iconChevron) iconChevron.classList.add('rotate-180');
                    } else {
                        drawerRaw.classList.add('hidden');
                        if (iconChevron) iconChevron.classList.remove('rotate-180');
                    }
                };
            }

            // Copy raw sync code (Primary toolbar & drawer)
            const copyCodeHandler = async () => {
                if (!this.currentPayload) {
                    this.onToast('Generating sync code, please wait...', 'info');
                    await this._renderQR();
                }
                if (this.currentPayload) {
                    if (typeof window.playSound === 'function') window.playSound('success.soft');
                    try {
                        await navigator.clipboard.writeText(this.currentPayload);
                        this.onToast('Sync code copied to clipboard!', 'success');
                    } catch (e) {
                        const ta = document.createElement('textarea');
                        ta.value = this.currentPayload;
                        document.body.appendChild(ta);
                        ta.select();
                        document.execCommand('copy');
                        document.body.removeChild(ta);
                        this.onToast('Sync code copied to clipboard!', 'success');
                    }
                } else {
                    this.onToast('Could not generate sync code', 'error');
                }
            };

            const btnCopySync = this.card.querySelector('#btn-copy-sync-code');
            if (btnCopySync) btnCopySync.onclick = copyCodeHandler;
            const btnDrawerCopy = this.card.querySelector('#btn-drawer-copy-code');
            if (btnDrawerCopy) btnDrawerCopy.onclick = copyCodeHandler;

            // Copy QR image to clipboard
            const btnCopyQrImage = this.card.querySelector('#btn-copy-qr-image');
            if (btnCopyQrImage) {
                btnCopyQrImage.onclick = () => {
                    if (typeof window.playSound === 'function') window.playSound('success.soft');
                    this._copyQrImageToClipboard();
                };
            }

            // Download QR as PNG
            const btnDownloadQr = this.card.querySelector('#btn-download-qr');
            if (btnDownloadQr) {
                btnDownloadQr.onclick = () => {
                    if (typeof window.playSound === 'function') window.playSound('reward');
                    this._downloadQrImage();
                };
            }

            // Share QR code
            const btnShareQr = this.card.querySelector('#btn-share-qr');
            if (btnShareQr) {
                btnShareQr.onclick = () => {
                    if (typeof window.playSound === 'function') window.playSound('checkbox');
                    this._shareQr();
                };
            }

            // Refresh QR payload
            const btnRefreshQr = this.card.querySelector('#btn-refresh-qr');
            if (btnRefreshQr) {
                btnRefreshQr.onclick = () => {
                    if (typeof window.playSound === 'function') window.playSound('checkbox');
                    this._refreshQr();
                };
            }

            // Confirm Sync -> Apply state -> Generate diff -> Show Progress Report
            this.card.querySelector('#btn-qr-apply').onclick = () => {
                if (this.scannedState) {
                    const previousState = JSON.parse(JSON.stringify(this.getState()));
                    const mergedState = mergeSyncState(previousState, this.scannedState);

                    if (typeof window.playSound === 'function') window.playSound('success.strong');
                    if (typeof window.triggerConfetti === 'function') window.triggerConfetti();

                    // Apply merged state to global application
                    this.onApplyState(mergedState);
                    this.onToast('Device synchronization complete!', 'success');

                    // Compute semantic diff and progress report
                    const diff = detectSyncChanges(previousState, mergedState, this.scannedState);
                    const report = generateProgressReport(mergedState, diff);
                    this.latestReport = report;
                    this.latestDiff = diff;

                    this._showProgressReport(report, diff);
                }
            };

            // Reject Sync
            this.card.querySelector('#btn-qr-reject').onclick = () => {
                this.scannedState = null;
                this.card.querySelector('#panel-qr-confirm').classList.add('hidden');
                this.card.querySelector('#panel-qr-scan').classList.remove('hidden');
                this._startCamera();
            };

            // Report Sub-Tab toggles
            const tabDiff = this.card.querySelector('#tab-report-diff');
            const tabParent = this.card.querySelector('#tab-report-parent');
            const viewDiff = this.card.querySelector('#view-report-diff');
            const viewParent = this.card.querySelector('#view-report-parent');

            if (tabDiff && tabParent && viewDiff && viewParent) {
                const activeSubClass = 'flex-1 py-1 px-2 rounded-lg text-xs font-black transition duration-200 text-white bg-blue-600 shadow-sm cursor-pointer';
                const inactiveSubClass = 'flex-1 py-1 px-2 rounded-lg text-xs font-bold transition duration-200 text-gray-400 hover:text-white bg-transparent cursor-pointer';

                tabDiff.onclick = () => {
                    tabDiff.className = activeSubClass;
                    tabParent.className = inactiveSubClass;
                    viewDiff.classList.remove('hidden');
                    viewParent.classList.add('hidden');
                };

                tabParent.onclick = () => {
                    tabParent.className = activeSubClass;
                    tabDiff.className = inactiveSubClass;
                    viewParent.classList.remove('hidden');
                    viewDiff.classList.add('hidden');
                };
            }

            // Copy Progress Summary text
            const btnCopyReport = this.card.querySelector('#btn-copy-progress-report');
            if (btnCopyReport) {
                btnCopyReport.onclick = async () => {
                    if (this.latestReport && this.latestReport.shareableText) {
                        if (typeof window.playSound === 'function') window.playSound('success.soft');
                        try {
                            await navigator.clipboard.writeText(this.latestReport.shareableText);
                            this.onToast('Progress summary copied! Ready to share.', 'success');
                        } catch (e) {
                            const ta = document.createElement('textarea');
                            ta.value = this.latestReport.shareableText;
                            document.body.appendChild(ta);
                            ta.select();
                            document.execCommand('copy');
                            document.body.removeChild(ta);
                            this.onToast('Progress summary copied! Ready to share.', 'success');
                        }
                    }
                };
            }

            // Close report done
            const btnCloseReport = this.card.querySelector('#btn-close-report');
            if (btnCloseReport) {
                btnCloseReport.onclick = () => this.close();
            }

            // Exit dock button in fullscreen
            const exitDockBtn = this.card.querySelector('#btn-qr-exit-dock');
            if (exitDockBtn) {
                exitDockBtn.onclick = () => {
                    if (typeof window.playSound === 'function') window.playSound('checkbox');
                    this.close();
                };
            }
        }

        toggleFullscreen(force) {
            this.isFullscreen = typeof force === 'boolean' ? force : !this.isFullscreen;
            const fsBtn = this.card.querySelector('#btn-qr-fullscreen');
            const qrContainer = this.card.querySelector('#qr-code-canvas-container');
            const scanContainer = this.card.querySelector('#panel-qr-scan > div:first-child');
            const exitDockBtn = this.card.querySelector('#btn-qr-exit-dock');
            const actionsToolbar = this.card.querySelector('#qr-actions-toolbar');

            if (this.isFullscreen) {
                this.overlay.classList.add('!p-0');
                this.card.classList.add('!max-w-none', '!w-screen', '!h-screen', '!max-h-none', '!rounded-none', '!border-0', 'sm:!p-6', '!p-4', 'flex', 'flex-col', 'justify-between');
                if (fsBtn) {
                    fsBtn.innerHTML = '<i class="fa-solid fa-compress"></i>';
                    fsBtn.title = 'Exit Fullscreen (F / Esc)';
                }
                if (qrContainer) {
                    qrContainer.classList.remove('max-w-[260px]');
                    qrContainer.classList.add('!max-w-none', '!w-[min(68vh,82vw,520px)]', '!h-[min(68vh,82vw,520px)]', '!p-4', 'sm:!p-6', 'shadow-[0_0_60px_rgba(37,99,235,0.3)]');
                }
                if (scanContainer) {
                    scanContainer.classList.remove('max-w-[260px]');
                    scanContainer.classList.add('!max-w-none', '!w-[min(66vh,82vw,480px)]', '!h-[min(66vh,82vw,480px)]', 'shadow-[0_0_60px_rgba(37,99,235,0.3)]');
                }
                if (exitDockBtn) {
                    exitDockBtn.classList.remove('hidden');
                    exitDockBtn.classList.add('flex');
                }
                if (actionsToolbar) {
                    actionsToolbar.classList.add('bg-slate-950/90', 'backdrop-blur-xl', 'border', 'border-white/10', 'rounded-full', 'px-3', 'py-1.5', 'shadow-2xl', 'max-w-fit', 'mx-auto');
                }
                try {
                    if (document.fullscreenEnabled && !document.fullscreenElement && this.overlay.requestFullscreen) {
                        this.overlay.requestFullscreen().catch(() => {});
                    }
                } catch (e) {}
            } else {
                this.overlay.classList.remove('!p-0');
                this.card.classList.remove('!max-w-none', '!w-screen', '!h-screen', '!max-h-none', '!rounded-none', '!border-0', 'sm:!p-6', '!p-4', 'flex', 'flex-col', 'justify-between');
                if (fsBtn) {
                    fsBtn.innerHTML = '<i class="fa-solid fa-expand"></i>';
                    fsBtn.title = 'Toggle Fullscreen (F)';
                }
                if (qrContainer) {
                    qrContainer.classList.remove('!max-w-none', '!w-[min(68vh,82vw,520px)]', '!h-[min(68vh,82vw,520px)]', '!p-4', 'sm:!p-6', 'shadow-[0_0_60px_rgba(37,99,235,0.3)]');
                    qrContainer.classList.add('max-w-[260px]');
                }
                if (scanContainer) {
                    scanContainer.classList.remove('!max-w-none', '!w-[min(66vh,82vw,480px)]', '!h-[min(66vh,82vw,480px)]', 'shadow-[0_0_60px_rgba(37,99,235,0.3)]');
                    scanContainer.classList.add('max-w-[260px]');
                }
                if (exitDockBtn) {
                    exitDockBtn.classList.add('hidden');
                    exitDockBtn.classList.remove('flex');
                }
                if (actionsToolbar) {
                    actionsToolbar.classList.remove('bg-slate-950/90', 'backdrop-blur-xl', 'border', 'border-white/10', 'rounded-full', 'px-3', 'py-1.5', 'shadow-2xl', 'max-w-fit', 'mx-auto');
                }
                try {
                    if (document.fullscreenElement && document.exitFullscreen) {
                        document.exitFullscreen().catch(() => {});
                    }
                } catch (e) {}
            }
        }

        setTab(tab) {
            this.activeTab = tab;
            if (typeof window.playSound === 'function') window.playSound('checkbox');
            const tabScan = this.card.querySelector('#tab-qr-scan');
            const tabShow = this.card.querySelector('#tab-qr-show');
            const panelScan = this.card.querySelector('#panel-qr-scan');
            const panelShow = this.card.querySelector('#panel-qr-show');

            const activeClass = 'flex-1 py-1.5 px-3 rounded-xl text-xs font-black transition duration-200 text-white bg-blue-600 shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5 cursor-pointer';
            const inactiveClass = 'flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition duration-200 text-gray-400 hover:text-white bg-transparent flex items-center justify-center gap-1.5 cursor-pointer';

            if (tab === 'scan') {
                tabScan.className = activeClass;
                tabShow.className = inactiveClass;
                panelScan.classList.remove('hidden');
                panelShow.classList.add('hidden');
                this._startCamera();
            } else {
                tabShow.className = activeClass;
                tabScan.className = inactiveClass;
                panelShow.classList.remove('hidden');
                panelScan.classList.add('hidden');
                this._stopCamera();
                this._renderQR();
            }
        }

        async _renderQR() {
            const container = this.card.querySelector('#qr-code-canvas-container');
            const rawTa = this.card.querySelector('#ta-raw-code');
            if (container) {
                container.innerHTML = `
                    <div class="flex flex-col items-center justify-center p-4 space-y-2 text-slate-800">
                        <i class="fa-solid fa-circle-notch fa-spin text-2xl text-blue-600"></i>
                        <span class="text-xs font-bold font-mono">Generating QR...</span>
                    </div>
                `;
            }

            const rawState = (typeof this.getState === 'function') ? this.getState() : (window.appState || {});
            const compactObj = extractCompactPayload(rawState);
            const json = JSON.stringify(compactObj);
            let payload = '';
            try {
                payload = await this._compress(json);
            } catch (err) {
                console.warn('_compress error, using b64 fallback', err);
                payload = 'B64:' + (typeof btoa === 'function' ? btoa(unescape(encodeURIComponent(json))) : Buffer.from(json).toString('base64'));
            }
            this.currentPayload = payload;

            if (rawTa) rawTa.value = payload;
            if (!container) return;

            // 1. Try qrcode engine (window.qrcode, globalThis.qrcode, or embedded)
            const qrEngine = (typeof window !== 'undefined' && typeof window.qrcode === 'function') 
                ? window.qrcode 
                : ((typeof globalThis !== 'undefined' && typeof globalThis.qrcode === 'function') 
                    ? globalThis.qrcode 
                    : (typeof _inlinedQrCode === 'function' ? _inlinedQrCode : null));

            if (qrEngine) {
                try {
                    const qr = qrEngine(0, 'L');
                    qr.addData(payload);
                    qr.make();

                    const moduleCount = qr.getModuleCount();
                    const targetCanvasDim = 560;
                    const cellSize = Math.max(4, Math.floor((targetCanvasDim - 48) / moduleCount));
                    const margin = Math.max(20, Math.floor((targetCanvasDim - (moduleCount * cellSize)) / 2));
                    const totalSize = moduleCount * cellSize + margin * 2;

                    const canvas = document.createElement('canvas');
                    canvas.width = totalSize;
                    canvas.height = totalSize;
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        ctx.fillStyle = '#ffffff';
                        ctx.fillRect(0, 0, totalSize, totalSize);
                        ctx.fillStyle = '#000000';
                        for (let r = 0; r < moduleCount; r++) {
                            for (let c = 0; c < moduleCount; c++) {
                                if (qr.isDark(r, c)) {
                                    ctx.fillRect(margin + c * cellSize, margin + r * cellSize, cellSize, cellSize);
                                }
                            }
                        }
                        canvas.className = 'w-full h-full object-contain rounded-xl shadow-inner';
                        canvas.setAttribute('aria-label', 'Conquest Sync QR Code');
                        container.innerHTML = '';
                        container.appendChild(canvas);
                        return;
                    }
                } catch (e) {
                    console.warn('qrcode canvas render failed, trying svg tag', e);
                    try {
                        const qr = qrEngine(0, 'L');
                        qr.addData(payload);
                        qr.make();
                        container.innerHTML = qr.createSvgTag({ cellSize: 5, margin: 4, scalable: true });
                        const svg = container.querySelector('svg');
                        if (svg) svg.setAttribute('class', 'w-full h-full object-contain rounded-xl');
                        return;
                    } catch (e2) {
                        console.warn('qrcode svg fallback failed', e2);
                    }
                }
            }

            // 2. Try window.QRCode (davidshimjs fallback)
            if (typeof window !== 'undefined' && typeof window.QRCode === 'function') {
                try {
                    container.innerHTML = '';
                    new window.QRCode(container, {
                        text: payload,
                        width: 260,
                        height: 260,
                        colorDark: '#0f172a',
                        colorLight: '#ffffff',
                        correctLevel: window.QRCode.CorrectLevel ? window.QRCode.CorrectLevel.L : 1
                    });
                    return;
                } catch (e) {
                    console.warn('QRCode fallback failed', e);
                }
            }

            // 3. Fallback: Quick image QR via api.qrserver.com if payload length fits
            const encoded = encodeURIComponent(payload);
            if (encoded.length < 2000) {
                const img = document.createElement('img');
                img.src = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encoded}`;
                img.className = 'w-full h-full object-contain rounded-xl';
                container.innerHTML = '';
                container.appendChild(img);
                return;
            }

            // 4. Graceful Fallback: If visual QR cannot be displayed, show sync code ready notice without confusing duplicate buttons
            container.innerHTML = `
                <div class="flex flex-col items-center justify-center p-4 text-center space-y-2">
                    <div class="w-11 h-11 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-500 text-lg shadow-inner">
                        <i class="fa-solid fa-code"></i>
                    </div>
                    <div class="space-y-0.5">
                        <p class="text-xs font-bold text-slate-800 dark:text-white">Sync Code Generated</p>
                        <p class="text-[10px] text-slate-500 dark:text-slate-400">Use "Copy Code" below to transfer your progress.</p>
                    </div>
                </div>
            `;
        }

        async _copyQrImageToClipboard() {
            const container = this.card.querySelector('#qr-code-canvas-container');
            if (!container) return;

            const img = container.querySelector('img');
            const svg = container.querySelector('svg');
            const canvas = container.querySelector('canvas');

            try {
                let blob = null;
                if (canvas) {
                    blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
                } else if (svg) {
                    const offscreen = document.createElement('canvas');
                    const ctx = offscreen.getContext('2d');
                    const svgData = new XMLSerializer().serializeToString(svg);
                    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
                    const url = URL.createObjectURL(svgBlob);
                    const tempImg = new Image();
                    await new Promise((res, rej) => {
                        tempImg.onload = res;
                        tempImg.onerror = rej;
                        tempImg.src = url;
                    });
                    const size = 320;
                    offscreen.width = size;
                    offscreen.height = size;
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(0, 0, size, size);
                    ctx.drawImage(tempImg, 10, 10, size - 20, size - 20);
                    URL.revokeObjectURL(url);
                    blob = await new Promise(resolve => offscreen.toBlob(resolve, 'image/png'));
                } else if (img) {
                    const offscreen = document.createElement('canvas');
                    const ctx = offscreen.getContext('2d');
                    if (!img.complete) {
                        await new Promise((res, rej) => {
                            img.onload = res;
                            img.onerror = rej;
                        });
                    }
                    const w = img.naturalWidth || img.width || 280;
                    const h = img.naturalHeight || img.height || 280;
                    offscreen.width = w;
                    offscreen.height = h;
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(0, 0, w, h);
                    ctx.drawImage(img, 0, 0, w, h);
                    blob = await new Promise(resolve => offscreen.toBlob(resolve, 'image/png'));
                }

                if (!blob) {
                    this.onToast('Generating QR image, please try again in a moment', 'warning');
                    return;
                }

                if (navigator.clipboard && window.ClipboardItem) {
                    try {
                        const item = new ClipboardItem({ 'image/png': blob });
                        await navigator.clipboard.write([item]);
                        this.onToast('QR image copied to clipboard!', 'success');
                        return;
                    } catch (clipErr) {
                        console.warn('Direct clipboard.write image failed, falling back to download:', clipErr);
                    }
                }

                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'cgl-conquest-sync-qr.png';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                setTimeout(() => URL.revokeObjectURL(url), 1000);
                this.onToast('QR image saved to downloads!', 'success');
            } catch (err) {
                console.error('Failed to copy/download QR image', err);
                this.onToast('Could not copy QR image', 'error');
            }
        }

        async _downloadQrImage() {
            const container = this.card.querySelector('#qr-code-canvas-container');
            if (!container) return;
            const img = container.querySelector('img');
            const svg = container.querySelector('svg');
            const canvas = container.querySelector('canvas');
            try {
                let blob = null;
                if (canvas) {
                    blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
                } else if (svg) {
                    const offscreen = document.createElement('canvas');
                    const ctx = offscreen.getContext('2d');
                    const svgData = new XMLSerializer().serializeToString(svg);
                    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
                    const url = URL.createObjectURL(svgBlob);
                    const tempImg = new Image();
                    await new Promise((res, rej) => {
                        tempImg.onload = res;
                        tempImg.onerror = rej;
                        tempImg.src = url;
                    });
                    const size = 360;
                    offscreen.width = size;
                    offscreen.height = size;
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(0, 0, size, size);
                    ctx.drawImage(tempImg, 10, 10, size - 20, size - 20);
                    URL.revokeObjectURL(url);
                    blob = await new Promise(resolve => offscreen.toBlob(resolve, 'image/png'));
                } else if (img) {
                    const offscreen = document.createElement('canvas');
                    const ctx = offscreen.getContext('2d');
                    if (!img.complete) {
                        await new Promise((res, rej) => {
                            img.onload = res;
                            img.onerror = rej;
                        });
                    }
                    const w = img.naturalWidth || img.width || 320;
                    const h = img.naturalHeight || img.height || 320;
                    offscreen.width = w;
                    offscreen.height = h;
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(0, 0, w, h);
                    ctx.drawImage(img, 0, 0, w, h);
                    blob = await new Promise(resolve => offscreen.toBlob(resolve, 'image/png'));
                }
                if (!blob) {
                    this.onToast('Generating QR image, please wait...', 'warning');
                    return;
                }
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `cgl-conquest-sync-qr-${new Date().toISOString().slice(0, 10)}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                setTimeout(() => URL.revokeObjectURL(url), 1000);
                this.onToast('QR image saved to downloads!', 'success');
            } catch (err) {
                console.error('Download QR failed', err);
                this.onToast('Failed to download QR image', 'error');
            }
        }

        async _shareQr() {
            if (!this.currentPayload) {
                this.onToast('Generating sync payload...', 'warning');
                return;
            }
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: 'CGL Conquest Sync Data',
                        text: this.currentPayload
                    });
                    this.onToast('Sync payload shared!', 'success');
                    return;
                } catch (e) {
                    if (e.name === 'AbortError') return;
                }
            }
            try {
                await navigator.clipboard.writeText(this.currentPayload);
                this.onToast('Share unavailable. Sync code copied to clipboard!', 'info');
            } catch (e) {
                this.onToast('Please copy code manually', 'warning');
            }
        }

        async _refreshQr() {
            this.onToast('Refreshing QR sync payload...', 'info');
            await this._renderQR();
            this.onToast('QR code updated with latest state!', 'success');
        }

        async _startCamera() {
            const video = this.card.querySelector('#qr-scanner-video');
            const prompt = this.card.querySelector('#qr-camera-prompt');
            const statusLabel = this.card.querySelector('#qr-camera-status');

            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                prompt.classList.remove('hidden');
                if (statusLabel) statusLabel.textContent = 'Camera requires HTTPS/Localhost. Paste code below.';
                return;
            }

            try {
                this.videoStream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment' }
                });
                video.srcObject = this.videoStream;
                await video.play();
                prompt.classList.add('hidden');
                this._scanVideoLoop();
            } catch (e) {
                prompt.classList.remove('hidden');
                if (statusLabel) statusLabel.textContent = 'Camera permission denied. Use paste or image below.';
            }
        }

        _stopCamera() {
            if (this.videoStream) {
                this.videoStream.getTracks().forEach(track => track.stop());
                this.videoStream = null;
            }
            if (this.animFrameId) {
                cancelAnimationFrame(this.animFrameId);
                this.animFrameId = null;
            }
        }

        async _scanVideoLoop() {
            const video = this.card.querySelector('#qr-scanner-video');
            if (!this.isOpen || this.activeTab !== 'scan' || video.readyState < video.HAVE_CURRENT_DATA) {
                if (this.isOpen && this.activeTab === 'scan') {
                    this.animFrameId = requestAnimationFrame(() => this._scanVideoLoop());
                }
                return;
            }

            if ('BarcodeDetector' in window) {
                try {
                    const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
                    const barcodes = await detector.detect(video);
                    if (barcodes.length > 0) {
                        this._onCodeDetected(barcodes[0].rawValue);
                        return;
                    }
                } catch (e) {}
            }

            if (window.jsQR) {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const code = window.jsQR(imgData.data, imgData.width, imgData.height);
                if (code && code.data) {
                    this._onCodeDetected(code.data);
                    return;
                }
            }

            this.animFrameId = requestAnimationFrame(() => this._scanVideoLoop());
        }

        async _handleImageUpload(e) {
            const file = e.target.files[0];
            if (!file) return;

            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = async () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                if ('BarcodeDetector' in window) {
                    try {
                        const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
                        const barcodes = await detector.detect(canvas);
                        if (barcodes.length > 0) {
                            this._onCodeDetected(barcodes[0].rawValue);
                            return;
                        }
                    } catch (err) {}
                }

                if (window.jsQR) {
                    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const code = window.jsQR(imgData.data, imgData.width, imgData.height);
                    if (code && code.data) {
                        this._onCodeDetected(code.data);
                        return;
                    }
                }

                this.onToast('Could not find a valid QR code in this image. Try pasting the code manually.', 'error');
            };
        }

        async _onCodeDetected(rawString) {
            this._stopCamera();
            try {
                const json = await this._decompress(rawString);
                const parsed = JSON.parse(json);

                // Integrity & Schema check
                const valResult = validateSyncPayload(parsed);
                if (!valResult.valid) {
                    throw new Error(valResult.error || 'Payload failed integrity check');
                }

                const expanded = expandCompactPayload(parsed);
                if (!expanded || (typeof expanded !== 'object')) {
                    throw new Error('Invalid state structure');
                }

                this.scannedState = expanded;
                this._showConfirmation(expanded);
            } catch (e) {
                console.error('Failed to parse QR sync code', e);
                this.onToast(e.message || 'Invalid or corrupted QR sync code', 'error');
                this._startCamera();
            }
        }

        _showConfirmation(state) {
            this.card.querySelector('#panel-qr-scan').classList.add('hidden');
            this.card.querySelector('#panel-qr-show').classList.add('hidden');
            this.card.querySelector('#panel-qr-report').classList.add('hidden');
            const confirmPanel = this.card.querySelector('#panel-qr-confirm');
            confirmPanel.classList.remove('hidden');

            const statsContainer = this.card.querySelector('#qr-confirm-stats');
            const warnText = confirmPanel.querySelector('p.text-amber-300');

            if (state._isRewardsOnlySync) {
                const rew = state.rewards || {};
                statsContainer.innerHTML = `
                    <div class="p-2 bg-black/40 rounded-xl border border-white/5">
                        <span class="text-[9px] text-gray-400 uppercase block">Mode</span>
                        <span class="font-extrabold text-blue-400">Rewards Modular Sync</span>
                    </div>
                    <div class="p-2 bg-black/40 rounded-xl border border-white/5">
                        <span class="text-[9px] text-gray-400 uppercase block">Coins & Stars</span>
                        <span class="font-extrabold text-amber-400">🪙 ${rew.coins || 0} • ⭐ ${rew.stars || 0}</span>
                    </div>
                    <div class="p-2 bg-black/40 rounded-xl border border-white/5">
                        <span class="text-[9px] text-gray-400 uppercase block">Trophies Claimed</span>
                        <span class="font-extrabold text-purple-400">${(rew.claimedTrophies || []).length} Trophies</span>
                    </div>
                    <div class="p-2 bg-black/40 rounded-xl border border-white/5">
                        <span class="text-[9px] text-gray-400 uppercase block">Current Streak</span>
                        <span class="font-extrabold text-rose-400">🔥 ${state.streak || 0} Days</span>
                    </div>
                `;
                if (warnText) {
                    warnText.textContent = '✨ Merging will update your Coins, Trophies, Powers & Streak while preserving your syllabus progress.';
                }
                return;
            }

            if (warnText) {
                warnText.textContent = '⚠️ Merging will synchronize all data with the incoming payload.';
            }

            const mocksCount = (state.mocks || []).length;
            const notesCount = (state.notes || state.customNotes || []).length;
            const examName = state.examName || state.targetExamName || 'Conquest';
            let masteredCount = 0;
            let activeCount = 0;
            if (state.syllabusProgress) {
                Object.values(state.syllabusProgress).forEach(f => {
                    if (f && f.mastered) masteredCount++;
                    if (f && (f.learned || f.practiced || f.mastered)) activeCount++;
                });
            }

            statsContainer.innerHTML = `
                <div class="p-2 bg-black/40 rounded-xl border border-white/5">
                    <span class="text-[9px] text-gray-400 uppercase block">Mastered Topics</span>
                    <span class="font-extrabold text-amber-400">${masteredCount} (${activeCount} active)</span>
                </div>
                <div class="p-2 bg-black/40 rounded-xl border border-white/5">
                    <span class="text-[9px] text-gray-400 uppercase block">Tests Logged</span>
                    <span class="font-extrabold text-cyan-400">${mocksCount} Tests</span>
                </div>
                <div class="p-2 bg-black/40 rounded-xl border border-white/5">
                    <span class="text-[9px] text-gray-400 uppercase block">Saved Notes</span>
                    <span class="font-extrabold text-purple-400">${notesCount} Notes</span>
                </div>
                <div class="p-2 bg-black/40 rounded-xl border border-white/5">
                    <span class="text-[9px] text-gray-400 uppercase block">Plan Day / Target</span>
                    <span class="font-extrabold text-rose-400">Day ${state.currentDay || 1} • ${examName}</span>
                </div>
            `;
        }

        _showProgressReport(report, diff) {
            this.card.querySelector('#panel-qr-confirm').classList.add('hidden');
            this.card.querySelector('#panel-qr-scan').classList.add('hidden');
            this.card.querySelector('#panel-qr-show').classList.add('hidden');
            const reportPanel = this.card.querySelector('#panel-qr-report');
            reportPanel.classList.remove('hidden');

            // 1. Render Top Stat Strip
            const statStrip = this.card.querySelector('#report-stat-strip');
            statStrip.innerHTML = `
                <div class="p-2 bg-slate-950/90 border border-white/5 rounded-xl">
                    <span class="text-[8px] text-gray-400 uppercase block">XP Total</span>
                    <span class="text-xs font-black font-mono text-amber-400">${report.currentPoints}</span>
                </div>
                <div class="p-2 bg-slate-950/90 border border-white/5 rounded-xl">
                    <span class="text-[8px] text-gray-400 uppercase block">Coins</span>
                    <span class="text-xs font-black font-mono text-yellow-300">🪙 ${report.coins}</span>
                </div>
                <div class="p-2 bg-slate-950/90 border border-white/5 rounded-xl">
                    <span class="text-[8px] text-gray-400 uppercase block">Streak</span>
                    <span class="text-xs font-black font-mono text-rose-400">🔥 ${report.streak}d</span>
                </div>
                <div class="p-2 bg-slate-950/90 border border-white/5 rounded-xl">
                    <span class="text-[8px] text-gray-400 uppercase block">Mastered</span>
                    <span class="text-xs font-black font-mono text-emerald-400">${report.masteredTopicsCount}</span>
                </div>
            `;

            // 2. Render "What's New" Semantic Diff View
            const viewDiff = this.card.querySelector('#view-report-diff');
            if (diff.isIdentical) {
                viewDiff.innerHTML = `
                    <div class="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center text-blue-300 space-y-1">
                        <i class="fa-solid fa-arrows-rotate text-base text-blue-400"></i>
                        <p class="font-bold text-xs">Devices Already in Sync</p>
                        <p class="text-[10.5px] text-gray-400">All syllabus topics, mock records, streaks and rewards are perfectly aligned.</p>
                    </div>
                `;
            } else {
                let diffHtml = '';
                if (diff.xpGain > 0) {
                    diffHtml += `
                        <div class="p-2 rounded-xl bg-slate-950/60 border border-white/5 flex items-center justify-between">
                            <span class="text-gray-300 font-medium text-[11px]"><i class="fa-solid fa-bolt text-amber-400 mr-1.5"></i>Experience Points</span>
                            <span class="font-black text-amber-400 font-mono text-xs">+${diff.xpGain} XP</span>
                        </div>
                    `;
                }
                if (diff.coinsGain > 0) {
                    diffHtml += `
                        <div class="p-2 rounded-xl bg-slate-950/60 border border-white/5 flex items-center justify-between">
                            <span class="text-gray-300 font-medium text-[11px]"><i class="fa-solid fa-coins text-yellow-400 mr-1.5"></i>Coins Added</span>
                            <span class="font-black text-yellow-400 font-mono text-xs">+${diff.coinsGain}</span>
                        </div>
                    `;
                }
                if (diff.starsGain > 0) {
                    diffHtml += `
                        <div class="p-2 rounded-xl bg-slate-950/60 border border-white/5 flex items-center justify-between">
                            <span class="text-gray-300 font-medium text-[11px]"><i class="fa-solid fa-star text-amber-300 mr-1.5"></i>Achievement Stars</span>
                            <span class="font-black text-amber-300 font-mono text-xs">+${diff.starsGain} ⭐</span>
                        </div>
                    `;
                }
                if (diff.levelChanged) {
                    diffHtml += `
                        <div class="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-between">
                            <span class="text-purple-300 font-bold text-[11px]"><i class="fa-solid fa-crown mr-1.5"></i>Rank Level Up</span>
                            <span class="font-black text-purple-200 text-xs">Level ${diff.oldLevel} ➔ ${diff.newLevel}</span>
                        </div>
                    `;
                }
                if (diff.streakDiff !== 0) {
                    diffHtml += `
                        <div class="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between">
                            <span class="text-rose-300 font-bold text-[11px]"><i class="fa-solid fa-fire mr-1.5"></i>Study Streak</span>
                            <span class="font-black text-rose-200 text-xs">${diff.oldStreak} ➔ ${diff.newStreak} Days</span>
                        </div>
                    `;
                }
                if (diff.newlyMasteredCount > 0) {
                    diffHtml += `
                        <div class="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                            <div class="flex items-center justify-between">
                                <span class="text-emerald-300 font-bold text-[11px]"><i class="fa-solid fa-graduation-cap mr-1.5"></i>Topics Mastered</span>
                                <span class="font-black text-emerald-400 font-mono text-xs">+${diff.newlyMasteredCount}</span>
                            </div>
                            <p class="text-[10px] text-gray-400 leading-snug">${diff.newlyMasteredNames.slice(0, 3).join(', ')}${diff.newlyMasteredNames.length > 3 ? ' +' + (diff.newlyMasteredNames.length - 3) + ' more' : ''}</p>
                        </div>
                    `;
                }
                if (diff.newMocksCount > 0) {
                    diffHtml += `
                        <div class="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 space-y-1">
                            <div class="flex items-center justify-between">
                                <span class="text-cyan-300 font-bold text-[11px]"><i class="fa-solid fa-file-lines mr-1.5"></i>Mock Tests Synced</span>
                                <span class="font-black text-cyan-400 font-mono text-xs">+${diff.newMocksCount}</span>
                            </div>
                            <p class="text-[10px] text-gray-400 leading-snug">${diff.newMocksSummaries.slice(0, 2).join(', ')}</p>
                        </div>
                    `;
                }
                if (diff.newTrophies && diff.newTrophies.length > 0) {
                    diffHtml += `
                        <div class="p-2.5 rounded-xl bg-yellow-500/10 border border-yellow-500/20 space-y-1">
                            <div class="flex items-center justify-between">
                                <span class="text-yellow-300 font-bold text-[11px]"><i class="fa-solid fa-trophy mr-1.5"></i>Trophies Claimed</span>
                                <span class="font-black text-yellow-400 text-xs">🏆 +${diff.newTrophies.length}</span>
                            </div>
                            <p class="text-[10px] text-gray-400 leading-snug">${diff.newTrophies.map(t => t.title).join(', ')}</p>
                        </div>
                    `;
                }
                if (diff.newStickers && diff.newStickers.length > 0) {
                    diffHtml += `
                        <div class="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between">
                            <span class="text-indigo-300 font-medium text-[11px]"><i class="fa-solid fa-certificate mr-1.5"></i>Stickers Unlocked</span>
                            <span class="font-black text-indigo-200 text-xs">+${diff.newStickers.length}</span>
                        </div>
                    `;
                }
                viewDiff.innerHTML = diffHtml;
            }

            // 3. Render Parent / Guardian View (Concise Progress Snapshot)
            const viewParent = this.card.querySelector('#view-report-parent');
            viewParent.innerHTML = `
                <div class="p-2.5 rounded-xl bg-slate-950/70 border border-white/5 space-y-1">
                    <div class="flex items-center justify-between">
                        <span class="text-[11px] font-bold text-gray-300"><i class="fa-solid fa-list-check text-blue-400 mr-1.5"></i>Daily Goals Routine</span>
                        <span class="text-xs font-mono font-black text-white">${report.todayRitualsCompleted} / 4 Done</span>
                    </div>
                    <p class="text-[10px] text-gray-400">${report.ritualsLabel}</p>
                </div>
                <div class="p-2.5 rounded-xl bg-slate-950/70 border border-white/5 space-y-1">
                    <div class="flex items-center justify-between">
                        <span class="text-[11px] font-bold text-gray-300"><i class="fa-solid fa-fire text-rose-400 mr-1.5"></i>Study Consistency</span>
                        <span class="text-xs font-mono font-black text-rose-400">${report.streak} Days Active</span>
                    </div>
                    <p class="text-[10px] text-gray-400">${report.streakLabel}</p>
                </div>
                <div class="p-2.5 rounded-xl bg-slate-950/70 border border-white/5 space-y-1">
                    <div class="flex items-center justify-between">
                        <span class="text-[11px] font-bold text-gray-300"><i class="fa-solid fa-book-open text-amber-400 mr-1.5"></i>Syllabus Mastery</span>
                        <span class="text-xs font-mono font-black text-amber-400">${report.masteredTopicsCount} Topics Mastered</span>
                    </div>
                    <p class="text-[10px] text-gray-400">${report.activeTopicsCount} topics currently active across Quant, Reasoning, English & GA.</p>
                </div>
                <div class="p-2.5 rounded-xl bg-slate-950/70 border border-white/5 space-y-1">
                    <div class="flex items-center justify-between">
                        <span class="text-[11px] font-bold text-gray-300"><i class="fa-solid fa-bullseye text-cyan-400 mr-1.5"></i>Exam Target Track</span>
                        <span class="text-xs font-mono font-black text-cyan-300">${report.examName}</span>
                    </div>
                    <p class="text-[10px] text-gray-400">Rank Progression: Level ${report.rankLevel} (${report.rankTitle}) with ${report.mocksCount} mock tests recorded.</p>
                </div>
            `;
        }

        open(initialTab = 'scan') {
            this.isOpen = true;
            this.overlay.classList.remove('hidden');
            void this.overlay.offsetWidth;
            this.overlay.classList.remove('opacity-0', 'pointer-events-none');
            this.card.classList.remove('scale-95');
            this.card.classList.add('scale-100');

            // Reset panel states
            this.card.querySelector('#panel-qr-confirm').classList.add('hidden');
            this.card.querySelector('#panel-qr-report').classList.add('hidden');

            this.setTab(initialTab);
        }

        close() {
            if (this.isFullscreen) {
                this.toggleFullscreen(false);
            }
            this.isOpen = false;
            this._stopCamera();
            this.overlay.classList.add('opacity-0', 'pointer-events-none');
            this.card.classList.remove('scale-100');
            this.card.classList.add('scale-95');

            setTimeout(() => {
                if (!this.isOpen) {
                    this.overlay.classList.add('hidden');
                    this.card.querySelector('#panel-qr-confirm').classList.add('hidden');
                    this.card.querySelector('#panel-qr-report').classList.add('hidden');
                }
            }, 200);
        }
    }

    if (typeof window !== 'undefined') {
        window.QrSyncModal = QrSyncModal;
        window.extractCompactPayload = extractCompactPayload;
        window.extractRewardsOnlyPayload = extractRewardsOnlyPayload;
        window.expandCompactPayload = expandCompactPayload;
        window.validateSyncPayload = validateSyncPayload;
        window.mergeSyncState = mergeSyncState;
        window.detectSyncChanges = detectSyncChanges;
        window.generateProgressReport = generateProgressReport;
    }
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = {
            QrSyncModal,
            extractCompactPayload,
            extractRewardsOnlyPayload,
            expandCompactPayload,
            validateSyncPayload,
            mergeSyncState,
            detectSyncChanges,
            generateProgressReport
        };
    }
})();
