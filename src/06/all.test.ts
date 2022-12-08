import { expect, test, describe } from '@jest/globals';
import { part1 } from './part1';
// import { part2 } from './part2';

const testCasesPt1: [Parameters<typeof part1>[0], ReturnType<typeof part1>][] =
	[
		['bvwbjplbgvbhsrlpgdmjqwftvncz', 5],
		['nppdvjthqldpwncqszvftbrmjlhg', 6],
		['nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg', 10],
		['zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw', 11],
	];

// const testCasesPt2: [Parameters<typeof part2>[0], ReturnType<typeof part2>][] = [];

describe('Day 6', () => {
	test.each(testCasesPt1)(
		'Part 1. Input: %s. Output: %s',
		(input, expected) => {
			expect(part1(input)).toBe(expected);
		}
	);
	//	test.each(testCasesPt2)(
	//		'Part 2. Input: %s. Output: %s',
	//		(input, expected) => {
	//			expect(part2(input)).toBe(expected);
	//		}
	//	);
});
