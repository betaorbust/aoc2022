import { parseInput, runInstructions, Rope } from './part1';

/**
 * Debugging function to print the rope
 */
function printRope(
	rope: Rope,
	minX: number,
	maxX: number,
	minY: number,
	maxY: number
): void {
	const width = maxX - minX + 1;
	const height = maxY - minY + 1;

	const grid = Array.from({ length: height })
		.fill(0)
		.map(() => Array.from({ length: width }).fill('.'));

	rope.forEach((p) => {
		grid[p.y - minY][p.x - minX] = '#';
	});
	console.log(
		[...grid]
			.reverse()
			.map((row) => row.join(''))
			.join('\n')
	);
}
/**
 * PART 2
 */
export const part2 = (input: string): number => {
	const instructions = parseInput(input);
	const locationsTailHasBeen = new Set<string>();

	let minX = 0;
	let maxX = 0;
	let minY = 0;
	let maxY = 0;

	runInstructions(instructions, 10, (rope) => {
		const xs = rope.map((p) => p.x);
		const ys = rope.map((p) => p.y);
		minX = Math.min(minX, ...xs);
		maxX = Math.max(maxX, ...xs);
		minY = Math.min(minY, ...ys);
		maxY = Math.max(maxY, ...ys);
		if (process.env.DEBUG) {
			printRope(rope, minX, maxX, minY, maxY);
		}
		locationsTailHasBeen.add(rope[rope.length - 1].toString());
	});
	return locationsTailHasBeen.size;
};
