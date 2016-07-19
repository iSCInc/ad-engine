'use strict';

import AdSlot from '../../src/models/ad-slot';
import Context from '../../src/services/context-service';
import ConfigMock from '../config-mock';

QUnit.module('AdSlot test', {
	beforeEach: () => {
		Context.extend(ConfigMock);
	}
});

QUnit.test('exception when id is wrong', function (assert) {
	assert.expect(1);

	assert.throws(
		() => {
			new AdSlot({
				id: 'gpt-foo'
			});
		},
		'Invalid id should throw error'
	);
});

QUnit.test('base properties', function (assert) {
	assert.expect(4);

	let adSlot = new AdSlot({
		id: 'gpt-top-leaderboard'
	});

	assert.equal(adSlot.getId(), 'gpt-top-leaderboard');
	assert.equal(adSlot.getSlotName(), 'TOP_LEADERBOARD');
	assert.equal(adSlot.getSizes().length > 0, true);
	assert.equal(adSlot.getDefaultSizes().length > 0, true);
});

QUnit.test('home ad unit', function (assert) {
	assert.expect(1);

	Context.set('custom.pageType', 'home');
	let adSlot = new AdSlot({
		id: 'gpt-top-leaderboard'
	});

	assert.equal(adSlot.getAdUnit(), '/5441/something/_home/TOP_LEADERBOARD');
});

QUnit.test('vertical ad unit', function (assert) {
	assert.expect(1);

	Context.set('custom.pageType', 'vertical');
	let adSlot = new AdSlot({
		id: 'gpt-top-leaderboard'
	});

	assert.equal(adSlot.getAdUnit(), '/5441/something/_vertical/TOP_LEADERBOARD');
});

QUnit.test('with article ad unit', function (assert) {
	assert.expect(1);

	Context.set('custom.pageType', 'article');
	let adSlot = new AdSlot({
		id: 'gpt-top-boxad'
	});

	assert.equal(adSlot.getAdUnit(), '/5441/something/_article/TOP_BOXAD');
});

QUnit.test('with other ad unit', function (assert) {
	assert.expect(1);

	Context.set('custom.pageType', 'other');
	let adSlot = new AdSlot({
		id: 'gpt-top-skin'
	});

	assert.equal(adSlot.getAdUnit(), '/5441/something/_other/INVISIBLE_SKIN');
});

QUnit.test('mobile ad', function (assert) {
	assert.expect(2);

	let mobileAd = new AdSlot({
		id: 'gpt-top-leaderboard-mobile'
	});

	Context.set('state.isMobile', true);
	assert.strictEqual(
		mobileAd.shouldLoad(),
		true,
		'mobile-only ad should be loaded on mobile screen size'
	);

	Context.set('state.isMobile', false);
	assert.strictEqual(
		mobileAd.shouldLoad(),
		false,
		'desktop-only ad should not be loaded on mobile screen size'
	);
});

QUnit.test('desktop ad', function (assert) {
	assert.expect(2);

	let desktopAd = new AdSlot({
		id: 'gpt-top-leaderboard-desktop'
	});

	Context.set('state.isMobile', true);
	assert.strictEqual(
		desktopAd.shouldLoad(),
		false,
		'desktop-only ad should not be loaded on mobile screen size'
	);

	Context.set('state.isMobile', false);
	assert.strictEqual(
		desktopAd.shouldLoad(),
		true,
		'desktop-only ad should be loaded on desktop screen size'
	);
});

QUnit.test('ad for all screen sizes', function (assert) {
	assert.expect(2);

	let adSlot = new AdSlot({
		id: 'gpt-top-leaderboard'
	});

	Context.set('state.isMobile', true);
	assert.strictEqual(
		adSlot.shouldLoad(),
		true,
		'ad should be loaded on mobile screen size'
	);

	Context.set('state.isMobile', false);
	assert.strictEqual(
		adSlot.shouldLoad(),
		true,
		'ad should be loaded on desktop screen size'
	);
});
