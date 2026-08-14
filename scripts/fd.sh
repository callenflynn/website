#!/usr/bin/env bash
set -euo pipefail

tmp="$(mktemp)"
trap 'rm -f "$tmp"' EXIT

curl -fsSL "https://raw.githubusercontent.com/callenflynn/fedora-script/refs/heads/main/setup.sh" -o "$tmp"

bash "$tmp"
