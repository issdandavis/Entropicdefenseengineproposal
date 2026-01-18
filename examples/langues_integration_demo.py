"""
Langues Weighting System Integration Demo
==========================================

This example demonstrates Layer 3 (Langues Metric Tensor) integration with
the complete SCBE-AETHERMOORE system, showing how the Six Sacred Tongues
weighting affects hyperbolic governance decisions.

Demonstrates:
1. Sacred Tongue weight scaling (φ^k)
2. Temporal phase breathing
3. Dimensional flux (polly/quasi/demi)
4. Integration with Layer 12 (Harmonic Scaling)
5. Complete risk computation pipeline

Author: Isaac Thorne
Created: January 2026
Patent: USPTO #63/961,403
"""

import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import numpy as np
import matplotlib.pyplot as plt
from symphonic_cipher.core import (
    LanguesConfig,
    langues_metric,
    langues_metric_gradient,
    langues_metric_normalized,
    flux_update,
    fractional_dimension,
    verify_all_properties,
    harmonic_scaling,
    SACRED_TONGUE_WEIGHTS,
)


def demo_sacred_tongue_weights():
    """Demo 1: Show how Sacred Tongue weights affect the metric"""
    print("="*70)
    print("DEMO 1: Sacred Tongue Weighting")
    print("="*70)
    
    config = LanguesConfig()
    
    # Same deviation in all dimensions
    x = np.full(6, 0.5)  # All at 0.5 deviation from ideal (0)
    t = 0.0
    
    print("\nSacred Tongue Weights (Golden Ratio Scaling):")
    print(f"  KO (Korvethian):    {SACRED_TONGUE_WEIGHTS['KO']:.3f}")
    print(f"  AV (Avethril):      {SACRED_TONGUE_WEIGHTS['AV']:.3f}")
    print(f"  RU (Runevast):      {SACRED_TONGUE_WEIGHTS['RU']:.3f}")
    print(f"  CA (Celestine):     {SACRED_TONGUE_WEIGHTS['CA']:.3f}")
    print(f"  UM (Umbralis):      {SACRED_TONGUE_WEIGHTS['UM']:.3f}")
    print(f"  DR (Draconic):      {SACRED_TONGUE_WEIGHTS['DR']:.3f}")
    
    L = langues_metric(x, config, t)
    print(f"\nMetric L(x,0) with equal deviations: {L:.3f}")
    
    # Now vary individual dimensions
    print("\nVarying individual tongue deviations:")
    for i, tongue in enumerate(['KO', 'AV', 'RU', 'CA', 'UM', 'DR']):
        x_varied = np.zeros(6)
        x_varied[i] = 0.5  # Only this tongue deviates
        
        L_varied = langues_metric(x_varied, config, t)
        print(f"  {tongue} deviation only: L = {L_varied:.3f}")


def demo_temporal_breathing():
    """Demo 2: Show temporal phase breathing over time"""
    print("\n" + "="*70)
    print("DEMO 2: Temporal Phase Breathing")
    print("="*70)
    
    config = LanguesConfig()
    
    # Fixed deviation
    x = np.array([0.3, 0.3, 0.3, 0.3, 0.3, 0.3])
    
    # Compute L over time
    t_values = np.linspace(0, 10, 500)
    L_values = [langues_metric(x, config, t) for t in t_values]
    L_values = np.array(L_values)
    
    print(f"\nFixed deviation: x = {x}")
    print(f"Time range: 0 to 10 seconds")
    print(f"\nL statistics:")
    print(f"  Mean: {np.mean(L_values):.3f}")
    print(f"  Std:  {np.std(L_values):.3f}")
    print(f"  Min:  {np.min(L_values):.3f}")
    print(f"  Max:  {np.max(L_values):.3f}")
    print(f"  Range: {np.max(L_values) - np.min(L_values):.3f}")
    
    # Plot
    plt.figure(figsize=(12, 6))
    plt.plot(t_values, L_values, 'b-', linewidth=2, label='L(x,t)')
    plt.axhline(np.mean(L_values), color='r', linestyle='--', label='Mean')
    plt.xlabel('Time (seconds)', fontsize=12)
    plt.ylabel('Langues Metric L', fontsize=12)
    plt.title('Temporal Phase Breathing (Layer 3)', fontsize=14)
    plt.legend()
    plt.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.savefig('/tmp/langues_temporal_breathing.png', dpi=150)
    print("\n✓ Plot saved: /tmp/langues_temporal_breathing.png")


