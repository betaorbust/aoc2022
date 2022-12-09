/**
--- Day 7: No Space Left On Device ---
You can hear birds chirping and raindrops hitting leaves as the expedition proceeds. Occasionally, you can even hear much louder sounds in the distance; how big do the animals get out here, anyway?

The device the Elves gave you has problems with more than just its communication system. You try to run a system update:

$ system-update --please --pretty-please-with-sugar-on-top
Error: No space left on device
Perhaps you can delete some files to make space for the update?

You browse around the filesystem to assess the situation and save the resulting terminal output (your puzzle input). For example:

$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k
The filesystem consists of a tree of files (plain data) and directories (which can contain other directories or files). The outermost directory is called /. You can navigate around the filesystem, moving into or out of directories and listing the contents of the directory you're currently in.

Within the terminal output, lines that begin with $ are commands you executed, very much like some modern computers:

cd means change directory. This changes which directory is the current directory, but the specific result depends on the argument:
cd x moves in one level: it looks in the current directory for the directory named x and makes it the current directory.
cd .. moves out one level: it finds the directory that contains the current directory, then makes that directory the current directory.
cd / switches the current directory to the outermost directory, /.
ls means list. It prints out all of the files and directories immediately contained by the current directory:
123 abc means that the current directory contains a file named abc with size 123.
dir xyz means that the current directory contains a directory named xyz.
Given the commands and output in the example above, you can determine that the filesystem looks visually like this:

- / (dir)
  - a (dir)
    - e (dir)
      - i (file, size=584)
    - f (file, size=29116)
    - g (file, size=2557)
    - h.lst (file, size=62596)
  - b.txt (file, size=14848514)
  - c.dat (file, size=8504156)
  - d (dir)
    - j (file, size=4060174)
    - d.log (file, size=8033020)
    - d.ext (file, size=5626152)
    - k (file, size=7214296)
Here, there are four directories: / (the outermost directory), a and d (which are in /), and e (which is in a). These directories also contain files of various sizes.

Since the disk is full, your first step should probably be to find directories that are good candidates for deletion. To do this, you need to determine the total size of each directory. The total size of a directory is the sum of the sizes of the files it contains, directly or indirectly. (Directories themselves do not count as having any intrinsic size.)

The total sizes of the directories above can be found as follows:

The total size of directory e is 584 because it contains a single file i of size 584 and no other directories.
The directory a has total size 94853 because it contains files f (size 29116), g (size 2557), and h.lst (size 62596), plus file i indirectly (a contains e which contains i).
Directory d has total size 24933642.
As the outermost directory, / contains every file. Its total size is 48381165, the sum of the size of every file.
To begin, find all of the directories with a total size of at most 100000, then calculate the sum of their total sizes. In the example above, these directories are a and e; the sum of their total sizes is 95437 (94853 + 584). (As in this example, this process can count files more than once!)

Find all of the directories with a total size of at most 100000. What is the sum of the total sizes of those directories?
*/

import { add } from '../junk-drawer';

// First up, we have a bunch of pre-processing types. We're going to use them
// to parse the terminal output into a set of objects that we can work with.
// Could I do it all in one go? Sure, but this way I can split up the problem
// into smaller pieces.
type TerminalFile = {
	type: 'terminal file';
	name: string;
	size: number;
};
type TerminalDirectory = {
	type: 'terminal directory';
	name: string;
};
type CdCommand = {
	type: 'command';
	command: 'cd';
	argument: string;
};
type LsCommand = {
	type: 'command';
	command: 'ls';
};
type Command = CdCommand | LsCommand;
type TerminalLine = Command | TerminalDirectory | TerminalFile;

// Now our file system objects that we'll build out
type File = {
	type: 'file';
	name: string;
	size: number;
	parent: Directory;
};
type Directory = {
	type: 'directory';
	name: string;
	parent: Directory | null;
	children: Entity[];
	totalSize: number;
	addChild(child: Entity): void;
	incrementTotalSize(size: number): void;
	getChildDirectory(childName: string): Directory | null;
	getChildFile(childName: string): File | null;
};
type Entity = File | Directory;

/**
 * Type guard for directories
 */
function isDirectory(entity: Entity): entity is Directory {
	return entity.type === 'directory';
}

/**
 * Type guard for files
 */
function isFile(entity: Entity): entity is File {
	return entity.type === 'file';
}

/**
 * Creates a file object
 */
function makeFile(name: string, size: number, parent: Directory): File {
	return {
		type: 'file',
		name,
		size,
		parent,
	};
}

/**
 * Creates a directory object
 */
function makeDirectory(name: string, parent: Directory | null): Directory {
	return {
		type: 'directory',
		name,
		parent,
		children: [],
		totalSize: 0,
		/**
		 * Adds a child to the directory
		 */
		addChild(child: Entity): void {
			this.children.push(child);
			if (child.type === 'file') {
				this.incrementTotalSize(child.size);
			}
		},
		/**
		 * Walks up the tree and increments the total size of all parent directories
		 */
		incrementTotalSize(size: number): void {
			this.totalSize += size;
			if (this.parent) {
				this.parent.incrementTotalSize(size);
			}
		},
		/**
		 * Gets a child directory by name
		 */
		getChildDirectory(childName: string): Directory | null {
			return (
				this.children.filter(isDirectory).find((c) => c.name === childName) ||
				null
			);
		},
		/**
		 * Gets a child file by name
		 */
		getChildFile(childName): File | null {
			return (
				this.children.filter(isFile).find((c) => c.name === childName) || null
			);
		},
	};
}

