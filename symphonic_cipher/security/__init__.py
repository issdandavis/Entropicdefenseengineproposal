"""
Security Components - Defense-in-Depth Layer

Includes:
- Security Gate (Claims 61-63): Mandatory dwell-based authentication
- Honey Traps (Experimental): Black box deception mechanisms
"""

from .security_gate import (
    SecurityGate,
    GateParams,
    GateResult,
    Request,
)

# Honey traps are experimental - import separately
try:
    from .honey_traps import (
        HoneyTrapGenerator,
        HoneyParams,
        TrapType,
        AttackSignature,
        honey_decrypt,
    )
    _HONEY_TRAPS_AVAILABLE = True
except ImportError:
    _HONEY_TRAPS_AVAILABLE = False

__all__ = [
    "SecurityGate",
    "GateParams",
    "GateResult",
    "Request",
]

if _HONEY_TRAPS_AVAILABLE:
    __all__.extend([
        "HoneyTrapGenerator",
        "HoneyParams",
        "TrapType",
        "AttackSignature",
        "honey_decrypt",
    ])
