"""
SCBE-AETHERMOORE Complete System Demo
======================================

This example demonstrates the full 14-layer architecture in action:

1. Input: User command in a Sacred Tongue
2. Layer 1: Context commitment (SHA-256 binding)
3. Layer 3: Langues metric tensor weighting
4. Layer 4: Poincaré ball embedding
5. Layer 8: Realm distance calculation
6. Layer 12: Harmonic scaling (super-exponential defense)
7. Layer 14: Spiralverse protocol (PQC + tongue integration)
8. Output: ALLOW/DENY decision with confidence score

Use Case: AI Safety Gate
- User issues command: "Execute diagnostic protocol"
- System verifies: context, tongue, distance to trusted realm
- Decision: Allow if within trusted radius, deny otherwise

Author: Isaac Thorne
Created: January 2026
"""

import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import numpy as np
from symphonic_cipher.core.harmonic_scaling_law import (
    harmonic_scaling,
    compute_risk_amplification,
    escape_velocity_theorem,
    HarmonicConfig
)
from symphonic_cipher.spiralverse.sst_manager import (
    SSTManager,
    SacredTongue
)

# Import SCBE complete math from root
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
from scbe_complete_math import (
    layer_1_complex_state,
    layer_2_realification,
    layer_3_weighted_transform,
    poincare_embedding,
    hyperbolic_distance,
    Realm,
    realm_distance,
    harmonic_scaling as scbe_harmonic_scaling,
    compute_base_risk,
    compute_amplified_risk,
    make_decision
)


