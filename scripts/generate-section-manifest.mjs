import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const sectionsDirectory = path.resolve(projectRoot, "assets/sections/optimized");
const manifestPath = path.resolve(projectRoot, "assets/sections/manifest.json");

async function findImages(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    const files = await Promise.all(entries.map(async (entry) => {
        const fullPath = path.join(directory, entry.name);
        if (entry.isDirectory()) return findImages(fullPath);
        return path.extname(entry.name).toLowerCase() === ".webp" ? [fullPath] : [];
    }));

    return files.flat();
}

const images = (await findImages(sectionsDirectory))
    .sort((left, right) => left.localeCompare(right))
    .map((filePath) => path.relative(projectRoot, filePath).split(path.sep).join("/"));

await writeFile(manifestPath, `${JSON.stringify(images, null, 2)}\n`);
console.log(`Wrote ${images.length} images to ${path.relative(process.cwd(), manifestPath)}`);
