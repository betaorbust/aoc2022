import { expect, test, describe } from '@jest/globals';
import { part1, part2 } from './solve';

const testCasesPt1: [string, number][] = [
	[``, 0],
	[`10`, 10],
	[
		`1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`,
		24_000,
	],
];

const testCasesPt2: [string, number][] = [
	[``, 0],
	[`10`, 10],
	[`10\n20\n\n10\n\n15`, 55],
	[
		`1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`,
		45_000,
	],
];

describe('Day 1', () => {
	test.each(testCasesPt1)(
		'Part 1. Input: %s. Output: %s',
		(input, expected) => {
			expect(part1(input)).toBe(expected);
		}
	);
	test.each(testCasesPt2)(
		'Part 2. Input: %s. Output: %s',
		(input, expected) => {
			expect(part2(input)).toBe(expected);
		}
	);
});
