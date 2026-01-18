"""
Six Sacred Tongues (SST) Manager - Spiralverse Protocol Layer 14
Patent Component: Linguistic-Cryptographic Binding

The Six Sacred Tongues provide domain-specific cryptographic bindings:
    KO (Korvethian): Command authority & control-flow integrity
    AV (Avethril): Emotional resonance & user intent verification
    RU (Runevast): Historical binding & audit trail immutability
    CA (Celestine): Divine invocation & ceremony management
    UM (Umbralis): Shadow protocols & stealth communication
    DR (Draconic): Power amplification & multi-party agreement

Each tongue has unique:
    - Phonetic structure (consonant/vowel patterns)
    - Weighting in Layer 3 metric tensor (φ^k scaling)
    - Cryptographic primitives (signing/encryption/hashing)
    - Intent classification (AI/rule-based)

Integration with SCBE:
    - Langues Metric Tensor (Layer 3): Weights tongue-specific features
    - Context Commitment (Layer 1): Binds tongue choice to SHA-256 hash
    - Harmonic Synthesis: Tongue → frequency allocation
    - AI Verifier: Tongue-specific intent classification models

Author: Isaac Thorne
Created: January 2026
Patent: USPTO #63/961,403
"""

import hashlib
import hmac
import secrets
from typing import Dict, List, Literal, Optional, Tuple
from dataclasses import dataclass, field
from enum import Enum
import numpy as np

# Golden ratio for tongue weighting
PHI = (1 + np.sqrt(5)) / 2


class SacredTongue(Enum):
    """
    The Six Sacred Tongues of the Spiralverse
    """
    KORVETHIAN = "KO"  # Command authority
    AVETHRIL = "AV"    # Emotional resonance
    RUNEVAST = "RU"    # Historical binding
    CELESTINE = "CA"   # Divine invocation
    UMBRALIS = "UM"    # Shadow protocols
    DRACONIC = "DR"    # Power amplification


@dataclass
class TongueConfig:
    """Configuration for a specific Sacred Tongue"""
    name: str
    code: str  # 2-letter code (KO, AV, RU, CA, UM, DR)
    index: int  # 0-5 (for metric tensor weighting)
    
    # Phonetic structure
    consonants: str = ""
    vowels: str = ""
    
    # Cryptographic parameters
    base_frequency: float = 220.0  # Hz (A3 = 220 Hz baseline)
    harmonic_mask: List[int] = field(default_factory=lambda: [1, 3, 5, 7, 9, 11, 13, 15])
    
    # Weighting in metric tensor (Layer 3)
    weight: float = 1.0  # Will be set to φ^index
    
    # Intent classification
    intent_patterns: List[str] = field(default_factory=list)
    
    def __post_init__(self):
        # Auto-compute golden ratio weight
        self.weight = PHI ** self.index


# ============================================================================
# Six Sacred Tongues Definitions
# ============================================================================

TONGUE_CONFIGS = {
    SacredTongue.KORVETHIAN: TongueConfig(
        name="Korvethian",
        code="KO",
        index=0,
        consonants="k,t,p,th,kh",
        vowels="o,a,e",
        base_frequency=220.0,  # A3
        harmonic_mask=[1, 2, 4, 8, 16],  # Powers of 2 (command authority)
        intent_patterns=["command", "execute", "authorize", "grant", "deny"]
    ),
    
    SacredTongue.AVETHRIL: TongueConfig(
        name="Avethril",
        code="AV",
        index=1,
        consonants="v,l,m,n,r",
        vowels="a,e,i",
        base_frequency=246.94,  # B3
        harmonic_mask=[1, 3, 5, 7, 9, 11],  # Odd harmonics (resonance)
        intent_patterns=["feel", "resonate", "connect", "empathize", "trust"]
    ),
    
    SacredTongue.RUNEVAST: TongueConfig(
        name="Runevast",
        code="RU",
        index=2,
        consonants="r,n,v,st,sk",
        vowels="u,a,o",
        base_frequency=277.18,  # C#4
        harmonic_mask=[1, 2, 3, 5, 8, 13],  # Fibonacci (historical binding)
        intent_patterns=["remember", "record", "archive", "witness", "preserve"]
    ),
    
    SacredTongue.CELESTINE: TongueConfig(
        name="Celestine",
        code="CA",
        index=3,
        consonants="s,l,t,sh,ch",
        vowels="e,i,a",
        base_frequency=311.13,  # D#4
        harmonic_mask=[1, 4, 7, 10, 13, 16],  # Major thirds (divine)
        intent_patterns=["invoke", "bless", "sanctify", "consecrate", "pray"]
    ),
    
    SacredTongue.UMBRALIS: TongueConfig(
        name="Umbralis",
        code="UM",
        index=4,
        consonants="m,b,d,g,z",
        vowels="u,o,a",
        base_frequency=349.23,  # F4
        harmonic_mask=[2, 6, 10, 14, 18],  # Even multiples (shadow)
        intent_patterns=["conceal", "encrypt", "hide", "cloak", "shadow"]
    ),
    
    SacredTongue.DRACONIC: TongueConfig(
        name="Draconic",
        code="DR",
        index=5,
        consonants="dr,kr,gr,zh,kh",
        vowels="a,o,u",
        base_frequency=392.00,  # G4
        harmonic_mask=[1, 3, 9, 27, 81],  # Powers of 3 (amplification)
        intent_patterns=["amplify", "power", "dominate", "enforce", "decree"]
    )
}


