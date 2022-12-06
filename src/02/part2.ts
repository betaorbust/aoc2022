import { convertToMove, Move, RULES, scoreGame } from './part1';

// Leveraging a bunch of the logic from part 1, so this file
// only has the new directive (XYZ) logic

// The new directive names
type Directive = 'X' | 'Y' | 'Z';

/**
 * Given a directive, and an elf move, look up the right play
 * per the rules
 */
const DIRECTIVE_TO_MOVE: Record<Directive, (elfMove: Move) => Move> = {
	X: (elfMove: Move) => RULES[elfMove].beats,
	Y: (elfMove: Move) => elfMove,
	Z: (elfMove: Move) => RULES[elfMove].losesTo,
};

/**
 * Typesafe shenanigans to convert a string to a directive
 */
function convertToDirective(directive: string): Directive {
	switch (directive) {
		case 'X':
		case 'Y':
		case 'Z':
			return directive;
		default:
			throw new Error(`Invalid directive ${directive}`);
	}
}

/**
 * Parse the input and convert it to a list of moves
 * based on the directives given
 */
function parseInputPt2(input: string): [Move, Move][] {
	return input.split('\n').map((line) => {
		const [a, b] = line.split(' ');
		const elfMove = convertToMove(a);
		const myDirective = convertToDirective(b);
		return [elfMove, DIRECTIVE_TO_MOVE[myDirective](elfMove)];
	});
}

/**
 *  Actually score the game
 */
export const part2 = (input: string): number => scoreGame(parseInputPt2(input));
