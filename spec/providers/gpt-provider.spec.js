import { expect } from 'chai';
import { spy, stub } from 'sinon';
import { GptProvider } from '../../src/providers/gpt-provider';
import { context } from '../../src/services/context-service';

let provider;
let pubads;
let isInitializedCb;

describe('gpt-provider', () => {
	before(() => {
		isInitializedCb = stub(GptProvider.prototype, 'isInitialized');
	});

	after(() => {
		isInitializedCb.reset();
	});

	beforeEach(() => {
		isInitializedCb.returns(false);

		pubads = {
			addEventListener: spy(),
			disableInitialLoad: spy(),
			enableSingleRequest: spy(),
			setRequestNonPersonalizedAds: spy()
		};

		window.googletag = {
			pubads: () => pubads,
			enableServices: spy()
		};

		window.googletag.cmd = window.googletag.cmd || [];
		window.googletag.cmd.push = (cb) => {
			cb();
		};

		context.set('options.trackingOptIn', true);
	});

	afterEach(() => {
		isInitializedCb.reset();
	});

	it('initialise and setup gpt provider', () => {
		isInitializedCb.callThrough();

		provider = new GptProvider();
		provider = new GptProvider();
		provider = new GptProvider();

		expect(pubads.disableInitialLoad.called).to.be.true;
		expect(pubads.enableSingleRequest.called).to.be.true;
		expect(pubads.addEventListener.calledTwice).to.be.true;
		expect(pubads.setRequestNonPersonalizedAds.calledWith(0)).to.be.true;
	});

	it('initialise with non personalized ads when tracking in is disabled', () => {
		context.set('options.trackingOptIn', false);

		provider = new GptProvider();
		provider.setupNonPersonalizedAds();

		expect(pubads.setRequestNonPersonalizedAds.calledWith(1)).to.be.true;
	});

	it('should not enable Single Request Architecture if context.options.isSraDisabled is true', () => {
		context.set('options.isSraDisabled', true);

		provider = new GptProvider();

		expect(pubads.enableSingleRequest.called).to.be.false;
	});

	it('should enable Single Request Architecture if context.options.isSraDisabled is false', () => {
		context.set('options.isSraDisabled', false);

		provider = new GptProvider();

		expect(pubads.enableSingleRequest.called).to.be.true;
	});
});
