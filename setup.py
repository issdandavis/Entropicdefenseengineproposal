"""
SCBE-AETHERMOORE v3.0 - Symphonic Cipher Library Setup
Patent Pending USPTO #63/961,403
"""

from setuptools import setup, find_packages
import os

# Read long description from README
def read_long_description():
    here = os.path.abspath(os.path.dirname(__file__))
    readme_path = os.path.join(here, 'README.md')
    if os.path.exists(readme_path):
        with open(readme_path, encoding='utf-8') as f:
            return f.read()
    return "SCBE-AETHERMOORE: Quantum-resistant cryptographic framework with hyperbolic governance"

setup(
    name="scbe-aethermoore",
    version="3.0.0",
    author="Isaac Thorne",
    author_email="your.email@example.com",  # TODO: Add your email
    description="Quantum-resistant post-quantum cryptography with hyperbolic governance and Six Sacred Tongues",
    long_description=read_long_description(),
    long_description_content_type="text/markdown",
    url="https://github.com/issdandavis/SCBE-AETHERMOORE",
    project_urls={
        "Bug Tracker": "https://github.com/issdandavis/SCBE-AETHERMOORE/issues",
        "Documentation": "https://github.com/issdandavis/SCBE-AETHERMOORE#readme",
        "Source Code": "https://github.com/issdandavis/SCBE-AETHERMOORE",
        "Patent": "https://www.uspto.gov (Application #63/961,403)",
    },
    packages=find_packages(exclude=["tests", "examples", "docs"]),
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Developers",
        "Intended Audience :: Science/Research",
        "Topic :: Security :: Cryptography",
        "Topic :: Scientific/Engineering :: Mathematics",
        "Topic :: Scientific/Engineering :: Artificial Intelligence",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.12",
        "Operating System :: OS Independent",
    ],
    python_requires=">=3.8",
    install_requires=[
        "numpy>=1.21.0",
        "scipy>=1.7.0",
    ],
    extras_require={
        "pqc": [
            # Post-quantum cryptography (will be added when implementing Layer 13-14)
            # "pqcrypto>=0.1.0",  # ML-KEM-768, ML-DSA-65
            # "cryptography>=41.0.0",  # Hybrid classical+PQC
        ],
        "audio": [
            "soundfile>=0.12.0",
            "librosa>=0.10.0",
        ],
        "dev": [
            "pytest>=7.0.0",
            "pytest-cov>=4.0.0",
            "black>=23.0.0",
            "flake8>=6.0.0",
            "mypy>=1.0.0",
            "sphinx>=6.0.0",
        ],
        "all": [
            # All optional dependencies
            "soundfile>=0.12.0",
            "librosa>=0.10.0",
            "pytest>=7.0.0",
            "pytest-cov>=4.0.0",
            "black>=23.0.0",
            "flake8>=6.0.0",
            "mypy>=1.0.0",
            "sphinx>=6.0.0",
        ],
    },
    entry_points={
        "console_scripts": [
            "scbe-demo=examples.complete_scbe_demo:run_demo",
        ],
    },
    keywords=[
        "cryptography",
        "post-quantum",
        "hyperbolic-geometry",
        "quantum-resistant",
        "ml-kem",
        "ml-dsa",
        "spiralverse",
        "harmonic-scaling",
        "scbe",
        "aethermoore",
        "sacred-tongues",
    ],
    include_package_data=True,
    zip_safe=False,
    license="MIT",
)
