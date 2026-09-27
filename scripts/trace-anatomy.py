"""Trace the approved GPT Image reference into real SVG paths.

Optional artwork tooling: pip install pillow numpy opencv-python vtracer
Run from the repository root. No tracing dependencies are needed by the app.
"""

from pathlib import Path
import tempfile
import xml.etree.ElementTree as ET

import cv2
import numpy as np
from PIL import Image
import vtracer

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "docs/artwork/anatomy-reference.png"
image = np.array(Image.open(SOURCE).convert("RGB"))
namespace = "http://www.w3.org/2000/svg"
ET.register_namespace("", namespace)

for view, left, right, center in [("front", 0, 524, 277), ("back", 524, 1024, 752)]:
    crop = image[:1380, left:right]
    gray = cv2.cvtColor(crop, cv2.COLOR_RGB2GRAY)
    binary = np.uint8(gray > 58) * 255
    contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    outline = max(contours, key=cv2.contourArea)
    mask = np.zeros(gray.shape, dtype=np.uint8)
    cv2.drawContours(mask, [outline], -1, 255, cv2.FILLED)
    # Retain linework while reducing tiny color variations and path count.
    tones = np.clip(np.round(gray / 3) * 3, 42, 192).astype(np.uint8)
    rgba = np.dstack([tones, tones, tones, mask])
    with tempfile.TemporaryDirectory() as temp:
        png, svg = Path(temp) / "source.png", Path(temp) / "trace.svg"
        Image.fromarray(rgba).save(png)
        vtracer.convert_image_to_svg_py(
            str(png), str(svg), colormode="color", hierarchical="stacked",
            mode="spline", filter_speckle=2, color_precision=8,
            layer_difference=3, corner_threshold=60, length_threshold=2,
            max_iterations=10, splice_threshold=45, path_precision=2,
        )
        traced = ET.parse(svg).getroot()
    output = ET.Element(f"{{{namespace}}}svg", {"viewBox": "0 0 400 670", "fill": "none"})
    title = ET.SubElement(output, f"{{{namespace}}}title")
    title.text = f"{view.capitalize()} anatomy — vector trace of approved illustration"
    scale = 0.496
    group = ET.SubElement(output, f"{{{namespace}}}g", {
        "transform": f"translate({200 - (center-left)*scale:.3f} -10.736) scale({scale})"
    })
    for child in traced:
        if child.tag.endswith("path"):
            group.append(child)
    # Neutral pelvic surface: exclude the ambiguous generated groin detail.
    if view == "front":
        ET.SubElement(output, f"{{{namespace}}}path", {
            "d": "M183 313 Q200 321 217 313 Q215 325 210 335 Q206 342 200 342 Q194 342 190 335 Q185 325 183 313 Z",
            "fill": "#888888"
        })
    destination = ROOT / f"public/anatomy/{view}.svg"
    ET.ElementTree(output).write(destination, encoding="unicode")
    print(f"{view}: {len(group)} vector paths, {destination.stat().st_size:,} bytes")
