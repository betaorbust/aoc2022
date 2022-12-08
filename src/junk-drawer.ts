/**
 * Add two numbers together. I know, this is why people make fun of JS
 * but honestly, these elves do a lot of summing.
 */
export const add = (a: number, b: number): number => a + b;

/**
 * Find the intersection of a list of sets.
 */
export function setIntersection<T>(sets: Set<T>[]): Set<T> {
	const all = new Set(sets.flatMap((set) => [...set]));
	return new Set([...all].filter((x) => sets.every((set) => set.has(x))));
}

/**
 * Partition an array into an array of arrays of size `partitionSize`.
 */
export function arrayPartition<T>(array: T[], partitionSize: number): T[][] {
	const partitions: T[][] = [];
	for (let i = 0; i < array.length; i += partitionSize) {
		partitions.push(array.slice(i, i + partitionSize));
	}
	return partitions;
}

/**
 * Extract matched values from a string
 */
export function extractValues(input: string, match: RegExp): string[] {
	const matches = input.match(match);
	if (!matches) {
		throw new Error(`Could not match ${match} in ${input}`);
	}
	return matches.slice(1);
}