@dataclass
class TongueBinding:
    """
    Cryptographic binding of a tongue to a message/context
    """
    tongue: SacredTongue
    message: str
    context_hash: str  # SHA-256 of (message + tongue + timestamp)
    signature: str     # HMAC-SHA256 signature
    timestamp: int     # Unix timestamp
    nonce: bytes       # Random nonce for uniqueness


class SSTManager:
    """
    Six Sacred Tongues Manager - Handles all tongue-specific operations
    """
    
    def __init__(self, master_key: Optional[bytes] = None):
        """
        Initialize SST Manager
        
        Args:
            master_key: Master secret for HMAC signing (generated if None)
        """
        self.master_key = master_key or secrets.token_bytes(32)
        self.tongues = TONGUE_CONFIGS
    
    def detect_tongue(self, message: str) -> SacredTongue:
        """
        Auto-detect which Sacred Tongue a message belongs to
        
        Uses pattern matching on intent_patterns and phonetic structure.
        
        Args:
            message: Input message/phrase
        
        Returns:
            Detected SacredTongue (defaults to KORVETHIAN if ambiguous)
        
        Examples:
            >>> sst = SSTManager()
            >>> sst.detect_tongue("Execute command alpha")
            <SacredTongue.KORVETHIAN: 'KO'>
            >>> sst.detect_tongue("I feel connected")
            <SacredTongue.AVETHRIL: 'AV'>
        """
        message_lower = message.lower()
        
        # Score each tongue based on pattern matches
        scores = {}
        for tongue, config in self.tongues.items():
            score = sum(1 for pattern in config.intent_patterns if pattern in message_lower)
            scores[tongue] = score
        
        # Return tongue with highest score (default to KORVETHIAN if tie)
        if max(scores.values()) == 0:
            return SacredTongue.KORVETHIAN
        
        return max(scores, key=scores.get)
    
    def bind_message(
        self,
        message: str,
        tongue: Optional[SacredTongue] = None,
        timestamp: Optional[int] = None
    ) -> TongueBinding:
        """
        Create cryptographic binding of message to a Sacred Tongue
        
        Args:
            message: Message to bind
            tongue: Specific tongue (auto-detected if None)
            timestamp: Unix timestamp (current time if None)
        
        Returns:
            TongueBinding with signature
        """
        import time
        
        # Auto-detect if not specified
        if tongue is None:
            tongue = self.detect_tongue(message)
        
        # Current timestamp
        if timestamp is None:
            timestamp = int(time.time())
        
        # Generate nonce
        nonce = secrets.token_bytes(16)
        
        # Compute context hash
        context_data = f"{message}|{tongue.value}|{timestamp}|{nonce.hex()}".encode()
        context_hash = hashlib.sha256(context_data).hexdigest()
        
        # Sign with HMAC
        signature = hmac.new(
            self.master_key,
            context_hash.encode(),
            hashlib.sha256
        ).hexdigest()
        
        return TongueBinding(
            tongue=tongue,
            message=message,
            context_hash=context_hash,
            signature=signature,
            timestamp=timestamp,
            nonce=nonce
        )
    
    def verify_binding(self, binding: TongueBinding) -> bool:
        """
        Verify cryptographic binding signature
        
        Args:
            binding: TongueBinding to verify
        
        Returns:
            True if signature is valid
        """
        expected_sig = hmac.new(
            self.master_key,
            binding.context_hash.encode(),
            hashlib.sha256
        ).hexdigest()
        
        return hmac.compare_digest(expected_sig, binding.signature)
    
    def get_tongue_weight(self, tongue: SacredTongue) -> float:
        """
        Get Layer 3 metric tensor weight for a tongue
        
        Weight = φ^index where φ is golden ratio
        
        Args:
            tongue: Sacred tongue
        
        Returns:
            Weight value (≥ 1.0)
        
        Examples:
            >>> sst = SSTManager()
            >>> sst.get_tongue_weight(SacredTongue.KORVETHIAN)
            1.0
            >>> sst.get_tongue_weight(SacredTongue.DRACONIC)
            11.09...  # φ^5
        """
        config = self.tongues[tongue]
        return config.weight
    
    def get_base_frequency(self, tongue: SacredTongue) -> float:
        """
        Get base frequency (Hz) for harmonic synthesis
        
        Args:
            tongue: Sacred tongue
        
        Returns:
            Frequency in Hz
        """
        config = self.tongues[tongue]
        return config.base_frequency
    
    def get_harmonic_mask(self, tongue: SacredTongue) -> List[int]:
        """
        Get harmonic mask (which harmonics to include in synthesis)
        
        Args:
            tongue: Sacred tongue
        
        Returns:
            List of harmonic indices (e.g., [1, 3, 5] = odd harmonics)
        """
        config = self.tongues[tongue]
        return config.harmonic_mask
    
    def compute_metric_tensor(self) -> np.ndarray:
        """
        Compute Layer 3 Langues Metric Tensor
        
        Returns 6x6 diagonal matrix with golden ratio weights:
        G = diag(φ^0, φ^1, φ^2, φ^3, φ^4, φ^5)
        
        Returns:
            6x6 numpy array (diagonal SPD matrix)
        """
        weights = [self.get_tongue_weight(tongue) for tongue in SacredTongue]
        return np.diag(weights)
    
    def synthesize_waveform(
        self,
        tongue: SacredTongue,
        duration: float = 1.0,
        sample_rate: int = 44100
    ) -> np.ndarray:
        """
        Generate harmonic waveform for a tongue (for audio authentication)
        
        Args:
            tongue: Sacred tongue
            duration: Duration in seconds
            sample_rate: Samples per second
        
        Returns:
            Audio waveform as numpy array
        """
        t = np.linspace(0, duration, int(sample_rate * duration))
        f0 = self.get_base_frequency(tongue)
        harmonics = self.get_harmonic_mask(tongue)
        
        # Additive synthesis: x(t) = Σ (1/h) sin(2π f0 h t)
        waveform = np.zeros_like(t)
        for h in harmonics:
            amplitude = 1.0 / h  # Harmonic decay
            waveform += amplitude * np.sin(2 * np.pi * f0 * h * t)
        
        # Normalize
        waveform /= np.max(np.abs(waveform)) + 1e-10
        
        return waveform


