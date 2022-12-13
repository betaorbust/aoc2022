/**
 * @fileoverview
 * 1. Break up that horrible input and build a list of monkeys that know
 *   how to evaluate and pass items around and to record when they inspect
 *   an item.
 * 2. Run 20 rounds
 * 3. Sort the monkey inspections and multiply the top two
 *
 * LARGE UPDATE FOR PART 2.
 * In part 2, we can't use full calculations any more, because the anxiety
 * gets too large (too large for BigInt to handle, anyway). So we need to
 * notice that everything is in prime numbers, and that we if instead of
 * passing around the whole anxiety, we just pass around the mod of the
 * anxiety with the least common multiple of the test divisors, then we
 * get to use numbers that computers can handle.
 *
 * Honestly, this is too much of a trick for me -- not my favorite kind of
 * puzzle.
 */

/**
 * A callback that happens at the end of each inspection to
 * let us hook into the process.
 */

type Test = (value: number) => string;
export class Monkey {
	readonly id: string;

	private inspections: number;

	private items: number[];

	private operation: (old: number) => number;

	private calmDownDivisor: number;

	private testDivisor: number;

	private test: Test;

	constructor(
		id: string,
		items: number[],
		operationString: string,
		calmDownDivisor: number,
		testDivisor: number,
		trueTarget: string,
		falseTarget: string
	) {
		this.id = id;
		this.items = items;
		// Look away, ESLint, look away 🫠
		/* eslint-disable-next-line @typescript-eslint/no-unused-vars, no-eval */
		this.operation = (old: number): number => eval(operationString);
		this.inspections = 0;
		this.calmDownDivisor = calmDownDivisor;
		this.testDivisor = testDivisor;
		// Build up the test function from the divisor and the targets
		this.test = (value: number): string =>
			value % testDivisor === 0 ? trueTarget : falseTarget;
	}

	getInspections(): number {
		return this.inspections;
	}

	getTestDivisor(): number {
		return this.testDivisor;
	}

	addItem(value: number): void {
		this.items.push(value);
	}

	doTurn(monkeys: Monkey[], leastCommonMultiple: number): void {
		let item = this.items.shift();
		while (item) {
			// Do the operation to get the initial worry level and then
			// divide by when the monkey gets bored
			const worryLevelAfter = Math.floor(
				this.operation(item) / this.calmDownDivisor
			);
			// get the target for the throw
			const targetId = this.test(worryLevelAfter);
			const target = monkeys.find((m) => m.id === targetId);
			if (!target) {
				throw new Error(`Invalid target ${targetId}`);
			}

			const worryLevelModded = worryLevelAfter % leastCommonMultiple;

			// Give the target monkey the item
			target.addItem(worryLevelModded);

			// Mark down that we've inspected an item
			this.inspections += 1;

			// Get the next one
			item = this.items.shift();
		}
	}
}

/**
 * Turn the monkey description into a list of monkeys
 * and bind the inspection callback into them.
 */
export function parseInput(
	input: string,
	calmDownDivisor: number
): [Monkey[], number] {
	let leastCommonMultiple = 1;
	const monkeys: Monkey[] = input.split('\n\n').map((monkeyText) => {
		// you know what? I'm not even sorry
		const matches = monkeyText.match(
			/Monkey (\d*):\n\s*Starting items: (.*)\n\s*Operation: new = (.*)\n.*divisible by (\d*)\n.*throw to monkey (\d*)\n.*throw to monkey (\d*)/
		);
		if (!matches) {
			throw new Error('Invalid monkey');
		}

		// Just naming things nicely so I don't lose track of them
		const id = matches[1];
		const items = matches[2].split(', ').map((m) => Number.parseInt(m, 10));
		const operationString = matches[3];
		const testDivisor = Number.parseInt(matches[4], 10);
		const trueTarget = matches[5];
		const falseTarget = matches[6];

		leastCommonMultiple *= testDivisor;

		// Make monkey!
		return new Monkey(
			id,
			items,
			operationString,
			calmDownDivisor,
			testDivisor,
			trueTarget,
			falseTarget
		);
	});
	return [monkeys, leastCommonMultiple];
}

/**
 * Take a list of monkeys and run them for a number of rounds,
 * returning the top two monkey business score.
 */
export function runForRounds(
	monkeys: Monkey[],
	leastCommonMultiple: number,
	rounds: number
): number {
	for (let i = 0; i < rounds; i += 1) {
		monkeys.forEach((monkey) => monkey.doTurn(monkeys, leastCommonMultiple));
	}
	const [most, secondMost] = monkeys
		.map((m) => m.getInspections())
		.sort((a, b) => b - a);
	return most * secondMost;
}

/**
 Part 1
*/
export const part1 = (input: string): number => {
	const [monkeys, leastCommonMultiple] = parseInput(input, 3);
	return runForRounds(monkeys, leastCommonMultiple, 20);
};
