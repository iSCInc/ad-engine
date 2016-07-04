'use strict';

/**
 * Turns an array in a LazyQueue
 *
 * @public
 *
 * @param {Array} queue An array of values
 * @param {Function} callback The callback to apply to each array item
 */
export function makeLazyQueue(queue, callback) {
	if (typeof callback !== 'function') {
		throw new Error('LazyQueue used with callback not being a function');
	} else if (queue instanceof Array) {
		queue.start = function () {
			while (queue.length > 0) {
				callback(queue.shift());
			}
			queue.push = function (item) {
				callback(item);
			};
		};
	} else {
		throw new Error('LazyQueue requires an array as the first parameter');
	}
}
