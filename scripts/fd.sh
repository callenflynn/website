#!/usr/bin/env bash
set -euo pipefail

TMP="$(mktemp)"
trap 'rm -f "$TMP"' EXIT

curl -fsSL "https://raw.githubusercontent.com/callenflynn/fedora-script/refs/heads/main/setup.sh" -o "$TMP"

exec bash "$TMP" </dev/tty