/**
 * Parses the terminal input into a set of terminal line objects
 * we'll then replay to understand the file system.
 */
export function parseInput(input: string): TerminalLine[] {
	return input.split('\n').map((line) => {
		// Commands start with $
		if (line[0] === '$') {
			const [, command, argument] = line.split(' ');
			let result: Command;
			switch (command) {
				case 'cd':
					result = {
						type: 'command',
						command: 'cd',
						argument,
					};
					break;
				case 'ls':
					result = {
						type: 'command',
						command: 'ls',
					};
					break;
				default:
					throw new Error(`Unknown command: ${command}`);
			}
			return result;
		}
		// File Entities
		// Directories start with 'dir'
		if (line.startsWith('dir')) {
			const [, name] = line.split(' ');
			const directory: TerminalDirectory = {
				type: 'terminal directory',
				name,
			};
			return directory;
		}
		// Files start with a number
		if (/\d/.test(line[0])) {
			const [size, name] = line.split(' ');
			const file: TerminalFile = {
				type: 'terminal file',
				name,
				size: Number.parseInt(size, 10),
			};
			return file;
		}
		// Just in case we run into something stupid
		throw new Error(`Unknown input for parse: ${line}`);
	});
}

/**
 * Takes the world state and a terminal line and plays forward one step
 * adding file and directories as we see them
 */
function actOnLine(
	currentDirectory: Directory,
	rootDirectory: Directory,
	line: TerminalLine
): Directory {
	if (line.type === 'command') {
		if (line.command === 'cd') {
			// Special case for root directory access
			if (line.argument === '/') {
				return rootDirectory;
			}
			// Going up 🛗
			if (line.argument === '..') {
				if (currentDirectory.parent === null) {
					throw new Error('Cannot cd .. from root directory');
				}
				return currentDirectory.parent;
			}
			// Going into a directory
			const existingChildDirectory = currentDirectory.getChildDirectory(
				line.argument
			);

			// If we have one, return it
			if (existingChildDirectory) {
				return existingChildDirectory;
			}
			// Otherwise it's the first time we've seen it, so make one
			const newChild = makeDirectory(line.argument, currentDirectory);
			currentDirectory.addChild(newChild);
			return newChild;
		}
		if (line.command === 'ls') {
			// don't do anything because an ls isn't a change in state
		}
	}
	// If we see a directory or file, add it if needed.
	else if (line.type === 'terminal directory') {
		if (!currentDirectory.getChildDirectory(line.name)) {
			currentDirectory.addChild(makeDirectory(line.name, currentDirectory));
		}
	} else if (line.type === 'terminal file') {
		if (!currentDirectory.getChildFile(line.name)) {
			currentDirectory.addChild(
				makeFile(line.name, line.size, currentDirectory)
			);
		}
	} else {
		throw new Error(`Unknown line type: ${line}`);
	}
	return currentDirectory;
}

/**
 * Takes a directory and finds all subdirectories that match a predicate
 */
export function getMatchingDirectories(
	currentDirectory: Directory,
	predicate: (entity: Directory) => boolean
): Directory[] {
	const onlyDirChildren = currentDirectory.children.filter(isDirectory);
	const matchingChildren = onlyDirChildren
		.filter(predicate)
		.concat(
			onlyDirChildren.flatMap((child) =>
				getMatchingDirectories(child, predicate)
			)
		);
	return matchingChildren;
}

/**
 * Just debugging tool to print a file system so I can see what I'm dealing with.
 */
export function printFileSystem(fileSystem: Directory, indent = 0): string {
	const indentString = '    '.repeat(indent);
	const output = [
		`${indentString}${fileSystem.name} (dir ${fileSystem.totalSize})`,
	];

	fileSystem.children.forEach((child) => {
		if (child.type === 'directory') {
			output.push(printFileSystem(child, indent + 1));
		} else {
			output.push(`${indentString}    ${child.name} (${child.size})`);
		}
	});
	return output.join('\n');
}

/**
 * Actually act on the lines of the terminal and build up the file system.
 */
export function replayTerminal(terminalLines: TerminalLine[]): Directory {
	const rootDirectory: Directory = makeDirectory('/', null);

	// mutative, but 🤷‍♂️
	terminalLines.reduce((currentDirectory, line) => {
		const results = actOnLine(currentDirectory, rootDirectory, line);
		return results;
	}, rootDirectory);
	return rootDirectory;
}

/**
 * Day 7 part 1
 */
export const part1 = (input: string): number => {
	const parsedInput = parseInput(input);
	const rootDirectory = replayTerminal(parsedInput);
	return getMatchingDirectories(
		rootDirectory,
		(dir) => dir.totalSize <= 100_000
	)
		.map((d) => d.totalSize)
		.reduce(add);
};
