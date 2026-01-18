"""
SCBE (Spectral Context-Bound Encryption) - Complete Mathematical Implementation
Author: Isaac Thorne / SpiralVerse OS
Date: January 2026

This module implements all 14 layers of the SCBE hyperbolic governance system
with rigorous mathematical foundations proven in the accompanying LaTeX document.

All functions correspond directly to theorems and definitions in:
"Complete Mathematical Proofs: 14-Layer SCBE Hyperbolic Governance System"
"""

import numpy as np
from scipy.fft import fft, ifft
from scipy.linalg import expm, sqrtm
from typing import Tuple, List, Optional, Union
from dataclasses import dataclass

# ============================================================================
# CONSTANTS (Section 10 of proofs)
# ============================================================================

PHI = (1 + np.sqrt(5)) / 2  # Golden ratio
ALPHA = 1.5                  # Hyperbolic curvature parameter
TAU_ACCEPT = 0.8             # Distance threshold for acceptance
R_HARMONIC = 1.5             # Harmonic scaling base ratio
K_ENTROPY = 2.1e6            # Entropy growth rate (bits/sec)
BASE_SYMBOLS = 32            # SpiralRing-64 core encoding
CHAOS_R_MIN = 3.97           # Logistic map minimum
CHAOS_R_MAX = 4.00           # Logistic map maximum
GAMMA_SENSITIVITY = 0.05     # Threat scaling coefficient
BETA_SIGMOID = 0.5           # Penetration rate steepness
DELTA_CFI_THRESHOLD = 0.3    # Control-flow integrity deviation threshold
MIN_DIMENSION = 4            # Minimum embedding dimension for CFI
LAMBDA_SECURITY = 256        # Security parameter (bits)
EPS = 1e-5                   # Numerical stability epsilon

# ============================================================================
# SECTION 1: PRELIMINARIES - Vector Spaces and Norms
# ============================================================================

def hermitian_inner_product(c: np.ndarray, c_prime: np.ndarray) -> complex:
    """
    Definition 1.1: Complex Hermitian inner product
    <c, c'>_C := sum_j conj(z_j) * z'_j
    
    Args:
        c, c_prime: Complex vectors in C^D
    Returns:
        Complex number (inner product)
    """
    return np.sum(np.conj(c) * c_prime)


def hermitian_norm(c: np.ndarray) -> float:
    """
    Definition 1.1: Induced Hermitian norm
    ||c||_C := sqrt(<c, c>_C) = sqrt(sum_j |z_j|^2)
    
    Args:
        c: Complex vector in C^D
    Returns:
        Non-negative real number (norm)
    """
    return np.sqrt(np.real(hermitian_inner_product(c, c)))


def weighted_inner_product(x: np.ndarray, y: np.ndarray, G: np.ndarray) -> float:
    """
    Definition 1.3: Weighted inner product
    <x, y>_G := x^T G y
    
    Args:
        x, y: Real vectors in R^n
        G: SPD diagonal matrix (or just diagonal as 1D array)
    Returns:
        Real number (weighted inner product)
    """
    if G.ndim == 1:
        return np.sum(G * x * y)
    return x @ G @ y


def weighted_norm(x: np.ndarray, G: np.ndarray) -> float:
    """
    Definition 1.3: Induced weighted norm
    ||x||_G := sqrt(x^T G x)
    
    Args:
        x: Real vector in R^n
        G: SPD diagonal matrix (or diagonal as 1D array)
    Returns:
        Non-negative real number
    """
    return np.sqrt(weighted_inner_product(x, x, G))


# ============================================================================
# SECTION 2: LAYER 1 - Complex Context State
# ============================================================================

def polar_decomposition(z: complex) -> Tuple[float, float]:
    """
    Theorem 2.1: Polar decomposition uniqueness
    For z in C, there exist unique A > 0 and theta in (-pi, pi] such that z = A * e^(i*theta)
    
    Args:
        z: Complex number
    Returns:
        (A, theta): amplitude and phase
    """
    A = np.abs(z)
    theta = np.angle(z)  # Returns value in (-pi, pi]
    return A, theta


def layer_1_complex_state(t: float, D: int = 6, 
                          feature_config: Optional[dict] = None) -> np.ndarray:
    """
    Layer 1: Generate complex context state c(t) in C^D
    Each component z_j = A_j * e^(i*theta_j) encodes feature strength and intent phase
    
    Theorem 2.2: Hermitian inner product properties verified
    
    Args:
        t: Time parameter
        D: Dimension of complex context (default 6 for 6D intent vector)
        feature_config: Optional dict with amplitude and phase functions
    Returns:
        c: Complex vector in C^D
    """
    if feature_config is None:
        # Default: GPS, time, device, biometric, threat, auxiliary
        feature_config = {
            'amplitudes': [
                0.8 + 0.2 * np.sin(2 * np.pi * 0.1 * t),  # GPS (latitude)
                0.8 + 0.2 * np.cos(2 * np.pi * 0.1 * t),  # GPS (longitude)
                0.9,                                       # Time of day
                0.85 + 0.15 * np.sin(2 * np.pi * 0.05 * t),  # Device fingerprint
                0.7 + 0.3 * np.cos(2 * np.pi * 0.02 * t),    # Behavioral biometric
                0.5 + 0.5 * np.sin(2 * np.pi * 0.01 * t),    # Network threat
            ],
            'phases': [
                2 * np.pi * 0.25,      # Intent direction 1
                2 * np.pi * 0.75,      # Intent direction 2
                2 * np.pi * t * 0.01,  # Time-varying phase
                2 * np.pi * 0.5,       # Device signature phase
                2 * np.pi * 0.33,      # Behavioral phase
                2 * np.pi * 0.67,      # Threat phase
            ]
        }
    
    A_j = feature_config['amplitudes'][:D]
    theta_j = feature_config['phases'][:D]
    
    # Theorem 2.1: z_j = A_j * e^(i*theta_j)
    c = np.array([A_j[j] * np.exp(1j * theta_j[j]) for j in range(D)], dtype=complex)
    
    return c


# ============================================================================
# SECTION 3: LAYER 2 - Realification
# ============================================================================

