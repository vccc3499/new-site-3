import json
import shutil
import subprocess
from pathlib import Path

from moviepy import VideoFileClip, concatenate_videoclips, vfx

ROOT = Path(r"C:\Users\sanya\Desktop\сайт")
SERVICES_DIR = ROOT / "media" / "services"
PIXABAY_DIR = SERVICES_DIR / "pixabay"
MERGED_DIR = SERVICES_DIR / "merged"
MANIFEST_PATH = SERVICES_DIR / "manifest.json"

PIXABAY_DIR.mkdir(parents=True, exist_ok=True)
MERGED_DIR.mkdir(parents=True, exist_ok=True)

# Pixabay CDN bases chosen by job type (construction/renovation focused)
BASES = {
    "apt_repair": "https://cdn.pixabay.com/video/2020/06/01/40813-426920959",
    "kitchen_room": "https://cdn.pixabay.com/video/2021/03/09/67460-522170651",
    "turnkey": "https://cdn.pixabay.com/video/2020/06/01/40813-426920959",

    "house_private": "https://cdn.pixabay.com/video/2020/06/01/40813-426920959",
    "house_stage": "https://cdn.pixabay.com/video/2021/03/09/67463-522170646",
    "house_terrace": "https://cdn.pixabay.com/video/2015/10/16/1009-142621189",

    "bath_tile": "https://cdn.pixabay.com/video/2021/03/09/67461-522170649",
    "bath_waterproof": "https://cdn.pixabay.com/video/2021/08/16/85349-590746470",
    "bath_plumb": "https://cdn.pixabay.com/video/2016/09/03/4906-181288859",

    "plaster_wall": "https://cdn.pixabay.com/video/2021/08/16/85346-590746462",
    "plaster_level": "https://cdn.pixabay.com/video/2021/08/16/85343-590746457",
    "plaster_prep": "https://cdn.pixabay.com/video/2021/08/16/85349-590746470",

    "putty_wallpaper": "https://cdn.pixabay.com/video/2021/08/16/85343-590746457",
    "putty_paint": "https://cdn.pixabay.com/video/2021/08/16/85346-590746462",
    "putty_finish": "https://cdn.pixabay.com/video/2021/08/16/85349-590746470",

    "paint_walls": "https://cdn.pixabay.com/video/2021/08/16/85346-590746462",
    "paint_ceiling": "https://cdn.pixabay.com/video/2021/08/16/85349-590746470",
    "paint_finish": "https://cdn.pixabay.com/video/2021/08/16/85343-590746457",

    "tile_laying": "https://cdn.pixabay.com/video/2021/03/09/67461-522170649",
    "tile_walls": "https://cdn.pixabay.com/video/2021/03/09/67463-522170646",
    "tile_floor": "https://cdn.pixabay.com/video/2020/06/01/40813-426920959",

    "elec_cable": "https://cdn.pixabay.com/video/2023/04/19/159674-819378829",
    "elec_sockets": "https://cdn.pixabay.com/video/2023/04/19/159674-819378829",
    "elec_panel": "https://cdn.pixabay.com/video/2016/08/22/4728-179738645",

    "plumb_lines": "https://cdn.pixabay.com/video/2016/04/15/2805-162943479",
    "plumb_equip": "https://cdn.pixabay.com/video/2016/09/03/4906-181288859",
    "plumb_nodes": "https://cdn.pixabay.com/video/2016/09/03/4905-181288857",

    "floor_screed": "https://cdn.pixabay.com/video/2021/03/09/67463-522170646",
    "floor_prep": "https://cdn.pixabay.com/video/2021/03/09/67461-522170649",
    "floor_laminate": "https://cdn.pixabay.com/video/2016/08/22/4728-179738645",
    "floor_quartz": "https://cdn.pixabay.com/video/2021/03/09/67460-522170651",
    "floor_linoleum": "https://cdn.pixabay.com/video/2015/10/16/1009-142621189",

    "weld_struct": "https://cdn.pixabay.com/video/2017/10/21/12543-239934681",
    "weld_frames": "https://cdn.pixabay.com/video/2021/05/25/75268-555047160",
    "weld_strength": "https://cdn.pixabay.com/video/2016/05/12/3140-166335926",

    "gen_demo": "https://cdn.pixabay.com/video/2015/10/16/1009-142621189",
    "gen_build": "https://cdn.pixabay.com/video/2020/06/01/40813-426920959",
    "gen_rough": "https://cdn.pixabay.com/video/2015/10/16/1009-142621189",
}

