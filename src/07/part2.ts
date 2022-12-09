import { getMatchingDirectories, parseInput, replayTerminal } from './part1';

/**
--- Part Two ---
Now, you're ready to choose a directory to delete.

The total disk space available to the filesystem is 70000000. To run the update, you need unused space of at least 30000000. You need to find a directory you can delete that will free up enough space to run the update.

In the example above, the total size of the outermost directory (and thus the total amount of used space) is 48381165; this means that the size of the unused space must currently be 21618835, which isn't quite the 30000000 required by the update. Therefore, the update still requires a directory with total size of at least 8381165 to be deleted before it can run.

To achieve this, you have the following options:

Delete directory e, which would increase unused space by 584.
Delete directory a, which would increase unused space by 94853.
Delete directory d, which would increase unused space by 24933642.
Delete directory /, which would increase unused space by 48381165.
Directories e and a are both too small; deleting them would not free up enough space. However, directories d and / are both big enough! Between these, choose the smallest: d, increasing unused space by 24933642.

Find the smallest directory that, if deleted, would free up enough space on the filesystem to run the update. What is the total size of that directory?
*/
const DISK_SIZE = 70_000_000;
const TARGET_UNUSED_SPACE = 30_000_000;

export const part2 = (input: string): number => {
	// Make up the file system
	const fileSystem = replayTerminal(parseInput(input));
	// Snag the free disk space we have
	const currentUnusedSpace = DISK_SIZE - fileSystem.totalSize;
	// Look for directories that could free up enough space to run the update
	return (
		getMatchingDirectories(
			fileSystem,
			(dir) => currentUnusedSpace + dir.totalSize >= TARGET_UNUSED_SPACE
		)
			// Sort them and get the smallest one and grab its size
			.sort((a, b) => a.totalSize - b.totalSize)[0].totalSize
	);
};
