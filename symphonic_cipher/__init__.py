"""
SCBE-AETHERMOORE v3.0 - Symphonic Cipher Library
Patent Pending USPTO #63/961,403
Quantum-Resistant Post-Quantum Cryptography System

A hyperbolic governance framework with 14-layer architecture:
- Layers 1-12: Core mathematical transforms (complex → hyperbolic → risk)
- Layer 13: Quasicrystal lattice (ML-KEM-768 PQC bridge)
- Layer 14: Spiralverse Protocol (Hybrid PQC + Six Sacred Tongues)
- Audio Axis: Real-time telemetry analysis

Author: Isaac Thorne (@issdandavis)
Created: January 2026
License: MIT (see LICENSE)
"""

__version__ = "3.0.0"
__author__ = "Isaac Thorne"
__patent__ = "USPTO #63/961,403"

# Core mathematical primitives (Layers 1-12)
from .core import (
    # Layer 1: Complexification
    context_commitment,
    # Layer 3: Langues Metric Tensor
    langues_metric_tensor,
    # Layer 4: Poincaré Ball
    poincare_ball,
    # Layer 5: Invariant Metric
    invariant_metric,
    # Layer 6: Breathing Transform
    breathing_transform,
    # Layer 7: Fractal Dimension
    fractal_dimension_analyzer,
    # Layer 8: PHDM Topology
    # Layer 9: Multi-Well Realms
    multi_well_realms,
    # Layer 12: Harmonic Scaling Law
    harmonic_scaling_law,
)

# Topological components (Layer 8)
from .topology import (
    polyhedral_hamiltonian_defense,
    hamiltonian_cfi,
    euler_characteristic,
    curvature_monitor,
)

# Dynamical systems (Layer 10)
from .dynamics import (
    differential_cryptography,
    lyapunov_analyzer,
    phase_shift,
    trajectory_validator,
)

# Post-quantum cryptography (Layer 13)
from .pqc import (
    quasicrystal_lattice,
    ml_kem_wrapper,
    ml_dsa_wrapper,
    hybrid_key_exchange,
    hybrid_signatures,
)

# Spiralverse Protocol (Layer 14)
from .spiralverse import (
    SpiralverseSDK,
    protocol_negotiation,
    sst_manager,
    policies,
)

# Layer-to-layer connectors/bridges
from .connectors import (
    phase_coherence_bridge,
    tongue_distance_bridge,
    geodesic_validator_bridge,
    temporal_bridge,
    topology_bridge,
    stability_bridge,
    triadic_bridge,
    risk_aggregation_bridge,
    pqc_integration_bridge,
)

# Audio axis (parallel layer)
from .audio import (
    fft_telemetry,
    frequency_analyzer,
    anomaly_detector,
)

__all__ = [
    # Version/metadata
    "__version__",
    "__author__",
    "__patent__",
    # Core modules
    "context_commitment",
    "langues_metric_tensor",
    "poincare_ball",
    "invariant_metric",
    "breathing_transform",
    "fractal_dimension_analyzer",
    "multi_well_realms",
    "harmonic_scaling_law",
    # Topology
    "polyhedral_hamiltonian_defense",
    "hamiltonian_cfi",
    "euler_characteristic",
    "curvature_monitor",
    # Dynamics
    "differential_cryptography",
    "lyapunov_analyzer",
    "phase_shift",
    "trajectory_validator",
    # PQC
    "quasicrystal_lattice",
    "ml_kem_wrapper",
    "ml_dsa_wrapper",
    "hybrid_key_exchange",
    "hybrid_signatures",
    # Spiralverse
    "SpiralverseSDK",
    "protocol_negotiation",
    "sst_manager",
    "policies",
    # Connectors
    "phase_coherence_bridge",
    "tongue_distance_bridge",
    "geodesic_validator_bridge",
    "temporal_bridge",
    "topology_bridge",
    "stability_bridge",
    "triadic_bridge",
    "risk_aggregation_bridge",
    "pqc_integration_bridge",
    # Audio
    "fft_telemetry",
    "frequency_analyzer",
    "anomaly_detector",
]
