"""Trace a generated workout drawing into actual, transparent SVG paths.

Optional art tooling: pip install pillow numpy vtracer
Usage: python scripts/trace-workout.py <reference.png> <output.svg>
The raster reference is kept intact. No raster is embedded in the output.
"""

import argparse
from pathlib import Path
import tempfile
import xml.etree.ElementTree as ET

import numpy as np
from PIL import Image
import vtracer


def trace(source: Path, destination: Path, title: str):
    destination.parent.mkdir(parents=True, exist_ok=True)
    image = Image.open(source).convert("RGBA")
    image.thumbnail((1152, 768), Image.Resampling.LANCZOS)
    pixels = np.array(image)
    # Generated alpha can include a soft surrounding halo. Keep the opaque
    # drawing, rather than tracing that halo into thousands of background paths.
    alpha = np.where(pixels[:, :, 3] >= 250, 255, 0).astype(np.uint8)
    gray = np.round(
        pixels[:, :, 0] * 0.2126
        + pixels[:, :, 1] * 0.7152
        + pixels[:, :, 2] * 0.0722
    )
    tones = np.clip(np.round(gray / 3) * 3, 16, 240).astype(np.uint8)
    rgba = np.dstack([tones, tones, tones, alpha])
    namespace = "http://www.w3.org/2000/svg"
    ET.register_namespace("", namespace)
    with tempfile.TemporaryDirectory(dir=destination.parent) as temp:
        png = Path(temp) / "trace-input.png"
        svg = Path(temp) / "trace.svg"
        Image.fromarray(rgba).save(png)
        vtracer.convert_image_to_svg_py(
            str(png), str(svg), colormode="color", hierarchical="stacked",
            mode="spline", filter_speckle=2, color_precision=8,
            layer_difference=3, corner_threshold=60, length_threshold=2,
            max_iterations=10, splice_threshold=45, path_precision=1,
        )
        traced = ET.parse(svg).getroot()
    output = ET.Element(f"{{{namespace}}}svg", {
        "viewBox": "0 0 1152 768", "fill": "none"
    })
    ET.SubElement(output, f"{{{namespace}}}title").text = title
    drawing = ET.SubElement(output, f"{{{namespace}}}g", {
        "transform": f"translate({(1152 - image.width) / 2:g} {(768 - image.height) / 2:g})"
    })
    for child in traced:
        if child.tag.endswith("path"):
            drawing.append(child)
    destination.parent.mkdir(parents=True, exist_ok=True)
    ET.ElementTree(output).write(destination, encoding="unicode")
    print(f"{len(drawing)} vector paths, {destination.stat().st_size:,} bytes: {destination}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    parser.add_argument("destination", type=Path)
    parser.add_argument("--title", default="Workout movement illustration")
    args = parser.parse_args()
    trace(args.source, args.destination, args.title)
