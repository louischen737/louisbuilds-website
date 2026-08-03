#!/usr/bin/env python3
"""Composite iPad-landscape bird's-eye island previews (map + spot art, no UI)."""

from __future__ import annotations

import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
APP = ROOT.parent / "LonelyIsle" / "LonelyIsle" / "Resources"
OUT_DIR = Path(__file__).resolve().parents[1] / "images" / "islands"

IPAD_LANDSCAPE = (1366, 1024)
MAP_SIZE = 4096
FOCUS = (MAP_SIZE * 0.5, MAP_SIZE * 0.5)
SPOT_SIZE = 200

ISLANDS = [
    {
        "id": "ellidaey",
        "map_base": APP / "Maps/ellidaey/ellidaey_base.png",
        "map_json": APP / "Maps/ellidaey/map.json",
    },
    {
        "id": "twilight",
        "map_base": APP / "Maps/twilight/bluehour_base.png",
        "map_json": APP / "Maps/twilight/map.json",
    },
    {
        "id": "naoshima",
        "map_base": APP / "Maps/naoshima/naoshima_base.png",
        "map_json": APP / "Maps/naoshima/map.json",
    },
]


def load_scenery(map_json: Path) -> list[dict]:
    with map_json.open(encoding="utf-8") as handle:
        data = json.load(handle)

    spots = []
    for layer in data.get("layers", []):
        if layer.get("name") != "Scenery":
            continue
        for obj in layer.get("objects", []):
            x = float(obj.get("x", 0))
            y = float(obj.get("y", 0))
            width = float(obj.get("width", 0))
            height = float(obj.get("height", 0))
            has_gid = "gid" in obj
            center_x = x + width * 0.5
            center_y = y - height * 0.5 if has_gid else y + height * 0.5

            spot_image = ""
            for prop in obj.get("properties", []):
                if prop.get("name") == "spotImage":
                    spot_image = str(prop.get("value", ""))
                    break

            if not spot_image:
                continue

            spots.append(
                {
                    "name": obj.get("name", ""),
                    "x": center_x,
                    "y": center_y,
                    "image": spot_image,
                }
            )
    return spots


def composite_world(map_base: Path, scenery: list[dict]) -> Image.Image:
    world = Image.open(map_base).convert("RGBA")
    if world.size != (MAP_SIZE, MAP_SIZE):
        world = world.resize((MAP_SIZE, MAP_SIZE), Image.Resampling.LANCZOS)

    half = SPOT_SIZE * 0.5
    spots_dir = APP / "Spots"

    for spot in scenery:
        spot_path = spots_dir / spot["image"]
        if not spot_path.exists():
            raise FileNotFoundError(f"Missing spot asset: {spot_path}")

        sprite = Image.open(spot_path).convert("RGBA")
        if sprite.size != (SPOT_SIZE, SPOT_SIZE):
            sprite = sprite.resize((SPOT_SIZE, SPOT_SIZE), Image.Resampling.LANCZOS)

        left = int(round(spot["x"] - half))
        top = int(round(spot["y"] - half))
        world.alpha_composite(sprite, (left, top))

    return world


def crop_birdseye_cover(world: Image.Image, viewport: tuple[int, int], focus: tuple[float, float]) -> Image.Image:
    view_w, view_h = viewport
    fit_side = max(view_w, view_h)
    scale = fit_side / MAP_SIZE

    scaled = world.resize(
        (int(round(MAP_SIZE * scale)), int(round(MAP_SIZE * scale))),
        Image.Resampling.LANCZOS,
    )

    focus_x = focus[0] * scale
    focus_y = focus[1] * scale
    left = int(round(focus_x - view_w * 0.5))
    top = int(round(focus_y - view_h * 0.5))

    left = max(0, min(left, scaled.width - view_w))
    top = max(0, min(top, scaled.height - view_h))

    return scaled.crop((left, top, left + view_w, top + view_h))


def save_outputs(preview: Image.Image, island_id: str) -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    png_path = OUT_DIR / f"{island_id}-birdseye-ipad.png"
    preview.save(png_path, format="PNG", optimize=True)

    web_w = 1200
    web_h = int(round(web_w * preview.height / preview.width))
    web = preview.resize((web_w, web_h), Image.Resampling.LANCZOS)
    web_path = OUT_DIR / f"{island_id}-birdseye-1200w.png"
    web.save(web_path, format="PNG", optimize=True)

    try:
        web.save(OUT_DIR / f"{island_id}-birdseye-1200w.webp", format="WEBP", quality=86, method=6)
    except Exception:
        pass

    print(f"✓ {island_id}: {png_path.name} ({preview.width}x{preview.height})")


def main() -> None:
    for island in ISLANDS:
        scenery = load_scenery(island["map_json"])
        world = composite_world(island["map_base"], scenery)
        preview = crop_birdseye_cover(world, IPAD_LANDSCAPE, FOCUS)
        save_outputs(preview, island["id"])
        print(f"  spots: {len(scenery)}")


if __name__ == "__main__":
    main()