# ============================================================================
# Example Usage
# ============================================================================

if __name__ == "__main__":
    print("=" * 70)
    print("SIX SACRED TONGUES MANAGER - Demonstration")
    print("=" * 70)
    
    # Initialize manager
    sst = SSTManager()
    
    # Test messages
    test_messages = [
        "Execute command authorization protocol",
        "I feel deeply connected to this moment",
        "Remember this witness for all time",
        "Invoke the sacred blessing",
        "Conceal this message in shadow",
        "Amplify the power of this decree"
    ]
    
    print("\n--- Tongue Detection & Binding ---")
    for msg in test_messages:
        binding = sst.bind_message(msg)
        is_valid = sst.verify_binding(binding)
        weight = sst.get_tongue_weight(binding.tongue)
        freq = sst.get_base_frequency(binding.tongue)
        
        print(f"\nMessage: '{msg[:40]}...'")
        print(f"  Tongue: {binding.tongue.value} ({binding.tongue.name})")
        print(f"  Weight: {weight:.3f} (φ^{binding.tongue.value})")
        print(f"  Base freq: {freq:.2f} Hz")
        print(f"  Signature: {binding.signature[:16]}...")
        print(f"  Valid: {'✓' if is_valid else '✗'}")
    
    # Metric tensor
    print("\n--- Layer 3: Langues Metric Tensor ---")
    G = sst.compute_metric_tensor()
    print("G = diag([φ^0, φ^1, φ^2, φ^3, φ^4, φ^5])")
    print(f"  = diag({np.diag(G)})")
    
    # Waveform synthesis
    print("\n--- Harmonic Synthesis Example ---")
    waveform = sst.synthesize_waveform(SacredTongue.KORVETHIAN, duration=0.1)
    print(f"Generated {len(waveform)} samples for KORVETHIAN")
    print(f"  RMS amplitude: {np.sqrt(np.mean(waveform**2)):.4f}")
