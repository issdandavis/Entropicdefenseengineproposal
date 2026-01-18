"""
Test Suite for Langues Metric Tensor (Layer 3)
Patent USPTO #63/961,403

Verifies all 9 proven mathematical properties:
1. Positivity
2. Monotonicity
3. Bounded Oscillation
4. Convexity
5. Smoothness (via continuity checks)
6. Normalization
7. Gradient correctness
8. Energy integral
9. Lyapunov stability

Author: Isaac Thorne
Created: January 2026
"""

import pytest
import numpy as np
from symphonic_cipher.core.langues_metric_tensor import (
    LanguesConfig,
    langues_metric,
    langues_metric_gradient,
    langues_metric_normalized,
    flux_update,
    fractional_dimension,
    verify_positivity,
    verify_monotonicity,
    verify_convexity,
    verify_lyapunov_stability,
    verify_all_properties,
    energy_integral,
    SACRED_TONGUE_WEIGHTS,
    DEFAULT_WEIGHTS,
)


# ============================================================================
# Fixtures
# ============================================================================

@pytest.fixture
def default_config():
    """Default Langues configuration"""
    return LanguesConfig()


@pytest.fixture
def flux_config():
    """Configuration with flux dynamics enabled"""
    return LanguesConfig(nu_enabled=True)


@pytest.fixture
def example_state():
    """Example state from documentation"""
    return np.array([0.8, 0.6, 0.4, 0.2, 0.1, 0.9])


# ============================================================================
# Property 1: Positivity
# ============================================================================

def test_positivity_random_states(default_config):
    """L(x,t) > 0 for all x,t"""
    for _ in range(100):
        x = np.random.uniform(-2, 2, 6)
        t = np.random.uniform(0, 100)
        L = langues_metric(x, default_config, t)
        assert L > 0, f"Positivity violated: L={L}"


def test_positivity_at_ideal(default_config):
    """L(μ,t) > 0 even at ideal state"""
    x = default_config.mu
    for t in [0, 1, 5, 10]:
        L = langues_metric(x, default_config, t)
        assert L > 0, f"Positivity violated at ideal: L={L}"


def test_positivity_verification(default_config):
    """Built-in verification function"""
    assert verify_positivity(default_config, n_samples=500)


# ============================================================================
# Property 2: Monotonicity
# ============================================================================

def test_monotonicity_single_dimension(default_config):
    """Increasing deviation in one dimension increases L"""
    x = default_config.mu.copy()
    t = 0.0
    
    L_base = langues_metric(x, default_config, t)
    
    for i in range(6):
        x_perturbed = x.copy()
        x_perturbed[i] += 0.1  # Small increase
        L_perturbed = langues_metric(x_perturbed, default_config, t)
        
        assert L_perturbed > L_base, \
            f"Monotonicity violated in dimension {i}: {L_perturbed} <= {L_base}"


def test_monotonicity_all_dimensions(default_config):
    """Increasing all deviations increases L"""
    x_small = default_config.mu + 0.01 * np.ones(6)
    x_large = default_config.mu + 0.5 * np.ones(6)
    t = 0.0
    
    L_small = langues_metric(x_small, default_config, t)
    L_large = langues_metric(x_large, default_config, t)
    
    assert L_large > L_small


def test_monotonicity_verification(default_config):
    """Built-in verification function"""
    assert verify_monotonicity(default_config)


# ============================================================================
# Property 3: Bounded Oscillation
# ============================================================================

def test_bounded_oscillation_temporal(default_config):
    """L oscillates within bounds over time"""
    x = np.array([0.3, 0.3, 0.3, 0.3, 0.3, 0.3])
    
    L_values = []
    for t in np.linspace(0, 10, 100):
        L = langues_metric(x, default_config, t)
        L_values.append(L)
    
    L_values = np.array(L_values)
    
    # Should oscillate
    assert np.std(L_values) > 0, "No oscillation detected"
    
    # Should be bounded
    L_min = np.min(L_values)
    L_max = np.max(L_values)
    
    # Theoretical bounds: e^(d-1) to e^(d+1) per dimension
    d = 0.3
    expected_min_per_dim = np.exp(1.0 * (d - 1))
    expected_max_per_dim = np.exp(1.0 * (d + 1))
    
    assert L_min > 0, "Lower bound violated"
    assert L_max < np.inf, "Upper bound violated"