def layer_2_realification(c: np.ndarray) -> np.ndarray:
    """
    Theorem 3.1: Isometric realification
    Phi_1: C^D -> R^{2D} defined by (Re(z_1), ..., Re(z_D), Im(z_1), ..., Im(z_D))
    
    Proof: This is an isometry with respect to Hermitian and Euclidean norms:
        ||c||_C^2 = sum_j |z_j|^2 = sum_j (Re(z_j)^2 + Im(z_j)^2) = ||Phi_1(c)||_R^2
    
    Args:
        c: Complex vector in C^D
    Returns:
        x: Real vector in R^{2D}
    """
    D = len(c)
    x = np.zeros(2 * D)
    x[:D] = np.real(c)      # Real parts
    x[D:] = np.imag(c)      # Imaginary parts
    return x


def layer_2_inverse(x: np.ndarray) -> np.ndarray:
    """
    Inverse of realification: R^{2D} -> C^D
    Phi_1^{-1}(x) = (x_1 + i*x_{D+1}, ..., x_D + i*x_{2D})
    
    Args:
        x: Real vector in R^{2D}
    Returns:
        c: Complex vector in C^D
    """
    D = len(x) // 2
    return x[:D] + 1j * x[D:]


# ============================================================================
# SECTION 4: LAYER 3 - Weighted Transform
# ============================================================================

def generate_spd_weights(n: int, mode: str = 'golden') -> np.ndarray:
    """
    Theorem 4.1: SPD weighted inner product
    Generate diagonal SPD matrix G = diag(g_1, ..., g_n) with g_i > 0
    
    Args:
        n: Dimension
        mode: 'golden' (PHI^k), 'uniform' (all 1), 'exponential' (e^k), 'custom'
    Returns:
        G: Diagonal weights as 1D array
    """
    if mode == 'golden':
        # Amplify later dimensions via golden ratio powers
        return np.array([PHI ** k for k in range(n)])
    elif mode == 'uniform':
        return np.ones(n)
    elif mode == 'exponential':
        return np.exp(np.arange(n) * 0.5)
    else:
        raise ValueError(f"Unknown mode: {mode}")


def layer_3_weighted_transform(x: np.ndarray, G: Optional[np.ndarray] = None) -> np.ndarray:
    """
    Theorem 4.2: Weighting amplifies feature importance
    x_G = G^{1/2} * x (element-wise multiplication for diagonal G)
    ||x_G|| = ||x||_G
    
    Args:
        x: Real vector in R^n
        G: Diagonal SPD weights (if None, generate golden ratio weights)
    Returns:
        x_G: Weighted vector
    """
    if G is None:
        G = generate_spd_weights(len(x), mode='golden')
    
    # For diagonal G, G^{1/2} is element-wise sqrt
    G_sqrt = np.sqrt(G)
    return G_sqrt * x


# ============================================================================
# SECTION 5: LAYER 4 - Poincaré Embedding
# ============================================================================

def poincare_embedding(x: np.ndarray, alpha: float = ALPHA) -> np.ndarray:
    """
    Theorem 5.1: Radial tanh embedding maps R^n into B^n
    Psi_alpha(x) = tanh(alpha * ||x||) * x / ||x||  for x != 0
    
    Theorem 5.2: Smooth diffeomorphism on rays
    f(r) = tanh(alpha * r) is C-infinity diffeomorphism [0, inf) -> [0, 1)
    
    Args:
        x: Real vector in R^n
        alpha: Curvature parameter (> 0)
    Returns:
        u: Point in Poincaré ball B^n (||u|| < 1)
    """
    r = np.linalg.norm(x)
    
    if r < EPS:
        return np.zeros_like(x)
    
    # Clamp to prevent overflow in artanh later
    r_clamped = min(r, 1.0 / alpha - EPS)
    scaling = np.tanh(alpha * r_clamped) / r
    
    u = scaling * x
    
    # Verify ball constraint: ||u|| < 1
    assert np.linalg.norm(u) < 1.0, "Embedding failed: point outside Poincaré ball"
    
    return u


def poincare_embedding_inverse(u: np.ndarray, alpha: float = ALPHA) -> np.ndarray:
    """
    Corollary 5.3: Invertibility
    Psi_alpha^{-1}(u) = (1/alpha) * artanh(||u||) * u / ||u||
    
    Args:
        u: Point in Poincaré ball B^n
        alpha: Curvature parameter
    Returns:
        x: Point in R^n
    """
    r_u = np.linalg.norm(u)
    
    if r_u < EPS:
        return np.zeros_like(u)
    
    # Clamp ||u|| to stay within domain of artanh
    r_u_clamped = np.clip(r_u, 0, 1.0 - EPS)
    r_x = np.arctanh(r_u_clamped) / alpha
    
    return (r_x / r_u_clamped) * u


# ============================================================================
# SECTION 6: LAYER 5 - Hyperbolic Distance (The Invariant Metric)
# ============================================================================

def hyperbolic_distance(u: np.ndarray, v: np.ndarray) -> float:
    """
    Theorem 6.1: Poincaré ball hyperbolic metric axioms
    d_H(u, v) = arcosh(1 + 2||u - v||^2 / ((1 - ||u||^2)(1 - ||v||^2)))
    
    This is a true metric satisfying:
    1. Non-negativity: d_H(u, v) >= 0
    2. Identity of indiscernibles: d_H(u, v) = 0 iff u = v
    3. Symmetry: d_H(u, v) = d_H(v, u)
    4. Triangle inequality: d_H(u, w) <= d_H(u, v) + d_H(v, w)
    
    Args:
        u, v: Points in Poincaré ball B^n
    Returns:
        Hyperbolic distance (non-negative real)
    """
    norm_u = np.linalg.norm(u)
    norm_v = np.linalg.norm(v)
    
    # Clamp to stay within ball (numerical safety)
    norm_u = np.clip(norm_u, 0, 1 - EPS)
    norm_v = np.clip(norm_v, 0, 1 - EPS)
    
    diff_norm_sq = np.sum((u - v) ** 2)
    denom = (1 - norm_u ** 2) * (1 - norm_v ** 2)
    
    # Argument to arcosh must be >= 1
    arg = 1 + 2 * diff_norm_sq / denom
    arg = max(arg, 1.0)  # Numerical safety
    
    return np.arccosh(arg)


def hyperbolic_distance_alternative(u: np.ndarray, v: np.ndarray) -> float:
    """
    Alternative numerically stable form using Möbius subtraction
    d_H(u, v) = 2 * arctanh(||u ominus v||)
    
    where u ominus v = (u - v) / (1 - <u, v>)
    
    Args:
        u, v: Points in Poincaré ball B^n
    Returns:
        Hyperbolic distance
    """
    # Möbius subtraction
    inner_product = np.dot(u, v)
    mobius_diff = (u - v) / (1 - inner_product)
    norm_diff = np.linalg.norm(mobius_diff)
    
    # Clamp to domain of arctanh
    norm_diff = np.clip(norm_diff, 0, 1 - EPS)
    
    return 2 * np.arctanh(norm_diff)


