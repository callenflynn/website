import json
from pathlib import Path
from PIL import Image

BASE_DIR = Path(__file__).resolve().parent.parent
SECTIONS_DIR = BASE_DIR / "assets" / "sections"
OPTIMIZED_DIR = SECTIONS_DIR / "optimized"
MANIFEST_PATH = SECTIONS_DIR / "manifest.json"

MAX_WIDTH = 800
MAX_HEIGHT = 800
QUALITY = 80


def safe_print(message: str) -> None:
    """Print a message, replacing characters the console cannot encode."""
    try:
        print(message)
    except UnicodeEncodeError:
        print(message.encode("ascii", "replace").decode("ascii"))


def optimize_image(input_path: Path, output_path: Path) -> None:
    with Image.open(input_path) as img:
        img = img.convert("RGB")
        img.thumbnail((MAX_WIDTH, MAX_HEIGHT), Image.Resampling.LANCZOS)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        img.save(output_path, "webp", quality=QUALITY, method=6)


def main() -> None:
    with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
        manifest = json.load(f)

    optimized_manifest = []

    for relative_path in manifest:
        input_path = BASE_DIR / relative_path
        # Strip the "assets/sections/" prefix so optimized images mirror the structure
        output_relative = Path(relative_path).relative_to("assets/sections").with_suffix(".webp").as_posix()
        output_path = OPTIMIZED_DIR / output_relative

        try:
            optimize_image(input_path, output_path)
            optimized_entry = f"assets/sections/optimized/{output_relative}"
            optimized_manifest.append(optimized_entry)
            safe_print(f"Optimized: {optimized_entry}")
        except Exception as e:
            safe_print(f"Failed to optimize {relative_path}: {e}")
            optimized_manifest.append(relative_path)

    optimized_manifest_path = SECTIONS_DIR / "manifest.optimized.json"
    with open(optimized_manifest_path, "w", encoding="utf-8") as f:
        json.dump(optimized_manifest, f, indent=2, ensure_ascii=False)

    safe_print(f"\nWrote {optimized_manifest_path} with {len(optimized_manifest)} entries.")


if __name__ == "__main__":
    main()
