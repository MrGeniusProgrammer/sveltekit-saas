import fs from "fs/promises";
import path from "path";

export async function getFilesRecursively(dir: string): Promise<string[]> {
	const entries = await fs.readdir(dir, { withFileTypes: true });
	const files = await Promise.all(
		entries.map(async (entry) => {
			const fullPath = path.join(dir, entry.name);

			if (entry.isDirectory()) {
				// Recurse into the subdirectory
				return getFilesRecursively(fullPath);
			} else if (entry.isFile()) {
				return fullPath;
			}
			return []; // Skip other types of entries (e.g., symbolic links)
		}),
	);

	return files.flat(); // Flatten the results
}
