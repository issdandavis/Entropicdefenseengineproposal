"""
Core Mathematical Primitives (Layers 1-12)
"""

from .harmonic_scaling_law import (
    harmonic_scaling,
    harmonic_gradient,
    compute_risk_amplification,
    escape_velocity_theorem,
    verify_axiom_a12,
    HarmonicConfig,
    PHI,
    DEFAULT_R
)

# Layer 3: Langues Metric Tensor (VERIFIED ✓)
try:
    from .langues_metric_tensor import (
        LanguesConfig,
        langues_metric,
        langues_metric_gradient,
        langues_metric_normalized,
        flux_update,
        fractional_dimension,
        energy_integral,
        verify_all_properties,
        SACRED_TONGUE_WEIGHTS,
        DEFAULT_WEIGHTS,
    )
    _LANGUES_AVAILABLE = True
except ImportError:
    _LANGUES_AVAILABLE = False

__all__ = [
    "harmonic_scaling",
    "harmonic_gradient",
    "compute_risk_amplification",
    "escape_velocity_theorem",
    "verify_axiom_a12",
    "HarmonicConfig",
    "PHI",
    "DEFAULT_R",
]

# Add Layer 3 exports if available
if _LANGUES_AVAILABLE:
    __all__.extend([
        "LanguesConfig",
        "langues_metric",
        "langues_metric_gradient",
        "langues_metric_normalized",
        "flux_update",
        "fractional_dimension",
        "energy_integral",
        "verify_all_properties",
        "SACRED_TONGUE_WEIGHTS",
        "DEFAULT_WEIGHTS",
    ])