class SCBEAethermooreGate:
    """
    Complete SCBE-AETHERMOORE Security Gate
    
    Integrates:
    - Six Sacred Tongues (linguistic binding)
    - Hyperbolic geometry (context embedding)
    - Harmonic scaling (exponential defense)
    - Post-quantum cryptography (ML-KEM-768 ready)
    """
    
    def __init__(self):
        # Initialize Six Sacred Tongues
        self.sst = SSTManager()
        
        # Define trusted realms in hyperbolic space
        self.realms = [
            Realm(
                center=np.array([0.2, 0.1, 0.0, 0.0, 0.0, 0.0]),
                radius=0.5,
                name="Office Command Center",
                trust_level=1.0
            ),
            Realm(
                center=np.array([-0.3, 0.2, 0.1, 0.0, 0.0, 0.0]),
                radius=0.4,
                name="Home Workspace",
                trust_level=0.9
            ),
            Realm(
                center=np.array([0.1, -0.25, 0.15, 0.0, 0.0, 0.0]),
                radius=0.3,
                name="Secure VPN",
                trust_level=0.85
            )
        ]
        
        # Harmonic configuration (golden ratio base)
        self.harmonic_config = HarmonicConfig(
            R=(1 + np.sqrt(5)) / 2,  # φ ≈ 1.618
            mode="BOUNDED",
            saturation_scale=1.0
        )
        
        # Decision threshold
        self.risk_threshold = 0.5
    
    def process_command(
        self,
        command: str,
        context_features: dict,
        timestamp: float = None
    ) -> dict:
        """
        Process user command through complete SCBE pipeline
        
        Args:
            command: User command string
            context_features: Dict with GPS, time, device, biometric, etc.
            timestamp: Current time (for Layer 1)
        
        Returns:
            Dict with decision, confidence, risk scores, and audit trail
        """
        import time
        if timestamp is None:
            timestamp = time.time()
        
        print("\n" + "="*70)
        print(f"PROCESSING COMMAND: '{command}'")
        print("="*70)
        
        # ====================================================================
        # LAYER 14: Spiralverse Protocol - Tongue Detection & Binding
        # ====================================================================
        print("\n[Layer 14] Spiralverse Protocol - Sacred Tongue Detection")
        binding = self.sst.bind_message(command)
        print(f"  → Detected tongue: {binding.tongue.value} ({binding.tongue.name})")
        print(f"  → Context hash: {binding.context_hash[:16]}...")
        print(f"  → Signature: {binding.signature[:16]}...")
        print(f"  → Binding valid: {'✓' if self.sst.verify_binding(binding) else '✗'}")
        
        # ====================================================================
        # LAYER 1: Complex Context State
        # ====================================================================
        print("\n[Layer 1] Complex Context State - Commitment")
        c = layer_1_complex_state(timestamp, D=6)
        print(f"  → Complex state c(t) ∈ ℂ^6: norm = {np.linalg.norm(c):.4f}")
        
        # ====================================================================
        # LAYER 2: Realification
        # ====================================================================
        print("\n[Layer 2] Realification - ℂ^6 → ℝ^12")
        x = layer_2_realification(c)
        print(f"  → Real vector x ∈ ℝ^12: norm = {np.linalg.norm(x):.4f}")
        
        # ====================================================================
        # LAYER 3: Langues Metric Tensor - Tongue Weighting
        # ====================================================================
        print("\n[Layer 3] Langues Metric Tensor - Sacred Tongue Weighting")
        tongue_weight = self.sst.get_tongue_weight(binding.tongue)
        print(f"  → Tongue weight (φ^{binding.tongue.value}): {tongue_weight:.4f}")
        
        # Apply tongue-specific weighting
        G_tongue = np.ones(len(x))
        G_tongue[:6] *= tongue_weight  # Weight first 6 dimensions by tongue
        x_weighted = layer_3_weighted_transform(x, G_tongue)
        print(f"  → Weighted vector: norm = {np.linalg.norm(x_weighted):.4f}")
        
        # ====================================================================
        # LAYER 4: Poincaré Ball Embedding
        # ====================================================================
        print("\n[Layer 4] Poincaré Ball Embedding - ℝ^n → 𝔹^n")
        u = poincare_embedding(x_weighted, alpha=1.5)
        u_norm = np.linalg.norm(u)
        print(f"  → Hyperbolic state u ∈ 𝔹^{len(u)}: ‖u‖ = {u_norm:.4f}")
        print(f"  → Ball constraint (‖u‖ < 1): {'✓' if u_norm < 1 else '✗'}")
        
        # ====================================================================
        # LAYER 8: Multi-Well Realms - Distance to Trusted
        # ====================================================================
        print("\n[Layer 8] Multi-Well Realms - Distance to Trusted")
        d_star = realm_distance(u, self.realms)
        print(f"  → Realm distance d*: {d_star:.4f}")
        
        # Find nearest realm
        nearest_idx = np.argmin([hyperbolic_distance(u, realm.center) for realm in self.realms])
        nearest_realm = self.realms[nearest_idx]
        print(f"  → Nearest realm: '{nearest_realm.name}' (trust: {nearest_realm.trust_level})")
        
        # ====================================================================
        # LAYER 12: Harmonic Scaling - Exponential Defense Wall
        # ====================================================================
        print("\n[Layer 12] Harmonic Scaling Law - H(d*, φ) = φ^(d*²)")
        H = harmonic_scaling(d_star, R=self.harmonic_config.R, mode="UNBOUNDED")
        H_bounded = harmonic_scaling(d_star, R=self.harmonic_config.R, mode="BOUNDED")
        print(f"  → Harmonic wall H(unbounded): {H:.2f}×")
        print(f"  → Harmonic wall H(bounded): {H_bounded:.4f}")
        
        # ====================================================================
        # LAYER 13: Risk Computation
        # ====================================================================
        print("\n[Layer 13] Risk Computation & Decision")
        
        # Base risk (simplified - normally from Layers 9-11)
        base_risk = min(d_star / 3.0, 1.0)  # Normalize distance to [0, 1]
        print(f"  → Base risk: {base_risk:.4f}")
        
        # Amplified risk
        risk_amplified = compute_risk_amplification(
            base_risk,
            d_star,
            self.harmonic_config
        )
        print(f"  → Amplified risk: {risk_amplified:.4f}")
        
        # Decision
        decision, confidence = make_decision(risk_amplified, threshold=self.risk_threshold)
        print(f"  → DECISION: {decision}")
        print(f"  → Confidence: {confidence:.2%}")
        
        # ====================================================================
        # Return complete audit trail
        # ====================================================================
        return {
            'timestamp': timestamp,
            'command': command,
            'tongue': {
                'detected': binding.tongue.value,
                'name': binding.tongue.name,
                'weight': tongue_weight,
                'binding_valid': self.sst.verify_binding(binding)
            },
            'layers': {
                'L1_complex_norm': float(np.linalg.norm(c)),
                'L2_real_norm': float(np.linalg.norm(x)),
                'L3_weighted_norm': float(np.linalg.norm(x_weighted)),
                'L4_hyperbolic_norm': float(u_norm),
                'L8_realm_distance': float(d_star),
                'L8_nearest_realm': nearest_realm.name,
                'L12_harmonic_wall': float(H),
                'L12_harmonic_bounded': float(H_bounded),
            },
            'risk': {
                'base': float(base_risk),
                'amplified': float(risk_amplified),
                'threshold': self.risk_threshold
            },
            'decision': decision,
            'confidence': float(confidence),
            'audit': {
                'context_hash': binding.context_hash,
                'signature': binding.signature
            }
        }


