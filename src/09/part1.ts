import { Vector } from '../junk-drawer';

type Instruction = {
	dir: 'L' | 'R' | 'U' | 'D';
	dist: number;
};

const MAX_DISTANCE = Math.sqrt(2);
type StepCallback = (head: Vector, tail: Vector) => void;

/**
 * turn the input into a list of instructions
 */
function parseInput(input: string): Instruction[] {
	return input.split('\n').map((line) => {
		const [dir, dist] = line.split(' ');
		if (!(dir === 'L' || dir === 'R' || dir === 'U' || dir === 'D')) {
			throw new Error('Invalid direction');
		}
		return { dir, dist: Number.parseInt(dist, 10) };
	});
}

/**
 * Execute a single move, returning the new head and tail locations
 */
function executeMove(
	dir: Instruction['dir'],
	head: Vector,
	tail: Vector
): [newHead: Vector, newTail: Vector] {
	// first move the head
	let newHead: Vector;
	switch (dir) {
		case 'L':
			newHead = head.add(new Vector(-1, 0));
			break;
		case 'R':
			newHead = head.add(new Vector(1, 0));
			break;
		case 'U':
			newHead = head.add(new Vector(0, 1));
			break;
		case 'D':
			newHead = head.add(new Vector(0, -1));
			break;
		default:
			throw new Error('Invalid direction');
	}

	// Special case for overlap. Just leave tail where it is.
	if (newHead.isEqualTo(tail)) {
		return [newHead, tail];
	}

	// get the difference from the head to the tail
	const headToTail = tail.subtract(newHead);
	// normalize to MAX_DISTANCE
	const headToTailNormalized = headToTail
		.normalize()
		.scalarMultiply(MAX_DISTANCE);

	// Find where a normalized tail would go
	const newTail = newHead.add(headToTailNormalized);
	// round it to the nearest integer
	return [newHead, new Vector(Math.round(newTail.x), Math.round(newTail.y))];
}

/**
 * Run our list of instructions, calling stepCallback on every step
 */
function runInstructions(
	instructions: Instruction[],
	stepCallback: StepCallback
): void {
	let headLocation: Vector = new Vector(0, 0);
	let tailLocation: Vector = new Vector(0, 0);

	for (const instruction of instructions) {
		for (let i = 0; i < instruction.dist; i += 1) {
			[headLocation, tailLocation] = executeMove(
				instruction.dir,
				headLocation,
				tailLocation
			);
			stepCallback(headLocation, tailLocation);
		}
	}
}

/**
 Part 1
*/
export const part1 = (input: string): number => {
	const instructions = parseInput(input);
	const locationsTailHasBeen = new Set<string>();
	const stepCallback: StepCallback = (head, tail) => {
		locationsTailHasBeen.add(tail.toString());
	};
	runInstructions(instructions, stepCallback);
	return locationsTailHasBeen.size;
};
