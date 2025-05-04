#!/usr/bin/env python3
"""
Walk the repo, find every .html file, and emit a modern XML sitemap.
Excludes anything in .git/, node_modules/, etc.
"""

import os, datetime, xml.etree.ElementTree as ET

BASE_URL = "https://joshuabastiaans.com"   # ⚠️ change to your final domain
EXCLUDE_DIRS = {".git", "node_modules", ".github", "__pycache__"}

def iter_html_files():
    for root, _, files in os.walk("."):
        # Skip unwanted directories
        if any(part in EXCLUDE_DIRS for part in root.split(os.sep)):
            continue
        for fname in files:
            if fname.endswith(".html"):
                yield os.path.join(root, fname).lstrip("./")

def build():
    urlset = ET.Element("urlset", attrib={
        "xmlns": "https://www.sitemaps.org/schemas/sitemap/0.9"
    })

    for path in iter_html_files():
        url = ET.SubElement(urlset, "url")
        loc = ET.SubElement(url, "loc")

        # treat /index.html as /
        clean_path = path[:-10] if path.endswith("index.html") else path
        loc.text = f"{BASE_URL}/{clean_path}"

        lastmod = ET.SubElement(url, "lastmod")
        mtime = datetime.datetime.fromtimestamp(os.path.getmtime(path))
        lastmod.text = mtime.strftime("%Y-%m-%d")

    tree = ET.ElementTree(urlset)
    tree.write("sitemap.xml", encoding="utf-8", xml_declaration=True)

if __name__ == "__main__":
    build()
