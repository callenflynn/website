import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const sectionsDirectory = path.resolve("assets/sections");
const manifestPath = path.join(sectionsDirectory, "manifest.json");
const imageExtensions = new Set([".avif", ".gif", ".jpeg", ".jpg", ".png", ".webp"]);

async function findImages(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    const files = await Promise.all(entries.map(async (entry) => {
        const fullPath = path.join(directory, entry.name);
        if (entry.isDirectory()) return findImages(fullPath);
        return imageExtensions.has(path.extname(entry.name).toLowerCase()) ? [fullPath] : [];
    }));

    return files.flat();
}

const images = (await findImages(sectionsDirectory))
    .sort((left, right) => left.localeCompare(right))
    .map((filePath) => path.relative(process.cwd(), filePath).split(path.sep).join("/"));

await writeFile(manifestPath, `${JSON.stringify(images, null, 2)}\n`);
console.log(`Wrote ${images.length} images to ${path.relative(process.cwd(), manifestPath)}`);