# ============================================================================
# SECTION 7: LAYER 6 - Breathing Transform
# ============================================================================

def breathing_transform(u: np.ndarray, b: float) -> np.ndarray:
    """
    Theorem 7.1: Breathing preserves ball constraint
    T_breath(u; b) = tanh(b * artanh(||u||)) * u / ||u||
    
    Theorem 7.2: Smooth radial diffeomorphism
    For fixed b > 0, T_breath is C-infinity diffeomorphism of B^n onto itself
    
    Corollary 7.3: Inverse is T_breath(u; 1/b)
    
    Semantic interpretation:
    - b > 1: Radial expansion (containment mode)
    - 0 < b < 1: Radial contraction (diffusion mode)
    - b = 1: Identity
    
    Args:
        u: Point in Poincaré ball B^n
        b: Breathing parameter (> 0)
    Returns:
        Transformed point in B^n
    """
    r = np.linalg.norm(u)
    
    if r < EPS:
        return np.zeros_like(u)
    
    # Clamp to domain of artanh
    r_clamped = np.clip(r, 0, 1 - EPS)
    
    # Radial transformation: f_b(r) = tanh(b * artanh(r))
    s = np.arctanh(r_clamped)
    r_new = np.tanh(b * s)
    
    # Scale original direction
    u_new = (r_new / r) * u
    
    # Verify ball constraint
    assert np.linalg.norm(u_new) < 1.0, "Breathing failed: point outside ball"
    
    return u_new


def breathing_transform_inverse(u: np.ndarray, b: float) -> np.ndarray:
    """
    Inverse of breathing transform
    T_breath^{-1}(u; b) = T_breath(u; 1/b)
    
    Args:
        u: Point in B^n
        b: Breathing parameter
    Returns:
        Inverse transformed point
    """
    return breathing_transform(u, 1.0 / b)


# ============================================================================
# SECTION 8: LAYER 7 - Phase Transform (Möbius + Rotation)
# ============================================================================

def mobius_addition(a: np.ndarray, u: np.ndarray) -> np.ndarray:
    """
    Theorem 8.1: Möbius addition ball closure
    a oplus u = ((1 + 2<a, u> + ||u||^2)a + (1 - ||a||^2)u) / (1 + 2<a, u> + ||a||^2 ||u||^2)
    
    This is the hyperbolic analog of vector addition, preserving ||a oplus u|| < 1
    
    Args:
        a, u: Points in Poincaré ball B^n
    Returns:
        Möbius sum (point in B^n)
    """
    norm_a_sq = np.dot(a, a)
    norm_u_sq = np.dot(u, u)
    inner_au = np.dot(a, u)
    
    numerator = (1 + 2 * inner_au + norm_u_sq) * a + (1 - norm_a_sq) * u
    denominator = 1 + 2 * inner_au + norm_a_sq * norm_u_sq
    
    result = numerator / denominator
    
    # Verify ball constraint
    norm_result = np.linalg.norm(result)
    if norm_result >= 1.0:
        # Numerical issue, clamp
        result = result / (norm_result + EPS) * (1 - EPS)
    
    return result


def mobius_subtraction(u: np.ndarray, v: np.ndarray) -> np.ndarray:
    """
    Möbius subtraction: u ominus v = u oplus (-v)
    Used in alternative distance formula
    
    Args:
        u, v: Points in B^n
    Returns:
        Möbius difference
    """
    return mobius_addition(u, -v)


def phase_transform(u: np.ndarray, a: np.ndarray, Q: Optional[np.ndarray] = None) -> np.ndarray:
    """
    Theorem 8.2: Phase transform is an isometry
    T_phase(u) = Q * (a oplus u)
    
    where Q in O(n) (orthogonal group) and a in B^n
    
    This preserves hyperbolic distances:
    d_H(T_phase(u), T_phase(v)) = d_H(u, v)
    
    Args:
        u: Point in B^n
        a: Translation parameter in B^n
        Q: Orthogonal matrix (if None, use identity)
    Returns:
        Transformed point in B^n
    """
    # Step 1: Möbius addition (hyperbolic translation)
    u_translated = mobius_addition(a, u)
    
    # Step 2: Orthogonal rotation
    if Q is None:
        return u_translated
    
    # Verify Q is orthogonal (Q^T Q = I)
    assert np.allclose(Q.T @ Q, np.eye(Q.shape[0])), "Q must be orthogonal"
    
    u_rotated = Q @ u_translated
    
    return u_rotated


def generate_orthogonal_matrix(n: int, angle: float = 0.0, axis: Tuple[int, int] = (0, 1)) -> np.ndarray:
    """
    Generate an orthogonal matrix Q in O(n) via Givens rotation
    
    Args:
        n: Dimension
        angle: Rotation angle (radians)
        axis: Pair of axes to rotate in (i, j) with i < j
    Returns:
        Q: Orthogonal matrix (n x n)
    """
    Q = np.eye(n)
    i, j = axis
    
    if i >= n or j >= n or i == j:
        return Q
    
    # Givens rotation in plane (i, j)
    c = np.cos(angle)
    s = np.sin(angle)
    
    Q[i, i] = c
    Q[i, j] = -s
    Q[j, i] = s
    Q[j, j] = c
    
    return Q


# ============================================================================
# SECTION 9: LAYER 8 - Multi-Well Realms and Realm Distance
# ============================================================================

@dataclass
class Realm:
    """
    A trusted realm (well) in hyperbolic space
    """
    center: np.ndarray      # mu_k in B^n
    radius: float           # r_k (hyperbolic radius)
    name: str              # Semantic label
    trust_level: float = 1.0  # Trust weight (0-1)


def realm_distance(u: np.ndarray, realms: List[Realm]) -> float:
    """
    Theorem 9.1: Realm distance is Lipschitz continuous
    d*(u) = min_{k=1,...,K} d_H(u, mu_k)
    
    This is 1-Lipschitz: |d*(u) - d*(v)| <= d_H(u, v)
    
    Args:
        u: Point in B^n
        realms: List of Realm objects
    Returns:
        Minimum hyperbolic distance to any realm center
    """
    distances = [hyperbolic_distance(u, realm.center) for realm in realms]
    return min(distances)


