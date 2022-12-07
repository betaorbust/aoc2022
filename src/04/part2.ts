import { parseInput } from './part1';

/**
 * Check if two ranges overlap
 */
function hasOverlap(a: [number, number], b: [number, number]): boolean {
	return (a[0] <= b[0] && a[1] >= b[0]) || (b[0] <= a[0] && b[1] >= a[0]);
}

export const part2 = (input: string): number =>
	parseInput(input).filter(([a, b]) => hasOverlap(a, b)).length;
