import { part1 } from './part1';
import { part2 } from './part2';

const testCasesPt1: [Parameters<typeof part1>[0], ReturnType<typeof part1>][] =
	[
		[
			`R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`,
			13,
		],
	];

describe('Day 9, part 1', () => {
	test.each(testCasesPt1)('Input: %s. Output: %s', (input, expected) => {
		expect(part1(input)).toBe(expected);
	});
});

const testCasesPt2: [Parameters<typeof part2>[0], ReturnType<typeof part2>][] =
	[
		[
			`R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20`,
			36,
		],
	];

describe('Day 9, part 2', () => {
	test.each(testCasesPt2)('Input: %s. Output: %s', (input, expected) => {
		expect(part2(input)).toBe(expected);
	});
});
