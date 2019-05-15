const chai = require('chai');
const jsdom = require('jsdom');
const sinon = require('sinon');

const { assert } = chai;
const { JSDOM } = jsdom;

const host = 'zendantennes-ontwikkel.milieuinfo.be';
const gdprCookie = 'vo_gdpr=true;Max-Age=2147483647;path=/';
const gdprDateCookie = 'vo_gdpr_date=1557848372873;Max-Age=2147483647;path=/';
const socialMediaCookie = 'vo_socialmedia=true;Max-Age=2147483647;path=/';

function setup() {
	return new JSDOM(`
		<head>
			<script id='gdpr_script' src='./gdpr.src.js' data-auto-open></script>
		</head>
	`, {
		runScripts: 'dangerously',
		resources: 'usable'
	});
}

function setupZonderFunctional() {
    return new JSDOM(`
		<head>
			<script id='gdpr_script' src='./gdpr.src.js' data-opt-in-functional='false'></script>
		</head>
	`, {
        runScripts: 'dangerously',
        resources: 'usable'
    });
}

function setupZonderAnalytics() {
    return new JSDOM(`
		<head>
			<script id='gdpr_script' src='./gdpr.src.js' data-opt-in-analytics='false'></script>
		</head>
	`, {
        runScripts: 'dangerously',
        resources: 'usable'
    });
}

function setupZonderAutoOpen() {
    return new JSDOM(`
		<head>
			<script id='gdpr_script' src='./gdpr.src.js'></script>
		</head>
	`, {
        runScripts: 'dangerously',
        resources: 'usable'
    });
}

function setupZonderAutoOpenExpliciet() {
    return new JSDOM(`
		<head>
			<script id='gdpr_script' src='./gdpr.src.js' data-auto-open="false"></script>
		</head>
	`, {
        runScripts: 'dangerously',
        resources: 'usable'
    });
}

function setupMetExtraOptIn(value, required, cookieJar) {
    return new JSDOM(`
		<head>
			<script id='gdpr_script' src='./gdpr.src.js' data-auto-open data-opt-in-socialmedia-label="sociale media" data-opt-in-socialmedia-description="beschrijving sociale media" data-opt-in-socialmedia-value="${value}" data-opt-in-socialmedia-required="${required}"></script>
		</head>
	`, {
        runScripts: 'dangerously',
        resources: 'usable',
        required: required,
        value: value,
		cookieJar: cookieJar
    });
}

const sandbox = sinon.createSandbox();

