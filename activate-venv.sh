#!/bin/bash
# dev_venv.sh
# Create and activate a Python virtual environment in the script's directory,
# but skip creation/activation if already inside a venv.

set -e


SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VENV_DIR="$SCRIPT_DIR/.venv"

# Detect OS
IS_WINDOWS=false
case "$(uname -s)" in
  CYGWIN*|MINGW*|MSYS*)
    IS_WINDOWS=true
    ;;
esac

# Detect if we're already inside a venv
if [ -n "$VIRTUAL_ENV" ]; then
  echo "[WARNING] Already inside a virtual environment at: $VIRTUAL_ENV"
  echo "Skipping creation/activation of $VENV_DIR."
else

  # Robustly find a working Python interpreter
  PYTHON_BIN=""
  PYTHON_CANDIDATES=""
  if [ "$IS_WINDOWS" = true ]; then
    PYTHON_CANDIDATES="python python3 py"
  else
    PYTHON_CANDIDATES="python3 python py"
  fi

  for candidate in $PYTHON_CANDIDATES; do
    if command -v "$candidate" &>/dev/null; then
      "$candidate" --version &>/dev/null && PYTHON_BIN="$candidate" && break
    fi
  done

  if [ -z "$PYTHON_BIN" ]; then
    echo "Error: Could not find a working Python interpreter. Tried: $PYTHON_CANDIDATES"
    for candidate in $PYTHON_CANDIDATES; do
      echo "--- $candidate output: ---"
      command -v "$candidate"
      "$candidate" --version 2>&1 || true
    done
    echo "On Windows, ensure Python is installed and added to your PATH, or use the Microsoft Store to install Python."
    echo "If you have Python installed, check your App execution aliases in Windows Settings and disable the Microsoft Store alias for python/python3 if needed."
    return 1
  fi


  # Create venv if it doesn't exist
  if [ ! -d "$VENV_DIR" ]; then
    echo "Creating virtual environment at $VENV_DIR..."
    "$PYTHON_BIN" -m venv "$VENV_DIR"
  else
    echo "Virtual environment already exists at $VENV_DIR"
  fi

  # Activate venv
  echo "Activating virtual environment..."
  if [ "$IS_WINDOWS" = true ]; then
    ACTIVATE_SCRIPT="$VENV_DIR/Scripts/activate"
  else
    ACTIVATE_SCRIPT="$VENV_DIR/bin/activate"
  fi

  # shellcheck disable=SC1091
  if [ -f "$ACTIVATE_SCRIPT" ]; then
    source "$ACTIVATE_SCRIPT"
  else
    echo "Could not find the activate script at $ACTIVATE_SCRIPT."
    exit 1
  fi


  # Upgrade pip/setuptools/wheel inside venv (use python -m pip to avoid Windows locking issues)
  "$PYTHON_BIN" -m pip install --upgrade pip setuptools wheel

  # Install dev tools
  "$PYTHON_BIN" -m pip install black flake8 isort mypy pytest ipython

  echo "✅ Development environment ready in $VENV_DIR."
  echo "To deactivate, run: deactivate"

fi
