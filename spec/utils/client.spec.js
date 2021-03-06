import { expect } from 'chai';
import { client } from '../../src/utils/client';

describe('client', () => {
	it('checkBlocking works correctly', () => {
		let blocker = false,
			notBlocked = false;

		client.checkBlocking(() => { blocker = true; }, () => { notBlocked = true; });

		// Failed to load plugin because lack of window = simulate blocking extension by disabling import
		expect(blocker).to.equal(true);
		expect(notBlocked).to.equal(false);
	});
});