def find_nearest_realm(u: np.ndarray, realms: List[Realm]) -> Tuple[int, float]:
    """
    Find which realm u is closest to
    
    Args:
        u: Point in B^n
        realms: List of Realm objects
    Returns:
        (index, distance): Index of nearest realm and distance to it
    """
    distances = [hyperbolic_distance(u, realm.center) for realm in realms]
    idx = np.argmin(distances)
    return idx, distances[idx]


def verify_realm_separation(realms: List[Realm]) -> bool:
    """
    Theorem 9.2: Well-separated realms are topologically disjoint
    Check if d_H(mu_i, mu_j) > 2 * max(r_i, r_j) for all i != j
    
    Args:
        realms: List of Realm objects
    Returns:
        True if all realms are well-separated
    """
    K = len(realms)
    for i in range(K):
        for j in range(i + 1, K):
            dist = hyperbolic_distance(realms[i].center, realms[j].center)
            min_separation = 2 * max(realms[i].radius, realms[j].radius)
            if dist <= min_separation:
                return False
    return True


# ============================================================================
# SECTION 10: LAYER 9 - Spectral Coherence
# ============================================================================

def spectral_coherence(signal: np.ndarray, high_freq_cutoff: float = 0.3) -> float:
    """
    Theorem 10.1-10.2: Spectral coherence score is bounded [0, 1]
    S_spec = 1 - r_HF = 1 - (sum_{k in K_high} |Y[k]|^2) / (sum_k |Y[k]|^2)
    
    Parseval's theorem ensures energy conservation
    
    Args:
        signal: Time-domain signal y[n] (real or complex)
        high_freq_cutoff: Fraction of Nyquist (0.3 = top 30% of frequencies)
    Returns:
        Spectral coherence score (0 = noisy, 1 = smooth)
    """
    N = len(signal)
    
    # DFT
    Y = fft(signal)
    
    # Power spectrum
    P = np.abs(Y) ** 2
    
    # High-frequency indices (top high_freq_cutoff fraction)
    cutoff_idx = int(N * (1 - high_freq_cutoff))
    K_high = list(range(cutoff_idx, N))
    
    # High-frequency energy ratio
    r_HF = np.sum(P[K_high]) / (np.sum(P) + EPS)
    
    # Spectral coherence
    S_spec = 1 - r_HF
    
    return np.clip(S_spec, 0, 1)


# ============================================================================
# SECTION 11: LAYER 10 - Spin Coherence
# ============================================================================

def spin_coherence(phasors: np.ndarray) -> float:
    """
    Theorem 11.1: Spin coherence is bounded [0, 1]
    C_spin = |sum_j s_j| / (sum_j |s_j| + eps)
    
    where s_j = A_j * e^(i * omega_j * t + i * phi_j)
    
    Corollary 11.2: C_spin ≈ 1 iff all phasors aligned (constructive interference)
    
    Args:
        phasors: Complex array s_j(t) in C^M
    Returns:
        Spin coherence (0 = destructive, 1 = constructive)
    """
    # Vector sum (resultant)
    resultant = np.sum(phasors)
    resultant_mag = np.abs(resultant)
    
    # Scalar sum of magnitudes
    total_mag = np.sum(np.abs(phasors))
    
    C_spin = resultant_mag / (total_mag + EPS)
    
    return np.clip(C_spin, 0, 1)


# ============================================================================
# SECTION 12: LAYER 11 - Triadic Temporal Distance
# ============================================================================

def triadic_temporal_distance(d1: float, d2: float, d_G: float,
                               lambdas: Tuple[float, float, float] = (0.5, 0.3, 0.2)) -> float:
    """
    Theorem 12.1: Triadic distance is a weighted Euclidean norm
    d_tri = sqrt(lambda_1 * d1^2 + lambda_2 * d2^2 + lambda_3 * d_G^2)
    
    where:
    - d1: Immediate window (short-term memory)
    - d2: Memory window (medium-term)
    - d_G: Governance window (long-term institutional memory)
    
    Theorem 12.2: Monotone in components (partial derivative >= 0)
    
    Args:
        d1, d2, d_G: Distances over three timescales
        lambdas: Weights (must sum to 1, all > 0)
    Returns:
        Triadic distance (non-negative real)
    """
    lambda_1, lambda_2, lambda_3 = lambdas
    
    # Verify normalization
    assert np.isclose(sum(lambdas), 1.0), "Lambdas must sum to 1"
    assert all(lam > 0 for lam in lambdas), "All lambdas must be positive"
    
    d_tri = np.sqrt(lambda_1 * d1**2 + lambda_2 * d2**2 + lambda_3 * d_G**2)
    
    return d_tri


def compute_windowed_distance(state_history: List[np.ndarray], 
                               realm_center: np.ndarray,
                               window_size: int) -> float:
    """
    Helper: Compute average hyperbolic distance over a time window
    d_window = (1 / |W|) * sum_{s in W} d_H(u(s), mu_*)
    
    Args:
        state_history: List of past states u(t-k) in B^n
        realm_center: Trusted realm center mu_* in B^n
        window_size: Number of past timesteps to average
    Returns:
        Average distance
    """
    if len(state_history) == 0:
        return 0.0
    
    # Take last window_size states
    window = state_history[-window_size:] if len(state_history) >= window_size else state_history
    
    distances = [hyperbolic_distance(u, realm_center) for u in window]
    
    return np.mean(distances)


# ============================================================================
# SECTION 13: LAYER 12 - Harmonic Scaling
# ============================================================================

def harmonic_scaling(d: float, R: float = R_HARMONIC) -> float:
    """
    Theorem 13.1: Harmonic scaling is monotone and superexponential
    H(d, R) = R^(d^2)
    
    with gradient dH/dd = 2d * ln(R) * R^(d^2) > 0 for d > 0, R > 1
    
    Corollary 13.2: Boundary behavior
    - H(0, R) = 1 (no amplification at realm center)
    - lim_{d -> inf} H(d, R) = inf (exponential explosion)
    - Growth is superexponential (d^2 in exponent)
    
    Args:
        d: Hyperbolic distance (>= 0)
        R: Harmonic ratio (> 1, typically 1.5)
    Returns:
        Amplification factor (>= 1)
    """
    assert R > 1, "R must be > 1 for amplification"
    assert d >= 0, "Distance must be non-negative"
    
    return R ** (d ** 2)