def demo_dimensional_flux():
    """Demo 3: Demonstrate polly/quasi/demi dimensional breathing"""
    print("\n" + "="*70)
    print("DEMO 3: Dimensional Flux (Polly/Quasi/Demi)")
    print("="*70)
    
    config = LanguesConfig(nu_enabled=True)
    
    # Start with partial flux
    config.nu = np.array([1.0, 0.8, 0.6, 0.4, 0.2, 0.0])
    
    print(f"\nInitial flux coefficients ν: {config.nu}")
    print(f"Effective dimension D_f: {fractional_dimension(config.nu):.2f}")
    
    # Fixed state
    x = np.array([0.5, 0.5, 0.5, 0.5, 0.5, 0.5])
    
    # Simulate flux evolution
    print("\nFlux evolution:")
    nu_current = config.nu.copy()
    t = 0.0
    dt = 0.1
    
    t_history = []
    nu_history = []
    D_f_history = []
    L_history = []
    
    for step in range(100):
        D_f = fractional_dimension(nu_current)
        
        # Update config with current flux
        config.nu = nu_current
        L = langues_metric(x, config, t)
        
        if step % 10 == 0:
            print(f"  t={t:.1f}s: D_f={D_f:.3f}, L={L:.3f}, ν={nu_current}")
        
        t_history.append(t)
        nu_history.append(nu_current.copy())
        D_f_history.append(D_f)
        L_history.append(L)
        
        nu_current = flux_update(nu_current, config, t, dt)
        t += dt
    
    # Plot dimensional breathing
    plt.figure(figsize=(14, 8))
    
    # Subplot 1: Individual flux coefficients
    plt.subplot(2, 2, 1)
    nu_array = np.array(nu_history)
    for i, tongue in enumerate(['KO', 'AV', 'RU', 'CA', 'UM', 'DR']):
        plt.plot(t_history, nu_array[:, i], label=tongue, linewidth=2)
    plt.xlabel('Time (s)')
    plt.ylabel('Flux Coefficient ν')
    plt.title('Individual Dimension Flux (ν_l)')
    plt.legend()
    plt.grid(True, alpha=0.3)
    
    # Subplot 2: Effective dimension
    plt.subplot(2, 2, 2)
    plt.plot(t_history, D_f_history, 'b-', linewidth=2)
    plt.axhline(6, color='r', linestyle='--', label='Max (6D)')
    plt.axhline(0, color='r', linestyle='--', label='Min (0D)')
    plt.xlabel('Time (s)')
    plt.ylabel('Effective Dimension D_f')
    plt.title('Fractional Dimension Breathing')
    plt.legend()
    plt.grid(True, alpha=0.3)
    plt.ylim([-0.5, 6.5])
    
    # Subplot 3: Metric value
    plt.subplot(2, 2, 3)
    plt.plot(t_history, L_history, 'g-', linewidth=2)
    plt.xlabel('Time (s)')
    plt.ylabel('Langues Metric L')
    plt.title('L(x,t) with Flux')
    plt.grid(True, alpha=0.3)
    
    # Subplot 4: Radar plot of final flux state
    plt.subplot(2, 2, 4, projection='polar')
    theta = np.linspace(0, 2*np.pi, 7)
    r = np.concatenate([nu_current, [nu_current[0]]])  # Close the loop
    plt.plot(theta, r, 'ro-', linewidth=2, markersize=8)
    plt.fill(theta, r, alpha=0.25)
    plt.ylim([0, 1])
    plt.title('Final Flux State (Radar)')
    
    plt.tight_layout()
    plt.savefig('/tmp/langues_dimensional_flux.png', dpi=150)
    print("\n✓ Plot saved: /tmp/langues_dimensional_flux.png")