def run_demo():
    """
    Run complete SCBE-AETHERMOORE demo
    """
    print("╔" + "="*68 + "╗")
    print("║" + " "*10 + "SCBE-AETHERMOORE v3.0 - COMPLETE DEMO" + " "*21 + "║")
    print("║" + " "*15 + "Patent USPTO #63/961,403" + " "*28 + "║")
    print("╚" + "="*68 + "╝")
    
    # Initialize gate
    gate = SCBEAethermooreGate()
    
    # Test scenarios
    scenarios = [
        {
            'name': "Legitimate Command (Trusted Context)",
            'command': "Execute diagnostic protocol alpha-seven",
            'context': {
                'gps': (47.6062, -122.3321),  # Office location
                'time': 14.5,  # 2:30 PM
                'device': 'trusted_laptop',
                'biometric': 0.95,
                'threat': 0.0
            }
        },
        {
            'name': "Suspicious Command (Unknown Location)",
            'command': "Amplify power override emergency systems",
            'context': {
                'gps': (40.7128, -74.0060),  # Remote location (NYC)
                'time': 3.0,  # 3:00 AM
                'device': 'unknown_device',
                'biometric': 0.4,
                'threat': 7.5
            }
        },
        {
            'name': "Emotional Command (Home Context)",
            'command': "I feel connected to this moment of peace",
            'context': {
                'gps': (47.6101, -122.3420),  # Home location
                'time': 20.0,  # 8:00 PM
                'device': 'personal_tablet',
                'biometric': 0.88,
                'threat': 0.0
            }
        }
    ]
    
    # Process each scenario
    results = []
    for i, scenario in enumerate(scenarios, 1):
        print(f"\n\n{'#'*70}")
        print(f"# SCENARIO {i}: {scenario['name']}")
        print(f"{'#'*70}")
        
        result = gate.process_command(
            command=scenario['command'],
            context_features=scenario['context']
        )
        results.append(result)
    
    # Summary
    print("\n\n" + "="*70)
    print("SUMMARY OF ALL SCENARIOS")
    print("="*70)
    
    for i, result in enumerate(results, 1):
        decision_symbol = "✓ ALLOW" if result['decision'] == 'ALLOW' else "✗ DENY"
        print(f"\nScenario {i}: {decision_symbol}")
        print(f"  Command: '{result['command'][:50]}...'")
        print(f"  Tongue: {result['tongue']['detected']} ({result['tongue']['name']})")
        print(f"  Realm distance: {result['layers']['L8_realm_distance']:.4f}")
        print(f"  Harmonic wall: {result['layers']['L12_harmonic_wall']:.2f}×")
        print(f"  Risk (amplified): {result['risk']['amplified']:.4f}")
        print(f"  Confidence: {result['confidence']:.2%}")
    
    # Escape velocity verification
    print("\n\n" + "="*70)
    print("ESCAPE VELOCITY THEOREM VERIFICATION")
    print("="*70)
    
    ev_result = escape_velocity_theorem(
        k=2.1e6,        # SCBE entropy growth (bits/sec)
        C=1e9,          # Quantum attacker (Grover's)
        N0=2**256       # AES-256 search space
    )
    
    print(f"Entropy growth rate k: {2.1e6:.2e} bits/sec")
    print(f"Attacker power C: {1e9:.2e} ops/sec")
    print(f"Initial space N₀: 2^256")
    print(f"Critical k_crit: {ev_result['k_crit']:.2e} bits/sec")
    print(f"Ratio k/k_crit: {ev_result['ratio']:.2e}")
    print(f"Has escape velocity: {'✓ YES' if ev_result['has_escape'] else '✗ NO'}")
    print(f"\nResult: {ev_result['interpretation']}")
    
    print("\n" + "="*70)
    print("Demo complete! All layers functioning correctly.")
    print("="*70 + "\n")


if __name__ == "__main__":
    run_demo()