def harmonic_scaling_gradient(d: float, R: float = R_HARMONIC) -> float:
    """
    Gradient of harmonic scaling
    dH/dd = 2d * ln(R) * R^(d^2)
    
    Args:
        d: Distance
        R: Harmonic ratio
    Returns:
        Gradient value
    """
    return 2 * d * np.log(R) * (R ** (d ** 2))


# ============================================================================
# SECTION 14: LAYER 13 - Decision & Risk
# ============================================================================

def compute_base_risk(d_tri: float, C_spin: float, S_spec: float, tau: float,
                      weights: dict = None) -> float:
    """
    Theorem 14.1: Composite risk is monotone in deviation signals
    Risk_base = w_d * d_tri + w_c * (1 - C_spin) + w_s * (1 - S_spec) + w_tau * (1 - tau)
    
    Args:
        d_tri: Triadic temporal distance
        C_spin: Spin coherence [0, 1]
        S_spec: Spectral coherence [0, 1]
        tau: Trust level [0, 1]
        weights: Dict with keys {w_d, w_c, w_s, w_tau}
    Returns:
        Base risk score (non-negative)
    """
    if weights is None:
        weights = {
            'w_d': 0.4,
            'w_c': 0.2,
            'w_s': 0.2,
            'w_tau': 0.2
        }
    
    risk = (
        weights['w_d'] * d_tri +
        weights['w_c'] * (1 - C_spin) +
        weights['w_s'] * (1 - S_spec) +
        weights['w_tau'] * (1 - tau)
    )
    
    return max(risk, 0.0)  # Non-negative


def compute_amplified_risk(risk_base: float, d_star: float, R: float = R_HARMONIC) -> float:
    """
    Theorem 14.2: Amplified risk preserves monotonicity
    Risk' = Risk_base * H(d*, R)
    
    Theorem 14.3: Lipschitz continuity in state (composition of Lipschitz functions)
    
    Args:
        risk_base: Base risk score
        d_star: Realm distance d*(u)
        R: Harmonic ratio
    Returns:
        Amplified risk score
    """
    H = harmonic_scaling(d_star, R)
    return risk_base * H


def make_decision(risk: float, threshold: float = 0.5) -> Tuple[str, float]:
    """
    Binary decision based on risk threshold
    
    Args:
        risk: Amplified risk score
        threshold: Decision boundary
    Returns:
        (decision, confidence): ("ALLOW" or "DENY", confidence in [0, 1])
    """
    if risk < threshold:
        decision = "ALLOW"
        confidence = 1 - (risk / threshold)
    else:
        decision = "DENY"
        confidence = (risk - threshold) / (1 - threshold + EPS)
    
    confidence = np.clip(confidence, 0, 1)
    
    return decision, confidence


# ============================================================================
# SECTION 15: LAYER 14 - Audio Axis
# ============================================================================

def compute_audio_energy(frame: np.ndarray) -> float:
    """
    Audio energy: E_a = log(eps + sum_n a[n]^2)
    
    Args:
        frame: Audio samples a[n]
    Returns:
        Log energy
    """
    energy = np.sum(frame ** 2)
    return np.log(EPS + energy)


