'use strict';

import VastBuilder from '../../src/video/vast-builder';
import Context from '../../src/services/context-service';

QUnit.module('VastBuilder test', {
	beforeEach: () => {
		Context.extend({
			vast: {
				adUnitId: '/0000/HELLO/world',
				size: [300, 250]
			},
			targeting: {
				uno: 'foo',
				due: 15,
				tre: [ 'bar', 'zero' ],
				quattro: null
			}
		});
	}
});

QUnit.test('build URL with DFP domain', function (assert) {
	const vastUrl = VastBuilder.build();

	assert.ok(vastUrl.match(/^https:\/\/pubads\.g\.doubleclick\.net\/gampad\/ads/g));
});

QUnit.test('build URL with required DFP parameters', function (assert) {
	const vastUrl = VastBuilder.build();

	assert.ok(vastUrl.match(/output=vast&/g));
	assert.ok(vastUrl.match(/&env=vp&/g));
	assert.ok(vastUrl.match(/&gdfp_req=1&/g));
	assert.ok(vastUrl.match(/&impl=s&/g));
	assert.ok(vastUrl.match(/&unviewed_position_start=1&/g));
});

QUnit.test('build URL with configured ad unit', function (assert) {
	const vastUrl = VastBuilder.build();

	assert.ok(vastUrl.match(/&iu=\/0000\/HELLO\/world&/g));
});

QUnit.test('build URL with ad size', function (assert) {
	const vastUrl = VastBuilder.build();

	assert.ok(vastUrl.match(/&sz=300x250&/g));
});

QUnit.test('build URL with referrer', function (assert) {
	const vastUrl = VastBuilder.build();

	assert.ok(vastUrl.match(/&url=http:\/\/localhost/g));
});

QUnit.test('build URL with numeric correlator', function (assert) {
	const vastUrl = VastBuilder.build();

	assert.ok(vastUrl.match(/&correlator=\d+&/g));
});

QUnit.test('build URL with page level targeting', function (assert) {
	const vastUrl = VastBuilder.build();

	assert.ok(vastUrl.match(/&cust_params=uno%3Dfoo%26due%3D15%26tre%3Dbar%2Czero$/g));
});