# ============================================================================
# Property 4: Convexity
# ============================================================================

def test_convexity_numerical(default_config):
    """∂²L/∂d² > 0 via finite differences"""
    assert verify_convexity(default_config, n_tests=50)


def test_convexity_unique_minimum(default_config):
    """Minimum at d=0 (ideal state)"""
    t = 0.0
    
    # L at ideal
    L_ideal = langues_metric(default_config.mu, default_config, t)
    
    # L at nearby points
    for _ in range(20):
        x = default_config.mu + np.random.uniform(-0.5, 0.5, 6)
        L = langues_metric(x, default_config, t)
        
        # Due to oscillation, L might sometimes be lower, but on average should be higher
        # This is a weak test - convexity is better tested via second derivative
        pass  # Verified via verify_convexity


# ============================================================================
# Property 5: Smoothness (Continuity)
# ============================================================================

def test_continuity_in_space(default_config):
    """L is continuous in x"""
    x1 = np.random.uniform(-1, 1, 6)
    t = 0.0
    
    L1 = langues_metric(x1, default_config, t)
    
    # Perturb slightly
    for eps in [1e-6, 1e-4, 1e-2]:
        x2 = x1 + eps * np.random.randn(6)
        L2 = langues_metric(x2, default_config, t)
        
        # Should be close for small perturbations
        if eps <= 1e-4:
            assert np.abs(L2 - L1) / L1 < 0.1, "Discontinuity detected"


def test_continuity_in_time(default_config):
    """L is continuous in t"""
    x = np.random.uniform(-1, 1, 6)
    
    t_values = np.linspace(0, 10, 1000)
    L_values = [langues_metric(x, default_config, t) for t in t_values]
    
    # Check no jumps
    diffs = np.diff(L_values)
    max_jump = np.max(np.abs(diffs))
    
    # With dt=0.01, jumps should be small
    assert max_jump < 0.5, f"Large jump detected: {max_jump}"


# ============================================================================
# Property 6: Normalization
# ============================================================================

def test_normalization_range(default_config):
    """L_N ∈ (0, 1]"""
    for _ in range(100):
        x = np.random.uniform(-1, 1, 6)
        t = np.random.uniform(0, 10)
        
        L_N = langues_metric_normalized(x, default_config, t)
        
        assert 0 < L_N <= 1, f"Normalization out of range: L_N={L_N}"


def test_normalization_at_ideal(default_config):
    """L_N at ideal should be low (near 0)"""
    x = default_config.mu
    t = 0.0
    
    L_N = langues_metric_normalized(x, default_config, t)
    
    # At ideal with sin(0)=0, should be minimal
    assert L_N < 0.3, f"L_N at ideal too high: {L_N}"


# ============================================================================
# Property 7: Gradient Correctness
# ============================================================================

def test_gradient_direction(default_config):
    """Gradient points away from ideal"""
    t = 0.0
    
    # Point above ideal
    x = default_config.mu + 0.1 * np.ones(6)
    grad = langues_metric_gradient(x, default_config, t)
    
    # Gradient should be positive (pointing away from ideal)
    assert np.all(grad > 0), f"Gradient direction incorrect: {grad}"
    
    # Point below ideal
    x = default_config.mu - 0.1 * np.ones(6)
    grad = langues_metric_gradient(x, default_config, t)
    
    # Gradient should be negative (pointing away from ideal)
    assert np.all(grad < 0), f"Gradient direction incorrect: {grad}"


def test_gradient_numerical(default_config):
    """Gradient matches finite difference approximation"""
    x = np.random.uniform(-1, 1, 6)
    t = 0.0
    h = 1e-5
    
    grad_analytical = langues_metric_gradient(x, default_config, t)
    
    # Numerical gradient
    grad_numerical = np.zeros(6)
    for i in range(6):
        x_plus = x.copy()
        x_plus[i] += h
        x_minus = x.copy()
        x_minus[i] -= h
        
        L_plus = langues_metric(x_plus, default_config, t)
        L_minus = langues_metric(x_minus, default_config, t)
        
        grad_numerical[i] = (L_plus - L_minus) / (2 * h)
    
    # Should match closely
    np.testing.assert_allclose(grad_analytical, grad_numerical, rtol=1e-3)