def demo_integration_with_harmonic_scaling():
    """Demo 4: Integration with Layer 12 (Harmonic Wall)"""
    print("\n" + "="*70)
    print("DEMO 4: Integration with Harmonic Scaling (Layer 12)")
    print("="*70)
    
    config = LanguesConfig()
    
    # Scenario: User deviating from trusted behavior
    scenarios = [
        ("Trusted User", np.array([0.05, 0.05, 0.05, 0.05, 0.05, 0.05])),
        ("Moderate Deviation", np.array([0.3, 0.2, 0.3, 0.2, 0.3, 0.2])),
        ("High Deviation", np.array([0.6, 0.7, 0.6, 0.5, 0.7, 0.6])),
        ("Extreme Deviation", np.array([1.0, 1.0, 1.0, 1.0, 1.0, 1.0])),
    ]
    
    t = 0.0
    R = 1.5  # Harmonic ratio
    
    print("\nScenario Analysis:")
    print(f"{'Scenario':<25} {'L(x)':<10} {'L_N':<10} {'d*':<10} {'H(d*)':<10} {'Risk':<10}")
    print("-" * 75)
    
    for name, x in scenarios:
        # Layer 3: Langues metric
        L = langues_metric(x, config, t)
        L_N = langues_metric_normalized(x, config, t)
        
        # Normalize to use as "distance" to trusted realm
        d_star = L_N * 3.0  # Scale to reasonable hyperbolic distance
        
        # Layer 12: Harmonic scaling
        H = harmonic_scaling(d_star, R=R)
        
        # Combined risk
        risk = L_N * H
        
        print(f"{name:<25} {L:<10.3f} {L_N:<10.3f} {d_star:<10.3f} {H:<10.2f} {risk:<10.3f}")
    
    print("\nInterpretation:")
    print("  - L(x): Raw Langues metric (cost)")
    print("  - L_N: Normalized metric [0,1]")
    print("  - d*: Hyperbolic distance (scaled from L_N)")
    print("  - H(d*): Harmonic wall amplification")
    print("  - Risk: Combined risk score (L_N × H)")


def demo_gradient_descent():
    """Demo 5: Gradient descent to ideal state"""
    print("\n" + "="*70)
    print("DEMO 5: Gradient Descent to Ideal (Lyapunov Stability)")
    print("="*70)
    
    config = LanguesConfig()
    
    # Start away from ideal
    x = config.mu + np.array([0.8, 0.6, -0.5, 0.7, -0.4, 0.9])
    t = 0.0
    k = 0.5  # Descent rate
    dt = 0.01
    
    print(f"\nInitial state: x = {x}")
    print(f"Ideal state:   μ = {config.mu}")
    print(f"Initial distance: {np.linalg.norm(x - config.mu):.3f}")
    
    # Simulate gradient descent
    x_history = [x.copy()]
    L_history = [langues_metric(x, config, t)]
    
    for step in range(500):
        # Gradient descent step
        grad = langues_metric_gradient(x, config, t)
        x = x - k * grad * dt
        
        x_history.append(x.copy())
        L_history.append(langues_metric(x, config, t))
        
        t += dt
    
    x_history = np.array(x_history)
    distances = np.linalg.norm(x_history - config.mu, axis=1)
    
    print(f"\nFinal state: x = {x_history[-1]}")
    print(f"Final distance: {distances[-1]:.6f}")
    print(f"Convergence: {(1 - distances[-1]/distances[0])*100:.2f}%")
    
    # Plot convergence
    plt.figure(figsize=(14, 6))
    
    # Subplot 1: Trajectory in each dimension
    plt.subplot(1, 2, 1)
    time_points = np.arange(len(x_history)) * dt
    for i, tongue in enumerate(['KO', 'AV', 'RU', 'CA', 'UM', 'DR']):
        plt.plot(time_points, x_history[:, i], label=tongue, linewidth=2)
    plt.axhline(0, color='k', linestyle='--', label='Ideal', linewidth=1)
    plt.xlabel('Time (s)')
    plt.ylabel('State Value')
    plt.title('Gradient Descent Trajectories')
    plt.legend()
    plt.grid(True, alpha=0.3)
    
    # Subplot 2: Distance to ideal
    plt.subplot(1, 2, 2)
    plt.plot(time_points, distances, 'b-', linewidth=2)
    plt.xlabel('Time (s)')
    plt.ylabel('Distance to Ideal ||x - μ||')
    plt.title('Convergence to Ideal State')
    plt.grid(True, alpha=0.3)
    plt.yscale('log')
    
    plt.tight_layout()
    plt.savefig('/tmp/langues_gradient_descent.png', dpi=150)
    print("\n✓ Plot saved: /tmp/langues_gradient_descent.png")