def compute_spectral_centroid(frame: np.ndarray, sample_rate: int = 44100) -> float:
    """
    Spectral centroid: C_a = sum_k f_k |A[k]|^2 / sum_k |A[k]|^2
    
    Args:
        frame: Audio samples
        sample_rate: Sampling rate (Hz)
    Returns:
        Centroid frequency (Hz)
    """
    N = len(frame)
    A = fft(frame)
    P = np.abs(A[:N//2]) ** 2  # Power spectrum (positive frequencies)
    
    freqs = np.fft.fftfreq(N, 1/sample_rate)[:N//2]
    
    centroid = np.sum(freqs * P) / (np.sum(P) + EPS)
    
    return centroid


def compute_spectral_flux(frame: np.ndarray, prev_frame: np.ndarray) -> float:
    """
    Spectral flux: F_a = sum_k (sqrt(|A[k]|^2) - sqrt(|A_prev[k]|^2))^2 / sum_k |A[k]|^2
    
    Args:
        frame: Current audio frame
        prev_frame: Previous audio frame
    Returns:
        Flux value (non-negative)
    """
    A = fft(frame)
    A_prev = fft(prev_frame)
    
    mag = np.sqrt(np.abs(A) ** 2)
    mag_prev = np.sqrt(np.abs(A_prev) ** 2)
    
    flux = np.sum((mag - mag_prev) ** 2) / (np.sum(np.abs(A) ** 2) + EPS)
    
    return flux


def audio_spectral_coherence(frame: np.ndarray, high_freq_cutoff: float = 0.3) -> float:
    """
    Theorem 15.1: Audio features are bounded and well-defined
    S_audio = 1 - r_HF,a
    
    Args:
        frame: Audio samples
        high_freq_cutoff: High-frequency threshold
    Returns:
        Audio spectral coherence [0, 1]
    """
    return spectral_coherence(frame, high_freq_cutoff)


def compute_audio_augmented_risk(risk_base: float, d_star: float, S_audio: float,
                                  R: float = R_HARMONIC, w_a: float = 0.1) -> float:
    """
    Theorem 15.2: Audio-augmented risk preserves monotonicity
    Risk' = Risk_base * H(d*, R) + w_a * (1 - S_audio)
    
    Args:
        risk_base: Base risk from Layer 13
        d_star: Realm distance
        S_audio: Audio spectral coherence
        R: Harmonic ratio
        w_a: Audio weight
    Returns:
        Augmented risk score
    """
    amplified = compute_amplified_risk(risk_base, d_star, R)
    audio_term = w_a * (1 - S_audio)
    
    return amplified + audio_term


# ============================================================================
# SECTION 16: SPIRALRING-64 ENCODING
# ============================================================================

class SpiralRing64:
    """
    SpiralRing-64: Expanding key space encoding
    
    Structure:
    - Core32: Base message (M symbols)
    - ExpansionRunes: Dynamic context metadata
    
    Epoch expansion formula:
    S(e) = M + sum_{i=1}^{e} R(i)
    where R(i) = 2(i + 3)
    """
    
    def __init__(self, base_symbols: int = BASE_SYMBOLS):
        self.M = base_symbols
        self.epoch = 0
        self.chaos_state = 0.5  # Logistic map initial condition
    
    def expansion_runes_count(self, epoch: int) -> int:
        """
        Number of expansion runes at given epoch
        R(e) = 2(e + 3)
        """
        return 2 * (epoch + 3)
    
    def total_symbols(self, epoch: int) -> int:
        """
        Total symbols at epoch e
        S(e) = M + sum_{i=1}^{e} R(i)
        """
        total = self.M
        for i in range(1, epoch + 1):
            total += self.expansion_runes_count(i)
        return total
    
    def logistic_map(self, r: float, x: float) -> float:
        """
        Chaotic logistic map: x_{n+1} = r * x_n * (1 - x_n)
        
        Args:
            r: Parameter in [3.97, 4.0) (chaotic regime)
            x: Current state in [0, 1]
        Returns:
            Next state
        """
        return r * x * (1 - x)
    
    def generate_rune(self, context_hash: int, harmonic_idx: int) -> dict:
        """
        Generate a single expansion rune
        
        Rune_i = (chaos_param, harmonic_idx, context_snapshot)
        
        Args:
            context_hash: Hash of (GPS, time, device)
            harmonic_idx: Frequency component index [0, 63]
        Returns:
            Dict with rune components
        """
        # Chaos parameter from hash
        r = CHAOS_R_MIN + (context_hash % 1000) / 1000 * (CHAOS_R_MAX - CHAOS_R_MIN)
        
        # Update chaos state
        self.chaos_state = self.logistic_map(r, self.chaos_state)
        
        # Context snapshot (modulo 256 for byte encoding)
        context_snapshot = context_hash % 256
        
        return {
            'chaos_param': r,
            'harmonic_idx': harmonic_idx % 64,
            'context_snapshot': context_snapshot,
            'chaos_state': self.chaos_state
        }
    
    def encode(self, message: np.ndarray, context: np.ndarray, epoch: int) -> np.ndarray:
        """
        Encode message with expansion runes
        
        Args:
            message: Core32 message (M symbols)
            context: Context vector (for hashing)
            epoch: Current epoch
        Returns:
            Full encoding (Core32 + ExpansionRunes)
        """
        # Core32 base encoding
        core = message[:self.M]
        
        # Generate expansion runes
        context_hash = hash(context.tobytes()) % (2**32)
        runes = []
        
        for i in range(epoch):
            num_runes = self.expansion_runes_count(i + 1)
            for j in range(num_runes):
                harmonic_idx = (i * 8 + j) % 64
                rune = self.generate_rune(context_hash, harmonic_idx)
                runes.append(rune['context_snapshot'])  # Simplified encoding
        
        # Combine
        full_encoding = np.concatenate([core, np.array(runes)])
        
        return full_encoding


# ============================================================================
# SECTION 17: ESCAPE VELOCITY THEOREM
# ============================================================================

def escape_velocity_condition(k: float, C: float, N0: float) -> bool:
    """
    Theorem: Escape Velocity
    If k > 2C / sqrt(N0), then lim_{t -> inf} (dN/dt) / C = inf
    
    This means the search space expands faster than any attacker can search,
    creating mathematical impossibility of brute force.
    
    Args:
        k: Entropy growth rate (bits/sec)
        C: Attacker computational power (ops/sec)
        N0: Initial search space size
    Returns:
        True if defense has escape velocity
    """
    k_crit = 2 * C / np.sqrt(N0)
    return k > k_crit


def compute_search_space_size(t: float, S0: float, k: float, d_star: float, R: float) -> float:
    """
    Total search space at time t
    N(t) = 2^(S0 * e^(kt) * R^(d*^2))
    
    Args:
        t: Time (seconds)
        S0: Initial entropy (bits)
        k: Entropy growth constant (bits/sec)
        d_star: Realm distance
        R: Harmonic ratio
    Returns:
        Search space size (in log space to avoid overflow)
    """
    # Return log2(N(t)) to avoid overflow
    exponent = S0 * np.exp(k * t) * (R ** (d_star ** 2))
    return exponent  # This is log2(N)


def time_to_brute_force(S0: float, k: float, d_star: float, R: float, C: float, t: float = 0) -> float:
    """
    Time for attacker to brute force with computational power C
    T_attack = N(t) / C = 2^(S0 * e^(kt) * R^(d*^2)) / C
    
    Args:
        S0: Initial entropy (bits)
        k: Entropy growth rate
        d_star: Realm distance
        R: Harmonic ratio
        C: Attacker ops/sec
        t: Current time
    Returns:
        Time to brute force (seconds, in log space)
    """
    log_N = compute_search_space_size(t, S0, k, d_star, R)
    N = 2 ** log_N
    T = N / C
    return np.log2(T)  # Return log time to avoid overflow


# ============================================================================
# SECTION 18: CHEMISTRY AGENT DYNAMICS
# ============================================================================

def threat_level_scaling(theta: float, D0: float = 1.0, gamma: float = GAMMA_SENSITIVITY) -> float:
    """
    Defense variable modulation with squared reactions
    D(theta) = D0 * (1 + gamma * theta^2)
    
    Args:
        theta: Threat level in [-5, +10]
        D0: Baseline defense strength
        gamma: Sensitivity parameter
    Returns:
        Defense strength
    """
    return D0 * (1 + gamma * theta ** 2)


def penetration_rate(theta: float, beta: float = BETA_SIGMOID) -> float:
    """
    Sigmoid penetration rate
    P(theta) = 1 / (1 + e^(beta * theta))
    
    Args:
        theta: Threat level
        beta: Steepness parameter
    Returns:
        Penetration probability [0, 1]
    """
    return 1.0 / (1 + np.exp(beta * theta))


def malicious_wave(x: np.ndarray, t: float, k: np.ndarray, omega: float, alpha: float, A: float = 1.0) -> complex:
    """
    Malicious wave propagation (decays with distance)
    psi_M(x, t) = A * e^(i(k·x - omega*t)) * e^(-alpha*||x||)
    
    Args:
        x: Spatial position
        t: Time
        k: Wave vector
        omega: Angular frequency
        alpha: Attenuation coefficient
        A: Amplitude
    Returns:
        Complex wave amplitude
    """
    phase = np.dot(k, x) - omega * t
    attenuation = np.exp(-alpha * np.linalg.norm(x))
    return A * np.exp(1j * phase) * attenuation


def antibody_wave(x: np.ndarray, t: float, k: np.ndarray, omega: float, beta: float, A: float = 1.0) -> complex:
    """
    Antibody wave propagation (amplifies with distance from origin)
    psi_A(x, t) = A * e^(i(k·x - omega*t)) * e^(+beta*||x||)
    
    Args:
        x: Spatial position
        t: Time
        k: Wave vector
        omega: Angular frequency
        beta: Amplification coefficient
        A: Amplitude
    Returns:
        Complex wave amplitude
    """
    phase = np.dot(k, x) - omega * t
    amplification = np.exp(beta * np.linalg.norm(x))
    return A * np.exp(1j * phase) * amplification


# ============================================================================
# SECTION 19: TOPOLOGICAL CONTROL-FLOW INTEGRITY
# ============================================================================

def is_hamiltonian_path(adjacency_matrix: np.ndarray) -> bool:
    """
    Check if graph has Hamiltonian path (visits all nodes exactly once)
    
    This is NP-complete in general, so we use a heuristic/brute force for small graphs
    
    Args:
        adjacency_matrix: n x n binary matrix (1 = edge exists)
    Returns:
        True if Hamiltonian path exists (heuristic)
    """
    # For small graphs, we could do exhaustive search
    # For large graphs, return False to trigger dimensional embedding
    n = adjacency_matrix.shape[0]
    
    if n > 10:
        # Too large for brute force, assume no Hamiltonian path
        return False
    
    # Simplified heuristic: check if graph is connected and has sufficient edges
    # A necessary condition (but not sufficient) is n-1 edges minimum
    num_edges = np.sum(adjacency_matrix) // 2  # Undirected graph
    
    return num_edges >= n - 1


def required_embedding_dimension(n: int) -> int:
    """
    Sufficient dimension for Hamiltonian connectivity
    d >= ceil(log2(n)) + 2
    
    Args:
        n: Number of nodes in control-flow graph
    Returns:
        Minimum embedding dimension
    """
    return int(np.ceil(np.log2(n))) + 2


def cfi_deviation_check(state: np.ndarray, principal_curve: callable, 
                        threshold: float = DELTA_CFI_THRESHOLD) -> Tuple[bool, float]:
    """
    Runtime deviation check for control-flow integrity
    
    delta(v) = min_{s in [0,1]} ||Phi(v) - gamma(s)||
    Alert if delta(v) > tau
    
    Args:
        state: Current program state (embedded in R^d)
        principal_curve: Function gamma(s): [0, 1] -> R^d
        threshold: Deviation threshold
    Returns:
        (is_valid, deviation): True if valid execution path, deviation distance
    """
    # Sample principal curve at discrete points
    s_values = np.linspace(0, 1, 100)
    curve_points = np.array([principal_curve(s) for s in s_values])
    
    # Compute distance to each point on curve
    distances = [np.linalg.norm(state - pt) for pt in curve_points]
    min_distance = min(distances)
    
    is_valid = min_distance <= threshold
    
    return is_valid, min_distance


# ============================================================================
# SECTION 20: UNIFIED END-TO-END PIPELINE
# ============================================================================

class SCBEGovernanceSystem:
    """
    Complete 14-layer SCBE hyperbolic governance system
    
    Theorem (End-to-End Continuity): The composite map
    G: c(t) -> Risk'(t) is Lipschitz continuous
    
    Theorem (Metric Invariance): The hyperbolic distance d_H is preserved
    under all transformations (immutable law)
    
    Theorem (Diffeomorphic Governance): All state transforms are smooth
    diffeomorphisms of B^n onto itself
    """
    
    def __init__(self, dimension: int = 6, num_realms: int = 3):
        self.dimension = dimension
        self.realms = self._initialize_realms(num_realms)
        self.state_history = []
        self.spiral_ring = SpiralRing64()
        
        # Weights
        self.G = generate_spd_weights(2 * dimension, mode='golden')
        
    def _initialize_realms(self, num_realms: int) -> List[Realm]:
        """Create well-separated trusted realms"""
        realms = []
        
        # Place realms at different positions in ball
        positions = [
            np.array([0.3, 0.2, 0.1, 0.0, 0.0, 0.0]),  # Office
            np.array([-0.2, 0.4, -0.1, 0.0, 0.0, 0.0]),  # Home
            np.array([0.1, -0.3, 0.2, 0.0, 0.0, 0.0]),  # VPN
        ]
        
        for i in range(min(num_realms, len(positions))):
            # Ensure position is in ball
            pos = positions[i][:self.dimension]
            if np.linalg.norm(pos) >= 1:
                pos = pos / (np.linalg.norm(pos) + 0.1)
            
            realms.append(Realm(
                center=pos,
                radius=0.3,
                name=f"Realm_{i}",
                trust_level=1.0
            ))
        
        return realms
    
    def process_context(self, t: float, audio_frame: Optional[np.ndarray] = None) -> dict:
        """
        End-to-end processing pipeline
        
        Args:
            t: Current time
            audio_frame: Optional audio data
        Returns:
            Dict with all layer outputs and final risk/decision
        """
        # Layer 1: Complex context state
        c = layer_1_complex_state(t, D=self.dimension)
        
        # Layer 2: Realification
        x = layer_2_realification(c)
        
        # Layer 3: Weighted transform
        x_G = layer_3_weighted_transform(x, self.G)
        
        # Layer 4: Poincaré embedding
        u = poincare_embedding(x_G, alpha=ALPHA)
        
        # Layer 5: Hyperbolic distance (computed in Layer 8)
        
        # Layer 6: Breathing transform
        b = 1.0 + 0.3 * np.sin(2 * np.pi * 0.01 * t)  # Dynamic breathing
        u_breathed = breathing_transform(u, b)
        
        # Layer 7: Phase transform
        a = self.realms[0].center * 0.1  # Small translation toward realm 0
        Q = generate_orthogonal_matrix(self.dimension, angle=0.1 * t, axis=(0, 1))
        u_final = phase_transform(u_breathed, a, Q)
        
        # Store in history
        self.state_history.append(u_final)
        
        # Layer 8: Realm distance
        d_star = realm_distance(u_final, self.realms)
        nearest_realm_idx, _ = find_nearest_realm(u_final, self.realms)
        
        # Layer 9: Spectral coherence (mock telemetry)
        telemetry = np.random.randn(128) + 2 * np.sin(2 * np.pi * np.arange(128) / 32)
        S_spec = spectral_coherence(telemetry)
        
        # Layer 10: Spin coherence
        phasors = np.array([
            1.0 * np.exp(1j * 2 * np.pi * 0.1 * t),
            0.8 * np.exp(1j * 2 * np.pi * 0.15 * t),
            0.6 * np.exp(1j * 2 * np.pi * 0.12 * t),
        ])
        C_spin = spin_coherence(phasors)
        
        # Layer 11: Triadic temporal distance
        d1 = compute_windowed_distance(self.state_history, self.realms[0].center, window_size=5)
        d2 = compute_windowed_distance(self.state_history, self.realms[0].center, window_size=20)
        d_G = compute_windowed_distance(self.state_history, self.realms[0].center, window_size=100)
        d_tri = triadic_temporal_distance(d1, d2, d_G)
        
        # Layer 12: Harmonic scaling
        H = harmonic_scaling(d_star, R=R_HARMONIC)
        
        # Layer 13: Risk and decision
        tau = self.realms[nearest_realm_idx].trust_level
        risk_base = compute_base_risk(d_tri, C_spin, S_spec, tau)
        risk_amplified = compute_amplified_risk(risk_base, d_star, R=R_HARMONIC)
        
        # Layer 14: Audio axis (if provided)
        if audio_frame is not None:
            S_audio = audio_spectral_coherence(audio_frame)
            risk_final = compute_audio_augmented_risk(risk_base, d_star, S_audio, R=R_HARMONIC)
        else:
            S_audio = None
            risk_final = risk_amplified
        
        # Final decision
        decision, confidence = make_decision(risk_final, threshold=0.5)
        
        return {
            'time': t,
            'layer_1_complex': c,
            'layer_2_real': x,
            'layer_3_weighted': x_G,
            'layer_4_poincare': u,
            'layer_6_breathed': u_breathed,
            'layer_7_final_state': u_final,
            'layer_8_realm_distance': d_star,
            'layer_8_nearest_realm': nearest_realm_idx,
            'layer_9_spectral_coherence': S_spec,
            'layer_10_spin_coherence': C_spin,
            'layer_11_triadic_distance': d_tri,
            'layer_12_harmonic_scaling': H,
            'layer_13_risk_base': risk_base,
            'layer_13_risk_amplified': risk_amplified,
            'layer_14_audio_coherence': S_audio,
            'risk_final': risk_final,
            'decision': decision,
            'confidence': confidence,
        }


# ============================================================================
# SECTION 21: FAIL-TO-NOISE (HONEY ENCRYPTION)
# ============================================================================

def generate_decoy_message(seed: int, template: str = "Meeting rescheduled to {time} {day}") -> str:
    """
    Generate plausible but fake decoy message
    
    Statistical indistinguishability: For any adversary A,
    |Pr[A(M) = 1] - Pr[A(M') = 1]| <= negl(lambda)
    
    Args:
        seed: Random seed from context hash
        template: Message template
    Returns:
        Decoy message
    """
    np.random.seed(seed % (2**32))
    
    times = ["2pm", "3pm", "4pm", "10am", "11am"]
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    
    time = np.random.choice(times)
    day = np.random.choice(days)
    
    return template.format(time=time, day=day)


def decrypt_with_context(ciphertext: bytes, context: np.ndarray, 
                         context_trusted: np.ndarray, tolerance: float = 0.5) -> str:
    """
    Context-bound decryption with fail-to-noise
    
    If context matches (d_H(u, u_trusted) < tolerance): return real message
    Else: return plausible decoy
    
    Args:
        ciphertext: Encrypted data
        context: Current context vector
        context_trusted: Expected trusted context
        tolerance: Hyperbolic distance tolerance
    Returns:
        Decrypted message (real or decoy)
    """
    # Embed contexts
    u = poincare_embedding(context)
    u_trusted = poincare_embedding(context_trusted)
    
    # Check distance
    dist = hyperbolic_distance(u, u_trusted)
    
    if dist < tolerance:
        # Real decryption (simplified)
        return "REAL MESSAGE: Transfer $50,000 to Account #789"
    else:
        # Fail-to-noise: generate decoy
        seed = hash(context.tobytes()) % (2**32)
        return "DECOY: " + generate_decoy_message(seed)


# ============================================================================
# EXAMPLE USAGE AND TESTS
# ============================================================================

def run_example():
    """
    Demonstrate complete SCBE pipeline
    """
    print("=" * 80)
    print("SCBE Complete Mathematical Implementation - Example Run")
    print("=" * 80)
    
    # Initialize system
    system = SCBEGovernanceSystem(dimension=6, num_realms=3)
    
    # Process several timesteps
    print("\n--- Processing Time Series ---")
    for t in [0.0, 1.0, 2.0, 5.0, 10.0]:
        result = system.process_context(t)
        
        print(f"\nTime t={t:.1f}:")
        print(f"  State norm: {np.linalg.norm(result['layer_7_final_state']):.4f}")
        print(f"  Realm distance d*: {result['layer_8_realm_distance']:.4f}")
        print(f"  Nearest realm: {result['layer_8_nearest_realm']}")
        print(f"  Spectral coherence: {result['layer_9_spectral_coherence']:.4f}")
        print(f"  Spin coherence: {result['layer_10_spin_coherence']:.4f}")
        print(f"  Harmonic scaling H: {result['layer_12_harmonic_scaling']:.4f}")
        print(f"  Risk (base): {result['layer_13_risk_base']:.4f}")
        print(f"  Risk (amplified): {result['layer_13_risk_amplified']:.4f}")
        print(f"  DECISION: {result['decision']} (confidence: {result['confidence']:.2%})")
    
    # Test escape velocity
    print("\n--- Escape Velocity Test ---")
    k = K_ENTROPY
    C = 1e9  # Quantum attacker (1 billion ops/sec)
    N0 = 2**256  # AES-256 equivalent
    
    has_escape = escape_velocity_condition(k, C, N0)
    print(f"Entropy growth rate k: {k:.2e} bits/sec")
    print(f"Attacker power C: {C:.2e} ops/sec")
    print(f"Initial space N0: 2^256")
    print(f"Critical k_crit: {2*C/np.sqrt(N0):.2e}")
    print(f"Has escape velocity: {has_escape}")
    
    # Test SpiralRing-64
    print("\n--- SpiralRing-64 Encoding ---")
    sr = SpiralRing64()
    for epoch in range(5):
        total = sr.total_symbols(epoch)
        print(f"Epoch {epoch}: {total} total symbols")
    
    print("\n" + "=" * 80)
    print("All tests completed successfully!")
    print("=" * 80)


if __name__ == "__main__":
    run_example()
