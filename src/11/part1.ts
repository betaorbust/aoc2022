/**
 * @fileoverview
 * 1. Break up that horrible input and build a list of monkeys that know
 *   how to evaluate and pass items around and to record when they inspect
 *   an item.
 * 2. Run 20 rounds
 * 3. Sort the monkey inspections and multiply the top two
 */

/**
 * A callback that happens at the end of each inspection to
 * let us hook into the process.
 */

type Test = (value: number) => string;

class Monkey {
	readonly id: string;

	private inspections: number;

	private items: number[];

	private operation: (old: number) => number;

	private test: Test;

	constructor(
		id: string,
		items: number[],
		operationString: string,
		test: Test
	) {
		this.id = id;
		this.items = items;
		// Look away, ESLint, look away 🫠
		/* eslint-disable-next-line @typescript-eslint/no-unused-vars, no-eval */
		this.operation = (old: number): number => eval(operationString);
		this.test = test;
		this.inspections = 0;
	}

	getInspections(): number {
		return this.inspections;
	}

	addItem(value: number): void {
		this.items.push(value);
	}

	doTurn(monkeys: Monkey[]): void {
		let item = this.items.shift();
		while (item) {
			// Do the operation to get the initial worry level and then
			// divide by when the monkey gets bored
			const worryLevelAfter = Math.floor(this.operation(item) / 3);
			// get the target for the throw
			const targetId = this.test(worryLevelAfter);
			const target = monkeys.find((m) => m.id === targetId);
			if (!target) {
				throw new Error(`Invalid target ${targetId}`);
			}

			// Give the target monkey the item
			target.addItem(worryLevelAfter);

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
function parseInput(input: string): Monkey[] {
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
		const divisor = Number.parseInt(matches[4], 10);
		const trueTarget = matches[5];
		const falseTarget = matches[6];
		// Build up the test function from the divisor and the targets
		const test = (value: number): string =>
			value % divisor === 0 ? trueTarget : falseTarget;

		// Make monkey!
		return new Monkey(id, items, operationString, test);
	});
	return monkeys;
}

/**
 * How many rounds to run
 */
const ROUNDS = 20;

/**
 Part 1
*/
export const part1 = (input: string): number => {
	const monkeys = parseInput(input);
	for (let i = 0; i < ROUNDS; i += 1) {
		monkeys.forEach((monkey) => monkey.doTurn(monkeys));
	}

	const [most, secondMost] = monkeys
		.map((m) => m.getInspections())
		.sort((a, b) => b - a);
	return most * secondMost;
};
