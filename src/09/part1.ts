import { Vector } from '../junk-drawer';

type Instruction = {
	dir: 'L' | 'R' | 'U' | 'D';
	dist: number;
};

export type Rope = Vector[];

const MAX_DISTANCE = Math.sqrt(2);
type StepCallback = (rope: Rope) => void;

/**
 * turn the input into a list of instructions
 */
export function parseInput(input: string): Instruction[] {
	return input.split('\n').map((line) => {
		const [dir, dist] = line.split(' ');
		if (!(dir === 'L' || dir === 'R' || dir === 'U' || dir === 'D')) {
			throw new Error('Invalid direction');
		}
		return { dir, dist: Number.parseInt(dist, 10) };
	});
}

/**
 * Resolve the updated position of the next knot in the rope
 */
function resolveNextKnot(head: Vector, next: Vector): Vector {
	// Special case for overlap. Just leave tail where it is.
	if (head.isEqualTo(next)) {
		return next;
	}
	// get the difference from the head to the tail
	const headToNext = next.subtract(head);
	// normalize to MAX_DISTANCE
	const headToNextNormalized = headToNext
		.normalize()
		.scalarMultiply(MAX_DISTANCE);

	// Find where a normalized tail would go
	const newNext = head.add(headToNextNormalized);
	// round it to the nearest integer
	return new Vector(Math.round(newNext.x), Math.round(newNext.y));
}

/**
 * Modify the rope to resolve any needed motion
 */
function resolveRope(rope: Rope): Rope {
	return rope.reduce<Rope>((result, current, currentIndex) => {
		if (currentIndex === 0) {
			return [current];
		}
		const previous = result[currentIndex - 1];
		return [...result, resolveNextKnot(previous, current)];
	}, []);
}

/**
 * Execute a single move, returning the new head and tail locations
 */
function executeMove(dir: Instruction['dir'], rope: Rope): Rope {
	const [head, ...rest] = rope;

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

	// then resolve the rest of the rope to match
	return resolveRope([newHead, ...rest]);
}

/**
 * Run our list of instructions, calling stepCallback on every step
 */
export function runInstructions(
	instructions: Instruction[],
	numberOfKnots: number,
	stepCallback: StepCallback
): void {
	let rope: Rope = Array.from({ length: numberOfKnots }).map(
		() => new Vector(0, 0)
	);

	for (const instruction of instructions) {
		for (let i = 0; i < instruction.dist; i += 1) {
			rope = executeMove(instruction.dir, rope);
			stepCallback(rope);
		}
	}
}

/**
 Part 1
*/
export const part1 = (input: string): number => {
	const instructions = parseInput(input);
	const locationsTailHasBeen = new Set<string>();
	runInstructions(instructions, 2, (rope) => {
		locationsTailHasBeen.add(rope[rope.length - 1].toString());
	});
	return locationsTailHasBeen.size;
};
