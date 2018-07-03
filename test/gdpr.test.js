const chai = require('chai');
const jsdom = require('jsdom');
const sinon = require('sinon');

const { assert } = chai;
const { JSDOM } = jsdom;

function setup() {
	return new JSDOM(`
		<head>
			<script src='./gdpr.js'></script>
		</head>
	`, {
		runScripts: 'dangerously',
		resources: 'usable'
	});
}

const sandbox = sinon.createSandbox();

teardown(() => {
	sandbox.restore();
});

suite('gdpr', function() {
	test('het laden van het gdpr script zal een GDPR object op de window zetten', (done) => {
		const dom = setup();
		dom.window.addEventListener('load', function() {
			const window = dom.window;
			const document = window.document;
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
	
	test('bij het sluiten van de GDPR modal zal een cookie gezet worden zodat nadien de GDPR modal niet meer getoond zal worden', (done) => {
		const dom = setup();
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
		const window = dom.window;
		const document = window.document;
		document.cookie = 'vo_gdpr=true;2147483647;path=/';
		dom.window.addEventListener('load', function() {
			const gdprModal = document.getElementById('gdpr_modal');
			assert.notExists(document.getElementById('gdpr_modal'));
			done();
		});
	});
	
	test('wanneer de GDPR modal niet meer getoond moet worden maar de gebruikersstatistieken zullen verwerkt worden indien ze eerder goedgekeurd werden', (done) => {
		const dom = setup();
		dom.reconfigure({ url: "https://zendantennes-ontwikkel.milieuinfo.be" });
		const window = dom.window;
		const document = window.document;
		const stub = sandbox.stub();
		stub.returns(document.createElement('script'));
		document.createTextNode = stub;
		document.cookie = 'vo_gdpr=true;2147483647;path=/';
		document.cookie = 'vo_matomo=true;2147483647;path=/';
		dom.window.addEventListener('load', function() {
			assert.exists(document.getElementById('gdpr_matomo_script'));
			assert.include(document.cookie, 'vo_matomo');
			assert(stub.called);
			done();
		});
	});
	
	test('er zal een fout getoond worden aan de ontwikkelaar wanneer de gebruikersstatistieken niet correct werken doordat de url niet gekend is', (done) => {
		const dom = setup();
		dom.reconfigure({ url: "https://example.com" });
		const window = dom.window;
		const document = window.document;
		document.cookie = 'vo_gdpr=true;2147483647;path=/';
		document.cookie = 'vo_matomo=true;2147483647;path=/';
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
		document.cookie = 'vo_gdpr=true;2147483647;path=/';
		dom.window.addEventListener('load', function() {
			const gdprModal = document.getElementById('gdpr_modal');
			window.GDPR.open();
			assert.exists(document.getElementById('gdpr_modal'));
			done();
		});
	});
	
	test('de gebruikersstatistieken kunnen later nog eens bevestigd worden zonder dat de opt in activatie opnieuw zal gebeuren', (done) => {
		const dom = setup();
		dom.reconfigure({ url: "https://zendantennes-ontwikkel.milieuinfo.be" });
		let window = dom.window;
		const document = window.document;
		const scriptStub = sandbox.stub();
		scriptStub.returns(document.createElement('script'));
		document.createTextNode = scriptStub;
		document.cookie = 'vo_gdpr=true;2147483647;path=/';
		document.cookie = 'vo_matomo=true;2147483647;path=/';
		dom.window.addEventListener('load', function() {
			window.GDPR.open();
			const gdprModal = document.getElementById('gdpr_modal');
			const gdprModalBtn = gdprModal.getElementsByTagName('button')[0];
			gdprModalBtn.click();
			assert.equal(document.querySelectorAll('#gdpr_matomo_script').length, 1);
			done();
		});
	});
	
	test('de gebruikersstatistieken kunnen later uitgezet worden en er zullen dan geen gebruikersstatistieken meer verwerkt worden', (done) => {
		const dom = setup();
		dom.reconfigure({ url: "https://zendantennes-ontwikkel.milieuinfo.be" });
		let window = dom.window;
		const document = window.document;
		const scriptStub = sandbox.stub();
		scriptStub.returns(document.createElement('script'));
		document.createTextNode = scriptStub;
		document.cookie = 'vo_gdpr=true;2147483647;path=/';
		document.cookie = 'vo_matomo=true;2147483647;path=/';
		dom.window.addEventListener('load', function() {
			assert.exists(document.getElementById('gdpr_matomo_script'));
			window.GDPR.reset();
			assert.notExists(document.getElementById('gdpr_matomo_script'));
			assert.notExists(document.getElementById('gdpr_matomo_piwik_script'));
			done();
		});
	});
	
	test('de GDPR modal zal standaard een opt in optie voorzien voor gebruikersstatistieken', (done) => {
		const dom = setup();
		dom.window.addEventListener('load', function() {
			const window = dom.window;
			const document = window.document;
			const gdprModalOptIn = document.getElementById('matomo_input');
			assert.exists(gdprModalOptIn);
			done();
		});
	});
	
	test('via de GDPR modal kan een opt in waarde gezet worden en zal er een cookie bewaard worden', (done) => {
		const dom = setup();
		dom.window.addEventListener('load', function() {
			const window = dom.window;
			const document = window.document;
			const gdprModal = document.getElementById('gdpr_modal');
			const gdprModalBtn = gdprModal.getElementsByTagName('button')[0];
			assert.isEmpty(document.cookie);
			gdprModalBtn.click();
			assert.include(document.cookie, 'vo_matomo');
			done();
		});
	});
	
	test('de cookies die via de GDPR modal gezet zijn kunnnen altijd manueel gereset worden', (done) => {
		const dom = setup();
		dom.window.addEventListener('load', function() {
			const window = dom.window;
			const document = window.document;
			const gdprModal = document.getElementById('gdpr_modal');
			const gdprModalBtn = gdprModal.getElementsByTagName('button')[0];
			assert.isEmpty(document.cookie);
			gdprModalBtn.click();
			assert.include(document.cookie, 'vo_gdpr');
			assert.include(document.cookie, 'vo_matomo');
			window.GDPR.reset();
			assert.isEmpty(document.cookie);
			done();
		});
	});
});