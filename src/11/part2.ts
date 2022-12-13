import { parseInput, runForRounds } from './part1';

/**
 Part 2
*/
export const part2 = (input: string): number => {
	const [monkeys, leastCommonMultiple] = parseInput(input, 1);
	const monkeyBusinessScore = runForRounds(
		monkeys,
		leastCommonMultiple,
		10_000
	);
	console.log(monkeys);
	return monkeyBusinessScore;
};
