import { expect, test, describe } from '@jest/globals';
import { part1, parseBoard } from './part1';
// import { part2 } from './part2';

const testCasesPt1: [Parameters<typeof part1>[0], ReturnType<typeof part1>][] =
	[
		[
			`    [D]    
[N] [C]    
[Z] [M] [P]
	1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`,
			'CMZ',
		],
	];

// const testCasesPt2: [Parameters<typeof part2>[0], ReturnType<typeof part2>][] = [];

describe('Day 5', () => {
	test('board parsing', () => {
		const input = testCasesPt1[0][0];
		expect(parseBoard(input)).toEqual({
			board: [['N', 'Z'], ['D', 'C', 'M'], ['P']],
			instructions: [
				[1, 1, 0],
				[3, 0, 2],
				[2, 1, 0],
				[1, 0, 1],
			],
		});
	});
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
