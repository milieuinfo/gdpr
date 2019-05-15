"use strict";!function(){function e(){function e(e,t,n,i,o,r,a){I[e]||(I[e]={name:e,label:t,description:n,value:B(e)||i,activate:r,deactivate:a,required:!!o})}function t(){e("functional","Noodzakelijke cookies toestaan (verplicht)","Noodzakelijke cookies helpen een website bruikbaarder te maken, door basisfuncties als paginanavigatie en toegang tot beveiligde gedeelten van de website mogelijk te maken. Zonder deze cookies kan de website niet naar behoren werken.",!1,!0)}function n(){return Object.values(I).length}function i(){document.getElementById(P)||document.head.appendChild(T())}function o(){return document.querySelector("#gdpr_script")}function r(e){!B(Y)||e?(document.body.appendChild(b()),document.body.appendChild(q||x())):D()}function a(){z&&document.body.removeChild(z),q&&document.body.removeChild(q),V(),D(),O(Y,!0),O(j,(new Date).getTime())}function d(e){return o().getAttribute(e)}function u(e,t){var n=d("data-"+e);if(!n)return t;try{return JSON.parse(n)}catch(e){return n}}function c(e,t){var n=d("data-"+e);if(!n)return void 0!=n?!!new Boolean(""):t;try{return JSON.parse(n)}catch(e){return n}}function l(e,t){return u("opt-in-"+e,t)}function A(e,t,n){return u("opt-in-"+e+"-"+t,n)}function p(e,t,n){return c("opt-in-"+e+"-"+t,n)}function s(e){return A(e,"label",e)}function g(e){return A(e,"description")}function m(e){return p(e,"value",!1)}function v(e){return p(e,"required",!1)}function b(){var e=document.createElement("div");return e.setAttribute("id","gdpr_modal"),e.appendChild(h()),e.appendChild(k()),Object.values(I).forEach(function(t){e.appendChild(w(t))}),e.appendChild(f()),z=e}function h(){var e=document.createElement("h2");return e.textContent="Cookie-toestemming",e.setAttribute("id","gdpr_modal_titel"),e}function k(){var e=document.createElement("div");e.setAttribute("id","gdpr_modal_tekst");var t=document.createElement("p");t.innerHTML='Het Departement Omgeving maakt op de websites waarvoor zij verantwoordelijk is gebruik van "cookies" en vergelijkbare internettechnieken. Cookies zijn kleine "tekstbestanden" die worden gebruikt om onze websites en apps beter te laten werken en jouw surfervaring te verbeteren. Zij kunnen worden opgeslagen in de context van de webbrowser(s) die je gebruikt bij het bezoeken van onze website(s).';var n=document.createElement("p");n.innerHTML="Er zijn verschillende soorten cookies, en deze hebben ook een verschillende doelstelling en geldigheidsduur. Een beperkt aantal cookies (essenti&#235;le cookies) zijn absoluut noodzakelijk, deze zijn altijd anoniem. Andere cookies dragen bij aan het gebruikscomfort, je hebt de keuze om deze al dan niet te aanvaarden.";var i=document.createElement("p");i.innerHTML='Op <a href="https://www.omgevingvlaanderen.be/privacy" target="_blank">https://www.omgevingvlaanderen.be/privacy</a> vind je meer informatie over de manier waarop het Departement Omgeving omgaat met uw privacy:';var o=document.createElement("ul"),r=document.createElement("li");r.innerHTML="- ons privacybeleid, vertaald in de Privacyverklaring";var a=document.createElement("li");a.innerHTML="- algemene informatie over de nieuwe Privacywet";var d=document.createElement("li");d.innerHTML="- de contactgegevens van de functionaris voor gegevensbescherming of DPO",o.appendChild(r),o.appendChild(a),o.appendChild(d);var u=document.createElement("p");return u.innerHTML="De cookie-toestemming die je geeft is van toepassing op meerdere websites, subsites en apps van het Departement Omgeving. Welke dit zijn, vind je via de Privacyverklaring. Je kunt naderhand een eerdere toestemming intrekken of wijzigen.",e.appendChild(t),e.appendChild(n),e.appendChild(i),e.appendChild(o),e.appendChild(u),e}function f(){var e=document.createElement("button");return n()>1?e.textContent="Bewaar keuze":e.textContent="Ik begrijp het",e.setAttribute("id","gdpr_modal_confirm_btn"),e.onclick=function(){a()},e}function w(e){var t=document.createElement("div");t.classList.add("checkbox-container");var n=document.createElement("span");n.setAttribute("id",e.name+"_label"),n.textContent=e?e.label:"";var i=document.createElement("div");i.setAttribute("id",e.name+"_description"),i.textContent=e?e.description:"";var o=document.createElement("input");return o.setAttribute("id",e.name+"_input"),o.type="checkbox",o.checked=e.value,o.onchange=function(t){var n=!(!t||!t.currentTarget)&&t.currentTarget.checked;I[e.name].value=n},e.required&&(o.checked=!0,o.disabled=!0,I[e.name].value=!0),t.appendChild(o),t.appendChild(n),t.appendChild(i),t}function x(){var e=document.createElement("div");return e.setAttribute("id","gdpr_overlay"),q=e}function T(){var e=y(),t=document.createElement("script");if(t.setAttribute("id",P),e){var n=document.createTextNode("if (!window._paq) {var _paq = window._paq || [];_paq.push(['trackPageView']);_paq.push(['enableLinkTracking']);(function() {var u='"+e.url+"';_paq.push(['setTrackerUrl', u+'piwik.php']);_paq.push(['setSiteId', "+e.id+"]);var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'piwik.js'; g.id='"+Q+"'; s.parentNode.insertBefore(g,s);})();var currentUrl = window.location.href;window.addEventListener('hashchange', function() {_paq.push(['setReferrerUrl', currentUrl]);currentUrl = '' + window.location.hash.substr(1);_paq.push(['setCustomUrl', currentUrl]);_paq.push(['setDocumentTitle', document.title]);_paq.push(['deleteCustomVariables', 'page']);_paq.push(['setGenerationTimeMs', 0]);_paq.push(['trackPageView']);var content = document.getElementById('content');_paq.push(['MediaAnalytics::scanForMedia', content]);_paq.push(['FormAnalytics::scanForForms', content]);_paq.push(['trackContentImpressionsWithinNode', content]);_paq.push(['enableLinkTracking']);});}");t.appendChild(n)}return t}function y(){var e={"stats-ontwikkel.milieuinfo.be":{id:1,url:Z},"ontwikkel.milieuinfo.be":{id:2,url:Z},"ontwikkel.omgevingsloket.be":{id:3,url:Z},"bredero-ontwikkel.ruimteinfo.be":{id:5,url:Z},"bredero-bupo-ontwikkel.ruimteinfo.be":{id:6,url:Z},"bredero-xfr-ontwikkel.ruimteinfo.be":{id:7,url:Z},"ontwikkel.ruimtemonitor.be":{id:8,url:Z},"rupadviestoets-ontwikkel.milieuinfo.be":{id:9,url:Z},"zendantennes-ontwikkel.milieuinfo.be":{id:13,url:Z},"vsm-ontwikkel.milieuinfo.be":{id:16,url:Z}}[window.location.host];return e||(e={"stats-oefen.milieuinfo.be":{id:1,url:U},"oefen.ruimtemonitor.be":{id:2,url:U},"oefen.omgevingsloket.be":{id:4,url:U},"vsm-oefen.milieuinfo.be":{id:8,url:U},"rupadviestoets-oefen.milieuinfo.be":{id:9,url:U},"zendantennes-oefen.milieuinfo.be":{id:10,url:U},"www2-oefen.omgeving.vlaanderen.be":{id:12,url:U}}[window.location.host]),e||(e={"vsm.milieuinfo.be":{id:9,url:F},"rupadviestoets.milieuinfo.be":{id:11,url:F},"zendantennes.milieuinfo.be":{id:12,url:F},"www.omgevingsloket.be":{id:14,url:F},"www2.omgeving.vlaanderen.be":{id:27,url:F}}[window.location.host]),e||console.error("de website is nog niet gekend bij ons dus er zullen geen gebruikersstatistieken bijgehouden worden"),e}function C(){document.head.appendChild(E())}function E(){var e=document.createElement("link");return e.setAttribute("rel","stylesheet"),e.setAttribute("type","text/css"),e.setAttribute("href","data:text/css;charset=UTF-8,"+encodeURIComponent(L())),e}function B(e){e=K+e+"=";for(var t=document.cookie.split(";"),n=0;n<t.length;n++){for(var i=t[n];" "==i.charAt(0);)i=i.substring(1);if(0==i.indexOf(e))return JSON.parse(i.substring(e.length,i.length))}}function O(e,t){document.cookie=K+e+"="+t+";Max-Age=2147483647;path=/;"}function N(e){document.cookie=K+e+"=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;"}function V(){Object.values(I).forEach(function(e){O(e.name,e.value||!1)})}function D(){Object.values(I).forEach(function(e){e.value?e.activate&&e.activate():e.deactivate&&e.deactivate()})}function L(){return"#gdpr_overlay {position: fixed;width: 100%;height: 100%;background: #FFF;opacity: 0.8;top: 0px;z-index: 10000;}#gdpr_modal {position: fixed;width: 60rem;max-width: 95vw;max-height: 95vh;top: 30%;left: 50%;transform: translate(-50%, -30%);padding: 1.5rem;background: #FFF;box-shadow: 0 0 0.1rem 0 rgba(0, 0, 0, 0.3);z-index: 10001;font-size: 1em;overflow: auto}#gdpr_modal #gdpr_modal_titel {margin-top: 0px;}#gdpr_modal #gdpr_modal_tekst ul {list-style-type: none;padding-left: 20px;}#gdpr_modal button {background: #333;border: 1px solid #000;color: #FFF;padding: 0 4rem;height: 3.5rem;float: right;outline: none;font-size: 1em;margin-top: 15px;}#gdpr_modal button:hover {background: #666;}#gdpr_modal .checkbox-container {position: relative;}#gdpr_modal .checkbox-container:not(:first-child) {margin-top: 10px;}#gdpr_modal .checkbox-container input[type=checkbox] {position: absolute;opacity: 0;z-index: 1;width: 100%;height: 100%;}#gdpr_modal .checkbox-container input[type=checkbox] + span {position: relative;padding-left: 30px;}#gdpr_modal .checkbox-container div {padding-left: 30px;font-size: 0.8em;}#gdpr_modal .checkbox-container input[type=checkbox] + span:before {position: absolute;top: 50%;left: 0px;transform: translate(0, -50%);height: 1em;content: '';width: 20px;height: 20px;display: inline-block;margin-right: 10px;background: url('data:image/png;base64,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');}#gdpr_modal .checkbox-container input[type=checkbox]:checked + span:before {background: url('data:image/png;base64,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');}#gdpr_modal .checkbox-container input[type=checkbox]:disabled + span:before {opacity: 0.5}"}var z,q,I={},K="vo_",Y="gdpr",j="gdpr_date",G=new Date("2019/05/14"),P="gdpr_matomo_script",Q="gdpr_matomo_piwik_script",Z="//stats-ontwikkel.milieuinfo.be/",U="//stats-oefen.milieuinfo.be/",F="//stats.milieuinfo.be/";!function(){C(),l("functional",!0)&&(t(),l("analytics",!0)&&i()),o().getAttributeNames().forEach(function(t){var n=/^data-opt-in-([^-]+)(-(.+))?$/.exec(t);if(n){var i=n[1];e(i,s(i),g(i),m(i),v(i))}})}(),this.open=function(){r(!0)},this.close=a,this.addOptIn=e,this.reset=function(){N(Y),N(j),Object.values(I).forEach(function(e){N(e.name),delete e.value,e.deactivate&&e.deactivate()})},this.isOptInActive=function(e){return!!I[e]&&I[e].value},this.addActivationCallback=function(e,t){I[e].activate=t},this.addDeactivationCallback=function(e,t){I[e].deactivate=t},c("auto-open",!1)&&Object.keys(I).length>0&&r(),B(Y)&&(!B(j)||new Date(B(j))<G)&&r(!0)}window.GDPR||(void 0==Element.prototype.getAttributeNames&&(Element.prototype.getAttributeNames=function(){for(var e=this.attributes,t=e.length,n=new Array(t),i=0;i<t;i++)n[i]=e[i].name;return n}),void 0==Object.values&&(Object.values=function(e){return Object.keys(e).map(function(t){return e[t]})}),window.GDPR=new e)}();