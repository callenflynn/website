from pathlib import Path
from PIL import Image

BASE_DIR = Path(__file__).resolve().parent.parent
SECTIONS_DIR = BASE_DIR / "assets" / "sections"
OPTIMIZED_DIR = SECTIONS_DIR / "optimized"
SOURCE_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png"}

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
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(input_path) as img:
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")
        elif img.mode != "RGB":
            img = img.convert("RGB")
        img.thumbnail((MAX_WIDTH, MAX_HEIGHT), Image.Resampling.LANCZOS)
        img.save(output_path, "webp", quality=QUALITY, method=6)


def main() -> None:
    optimized_count = 0
    skipped_count = 0

    for source_path in SECTIONS_DIR.rglob("*"):
        if not source_path.is_file():
            continue
        if source_path.suffix.lower() not in SOURCE_IMAGE_EXTENSIONS:
            continue
        if source_path.is_relative_to(OPTIMIZED_DIR):
            continue

        relative = source_path.relative_to(SECTIONS_DIR)
        output_relative = relative.with_suffix(".webp")
        output_path = OPTIMIZED_DIR / output_relative

        if output_path.exists():
            skipped_count += 1
            continue

        try:
            optimize_image(source_path, output_path)
            optimized_count += 1
            safe_print(f"Optimized: {output_path}")
        except Exception as e:
            safe_print(f"Failed to optimize {source_path}: {e}")

    safe_print(f"\nOptimized {optimized_count} new images, skipped {skipped_count} existing images.")


if __name__ == "__main__":
    main()