suite('gdpr', function() {
	teardown(() => {
		sandbox.restore();
	});
	
	test('het laden van het gdpr script zal een GDPR object op de window zetten', (done) => {
		const dom = setup();
		dom.window.addEventListener('load', function() {
			const window = dom.window;
			window.document;
			assert.exists(window.GDPR);
			done();
		});
	});
	
	test('het laden van het gdpr script zal een GDPR modal en overlay toevoegen aan de dom', (done) => {
		const dom = setup();
		dom.window.addEventListener('load', function() {
			const window = dom.window;
			const document = window.document;
			assert.exists(document.getElementById('gdpr_modal'));
			assert.exists(document.getElementById('gdpr_overlay'));
			done();
		});
	});

    test('het laden van het gdpr script zal standaard geen GDPR modal en overlay toevoegen aan de dom of indien er gekozen werd om de auto-open af te zetten', (done) => {
    	let dom = setupZonderAutoOpen();
        dom.window.addEventListener('load', function() {
            const window = dom.window;
            const document = window.document;
            assert.notExists(document.getElementById('gdpr_modal'));
            assert.notExists(document.getElementById('gdpr_overlay'));
            
            dom = setupZonderAutoOpenExpliciet();
            dom.window.addEventListener('load', function() {
                const window = dom.window;
                const document = window.document;
                assert.notExists(document.getElementById('gdpr_modal'));
                assert.notExists(document.getElementById('gdpr_overlay'));
                done();
            });
        });
    });
	
	test('de GDPR modal bevat een confirm knop waarmee de modal gesloten kan worden', (done) => {
		const dom = setup();
		dom.window.addEventListener('load', function() {
			const window = dom.window;
			const document = window.document;
			const gdprModal = document.getElementById('gdpr_modal');
			const gdprModalBtns = gdprModal.getElementsByTagName('button');
			assert.equal(gdprModalBtns.length, 1);
			const gdprModalBtn = gdprModalBtns[0];
			assert.exists(document.getElementById('gdpr_modal'));
			gdprModalBtn.click();
			assert.notExists(document.getElementById('gdpr_modal'));
			done();
		});
	});

	test('de GDPR modal bevat een confirm knop waarmee de modal gesloten kan worden en de tekst is afhankelijk van het aantal opt in opties', (done) => {
		let dom = setup();
		dom.window.addEventListener('load', function() {
			const window = dom.window;
			const document = window.document;
			const gdprModal = document.getElementById('gdpr_modal');
			const gdprModalBtn = gdprModal.getElementsByTagName('button')[0];
			assert.equal(gdprModalBtn.textContent, 'Ik begrijp het');

			dom = setupMetExtraOptIn();
			dom.window.addEventListener('load', function() {
				const window = dom.window;
				const document = window.document;
				const gdprModal = document.getElementById('gdpr_modal');
				const gdprModalBtn = gdprModal.getElementsByTagName('button')[0];
				assert.equal(gdprModalBtn.textContent, 'Bewaar keuze');
				done();
			});
		});
	});
	
	test('bij het sluiten van de GDPR modal zal een cookie gezet worden zodat nadien de GDPR modal niet meer getoond zal worden', (done) => {
		const dom = setup();
		dom.reconfigure({url: 'https://' + host});
		dom.window.addEventListener('load', function() {
			const window = dom.window;
			const document = window.document;
			const gdprModal = document.getElementById('gdpr_modal');
			const gdprModalBtn = gdprModal.getElementsByTagName('button')[0];
			gdprModalBtn.click();
			assert.include(document.cookie, 'vo_gdpr=true');
			done();
		});
	});
	
	test('wanneer de GDPR modal ooit al eens gesloten werd, zal deze niet meer getoond worden', (done) => {
		const dom = setup();
		dom.reconfigure({url: 'https://' + host});
		const window = dom.window;
		const document = window.document;
		document.cookie = gdprCookie;
		document.cookie = gdprDateCookie;
		dom.window.addEventListener('load', function() {
			document.getElementById('gdpr_modal');
			assert.notExists(document.getElementById('gdpr_modal'));
			done();
		});
	});
	
	test('wanneer de GDPR modal niet meer getoond moet worden zullen de gebruikersstatistieken nog steeds verwerkt worden', (done) => {
		const dom = setup();
		dom.reconfigure({ url: 'https://' + host });
		const window = dom.window;
		const document = window.document;
		const stub = sandbox.stub();
		stub.returns(document.createElement('script'));
		document.createTextNode = stub;
		dom.window.addEventListener('load', function() {
			assert.exists(document.getElementById('gdpr_matomo_script'));
			assert(stub.called);
			done();
		});
	});
	
	test('er zal een fout getoond worden aan de ontwikkelaar wanneer de gebruikersstatistieken niet correct werken doordat de url niet gekend is', (done) => {
		const dom = setup();
		const host = 'example.com';
		dom.reconfigure({ url: 'https://' + host });
		const window = dom.window;
		const document = window.document;
		document.cookie = gdprCookie;
		const error = sandbox.spy(console, 'error');
		dom.window.addEventListener('load', function() {
			assert.exists(document.getElementById('gdpr_matomo_script'));
			assert(error.calledWith('de website is nog niet gekend bij ons dus er zullen geen gebruikersstatistieken bijgehouden worden'));
			done();
		});
	});
	
	test('de GDPR modal zal steeds manueel geopend kunnen worden om de opt in waarden aan te kunnen passen', (done) => {
		const dom = setup();
		const window = dom.window;
		const document = window.document;
		document.cookie = gdprCookie;
		dom.window.addEventListener('load', function() {
			document.getElementById('gdpr_modal');
			window.GDPR.open();
			assert.exists(document.getElementById('gdpr_modal'));
			done();
		});
	});
	
	test('via het GDPR script kan er gevraagd worden of een opt in actief is of niet', (done) => {
		const dom = setupMetExtraOptIn(false, false);
		const window = dom.window;
		const document = window.document;
		dom.window.addEventListener('load', function() {
			assert.isFalse(window.GDPR.isOptInActive('socialmedia'));
			const gdprModal = document.getElementById('gdpr_modal');
			const gdprModalOptIn = document.getElementById('socialmedia_input');
			gdprModalOptIn.onchange({
				currentTarget: {
					checked: false
				}
			});
			const gdprModalBtn = gdprModal.getElementsByTagName('button')[0];
			gdprModalBtn.click();
			assert.isFalse(window.GDPR.isOptInActive('socialmedia'));
			done();
		});
	});
	
	test('de gebruikersstatistieken kunnen via de noodzakelijke cookies opt in optie later nog eens bevestigd worden zonder dat de opt in activatie opnieuw zal gebeuren', (done) => {
		const dom = setup();
		dom.reconfigure({ url: 'https://' + host });
		let window = dom.window;
		const document = window.document;
		const scriptStub = sandbox.stub();
		scriptStub.returns(document.createElement('script'));
		document.createTextNode = scriptStub;
		document.cookie = gdprCookie;
		dom.window.addEventListener('load', function() {
			window.GDPR.open();
			const gdprModal = document.getElementById('gdpr_modal');
			const gdprModalBtn = gdprModal.getElementsByTagName('button')[0];
			gdprModalBtn.click();
			assert.equal(document.querySelectorAll('#gdpr_matomo_script').length, 1);
			done();
		});
	});
	
	test('de GDPR modal zal standaard een opt in optie voorzien voor noodzakelijke cookies die niet uitgeschakeld kan worden', (done) => {
		const dom = setup();
		dom.window.addEventListener('load', function() {
			const window = dom.window;
			const document = window.document;
			const gdprModalOptIn = document.getElementById('functional_input');
			assert.isTrue(gdprModalOptIn.checked);
			assert.isTrue(gdprModalOptIn.disabled);
			assert.exists(gdprModalOptIn);
			done();
		});
	});
	
	test('indien er geen noodzakelijke cookies opt in voorzien wordt, zullen er geen gebruikersststatieken toegepast worden', (done) => {
		const dom = setupZonderFunctional();
		dom.window.addEventListener('load', function() {
			const window = dom.window;
			const document = window.document;
			assert.notExists(document.getElementById('gdpr_matomo_script'));
			done();
		});
	});
	
	test('de gebruikersstatistieken kunnen standaard ook uitgeschakeld worden via de analytics opt in optie', (done) => {
		const dom = setupZonderAnalytics();
		dom.window.addEventListener('load', function() {
			const window = dom.window;
			const document = window.document;
			assert.notExists(document.getElementById('gdpr_matomo_script'));
			done();
		});
	});
	
	test('via de GDPR modal kan een opt in waarde gezet worden en zal er een host cookie bewaard worden', (done) => {
		const dom = setupMetExtraOptIn();
		dom.reconfigure({ url: 'https://' + host });
		dom.window.addEventListener('load', function() {
			const window = dom.window;
			const document = window.document;
			const gdprModal = document.getElementById('gdpr_modal');
			const gdprModalBtn = gdprModal.getElementsByTagName('button')[0];
			assert.isEmpty(document.cookie);
			gdprModalBtn.click();
			assert.include(document.cookie, 'vo_socialmedia');
			done();
		});
	});
	
	test('de cookies die via de GDPR modal gezet zijn kunnen altijd manueel gereset worden', (done) => {
		const dom = setupMetExtraOptIn();
		dom.reconfigure({ url: 'https://' + host });
		dom.window.addEventListener('load', function() {
			const window = dom.window;
			const document = window.document;
			const gdprModal = document.getElementById('gdpr_modal');
			const gdprModalBtn = gdprModal.getElementsByTagName('button')[0];
			assert.isEmpty(document.cookie);
			gdprModalBtn.click();
			assert.include(document.cookie, 'vo_gdpr');
			assert.include(document.cookie, 'vo_gdpr_date');
			assert.include(document.cookie, 'vo_socialmedia');
			window.GDPR.reset();
			assert.isEmpty(document.cookie);
			done();
		});
	});

	test('na het resetten worden de waardes van de opt-ins teruggezet naar hun initiele waardes', (done) => {
		const dom = setupMetExtraOptIn(true, false);
		dom.reconfigure({ url: 'https://' + host });
		dom.window.addEventListener('load', function() {
			const window = dom.window;
			const document = window.document;
			const gdprModal = document.getElementById('gdpr_modal');
			const gdprModalBtn = gdprModal.getElementsByTagName('button')[0];
			assert.isEmpty(document.cookie);

			gdprModalBtn.click();
			assert.include(document.cookie, 'vo_gdpr=true');
			assert.include(document.cookie, 'vo_socialmedia=true');

			document.cookie = 'vo_gdpr=false';
			document.cookie = 'vo_socialmedia=false';
            assert.include(document.cookie, 'vo_gdpr=false');
            assert.include(document.cookie, 'vo_socialmedia=false');

            window.GDPR.reset();
			assert.isEmpty(document.cookie);

			window.GDPR.open();
			gdprModalBtn.click();
			assert.include(document.cookie, 'vo_gdpr=true');
			assert.include(document.cookie, 'vo_socialmedia=true');

			done();
		});
	});

	test('de gebruikersstatistieken kunnen opnieuw bevestigd worden en er zullen dan geen dubbele gebruikersstatistieken verwerkt worden', (done) => {
		const dom = setup();
		dom.reconfigure({ url: 'https://' + host });
		const window = dom.window;
		const document = window.document;
		document.cookie = gdprCookie;
		dom.window.addEventListener('load', function() {
			const script = document.getElementById('gdpr_matomo_script');
			window.eval(script.innerHTML);
			let spy = sandbox.spy(window._paq, 'push');
			const event = new window.Event('hashchange');
			window.dispatchEvent(event);
			sinon.assert.callCount(spy, 10);
			window.eval(script.innerHTML);
			window.dispatchEvent(event);
			sinon.assert.callCount(spy, 20);
			done();
		});
	});

	test('een extra opt-in toevoegen via een attribuut op de script tag zal een extra keuze toevoegen aan de GDPR modal', (done) => {
        const dom = setupMetExtraOptIn(false, true);
        const window = dom.window;
        const document = window.document;
        dom.window.addEventListener('load', function() {
            const extraOptInInput = document.getElementById('socialmedia_input');
            const extraOptInLabel = document.getElementById('socialmedia_label');
            const extraOptInDescription = document.getElementById('socialmedia_description');
            assert.exists(extraOptInInput);
            assert.isTrue(extraOptInInput.checked);
            assert.isTrue(extraOptInInput.disabled);
            assert.exists(extraOptInLabel);
            assert.exists(extraOptInDescription);
            assert.equal('sociale media', extraOptInLabel.textContent);
            assert.equal('beschrijving sociale media', extraOptInDescription.textContent);
            done();
        });
	});
	
	test('een extra-opt-in zal standaard aangevinkt zijn wanneer het value attribuut bestaat zonder waarde of de waarde true heeft', (done) => {
        let dom = setupMetExtraOptIn("", false);
        let window = dom.window;
        let document = window.document;
        dom.window.addEventListener('load', function() {
            const extraOptInInput = document.getElementById('socialmedia_input');
            assert.isTrue(extraOptInInput.checked);
            assert.isFalse(extraOptInInput.disabled);
            
            dom = setupMetExtraOptIn(true, false);
            window = dom.window;
            document = window.document;
            dom.window.addEventListener('load', function() {
                const extraOptInInput = document.getElementById('socialmedia_input');
                assert.isTrue(extraOptInInput.checked);
                assert.isFalse(extraOptInInput.disabled);
                
                dom = setupMetExtraOptIn(false, false);
                window = dom.window;
                document = window.document;
                dom.window.addEventListener('load', function() {
                    const extraOptInInput = document.getElementById('socialmedia_input');
                    assert.isFalse(extraOptInInput.checked);
                    assert.isFalse(extraOptInInput.disabled);
                    done();
                });
            });
        });
	});
	
	test('een extra-opt-in zal alleen required zijn wanneer het required attribuut bestaat zonder waarde of de waarde true heeft', (done) => {
        let dom = setupMetExtraOptIn("", "");
        let window = dom.window;
        let document = window.document;
        dom.window.addEventListener('load', function() {
            const extraOptInInput = document.getElementById('socialmedia_input');
            assert.isTrue(extraOptInInput.checked);
            assert.isTrue(extraOptInInput.disabled);
            
            dom = setupMetExtraOptIn(false, true);
            window = dom.window;
            document = window.document;
            dom.window.addEventListener('load', function() {
                const extraOptInInput = document.getElementById('socialmedia_input');
                assert.isTrue(extraOptInInput.checked);
                assert.isTrue(extraOptInInput.disabled);
                
                dom = setupMetExtraOptIn(false, false);
                window = dom.window;
                document = window.document;
                dom.window.addEventListener('load', function() {
                    const extraOptInInput = document.getElementById('socialmedia_input');
                    assert.isFalse(extraOptInInput.checked);
                    assert.isFalse(extraOptInInput.disabled);
                    done();
                });
            });
        });
	});

    test('een extra opt-in toevoegen via JavaScript zal een extra keuze toevoegen aan de GDPR modal', (done) => {
        const dom = setupZonderAutoOpen();
        const window = dom.window;
        const document = window.document;
        dom.window.addEventListener('load', function() {
        	let label = 'sociale media';
        	let description = 'beschrijving sociale media';
        	let required = true;
        	window.GDPR.addOptIn('socialmedia', label, description, false, required);
            window.GDPR.open();
            const extraOptInInput = document.getElementById('socialmedia_input');
            const extraOptInLabel = document.getElementById('socialmedia_label');
            const extraOptInDescription = document.getElementById('socialmedia_description');
            assert.exists(extraOptInInput);
            assert.equal(extraOptInInput.checked, required);
            assert.equal(extraOptInInput.disabled, required);
            assert.exists(extraOptInLabel);
            assert.exists(extraOptInDescription);
            assert.equal(label, extraOptInLabel.textContent);
            assert.equal(description, extraOptInDescription.textContent);
            done();
        });
    });
    
    test('een extra opt-in toevoegen via JavaScript zal een extra keuze toevoegen aan de GDPR modal, ook wanneer de GDPR modal al eens geopend werd', (done) => {
        const dom = setupZonderAutoOpen();
        const window = dom.window;
        const document = window.document;
        dom.window.addEventListener('load', function() {
        	let label = 'sociale media';
        	let description = 'beschrijving sociale media';
        	let required = true;
            window.GDPR.open();
        	window.GDPR.addOptIn('socialmedia', label, description, false, required);
        	window.GDPR.open();
            const extraOptInInput = document.getElementById('socialmedia_input');
            const extraOptInLabel = document.getElementById('socialmedia_label');
            const extraOptInDescription = document.getElementById('socialmedia_description');
            assert.exists(extraOptInInput);
            assert.equal(extraOptInInput.checked, required);
            assert.equal(extraOptInInput.disabled, required);
            assert.exists(extraOptInLabel);
            assert.exists(extraOptInDescription);
            assert.equal(label, extraOptInLabel.textContent);
            assert.equal(description, extraOptInDescription.textContent);
            done();
        });
    });

    test('een activation callback toevoegen zal ervoor zorgen dat de callback opgeroepen wordt als de opt-in verplicht is', (done) => {
        const dom = setupMetExtraOptIn(false, true);
        const window = dom.window;
        const document = window.document;
        dom.window.addEventListener('load', function() {
            window.GDPR.addActivationCallback('socialmedia', done);
            const gdprModal = document.getElementById('gdpr_modal');
            const gdprModalBtn = gdprModal.getElementsByTagName('button')[0];
            gdprModalBtn.click();
        });
    });

    test('een activation callback toevoegen zal ervoor zorgen dat de callback opgeroepen wordt als er opt-in wordt', (done) => {
        const dom = setupMetExtraOptIn(false, false);
        const window = dom.window;
        const document = window.document;
        dom.window.addEventListener('load', function() {
            window.GDPR.addActivationCallback('socialmedia', done);
            const gdprModal = document.getElementById('gdpr_modal');
            const gdprModalBtn = gdprModal.getElementsByTagName('button')[0];
            const socialMediaInput = document.getElementById('socialmedia_input');
            socialMediaInput.click();
            gdprModalBtn.click();
        });
    });

    test('een deactivation callback toevoegen zal ervoor zorgen dat de callback opgeroepen wordt als er opt-out wordt', (done) => {
        const dom = setupMetExtraOptIn(false, false);
		dom.reconfigure({ url: 'https://' + host });
        const window = dom.window;
        const document = window.document;
        document.cookie = gdprCookie;
        document.cookie = socialMediaCookie;
        dom.window.addEventListener('load', function() {
            window.GDPR.addDeactivationCallback('socialmedia', done);
            window.GDPR.open();
            const gdprModal = document.getElementById('gdpr_modal');
            const gdprModalBtn = gdprModal.getElementsByTagName('button')[0];
            const socialMediaInput = document.getElementById('socialmedia_input');
            socialMediaInput.click();
            gdprModalBtn.click();
        });
    });

	test('de checkbox van een opt-in met default waarde "true" wordt niet aangevinkt indien de value in de cookie false is', (done) => {
		const cookieJar = new jsdom.CookieJar();
		const url = 'https://' + host;
		cookieJar.setCookieSync('vo_socialmedia=false', url);
		let dom = setupMetExtraOptIn(true, false, cookieJar);
		dom.reconfigure({ url: url });
		let window = dom.window;
		let document = window.document;
		dom.window.addEventListener('load', function() {
			const extraOptInInput = document.getElementById('socialmedia_input');
			assert.isFalse(extraOptInInput.checked);
			done();
		});
	});

	test('wanneer de GDPR modal ooit al eens gesloten werd, maar de GDPR reset datum niet bestaat zal de modal opnieuw getoond worden', (done) => {
		const dom = setup();
		dom.reconfigure({url: 'https://' + host});
		const window = dom.window;
		const document = window.document;
		document.cookie = gdprCookie;
		dom.window.addEventListener('load', function() {
			document.getElementById('gdpr_modal');
			assert.exists(document.getElementById('gdpr_modal'));
			done();
		});
	});

	test('wanneer de GDPR modal ooit al eens gesloten werd, maar de GDPR reset datum recenter is dan de GDPR datum cookie, zal de modal opnieuw getoond worden', (done) => {
		const dom = setup();
		dom.reconfigure({url: 'https://' + host});
		const window = dom.window;
		const document = window.document;
		document.cookie = gdprCookie;
		document.cookie = 'vo_gdpr_date=1556661600000;Max-Age=2147483647;path=/';
		dom.window.addEventListener('load', function() {
			document.getElementById('gdpr_modal');
			assert.exists(document.getElementById('gdpr_modal'));
			done();
		});
	});

	test('wanneer de GDPR modal ooit al eens gesloten werd, maar de GDPR datum cookie niet ingelezen kan woorden, zal de modal opnieuw getoond worden', (done) => {
		const dom = setup();
		dom.reconfigure({url: 'https://' + host});
		const window = dom.window;
		const document = window.document;
		document.cookie = gdprCookie;
		document.cookie = 'vo_gdpr_date="geen";Max-Age=2147483647;path=/';
		dom.window.addEventListener('load', function() {
			document.getElementById('gdpr_modal');
			assert.exists(document.getElementById('gdpr_modal'));
			done();
		});
	});
});