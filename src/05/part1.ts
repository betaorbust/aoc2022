/**
 --- Day 5: Supply Stacks ---
The expedition can depart as soon as the final supplies have been unloaded from the ships. Supplies are stored in stacks of marked crates, but because the needed supplies are buried under many other crates, the crates need to be rearranged.

The ship has a giant cargo crane capable of moving crates between stacks. To ensure none of the crates get crushed or fall over, the crane operator will rearrange them in a series of carefully-planned steps. After the crates are rearranged, the desired crates will be at the top of each stack.

The Elves don't want to interrupt the crane operator during this delicate procedure, but they forgot to ask her which crate will end up where, and they want to be ready to unload them as soon as possible so they can embark.

They do, however, have a drawing of the starting stacks of crates and the rearrangement procedure (your puzzle input). For example:

    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2
In this example, there are three stacks of crates. Stack 1 contains two crates: crate Z is on the bottom, and crate N is on top. Stack 2 contains three crates; from bottom to top, they are crates M, C, and D. Finally, stack 3 contains a single crate, P.

Then, the rearrangement procedure is given. In each step of the procedure, a quantity of crates is moved from one stack to a different stack. In the first step of the above rearrangement procedure, one crate is moved from stack 2 to stack 1, resulting in this configuration:

[D]        
[N] [C]    
[Z] [M] [P]
 1   2   3 
In the second step, three crates are moved from stack 1 to stack 3. Crates are moved one at a time, so the first crate to be moved (D) ends up below the second and third crates:

        [Z]
        [N]
    [C] [D]
    [M] [P]
 1   2   3
Then, both crates are moved from stack 2 to stack 1. Again, because crates are moved one at a time, crate C ends up below crate M:

        [Z]
        [N]
[M]     [D]
[C]     [P]
 1   2   3
Finally, one crate is moved from stack 1 to stack 2:

        [Z]
        [N]
        [D]
[C] [M] [P]
 1   2   3
The Elves just need to know which crate will end up on top of each stack; in this example, the top crates are C in stack 1, M in stack 2, and Z in stack 3, so you should combine these together and give the Elves the message CMZ.

After the rearrangement procedure completes, what crate ends up on top of each stack?
 */

// The two major types we'll be passing around
type Board = string[][];
type Instructions = [count: number, from: number, to: number][];

// Parse that horrible text input
export function parseBoard(input: string): {
	board: Board;
	instructions: Instructions;
} {
	const lines = input.split('\n');
	const splitBetweenBoardAndInstructions = lines.findIndex(
		(l) => l.trim() === ''
	);
	const boardInput = lines.slice(0, splitBetweenBoardAndInstructions - 1);
	const instructionInput = lines.slice(splitBetweenBoardAndInstructions + 1);

	const board: Board = [];

	// Parse out and build up the board
	boardInput.forEach((line: string) => {
		let stackIndex = 0;
		let currentCharacterPosition = 1;
		while (line[currentCharacterPosition] !== undefined) {
			const value = line[currentCharacterPosition];
			board[stackIndex] = board[stackIndex] || [];
			if (value !== ' ') {
				board[stackIndex].push(value);
			}
			stackIndex += 1;
			currentCharacterPosition += 4;
		}
	});

	// Now do the instructions
	const instructions: Instructions = instructionInput.map((line: string) => {
		const match = line.match(/move (\d+) from (\d+) to (\d+)/);
		if (!match) {
			throw new Error(`Could not parse instruction: ${line}`);
		}
		const [, number, from, to] = [...match].map((n) => Number.parseInt(n, 10));
		return [number, from - 1, to - 1]; // account for 0-indexing
	});

	return { board, instructions };
}

/**
 * Does an instruction
 */
function move(board: Board, from: number, to: number, count: number): Board {
	const boxesMoving = board[from].slice(0, count);
	const boxesRemaining = board[from].slice(count);
	const newBoard = [...board]; // Don't mutate the original board
	// Reverse them and stack them on the top
	newBoard[to] = [...boxesMoving.reverse(), ...newBoard[to]];
	// Whatever's left over
	newBoard[from] = boxesRemaining;
	return newBoard;
}

/**
 * Run the actual problem
 */
export const part1 = (input: string): string => {
	const { board, instructions } = parseBoard(input);

	// Run every instruction
	const finalBoard = instructions.reduce(
		(currentBoard, [count, from, to]) => move(currentBoard, from, to, count),
		board
	);

	// Collect the top of each stack and join them up
	return finalBoard.map((stack) => stack[0] || '').join('');
};
