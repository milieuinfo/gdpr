'use strict';

(function () {
    if (!window.GDPR) {
        if (Element.prototype.getAttributeNames == undefined) {
            Element.prototype.getAttributeNames = function () {
                var attributes = this.attributes;
                var length = attributes.length;
                var result = new Array(length);
                for (var i = 0; i < length; i++) {
                    result[i] = attributes[i].name;
                }
                return result;
            };
        }

        if (Object.values == undefined) {
            Object.values = function (object) {
                return Object.keys(object).map(function (key) {
                    return object[key];
                });
            }
        }

        window.GDPR = new GDPR();
    }

    function GDPR() {
        var optIns = {};
        var cookiePrefix = 'vo_';
        var gdprCookieName = 'gdpr';
        var gdprCookieDateName = 'gdpr_date';
        var gdprResetDate = new Date('2019/05/14');
        var matomoScriptId = 'gdpr_matomo_script';
        var matomoPiwikScriptId = 'gdpr_matomo_piwik_script';
        var matomoOntwikkelUrl = '//stats-ontwikkel.milieuinfo.be/';
        var matomoOefenUrl = '//stats-oefen.milieuinfo.be/';
        var matomoProdUrl = '//stats.milieuinfo.be/';

        var modalElement;
        var overlayElement;

        initialize();

        this.open = function () {
            open(true);
        };

        this.close = close;
        this.addOptIn = addOptIn;

        this.reset = function () {
            deleteCookie(gdprCookieName);
            deleteCookie(gdprCookieDateName);
            Object.values(optIns).forEach(function (optIn) {
                deleteCookie(optIn.name);
                resetOptInValue(optIn);
                if (optIn.deactivate) {
                    optIn.deactivate();
                }
            });
        };

        this.isOptInActive = function (name) {
            return optIns[name] ? optIns[name].value : false;
        };

        this.addActivationCallback = function (name, callback) {
            optIns[name].activate = callback;
        };

        this.addDeactivationCallback = function (name, callback) {
            optIns[name].deactivate = callback;
        };

        if (getScriptBooleanAttribute('auto-open', false) && Object.keys(optIns).length > 0) {
            open();
        }

        if (getCookie(gdprCookieName) && (!getCookie(gdprCookieDateName) || gdprCookieDateOngeldig())) {
            open(true);
        }

        function gdprCookieDateOngeldig() {
            var value = getCookie(gdprCookieDateName);
            if (isNaN(value)) {
                return true;
            } else {
                return (new Date(getCookie(gdprCookieDateName)) < gdprResetDate);
            }
        }

        function addOptIn(name, label, description, value, required, activationCallback, deactivationCallback) {
            if (!optIns[name]) {
                const storedValue = getCookie(name);
                optIns[name] = {
                    'name': name,
                    'label': label,
                    'description': description,
                    'value': storedValue !== undefined ? storedValue : value,
                    'activate': activationCallback,
                    'deactivate': deactivationCallback,
                    'required': !!required
                };
            }
        }

        function resetOptInValue(optIn) {
            optIn.value = getOptInValueAttribute(optIn.name);
        }

        function addFunctionalOptIn() {
            addOptIn('functional', 'Noodzakelijke cookies toestaan (verplicht)', 'Noodzakelijke cookies helpen een website bruikbaarder te maken, door basisfuncties als paginanavigatie en toegang tot beveiligde gedeelten van de website mogelijk te maken. Zonder deze cookies kan de website niet naar behoren werken.', false, true);
        }

        function aantalOptIns() {
            return Object.values(optIns).length;
        }

        function addAnalytics() {
            if (!document.getElementById(matomoScriptId)) {
                document.head.appendChild(createMatomoScript());
            }
        }

        function getGDPRScript() {
            return document.querySelector('#gdpr_script');
        }

        function initialize() {
            addStyleLink();

            if (isOptIn('functional', true)) {
                addFunctionalOptIn();

                if (isOptIn('analytics', true)) {
                    addAnalytics();
                }
            }

            getGDPRScript().getAttributeNames().forEach(function (attributeName) {
                var matches = /^data-opt-in-([^-]+)(-(.+))?$/.exec(attributeName);
                if (matches) {
                    var name = matches[1];
                    addOptIn(name, getOptInLabelAttribute(name), getOptInDescriptionAttribute(name), getOptInValueAttribute(name), getOptInRequiredAttribute(name));
                }
            });
        }

        function open(forced) {
            if (!getCookie(gdprCookieName) || forced) {
                document.body.appendChild(createModalElement());
                document.body.appendChild(overlayElement || createOverlayElement());
            } else {
                processOptIns();
            }
        }

        function close() {
            if (modalElement) {
                document.body.removeChild(modalElement);
            }

            if (overlayElement) {
                document.body.removeChild(overlayElement);
            }

            processOptInCookies();
            processOptIns();
            setCookie(gdprCookieName, true);
            setCookie(gdprCookieDateName, new Date().getTime());
        }

        function getScriptAttribute(key) {
            return getGDPRScript().getAttribute(key);
        }

        function getScriptDataAttribute(name, fallback) {
            var value = getScriptAttribute("data-" + name);

            if (value) {
                try {
                    return JSON.parse(value);
                } catch (e) {
                    return value;
                }
            } else {
                return fallback;
            }
        }

        function getScriptBooleanAttribute(name, fallback) {
            var value = getScriptAttribute("data-" + name);

            if (value) {
                try {
                    return JSON.parse(value);
                } catch (e) {
                    return value;
                }
            } else if (value != undefined) {
                return !!new Boolean("");
            } else {
                return fallback;
            }
        }

        function isOptIn(name, fallback) {
            return getScriptDataAttribute("opt-in-" + name, fallback);
        }

        function getOptInAttribute(name, attribute, fallback) {
            return getScriptDataAttribute("opt-in-" + name + "-" + attribute, fallback);
        }

        function getOptInBooleanAttribute(name, attribute, fallback) {
            return getScriptBooleanAttribute("opt-in-" + name + "-" + attribute, fallback);
        }

        function getOptInLabelAttribute(name) {
            return getOptInAttribute(name, "label", name);
        }

        function getOptInDescriptionAttribute(name) {
            return getOptInAttribute(name, "description");
        }

        function getOptInValueAttribute(name) {
            return getOptInBooleanAttribute(name, "value", false);
        }

        function getOptInRequiredAttribute(name) {
            return getOptInBooleanAttribute(name, "required", false);
        }

        function createModalElement() {
            var modal = document.createElement('div');
            modal.setAttribute('id', 'gdpr_modal');

            modal.appendChild(createModalTitleElement());
            modal.appendChild(createModalTextElement());

            Object.values(optIns).forEach(function (optIn) {
                modal.appendChild(createOptieElement(optIn));
            });

            modal.appendChild(createModalConfirmButton());

            return modalElement = modal;
        }

        function createModalTitleElement() {
            var element = document.createElement('h2');
            element.textContent = 'Cookie-toestemming';
            element.setAttribute('id', 'gdpr_modal_titel');
            return element;
        }

        function createModalTextElement() {
            var element = document.createElement('div');
            element.setAttribute('id', 'gdpr_modal_tekst');

            var element1 = document.createElement('p');
            element1.innerHTML = 'Het Departement Omgeving maakt op de websites waarvoor zij verantwoordelijk is gebruik van "cookies" en vergelijkbare internettechnieken. Cookies zijn kleine "tekstbestanden" die worden gebruikt om onze websites en apps beter te laten werken en jouw surfervaring te verbeteren. Zij kunnen worden opgeslagen in de context van de webbrowser(s) die je gebruikt bij het bezoeken van onze website(s).';

            var element2 = document.createElement('p');
            element2.innerHTML = 'Er zijn verschillende soorten cookies, en deze hebben ook een verschillende doelstelling en geldigheidsduur. Een beperkt aantal cookies (essenti&#235;le cookies) zijn absoluut noodzakelijk, deze zijn altijd anoniem. Andere cookies dragen bij aan het gebruikscomfort, je hebt de keuze om deze al dan niet te aanvaarden.';

            var element3 = document.createElement('p');
            element3.innerHTML = 'Op <a href="https://www.omgevingvlaanderen.be/privacy" target="_blank">https://www.omgevingvlaanderen.be/privacy</a> vind je meer informatie over de manier waarop het Departement Omgeving omgaat met uw privacy:';

            var element4 = document.createElement('ul');
            var element4_1 = document.createElement('li');
            element4_1.innerHTML = '- ons privacybeleid, vertaald in de Privacyverklaring';
            var element4_2 = document.createElement('li');
            element4_2.innerHTML = '- algemene informatie over de nieuwe Privacywet';
            var element4_3 = document.createElement('li');
            element4_3.innerHTML = '- de contactgegevens van de functionaris voor gegevensbescherming of DPO';
            element4.appendChild(element4_1);
            element4.appendChild(element4_2);
            element4.appendChild(element4_3);

            var element5 = document.createElement('p');
            element5.innerHTML = 'De cookie-toestemming die je geeft is van toepassing op meerdere websites, subsites en apps van het Departement Omgeving. Welke dit zijn, vind je via de Privacyverklaring. Je kunt naderhand een eerdere toestemming intrekken of wijzigen.';

            element.appendChild(element1);
            element.appendChild(element2);
            element.appendChild(element3);
            element.appendChild(element4);
            element.appendChild(element5);

            return element;
        }

        function createModalConfirmButton() {
            var element = document.createElement('button');
            if (aantalOptIns() > 1) {
                element.textContent = 'Bewaar keuze';
            } else {
                element.textContent = 'Ik begrijp het';
            }
            element.setAttribute('id', 'gdpr_modal_confirm_btn');
            element.onclick = function () {
                close();
            };
            return element;
        }

        function createOptieElement(data) {
            var container = document.createElement('div');
            container.classList.add('checkbox-container');
            var label = document.createElement('span');
            label.setAttribute('id', data.name + '_label');
            label.textContent = data ? data.label : '';
            var description = document.createElement('div');
            description.setAttribute('id', data.name + '_description');
            description.textContent = data ? data.description : '';
            var checkbox = document.createElement('input');
            checkbox.setAttribute('id', data.name + '_input');
            checkbox.type = 'checkbox';
            checkbox.checked = data.value;
            checkbox.onchange = function (event) {
                var checked = event && event.currentTarget ? event.currentTarget.checked : false;
                optIns[data.name].value = checked;
            };
            if (data.required) {
                checkbox.checked = true;
                checkbox.disabled = true;
                optIns[data.name].value = true;
            }
            container.appendChild(checkbox);
            container.appendChild(label);
            container.appendChild(description);
            return container;
        }

        function createOverlayElement() {
            var element = document.createElement('div');
            element.setAttribute('id', 'gdpr_overlay');
            return overlayElement = element;
        }

        function createMatomoScript() {
            var matomo = getMatomoId();
            var element = document.createElement('script');
            element.setAttribute('id', matomoScriptId);
            if (matomo) {
                var script = document.createTextNode("" +
                    "if (!window._paq) {" +
                    "var _paq = window._paq || [];" +
                    "_paq.push(['trackPageView']);" +
                    "_paq.push(['enableLinkTracking']);" +
                    "(function() {" +
                    "var u='" + matomo.url + "';" +
                    "_paq.push(['setTrackerUrl', u+'piwik.php']);" +
                    "_paq.push(['setSiteId', " + matomo.id + "]);" +
                    "var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];" +
                    "g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'piwik.js'; g.id='" + matomoPiwikScriptId + "'; s.parentNode.insertBefore(g,s);" +
                    "})();" +
                    "" +
                    "var currentUrl = window.location.href;" +
                    "window.addEventListener('hashchange', function() {" +
                    "_paq.push(['setReferrerUrl', currentUrl]);" +
                    "currentUrl = '' + window.location.hash.substr(1);" +
                    "_paq.push(['setCustomUrl', currentUrl]);" +
                    "_paq.push(['setDocumentTitle', document.title]);" +
                    "_paq.push(['deleteCustomVariables', 'page']);" +
                    "_paq.push(['setGenerationTimeMs', 0]);" +
                    "_paq.push(['trackPageView']);" +
                    "var content = document.getElementById('content');" +
                    "_paq.push(['MediaAnalytics::scanForMedia', content]);" +
                    "_paq.push(['FormAnalytics::scanForForms', content]);" +
                    "_paq.push(['trackContentImpressionsWithinNode', content]);" +
                    "_paq.push(['enableLinkTracking']);" +
                    "});" +
                    "}"
                );
                element.appendChild(script);
            }
            return element;
        }

        function deleteScript(id) {
            var script = document.getElementById(id);
            if (script) {
                document.head.removeChild(document.getElementById(id));
            }
        }

        function getMatomoId() {
            var match = {
                'stats-ontwikkel.milieuinfo.be': {
                    'id': 1,
                    'url': matomoOntwikkelUrl
                },
                'ontwikkel.milieuinfo.be': {
                    'id': 2,
                    'url': matomoOntwikkelUrl
                },
                'ontwikkel.omgevingsloket.be': {
                    'id': 3,
                    'url': matomoOntwikkelUrl
                },
                'bredero-ontwikkel.ruimteinfo.be': {
                    'id': 5,
                    'url': matomoOntwikkelUrl
                },
                'bredero-bupo-ontwikkel.ruimteinfo.be': {
                    'id': 6,
                    'url': matomoOntwikkelUrl
                },
                'bredero-xfr-ontwikkel.ruimteinfo.be': {
                    'id': 7,
                    'url': matomoOntwikkelUrl
                },
                'ontwikkel.ruimtemonitor.be': {
                    'id': 8,
                    'url': matomoOntwikkelUrl
                },
                'rupadviestoets-ontwikkel.milieuinfo.be': {
                    'id': 9,
                    'url': matomoOntwikkelUrl
                },
                'zendantennes-ontwikkel.milieuinfo.be': {
                    'id': 13,
                    'url': matomoOntwikkelUrl
                },
                'vsm-ontwikkel.milieuinfo.be': {
                    'id': 16,
                    'url': matomoOntwikkelUrl
                },
                'mobiscore-ontwikkel.omgeving.vlaanderen.be': {
                    'id': 22,
                    'url': matomoOntwikkelUrl
                },
                'erkenningencontactgegevens-ontwikkel.omgeving.vlaanderen.be': {
                    'id': 24,
                    'url': matomoOntwikkelUrl
                }
            }[window.location.host];

            if (!match) {
                match = {
                    'stats-oefen.milieuinfo.be': {
                        'id': 1,
                        'url': matomoOefenUrl
                    },
                    'oefen.ruimtemonitor.be': {
                        'id': 2,
                        'url': matomoOefenUrl
                    },
                    'oefen.omgevingsloket.be': {
                        'id': 4,
                        'url': matomoOefenUrl
                    },
                    'vsm-oefen.milieuinfo.be': {
                        'id': 8,
                        'url': matomoOefenUrl
                    },
                    'rupadviestoets-oefen.milieuinfo.be': {
                        'id': 9,
                        'url': matomoOefenUrl
                    },
                    'zendantennes-oefen.milieuinfo.be': {
                        'id': 10,
                        'url': matomoOefenUrl
                    },
                    'www2-oefen.omgeving.vlaanderen.be': {
                        'id': 12,
                        'url': matomoOefenUrl
                    },
                    'mobiscore-oefen.omgeving.vlaanderen.be': {
                        'id': 14,
                        'url': matomoOefenUrl
                    },
                    'erkenningencontactgegevens-oefen.omgeving.vlaanderen.be': {
                        'id': 16,
                        'url': matomoOefenUrl
                    }
                }[window.location.host];
            }

            if (!match) {
                match = {
                    'vsm.milieuinfo.be': {
                        'id': 9,
                        'url': matomoProdUrl
                    },
                    'rupadviestoets.milieuinfo.be': {
                        'id': 11,
                        'url': matomoProdUrl
                    },
                    'zendantennes.milieuinfo.be': {
                        'id': 12,
                        'url': matomoProdUrl
                    },
                    'www.omgevingsloket.be': {
                        'id': 14,
                        'url': matomoProdUrl
                    },
                    'www2.omgeving.vlaanderen.be': {
                        'id': 27,
                        'url': matomoProdUrl
                    },
                    'mobiscore.omgeving.vlaanderen.be': {
                        'id': 29,
                        'url': matomoProdUrl
                    },
                    'ruimtelijkeordening.be': {
                        'id': 30,
                        'url': matomoProdUrl
                    },
                    'complexeprojecten.be': {
                        'id': 31,
                        'url': matomoProdUrl
                    },
                    'rsv.ruimtevlaanderen.be': {
                        'id': 32,
                        'url': matomoProdUrl
                    },
                    'ena.ruimtevlaanderen.be': {
                        'id': 33,
                        'url': matomoProdUrl
                    },
                    'erkenningencontactgegevens.omgeving.vlaanderen.be': {
                        'id':44,
                        'url': matomoProdUrl
                    }
                    'www.vhrm.be': {
                        'id':45,
                        'url': matomoProdUrl
                    }
                }[window.location.host];
            }

            if (!match) {
                console.error('de website is nog niet gekend bij ons dus er zullen geen gebruikersstatistieken bijgehouden worden');
            }
            return match;
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
                    try {
                        return JSON.parse(cookie.substring(name.length, cookie.length));
                    } catch (error) {
                        return cookie.substring(name.length, cookie.length);
                    }
                }
            }
        }

        function setCookie(name, value) {
            document.cookie = cookiePrefix + name + '=' + value + ';Max-Age=2147483647;path=/;';
        }

        function deleteCookie(name) {
            document.cookie = cookiePrefix + name + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
        }

        function processOptInCookies() {
            Object.values(optIns).forEach(function (optIn) {
                setCookie(optIn.name, optIn.value || false);
            });
        }

        function processOptIns() {
            Object.values(optIns).forEach(function (optIn) {
                if (optIn.value) {
                    if (optIn.activate) {
                        optIn.activate();
                    }
                } else {
                    if (optIn.deactivate) {
                        optIn.deactivate();
                    }
                }
            });
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
                "transform: translate(-50%, -30%);" +
                "padding: 1.5rem;" +
                "background: #FFF;" +
                "box-shadow: 0 0 0.1rem 0 rgba(0, 0, 0, 0.3);" +
                "z-index: 10001;" +
                "font-size: 1em;" +
                "overflow: auto" +
                "}" +
                "" +
                "#gdpr_modal #gdpr_modal_titel {" +
                "margin-top: 0px;" +
                "font-size: 2rem;" +
                "margin-bottom: 1.5rem;" +
                "}" +
                "#gdpr_modal #gdpr_modal_tekst p {" +
                "margin-bottom: 1.8rem;" +
                "}" +
                "#gdpr_modal #gdpr_modal_tekst ul {" +
                "list-style-type: none;" +
                "padding-left: 20px;" +
                "}" +
                "" +
                "#gdpr_modal button {" +
                "background: #333;" +
                "border: 1px solid #000;" +
                "color: #FFF;" +
                "padding: 0 4rem;" +
                "height: 3.5rem;" +
                "float: right;" +
                "outline: none;" +
                "font-size: 1em;" +
                "margin-top: 15px;" +
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
                "#gdpr_modal .checkbox-container:not(:first-child) {" +
                "margin-top: 10px;" +
                "}" +
                "" +
                "#gdpr_modal .checkbox-container input[type=checkbox] {" +
                "position: absolute;" +
                "opacity: 0;" +
                "z-index: 1;" +
                "width: 100%;" +
                "height: 100%;" +
                "}" +
                "" +
                "#gdpr_modal .checkbox-container input[type=checkbox] + span {" +
                "position: relative;" +
                "padding-left: 30px;" +
                "}" +
                "" +
                "#gdpr_modal .checkbox-container div {" +
                "padding-left: 30px;" +
                "font-size: 0.8em;" +
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
                "background: url('data:image/png;base64,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');" +
                "}" +
                "" +
                "#gdpr_modal .checkbox-container input[type=checkbox]:disabled + span:before {" +
                "opacity: 0.5" +
                "}";
        }
    }
})(this);
