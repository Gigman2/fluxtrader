#!/bin/bash
# Script to run SignalFlux backend

cd "$(dirname "$0")"

# Check if virtual environment exists
if [ ! -d ".venv" ]; then
    echo "Virtual environment not found. Creating one..."
    python3 -m venv .venv
fi

# Check if venv Python is valid, recreate if broken
if [ ! -f ".venv/bin/python3" ] || ! .venv/bin/python3 --version >/dev/null 2>&1; then
    echo "Virtual environment appears broken. Recreating..."
    rm -rf .venv
    python3 -m venv .venv
fi

#activate venv
source .venv/bin/activate

# Ensure dependencies are installed
echo "Checking dependencies..."
python3 -m pip install -q -r requirements.txt

# Use venv's Python directly (more reliable than activation)
echo "Starting SignalFlux backend..."
python3 main.py