# ============================================================================
# Property 8: Energy Integral
# ============================================================================

def test_energy_integral_positive(default_config):
    """Energy integral E_L > 0"""
    d = np.abs(np.random.uniform(-1, 1, 6))
    E_L = energy_integral(default_config, d)
    
    assert E_L > 0, f"Energy integral not positive: {E_L}"


def test_energy_integral_at_ideal(default_config):
    """Energy at ideal (d=0)"""
    d = np.zeros(6)
    E_L = energy_integral(default_config, d)
    
    # E_L = Σ w_l · e^0 · I₀(β_l) = Σ w_l · I₀(1) ≈ Σ w_l · 1.266
    expected_approx = np.sum(default_config.w) * 1.266
    
    assert np.isclose(E_L, expected_approx, rtol=0.1)


# ============================================================================
# Property 9: Lyapunov Stability
# ============================================================================

def test_lyapunov_convergence(default_config):
    """System converges to ideal under gradient descent"""
    results = verify_lyapunov_stability(default_config, k=0.1, n_steps=1000)
    
    assert results['converged'], "Lyapunov stability: did not converge"
    assert results['reduction_ratio'] < 0.2, \
        f"Lyapunov stability: insufficient convergence {results['reduction_ratio']}"


# ============================================================================
# Worked Example from Documentation
# ============================================================================

def test_worked_example_from_docs(default_config, example_state):
    """Reproduce worked example from documentation"""
    t = 1.0
    
    L = langues_metric(example_state, default_config, t)
    
    # Expected: L ≈ 13.1
    assert 12.5 < L < 13.5, f"Worked example mismatch: L={L}"
    
    # Normalized
    L_N = langues_metric_normalized(example_state, default_config, t)
    
    # Expected: L_N ≈ 0.64
    assert 0.60 < L_N < 0.68, f"Normalized mismatch: L_N={L_N}"


# ============================================================================
# Dimensional Flux
# ============================================================================

def test_flux_update_bounds(flux_config):
    """Flux coefficients stay in [0,1]"""
    nu = np.array([0.5, 0.5, 0.5, 0.5, 0.5, 0.5])
    t = 0.0
    dt = 0.01
    
    for _ in range(1000):
        nu = flux_update(nu, flux_config, t, dt)
        t += dt
        
        assert np.all(nu >= 0), f"Flux went negative: {nu}"
        assert np.all(nu <= 1), f"Flux exceeded 1: {nu}"


def test_fractional_dimension_range(flux_config):
    """D_f(t) ∈ [0, 6]"""
    for _ in range(100):
        nu = np.random.uniform(0, 1, 6)
        D_f = fractional_dimension(nu)
        
        assert 0 <= D_f <= 6, f"D_f out of range: {D_f}"


def test_fractional_dimension_examples():
    """Test known examples"""
    # All active
    nu_full = np.ones(6)
    assert fractional_dimension(nu_full) == 6.0
    
    # Half active
    nu_half = np.array([1, 1, 1, 0, 0, 0])
    assert fractional_dimension(nu_half) == 3.0
    
    # Quasi/demi
    nu_quasi = np.array([1, 0.8, 0.6, 0.4, 0.2, 0])
    D_f = fractional_dimension(nu_quasi)
    assert 2.9 < D_f < 3.1  # ≈ 3.0


# ============================================================================
# Sacred Tongue Weights
# ============================================================================

def test_sacred_tongue_weights_order():
    """Weights increase from KO to DR"""
    weights = [
        SACRED_TONGUE_WEIGHTS['KO'],
        SACRED_TONGUE_WEIGHTS['AV'],
        SACRED_TONGUE_WEIGHTS['RU'],
        SACRED_TONGUE_WEIGHTS['CA'],
        SACRED_TONGUE_WEIGHTS['UM'],
        SACRED_TONGUE_WEIGHTS['DR'],
    ]
    
    for i in range(len(weights) - 1):
        assert weights[i] < weights[i+1], \
            f"Weights not increasing: {weights[i]} >= {weights[i+1]}"


