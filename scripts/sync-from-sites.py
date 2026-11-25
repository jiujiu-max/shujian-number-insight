#!/usr/bin/env python3
"""Copy a published Sites source commit into the static GitHub Pages mirror.

The source checkout is read through Git, so uncommitted work is never copied.
This script intentionally stops when source files needing a manual Pages
adaptation change. It does not commit, push, or publish anything itself.
"""

from __future__ import annotations

import argparse
import hashlib
import subprocess
import sys
from pathlib import Path


MIRROR = Path(__file__).resolve().parents[1]
SOURCE_URL = "https://shujian-number-insight-2026.cyj4f5r8c4.chatgpt.site/"
PUBLIC_URL = "https://jiaming27.cn/"
COPY_PUBLIC = {
    "public/favicon.svg",
    "public/file.svg",
    "public/globe.svg",
    "public/window.svg",
    "public/wechat-jmgy27.png",
}
KNOWN_PUBLIC = COPY_PUBLIC | {
    "public/og.png",
    "public/og-v2.png",
    "public/og-v3.png",
    "public/og-v4.png",
    "public/og-v5.png",
    "public/type-entry-qr.png",
    "public/wechat-consultation.png",
}
MANUAL_SOURCE_HASHES = {
    "app/layout.tsx": "dc67b0bc8f9ce5b6d6c7c9337d07be3b84e1fabb5bbbf8e87482ef6f20c62b36",
    "public/og-v5.png": "351ebebf2355dd0225498fbfe276ba4c08b51b419cb838b4dda3f454e9999253",
    "package.json": "985fb194062c2f6cd633517e7b67976d6fd76582c83fca7f4c1f5d7d53428ef8",
    "pnpm-lock.yaml": "19b584f3ac1e6dc845a2fb5e5ff6daa6e05b1e6d86f7287a73dd4813a0bf0afc",
    "next.config.ts": "614bce25b089c3f19b1e17a6346c74b858034040154c6621e7d35303004767cc",
}
SOURCE_MARKER = "scripts/sites-source-commit.txt"


def git(repo: Path, *args: str) -> bytes:
    return subprocess.check_output(["git", *args], cwd=repo)


def source_file(repo: Path, commit: str, name: str) -> bytes:
    return git(repo, "show", f"{commit}:{name}")


def replace_once(data: bytes, old: bytes, new: bytes, name: str) -> bytes:
    if data.count(old) != 1:
        raise ValueError(f"{name}: expected one known domain/asset reference; review manually")
    return data.replace(old, new)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--sites-checkout", type=Path, required=True)
    parser.add_argument("--source-commit", required=True, help="SHA verified as the published Sites version")
    parser.add_argument("--apply", action="store_true", help="write the mirror files after safety checks")
    args = parser.parse_args()
    source = args.sites_checkout.expanduser().resolve()
    if not source.is_dir():
        parser.error("Sites checkout does not exist")
    commit = git(source, "rev-parse", "--verify", f"{args.source_commit}^{{commit}}").decode().strip()
    if len(commit) != 40:
        raise ValueError("source commit must resolve to a full SHA")

    if args.apply:
        if git(source, "rev-parse", "HEAD").decode().strip() != commit:
            raise ValueError("Sites checkout HEAD differs from the published source commit")
        if git(source, "status", "--porcelain").strip():
            raise ValueError("Sites checkout has uncommitted work; wait until its edit is published")
        if git(MIRROR, "status", "--porcelain").strip():
            raise ValueError("GitHub mirror has uncommitted work; review it before syncing")

    for name, expected_hash in MANUAL_SOURCE_HASHES.items():
        actual_hash = hashlib.sha256(source_file(source, commit, name)).hexdigest()
        if actual_hash != expected_hash:
            raise ValueError(f"{name} changed in Sites; review its Pages adaptation before syncing")

    source_paths = set(
        git(source, "ls-tree", "-r", "--name-only", commit, "app", "tests", "public")
        .decode()
        .splitlines()
    )
    unknown_public = sorted(p for p in source_paths if p.startswith("public/") and p not in KNOWN_PUBLIC)
    if unknown_public:
        raise ValueError(f"New public assets need review: {', '.join(unknown_public)}")

    desired: dict[str, bytes] = {}
    for name in sorted(source_paths):
        if name.startswith("app/") or name.startswith("tests/"):
            if name == "app/layout.tsx":
                continue  # Pages metadata is intentionally static and domain-specific.
            data = source_file(source, commit, name)
            if name == "app/eight-types.ts":
                data = replace_once(data, SOURCE_URL.encode(), PUBLIC_URL.encode(), name)
            elif name == "app/globals.css":
                data = replace_once(data, b'url("/og-v5.png")', b'url("/og-v5.jpg")', name)
            desired[name] = data
    for name in sorted(COPY_PUBLIC):
        if name not in source_paths:
            raise ValueError(f"Expected public asset missing: {name}")
        desired[name] = source_file(source, commit, name)
    desired[SOURCE_MARKER] = (commit + "\n").encode()

    existing = {
        p.relative_to(MIRROR).as_posix()
        for folder in ("app", "tests")
        for p in (MIRROR / folder).rglob("*")
        if p.is_file() and p.relative_to(MIRROR).as_posix() != "app/layout.tsx"
    }
    to_remove = sorted(existing - desired.keys())
    changed = sorted(name for name, data in desired.items() if not (MIRROR / name).exists() or (MIRROR / name).read_bytes() != data)
    print(f"Sites source commit: {commit}")
    print(f"Files to update: {len(changed)}; files to remove: {len(to_remove)}")
    for name in changed + to_remove:
        print(f"  {name}")
    if not args.apply:
        if git(source, "status", "--porcelain").strip():
            print("Sites checkout has uncommitted work; check used only the committed SHA.")
        return 0
    for name in changed:
        target = MIRROR / name
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(desired[name])
    for name in to_remove:
        (MIRROR / name).unlink()
    print("Mirror updated locally. Run tests/build, then commit and push main to publish.")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (subprocess.CalledProcessError, ValueError) as error:
        print(f"Sync stopped: {error}", file=sys.stderr)
        raise SystemExit(1)
