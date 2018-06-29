const chai = require('chai');
const jsdom = require('jsdom');

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

suite('gdpr', function() {
	test('het laden van het gdpr script zal een GDPR object op de window zetten', function(done) {
		let dom = setup();
		dom.window.addEventListener('load', function() {
			let window = dom.window;
			let document = window.document;
			assert.exists(window.GDPR);
			done();
		});
	});
	
	test('het laden van het gdpr script zal een GDPR modal en overlay toevoegen aan de dom', function(done) {
		let dom = setup();
		dom.window.addEventListener('load', function() {
			let window = dom.window;
			let document = window.document;
			assert.exists(document.getElementById('gdpr_modal'));
			assert.exists(document.getElementById('gdpr_overlay'));
			done();
		});
	});
	
	test('de GDPR modal bevat een confirm knop waarmee de modal gesloten kan worden', function(done) {
		let dom = setup();
		dom.window.addEventListener('load', function() {
			let window = dom.window;
			let document = window.document;
			let gdprModal = document.getElementById('gdpr_modal');
			let gdprModalBtns = gdprModal.getElementsByTagName('button');
			assert.equal(gdprModalBtns.length, 1);
			let gdprModalBtn = gdprModalBtns[0];
			assert.exists(document.getElementById('gdpr_modal'));
			gdprModalBtn.click();
			assert.notExists(document.getElementById('gdpr_modal'));
			done();
		});
	});
	
	test('bij het sluiten van de GDPR modal zal een cookie gezet worden zodat nadien de GDPR modal niet meer getoond zal worden', function(done) {
		let dom = setup();
		dom.window.addEventListener('load', function() {
			let window = dom.window;
			let document = window.document;
			let gdprModal = document.getElementById('gdpr_modal');
			let gdprModalBtn = gdprModal.getElementsByTagName('button')[0];
			gdprModalBtn.click();
			assert.include(document.cookie, 'vo_gdpr=true');
			done();
		});
	});
	
	test('wanneer de GDPR modal ooit al eens gesloten werd, zal deze niet meer getoond worden', function(done) {
		let dom = setup();
		let window = dom.window;
		let document = window.document;
		document.cookie = 'vo_gdpr=true;2147483647;path=/';
		dom.window.addEventListener('load', function() {
			let gdprModal = document.getElementById('gdpr_modal');
			assert.notExists(document.getElementById('gdpr_modal'));
			done();
		});
	});
	
	test('de GDPR modal zal steeds manueel geopend kunnen worden om de opt in waarden aan te kunnen passen', function(done) {
		let dom = setup();
		let window = dom.window;
		let document = window.document;
		document.cookie = 'vo_gdpr=true;2147483647;path=/';
		dom.window.addEventListener('load', function() {
			let gdprModal = document.getElementById('gdpr_modal');
			assert.notExists(document.getElementById('gdpr_modal'));
			window.GDPR.open();
			assert.exists(document.getElementById('gdpr_modal'));
			done();
		});
	});
	
	test('de GDPR modal zal standaard een opt in optie voorzien voor analytics', function(done) {
		let dom = setup();
		dom.window.addEventListener('load', function() {
			let window = dom.window;
			let document = window.document;
			let gdprModal = document.getElementById('gdpr_modal');
			let gdprModalOptIns = gdprModal.getElementsByTagName('input');
			assert.equal(gdprModalOptIns.length, 1);
			let gdprModalOptIn = gdprModalOptIns[0];
			assert.exists(gdprModalOptIn);
			done();
		});
	});
	
	test('via de GDPR modal kan een opt in waarde gezet worden en zal er een cookie bewaard worden', function(done) {
		let dom = setup();
		dom.window.addEventListener('load', function() {
			let window = dom.window;
			let document = window.document;
			let gdprModal = document.getElementById('gdpr_modal');
			let gdprModalBtn = gdprModal.getElementsByTagName('button')[0];
			assert.isEmpty(document.cookie);
			gdprModalBtn.click();
			assert.include(document.cookie, 'vo_matomo');
			done();
		});
	});
	
	test('de cookies die via de GDPR modal gezet zijn kunnnen altijd manueel gereset worden', function(done) {
		let dom = setup();
		dom.window.addEventListener('load', function() {
			let window = dom.window;
			let document = window.document;
			let gdprModal = document.getElementById('gdpr_modal');
			let gdprModalBtn = gdprModal.getElementsByTagName('button')[0];
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