def demo_verification():
    """Demo 6: Verify all mathematical properties"""
    print("\n" + "="*70)
    print("DEMO 6: Mathematical Property Verification")
    print("="*70)
    
    config = LanguesConfig()
    
    print("\nVerifying all 9 proven properties...")
    results = verify_all_properties(config)
    
    print(f"\n✓ Positivity:          {results['positivity']}")
    print(f"✓ Monotonicity:        {results['monotonicity']}")
    print(f"✓ Convexity:           {results['convexity']}")
    print(f"✓ Lyapunov Stability:  {results['lyapunov_stability']['converged']}")
    
    if results['lyapunov_stability']['converged']:
        print(f"  - Initial distance:  {results['lyapunov_stability']['initial_distance']:.4f}")
        print(f"  - Final distance:    {results['lyapunov_stability']['final_distance']:.6f}")
        print(f"  - Reduction ratio:   {results['lyapunov_stability']['reduction_ratio']:.4f}")
    
    print(f"\n{'='*70}")
    print(f"ALL PROPERTIES VERIFIED: {results['all_passed']}")
    print(f"{'='*70}")


def run_all_demos():
    """Run complete demo suite"""
    print("╔" + "="*68 + "╗")
    print("║" + " "*8 + "LANGUES WEIGHTING SYSTEM (Layer 3) - DEMO SUITE" + " "*13 + "║")
    print("║" + " "*20 + "Patent USPTO #63/961,403" + " "*25 + "║")
    print("╚" + "="*68 + "╝")
    
    demo_sacred_tongue_weights()
    demo_temporal_breathing()
    demo_dimensional_flux()
    demo_integration_with_harmonic_scaling()
    demo_gradient_descent()
    demo_verification()
    
    print("\n" + "="*70)
    print("ALL DEMOS COMPLETE")
    print("="*70)
    print("\nGenerated files:")
    print("  - /tmp/langues_temporal_breathing.png")
    print("  - /tmp/langues_dimensional_flux.png")
    print("  - /tmp/langues_gradient_descent.png")
    print("\nFor full documentation, see:")
    print("  - /LANGUES_WEIGHTING_SYSTEM.md")
    print("  - /symphonic_cipher/core/langues_metric_tensor.py")
    print("="*70)


if __name__ == "__main__":
    # Check if matplotlib is available
    try:
        import matplotlib.pyplot as plt
        from mpl_toolkits.mplot3d import Axes3D
        from matplotlib.patches import Circle
        import mpl_toolkits.mplot3d.art3d as art3d
    except ImportError:
        print("Warning: matplotlib not installed. Plots will be skipped.")
        print("Install with: pip install matplotlib")
        plt = None
    
    run_all_demos()