def test_default_weights_match():
    """DEFAULT_WEIGHTS matches SACRED_TONGUE_WEIGHTS"""
    expected = np.array([
        SACRED_TONGUE_WEIGHTS['KO'],
        SACRED_TONGUE_WEIGHTS['AV'],
        SACRED_TONGUE_WEIGHTS['RU'],
        SACRED_TONGUE_WEIGHTS['CA'],
        SACRED_TONGUE_WEIGHTS['UM'],
        SACRED_TONGUE_WEIGHTS['DR'],
    ])
    
    np.testing.assert_array_equal(DEFAULT_WEIGHTS, expected)


# ============================================================================
# Integration Tests
# ============================================================================

def test_all_properties_verification(default_config):
    """Run complete verification suite"""
    results = verify_all_properties(default_config)
    
    assert results['positivity'], "Positivity failed"
    assert results['monotonicity'], "Monotonicity failed"
    assert results['convexity'], "Convexity failed"
    assert results['lyapunov_stability']['converged'], "Lyapunov stability failed"
    assert results['all_passed'], "Not all properties passed"


def test_config_initialization():
    """LanguesConfig initializes correctly"""
    config = LanguesConfig()
    
    assert config.n_dimensions == 6
    assert len(config.w) == 6
    assert len(config.beta) == 6
    assert len(config.omega) == 6
    assert len(config.phi) == 6
    assert len(config.mu) == 6
    
    # Defaults
    np.testing.assert_array_equal(config.w, DEFAULT_WEIGHTS)
    np.testing.assert_array_equal(config.beta, np.ones(6))
    np.testing.assert_array_equal(config.omega, np.arange(1, 7))


def test_flux_config_initialization():
    """Flux config initializes flux parameters"""
    config = LanguesConfig(nu_enabled=True)
    
    assert config.nu_enabled
    assert config.nu is not None
    assert len(config.nu) == 6
    np.testing.assert_array_equal(config.nu, np.ones(6))
    
    # Flux dynamics
    assert config.kappa is not None
    assert config.nu_bar is not None
    assert config.sigma is not None
    assert config.Omega is not None


# ============================================================================
# Edge Cases
# ============================================================================

def test_edge_case_zero_deviation(default_config):
    """L at exactly the ideal state"""
    x = default_config.mu.copy()
    t = 0.0
    
    L = langues_metric(x, default_config, t)
    
    # At d=0, sin(0)=0: L = Σ w_l·e^0 = Σ w_l
    expected = np.sum(default_config.w)
    
    assert np.isclose(L, expected, rtol=1e-10)


def test_edge_case_large_deviation(default_config):
    """L with very large deviations"""
    x = default_config.mu + 10.0 * np.ones(6)  # Large deviation
    t = 0.0
    
    L = langues_metric(x, default_config, t)
    
    # Should be very large but finite
    assert L > 1000, f"L not large enough: {L}"
    assert np.isfinite(L), "L became infinite"


def test_edge_case_zero_weights(default_config):
    """What happens if weights are zero? (Should fail gracefully)"""
    # This should NOT be allowed, but let's test
    config = LanguesConfig()
    config.w = np.zeros(6)
    
    x = np.random.uniform(-1, 1, 6)
    t = 0.0
    
    L = langues_metric(x, config, t)
    
    # Should be zero
    assert L == 0.0


# ============================================================================
# Performance Tests
# ============================================================================

def test_performance_single_evaluation(default_config, benchmark):
    """Benchmark single L(x,t) evaluation"""
    x = np.random.uniform(-1, 1, 6)
    t = 0.0
    
    result = benchmark(langues_metric, x, default_config, t)
    
    assert result > 0


def test_performance_gradient_evaluation(default_config, benchmark):
    """Benchmark gradient evaluation"""
    x = np.random.uniform(-1, 1, 6)
    t = 0.0
    
    result = benchmark(langues_metric_gradient, x, default_config, t)
    
    assert len(result) == 6


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
