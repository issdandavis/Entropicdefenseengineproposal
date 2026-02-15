"""
Topological Components (Layer 8: PHDM + CFI)

Crystal Cranium v3.0.0 — Zone-dependent topology validation
for the 16 canonical polyhedra cognitive lattice.

Modules:
    phdm_polyhedra — 16-polyhedra registry with zone-dependent χ validation
    phdm_router    — Hamiltonian path routing with φ-weighted energy costs
    aether_braid   — MSR algebra + FSGS hybrid automaton

Author: Issac Davis
"""

from .phdm_polyhedra import (
    CrystalPolyhedron,
    CognitiveZone,
    PolyhedronFamily,
    get_registry,
    get_polyhedron,
    get_zone_polyhedra,
    get_by_name,
    validate_all,
    topology_report,
    ZONE_SPECS,
)

from .phdm_router import (
    HamiltonianRouter,
    ThoughtPath,
    create_golden_path,
)

from .aether_braid import (
    MirrorShiftRefactor,
    FSGSAutomaton,
    FSGSSymbol,
    GovernanceMode,
    PhaseState,
    HybridState,
)

__all__ = [
    "CrystalPolyhedron",
    "CognitiveZone",
    "PolyhedronFamily",
    "get_registry",
    "get_polyhedron",
    "get_zone_polyhedra",
    "get_by_name",
    "validate_all",
    "topology_report",
    "ZONE_SPECS",
    "HamiltonianRouter",
    "ThoughtPath",
    "create_golden_path",
    "MirrorShiftRefactor",
    "FSGSAutomaton",
    "FSGSSymbol",
    "GovernanceMode",
    "PhaseState",
    "HybridState",
]
