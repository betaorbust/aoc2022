import { expect, test, describe } from '@jest/globals';
import { arrayPartition, setIntersection } from './junk-drawer';

describe('setUnion', () => {
	test('One set', () => {
		expect(setIntersection([new Set([1, 2, 3])])).toEqual(new Set([1, 2, 3]));
	});
	test('Two sets', () => {
		expect(setIntersection([new Set([1, 2, 3]), new Set([2, 3, 4])])).toEqual(
			new Set([2, 3])
		);
	});
	test('Three sets', () => {
		expect(
			setIntersection([
				new Set([1, 2, 3]),
				new Set([2, 3, 4]),
				new Set([3, 4, 5]),
			])
		).toEqual(new Set([3]));
	});
});

describe('partitionArray', () => {
	test('By 1', () => {
		expect(arrayPartition([1, 2, 3, 4, 5, 6, 7, 8, 9], 1)).toEqual([
			[1],
			[2],
			[3],
			[4],
			[5],
			[6],
			[7],
			[8],
			[9],
		]);
	});
	test('By 2', () => {
		expect(arrayPartition([1, 2, 3, 4, 5, 6, 7, 8, 9], 2)).toEqual([
			[1, 2],
			[3, 4],
			[5, 6],
			[7, 8],
			[9],
		]);
	});
	test('By 3', () => {
		expect(arrayPartition([1, 2, 3, 4, 5, 6, 7, 8, 9], 3)).toEqual([
			[1, 2, 3],
			[4, 5, 6],
			[7, 8, 9],
		]);
	});
});
