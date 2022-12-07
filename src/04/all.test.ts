import { expect, test, describe } from '@jest/globals';
import { part1 } from './part1';
import { part2 } from './part2';

const testCasesPt1: [Parameters<typeof part1>[0], ReturnType<typeof part1>][] =
	[
		[
			`2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`,
			2,
		],
	];

const testCasesPt2: [Parameters<typeof part2>[0], ReturnType<typeof part2>][] =
	[
		[
			`2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`,
			4,
		],
	];

describe('Day 4', () => {
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
