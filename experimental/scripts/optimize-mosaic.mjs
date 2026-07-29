import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SECTIONS_DIR = path.resolve(__dirname, "..", "assets", "sections");
const OPTIMIZED_DIR = path.join(SECTIONS_DIR, "optimized");
const MANIFEST_PATH = path.join(SECTIONS_DIR, "manifest.json");

const MAX_WIDTH = 800;
const MAX_HEIGHT = 800;
const QUALITY = 80;

async function optimize() {
    const manifest = JSON.parse(await fs.promises.readFile(MANIFEST_PATH, "utf8"));
    const optimizedManifest = [];

    for (const relativePath of manifest) {
        const ext = path.extname(relativePath).toLowerCase();
        if (![".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
            console.log(`Skipping unsupported file: ${relativePath}`);
            optimizedManifest.push(relativePath);
            continue;
        }

        const inputPath = path.resolve(SECTIONS_DIR, relativePath);
        const outputRelativePath = relativePath.replace(/\.[^.]+$/, ".webp");
        const outputPath = path.join(OPTIMIZED_DIR, outputRelativePath);

        try {
            await fs.promises.mkdir(path.dirname(outputPath), { recursive: true });

            await sharp(inputPath)
                .resize({
                    width: MAX_WIDTH,
                    height: MAX_HEIGHT,
                    fit: "inside",
                    withoutEnlargement: true
                })
                .webp({
                    quality: QUALITY,
                    effort: 4,
                    nearLossless: false
                })
                .toFile(outputPath);

            const rel = "assets/sections/optimized/" + outputRelativePath.replace(/\\/g, "/");
            optimizedManifest.push(rel);
            console.log(`Optimized: ${rel}`);
        } catch (error) {
            console.error(`Failed to optimize ${relativePath}:`, error.message);
            optimizedManifest.push(relativePath);
        }
    }

    await fs.promises.writeFile(
        path.join(SECTIONS_DIR, "manifest.optimized.json"),
        JSON.stringify(optimizedManifest, null, 2)
    );

    console.log(`\nWrote manifest.optimized.json with ${optimizedManifest.length} entries.`);
}

optimize().catch((error) => {
    console.error(error);
    process.exit(1);
});
