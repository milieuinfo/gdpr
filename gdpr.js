'use strict';

(function() {
	if (!window.GDPR) {
		window.GDPR = new GDPR();
	}
	
	function GDPR() {
		var optIns = {};
		var cookiePrefix = 'vo_';
		
		var modalElement;
		var overlayElement;
		
		initialize();

		this.open = function() {
			open(true);
		}
		
		this.reset = function() {
			deleteCookie('gdpr');
			Object.values(optIns).forEach(function(optIn) {
				deleteCookie(optIn.name);
			});
		}
		
		if (Object.keys(optIns).length > 0) {
			open();
		}
		
		function initialize() {
			addStyleLink();
			
			if (isOptIn('analytics', true)) {
				optIns['matomo'] = {
					'name': 'matomo',
					'label': 'matomo',
					'value': getCookie('matomo')
				}
			}
		}
		
		function open(forced) {
			if (!getCookie('gdpr') || forced) {
				document.body.appendChild(modalElement || createModalElement());
				document.body.appendChild(overlayElement || createOverlayElement());
			}
		}
		
		function close() {
			document.body.removeChild(modalElement);
			document.body.removeChild(overlayElement);
			
			if (optIns['matomo']) {
				var optIn = optIns['matomo'].value;
				setCookie('matomo', optIn || false);
				if (optIn) {
					document.head.appendChild(createMatomaScript());
				}
			}
			
			setCookie('gdpr', true);
		}
		
		function isOptIn(name, fallback) {
			return JSON.parse(document.currentScript.getAttribute(name) || fallback);
		}
		
		function createModalElement() {
			var modal = document.createElement('div');
			modal.setAttribute('id', 'gdpr_modal');

			modal.appendChild(createModalTitleElement());
			modal.appendChild(createModalTextElement());
			
			Object.values(optIns).forEach(function(optIn) {
				modal.appendChild(createOptieElement(optIn));
			});
			
			modal.appendChild(createModalConfirmButton());
			
			return modalElement = modal;
		}
		
		function createModalTitleElement() {
			var element = document.createElement('h2');
			element.textContent = 'GDPR titel';
			return element;
		}
		
		function createModalTextElement() {
			var element = document.createElement('p');
			element.textContent = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
			return element;
		}
		
		function createModalConfirmButton() {
			var element = document.createElement('button');
			element.textContent = 'bewaar';
			element.onclick = function() {
				close();
			};
			return element;
		}
		
		function createOptieElement(data) {
			var container = document.createElement('div');
			container.classList.add('checkbox-container')
			var span = document.createElement('span');
			span.textContent = data ? data.label : '';
			var checkbox = document.createElement('input');
			checkbox.type = 'checkbox';
			checkbox.checked = data.value;
			checkbox.onchange = function(event) {
				var checked = event && event.currentTarget ? event.currentTarget.checked : false;
				optIns[data.name].value = checked;
			};
			container.appendChild(checkbox);
			container.appendChild(span);
			return container;
		}
		
		function createOverlayElement() {
			var element = document.createElement('div');
			element.setAttribute('id', 'gdpr_overlay');
			return overlayElement = element;
		}
		
		function createMatomaScript() {
			var element = document.createElement('script');
			var script = document.createTextNode("" +
				"var _paq = _paq || [];" +
				"_paq.push(['trackPageView']);" +
				"_paq.push(['enableLinkTracking']);" +
				"(function() {" +
					"var u='//stats-ontwikkel.milieuinfo.be/';" +
					"_paq.push(['setTrackerUrl', u+'piwik.php']);" +
					"_paq.push(['setSiteId', '13']);" +
					"var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];" +
					"g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s);" +
				"})();");
			element.appendChild(script);
			return element;
		}
		
		function addStyleLink() {
			document.head.appendChild(getStyleLink());
		}
		
		function getStyleLink() {
			var link = document.createElement('link');
			link.setAttribute('rel', 'stylesheet');
			link.setAttribute('type', 'text/css');
			link.setAttribute('href', 'data:text/css;charset=UTF-8,' + encodeURIComponent(getStyle()));
			return link;
		}
		
		function getCookie(name) {
			name = cookiePrefix + name + '=';
			var cookies = document.cookie.split(';');
			for (var i = 0; i < cookies.length; i++) {
				var cookie = cookies[i];
				while (cookie.charAt(0) == ' ') {
					cookie = cookie.substring(1);
				}
				if (cookie.indexOf(name) == 0) {
					return JSON.parse(cookie.substring(name.length, cookie.length));
				}
			}
		}
		
		function setCookie(name, value) {
			document.cookie = cookiePrefix + name + '=' + value + ';2147483647;path=/;';
		}
		
		function deleteCookie(name) {
			document.cookie = cookiePrefix + name + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
		}
		
		function getStyle() {
			return "" +
				"#gdpr_overlay {" +
					"position: fixed;" +
					"width: 100%;" +
					"height: 100%;" +
					"background: #FFF;" +
					"opacity: 0.8;" +
					"top: 0px;" +
					"z-index: 10000;" +
				"}" +
				"" +
				"#gdpr_modal {" +
					"position: fixed;" +
					"width: 60rem;" +
					"max-width: 95vw;" +
					"max-height: 95vh;" +
					"top: 30%;" +
					"left: 50%;" +
					"transform: translate(-50%, -50%);" +
					"padding: 1.5rem;" +
					"background: #FFF;" +
					"box-shadow: 0 0 0.1rem 0 rgba(0, 0, 0, 0.3);" +
					"z-index: 10001;" +
				"}" +
				"" +
				"#gdpr_modal h2 {" +
					"text-transform: capitalize;" +
					"margin-top: 0px;" +
				"}" +
				"" +
				"#gdpr_modal button {" +
					"text-transform: capitalize;" +
					"background: #333;" +
					"border: 1px solid #000;" +
					"color: #FFF;" +
					"padding: 0 4rem;" +
					"height: 3.5rem;" +
					"float: right;" +
					"outline: none;" +
				"}" +
				"" +
				"#gdpr_modal button:hover {" +
					"background: #666;" +
				"}" +
				"" +
				"#gdpr_modal .checkbox-container {" +
					"position: relative;" +
				"}" +
				"" +
				"#gdpr_modal .checkbox-container input[type=checkbox] {" +
					"position: absolute;" +
					"margin: 4px;" +
					"opacity: 0;" +
					"z-index: 1;" +
				"}" +
				"" +
				"" +
				"#gdpr_modal .checkbox-container input[type=checkbox] + span {" +
					"position: relative;" +
					"padding-left: 30px;" +
					"text-transform: capitalize;" +
				"}" +
				"" +
				"#gdpr_modal .checkbox-container input[type=checkbox] + span:before {" +
					"position: absolute;" +
					"top: 50%;" +
					"left: 0px;" +
					"transform: translate(0, -50%);" +
					"height: 1em;" +
					"content: '';" +
					"width: 20px;" +
					"height: 20px;" +
					"display: inline-block;" +
					"margin-right: 10px;" +
					"background: url('data:image/png;base64,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');" +
				"}" +
				"" +
				"#gdpr_modal .checkbox-container input[type=checkbox]:checked + span:before {" +
					"background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAIAAAAC64paAAAACXBIWXMAABYlAAAWJQFJUiTwAAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgABeNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzABhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/phCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+IoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm+eb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lOk06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7RyFDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lpsbxt3IveRKdPVxXeF60vWdm7Obwu2o26/uNu5p7ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+VMGvfrH5PQ0+BZ7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8Nvnl+F30N/I/9k/3r/0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5pDoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo+qi5qPNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt/87fOH4p3iC+N7F5gvyF1weaHOwvSFpxapLhIsOpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi/RNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z+pn5mZ2y6xlhbL+xW6Lty8elQfJa7OQrAVZLQq2QqboVFoo1yoHsmdlV2a/zYnKOZarnivN7cyzytuQN5zvn//tEsIS4ZK2pYZLVy0dWOa9rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1+1dT1gvWd+1YfqGnRs+FYmKrhTbF5cVf9go3HjlG4dvyr+Z3JS0qavEuWTPZtJm6ebeLZ5bDpaql+aXDm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO/PLi8ZafJzs07P1SkVPRU+lQ27tLdtWHX+G7R7ht7vPY07NXbW7z3/T7JvttVAVVN1WbVZftJ+7P3P66Jqun4lvttXa1ObXHtxwPSA/0HIw6217nU1R3SPVRSj9Yr60cOxx++/p3vdy0NNg1VjZzG4iNwRHnk6fcJ3/ceDTradox7rOEH0x92HWcdL2pCmvKaRptTmvtbYlu6T8w+0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO32oPb++6EHTh0kX/i+c7vDvOXPK4dPKy2+UTV7hXmq86X23qdOo8/pPTT8e7nLuarrlca7nuer21e2b36RueN87d9L158Rb/1tWeOT3dvfN6b/fF9/XfFt1+cif9zsu72Xcn7q28T7xf9EDtQdlD3YfVP1v+3Njv3H9qwHeg89HcR/cGhYPP/pH1jw9DBY+Zj8uGDYbrnjg+OTniP3L96fynQ89kzyaeF/6i/suuFxYvfvjV69fO0ZjRoZfyl5O/bXyl/erA6xmv28bCxh6+yXgzMV70VvvtwXfcdx3vo98PT+R8IH8o/2j5sfVT0Kf7kxmTk/8EA5jz/GMzLdsAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAAAidJREFUeNqUVL9rU1EU/s69t8lLSUJwaNM0gkUhRkQ3O7g6GKymWKu4OFgEFwWHtpBBKOKgg4O1k6iDdPMvcBZ0KEjBIJjE0hqVKorYkB8v793j8JKXd5N08A4P3sd3zv3Oud85lFrc3Gtq/P+JWUL9qbt1OxBMAMP4hYl0cVezkII6DD+STJ6HDIBSkDASc4AdVOF/taFB9KccjPGOBjSHQwIu+zRh1BaM7CEEzbD17TNjG4Xs2RMJOOylFkaRRP3dIkAzHL6TSz66cvB4OlLIjfuSlFFSy8WI6KjhrlpXL56beDifBrDzy156VQ3U3GkVE+H0sXh8VMDh7gsxXF04n3ownwaw/bM1t1Z+96kGJcyaHV65kHqznFlfmIpHJNoaGnD47uzk/YuTBJR2mzOrlY1yDaFej4WvITNuAZg5mXh5YypqSbT1vbn0Sj4FoPKjdWmt8mG7hogMlinD0zdtlwG8Lv49moxkJ6xM0sqmrOnD0eVcEkCx2ph9Ui5WGwjL4IOGlaDYrfd7TRcEtDkaEs+uH7p86oDP+PitkV8tl742YYk+58YiUvS8NUK1tr72fGv97W8P29yp5x+XS9+bsEwjdg2vDG8oatm88GLL0frImHX16ecvuy0j0qP5HuvIDg6QZhApSY6toWg/88YsaXrbSykIgOMyFA2dJ/+mgD3ZdDiZVBrif+Vq7h/JwZXAQy53NavEqJSShuyK/dZId2HEwuLfAHHg3T3sUqDGAAAAAElFTkSuQmCC');" +
				"}";
		}
	}
})(this);