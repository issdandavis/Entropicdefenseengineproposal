"""
SCBE-AETHERMOORE v3.0 - Symphonic Cipher Library.

This package initializer stays conservative and import-safe so partial
implementations do not break consumers importing submodules directly.
"""

__version__ = "3.0.0"
__author__ = "Isaac Thorne"
__patent__ = "USPTO #63/961,403"

# Expose package namespaces (not symbol-level re-exports).
from . import audio, connectors, core, dynamics, pqc, security, spiralverse, topology

__all__ = [
    "__version__",
    "__author__",
    "__patent__",
    "audio",
    "connectors",
    "core",
    "dynamics",
    "pqc",
    "security",
    "spiralverse",
    "topology",
]