TARGETS = {
    "media/services/apartment-1.mp4": "apt_repair",
    "media/services/apartment-2.mp4": "kitchen_room",
    "media/services/apartment-3.mp4": "turnkey",

    "media/services/house-1.mp4": "house_private",
    "media/services/house-2.mp4": "house_stage",
    "media/services/house-3.mp4": "house_terrace",

    "media/services/bathroom-1.mp4": "bath_tile",
    "media/services/bathroom-2.mp4": "bath_waterproof",
    "media/services/bathroom-3.mp4": "bath_plumb",

    "media/services/plaster-1.mp4": "plaster_wall",
    "media/services/plaster-2.mp4": "plaster_level",
    "media/services/plaster-3.mp4": "plaster_prep",

    "media/services/putty-1.mp4": "putty_wallpaper",
    "media/services/putty-2.mp4": "putty_paint",
    "media/services/putty-3.mp4": "putty_finish",

    "media/services/paint-1.mp4": "paint_walls",
    "media/services/paint-2.mp4": "paint_ceiling",
    "media/services/paint-3.mp4": "paint_finish",

    "media/services/tile-1.mp4": "tile_laying",
    "media/services/tile-2.mp4": "tile_walls",
    "media/services/tile-3.mp4": "tile_floor",

    "media/services/electric-1.mp4": "elec_cable",
    "media/services/electric-2.mp4": "elec_sockets",
    "media/services/electric-3.mp4": "elec_panel",

    "media/services/plumbing-1.mp4": "plumb_lines",
    "media/services/plumbing-2.mp4": "plumb_equip",
    "media/services/plumbing-3.mp4": "plumb_nodes",

    "media/services/floors-1.mp4": "floor_screed",
    "media/services/floors-2.mp4": "floor_prep",
    "media/services/floors-3.mp4": "floor_laminate",
    "media/services/floors-4.mp4": "floor_quartz",
    "media/services/floors-5.mp4": "floor_linoleum",

    "media/services/welding-1.mp4": "weld_struct",
    "media/services/welding-2.mp4": "weld_frames",
    "media/services/welding-3.mp4": "weld_strength",

    "media/services/general-1.mp4": "gen_demo",
    "media/services/general-2.mp4": "gen_build",
    "media/services/general-3.mp4": "gen_rough",
}


def download_pixabay(base: str, key: str) -> Path:
    for suffix in ("_tiny.mp4", "_small.mp4", "_medium.mp4", "_large.mp4"):
        url = f"{base}{suffix}"
        out = PIXABAY_DIR / f"{key}{suffix.replace('.mp4','')}.mp4"
        if out.exists() and out.stat().st_size > 100_000:
            return out

        result = subprocess.run(
            ["curl.exe", "-L", "-A", "Mozilla/5.0", url, "--output", str(out), "-s", "-S"],
            capture_output=True,
            text=True,
        )
        if result.returncode == 0 and out.exists() and out.stat().st_size > 100_000:
            return out

        out.unlink(missing_ok=True)

    raise RuntimeError(f"Failed to download video for {key} from {base}")


def safe_clip(path: Path, seconds: float = 4.0) -> VideoFileClip:
    clip = VideoFileClip(str(path)).without_audio()
    end = min(clip.duration, seconds)
    clip = clip.subclipped(0, end)

    target_w, target_h = 1280, 720
    src_ratio = clip.w / clip.h
    target_ratio = target_w / target_h

    if src_ratio > target_ratio:
        new_w = int(clip.h * target_ratio)
        x1 = (clip.w - new_w) / 2
        clip = clip.cropped(x1=x1, y1=0, x2=x1 + new_w, y2=clip.h)
    elif src_ratio < target_ratio:
        new_h = int(clip.w / target_ratio)
        y1 = (clip.h - new_h) / 2
        clip = clip.cropped(x1=0, y1=y1, x2=clip.w, y2=y1 + new_h)

    clip = clip.resized((target_w, target_h))
    return clip


def build_merged(service_key: str, files: list[str]) -> None:
    clips = []
    overlap = 0.35
    try:
        for i, rel in enumerate(files):
            clip = safe_clip(ROOT / rel, 4.0)
            if i > 0:
                clip = clip.with_effects([vfx.CrossFadeIn(overlap)])
            clips.append(clip)
        merged = concatenate_videoclips(clips, method="compose", padding=-overlap)
        merged.write_videofile(
            str(MERGED_DIR / f"{service_key}.mp4"),
            fps=24,
            codec="libx264",
            preset="medium",
            bitrate="3000k",
            audio=False,
            threads=4,
            logger=None,
        )
        merged.close()
    finally:
        for c in clips:
            c.close()


def main() -> None:
    print("Downloading Pixabay clips...")
    resolved = {}
    for key, base in BASES.items():
        path = download_pixabay(base, key)
        resolved[key] = path

    print("Replacing subservice files...")
    for rel_target, key in TARGETS.items():
        target = ROOT / rel_target
        shutil.copy2(resolved[key], target)

    print("Rebuilding merged service videos...")
    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8-sig"))
    for service_key, entries in manifest.items():
        files = [entry["file"] for entry in entries]
        build_merged(service_key, files)
        print(f"  merged/{service_key}.mp4")

    print("Done")


if __name__ == "__main__":
    main()

