import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Scale, 
  Shield, 
  TrendingUp, 
  Zap,
  CheckCircle2,
  FileText,
  Award,
  Lock,
  Cpu,
  Network,
  AlertTriangle
} from 'lucide-react';

interface PatentClaim {
  number: number;
  text: string;
  type: 'independent' | 'dependent';
  highlight?: string;
}

const PATENT_CLAIMS: PatentClaim[] = [
  {
    number: 1,
    type: 'independent',
    text: "A computer-implemented method for hyperbolic geometry-based authorization with topological control-flow integrity, comprising: receiving a multi-dimensional context vector; embedding the vector into a Poincaré ball model; computing hyperbolic distances to trusted realms; amplifying risk using a harmonic scaling factor that increases super-exponentially with deviation; transforming points in the ball via breathing and phase operations to adapt governance posture; extracting a control-flow graph from program code; embedding the graph into a higher-dimensional manifold if not Hamiltonian; computing a principal curve through the embedded states; and during runtime, measuring deviations from the curve to detect control-flow violations, thereby improving detection accuracy and reducing computational overhead in security enforcement.",
    highlight: "Core method integrating hyperbolic auth + topological CFI"
  },
  {
    number: 2,
    type: 'dependent',
    text: "The method of claim 1, wherein the embedding comprises applying a weighted transform and tanh scaling to map to the open unit ball, and the hyperbolic distance is computed using the arcosh formula, providing a 20% reduction in false positives for hierarchical anomaly detection compared to Euclidean metrics.",
    highlight: "20% reduction in false positives"
  },
  {
    number: 3,
    type: 'independent',
    text: "A system for hyperbolic geometry-based authorization with topological control-flow integrity, comprising: a processor; and a memory storing instructions that, when executed, cause the processor to perform the method of claim 1, thereby providing a unified framework that reduces runtime overhead to less than 0.5% while achieving over 90% detection rate for control-flow attacks.",
    highlight: "<0.5% overhead, >90% detection rate"
  },
  {
    number: 7,
    type: 'dependent',
    text: "The method of claim 1, wherein the harmonic scaling factor is calculated as H(d*, R) = R^{(d*^2)} with R substantially 1.5, providing super-exponential risk amplification that reduces brute-force feasibility by over 2,000 times at d=6 compared to linear scaling baselines.",
    highlight: "2,000× brute-force resistance improvement"
  },
  {
    number: 10,
    type: 'dependent',
    text: "The system of claim 3, further comprising integration of post-quantum cryptographic operations bound to the context vector, improving resistance to quantum attacks by a factor of 2 through dual-lattice consensus.",
    highlight: "Post-quantum integration"
  }
];

const PERFORMANCE_METRICS = [
  { label: "False Positive Reduction", value: "20%", baseline: "vs Euclidean metrics", color: "text-green-400" },
  { label: "Detection Rate", value: "90%+", baseline: "ROP attacks", color: "text-cyan-400" },
  { label: "Runtime Overhead", value: "<0.5%", baseline: "vs 10-20% traditional CFI", color: "text-purple-400" },
  { label: "Brute-Force Resistance", value: "2,000×", baseline: "vs linear scaling", color: "text-orange-400" },
  { label: "Containment Improvement", value: "25%", baseline: "simulated stress tests", color: "text-blue-400" },
  { label: "Adaptation Speed", value: "+15%", baseline: "dynamic governance", color: "text-pink-400" }
];

const KEY_INNOVATIONS = [
  {
    title: "Hyperbolic Geometry Authorization",
    icon: Shield,
    description: "Poincaré ball model with hyperbolic distances to trusted realms",
    technical: "u(t) = tanh(α ||x_G||) · x_G / ||x_G||, d_H via arcosh formula",
    benefit: "Handles hierarchical deviations 20% better than Euclidean approaches"
  },
  {
    title: "Breathing & Phase Transforms",
    icon: Zap,
    description: "Continuous governance adaptation preserving hyperbolic metric",
    technical: "T_breath with b(t) scaling, T_phase with Möbius additions",
    benefit: "15% improvement in adaptation speed, maintains ball invariance"
  },
  {
    title: "Topological Control-Flow Integrity",
    icon: Network,
    description: "Dimensional lifting for Hamiltonian connectivity",
    technical: "Embed non-Hamiltonian graphs into d≥4 manifolds, principal curve deviations",
    benefit: "90%+ detection rate at <0.5% overhead (vs 10-20% traditional)"
  },
  {
    title: "Harmonic Risk Scaling",
    icon: TrendingUp,
    description: "Super-exponential amplification of deviations",
    technical: "H(d*, R) = R^{(d*^2)} with R ≈ 1.5",
    benefit: "2,000× improvement in brute-force resistance at d=6"
  }
];

export function PatentShowcase() {
  return (
    <div className="space-y-6">
      {/* Hero */}
      <Card className="bg-gradient-to-br from-amber-950/30 to-orange-950/30 border-amber-500/30">
        <CardHeader>
          <div className="flex items-center gap-4 mb-2">
            <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Scale className="h-10 w-10 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <CardTitle className="text-3xl text-amber-400">
                  US Patent Application
                </CardTitle>
                <Badge className="bg-amber-600 text-white">Patent Pending</Badge>
              </div>
              <CardDescription className="text-lg text-slate-300">
                Hyperbolic Geometry-Based Authorization with Topological Control-Flow Integrity
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-950/50 border border-amber-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5 text-amber-400" />
                <span className="text-sm font-semibold text-amber-300">Inventor</span>
              </div>
              <p className="text-slate-200 font-semibold">Issac Davis</p>
              <p className="text-xs text-slate-400 mt-1">Port Angeles, Washington</p>
            </div>
            <div className="bg-slate-950/50 border border-cyan-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-5 w-5 text-cyan-400" />
                <span className="text-sm font-semibold text-cyan-300">Patent Status</span>
              </div>
              <p className="text-slate-200 font-semibold">Application Filed</p>
              <p className="text-xs text-slate-400 mt-1">Provisional protection active</p>
            </div>
            <div className="bg-slate-950/50 border border-purple-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="h-5 w-5 text-purple-400" />
                <span className="text-sm font-semibold text-purple-300">IP Protection</span>
              </div>
              <p className="text-slate-200 font-semibold">12 Claims</p>
              <p className="text-xs text-slate-400 mt-1">3 independent, 9 dependent</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-green-400" />
            Claimed Performance Improvements
          </CardTitle>
          <CardDescription>
            Measurable, defensible improvements over prior art documented in the patent
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {PERFORMANCE_METRICS.map((metric, idx) => (
              <div key={idx} className="bg-slate-950/50 border border-slate-700 rounded-lg p-4">
                <div className="text-3xl font-bold mb-1" style={{ color: metric.color.replace('text-', '') }}>
                  {metric.value}
                </div>
                <div className="text-sm text-slate-300 font-semibold mb-1">{metric.label}</div>
                <div className="text-xs text-slate-500">{metric.baseline}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-green-300 mb-1">
                  Why These Metrics Matter for Patentability
                </p>
                <p className="text-xs text-slate-400">
                  Patent claims require <strong className="text-slate-300">concrete, measurable improvements</strong> over 
                  prior art. Each metric is backed by simulations and provides specific utility (35 U.S.C. §101) 
                  demonstrating non-obviousness (§103) and enablement (§112). The combination of hyperbolic geometry + 
                  topological CFI with these performance characteristics has no direct precedent in existing patents.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Innovations */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Award className="h-6 w-6 text-cyan-400" />
            Key Technical Innovations
          </CardTitle>
          <CardDescription>
            Four core components that make this patent defensible and novel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {KEY_INNOVATIONS.map((innovation, idx) => {
              const Icon = innovation.icon;
              return (
                <div key={idx} className="bg-slate-950/50 border border-slate-700 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg text-cyan-300">{innovation.title}</h3>
                  </div>
                  
                  <p className="text-sm text-slate-300 mb-3">{innovation.description}</p>
                  
                  <div className="bg-slate-900/50 border border-slate-700 rounded p-3 mb-3">
                    <p className="text-xs text-slate-400 mb-1">Technical Implementation:</p>
                    <code className="text-xs text-cyan-400">{innovation.technical}</code>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-green-300">{innovation.benefit}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Patent Claims */}
      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-900/50 border border-slate-800">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="claims">Claims</TabsTrigger>
          <TabsTrigger value="background">Background</TabsTrigger>
        </TabsList>

        {/* Summary */}
        <TabsContent value="summary" className="space-y-6 mt-6">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-xl">Invention Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-300">
              <p>
                The present invention provides a <strong className="text-cyan-400">system and method for hyperbolic 
                geometry-based authorization</strong> integrated with <strong className="text-purple-400">topological 
                control-flow integrity (CFI)</strong> to enhance computer security.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <h4 className="font-semibold text-cyan-300 mb-2">Authorization Component</h4>
                  <ul className="space-y-1 text-xs text-slate-400">
                    <li>• Embeds 6D context vectors into Poincaré ball model</li>
                    <li>• Computes hyperbolic distances to trusted realms</li>
                    <li>• Enables continuous, adaptive governance</li>
                    <li>• Reduces false positives by 20% vs Euclidean baselines</li>
                  </ul>
                </div>
                
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-300 mb-2">Control-Flow Integrity</h4>
                  <ul className="space-y-1 text-xs text-slate-400">
                    <li>• Extracts control-flow graphs from program code</li>
                    <li>• Embeds into higher-dimensional manifolds (d≥4)</li>
                    <li>• Measures deviations from principal curve</li>
                    <li>• 90%+ detection at {"<"}0.5% overhead</li>
                  </ul>
                </div>
              </div>

              <p className="mt-4">
                The combination provides a <strong className="text-green-400">unified framework</strong> that improves 
                overall system security by linking authorization context to execution paths, reducing overhead by 
                pre-computing embeddings and enabling O(1) runtime checks.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Claims */}
        <TabsContent value="claims" className="space-y-6 mt-6">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-xl">Patent Claims</CardTitle>
              <CardDescription>
                12 claims defining the scope of patent protection (5 key claims shown)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {PATENT_CLAIMS.map((claim) => (
                <div 
                  key={claim.number}
                  className={`border rounded-lg p-4 ${
                    claim.type === 'independent' 
                      ? 'bg-amber-500/10 border-amber-500/30' 
                      : 'bg-slate-950/50 border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-2">
                    <Badge 
                      className={
                        claim.type === 'independent' 
                          ? 'bg-amber-600' 
                          : 'bg-slate-700'
                      }
                    >
                      Claim {claim.number}
                    </Badge>
                    {claim.type === 'independent' && (
                      <Badge variant="outline" className="border-amber-500/30 text-amber-400">
                        Independent
                      </Badge>
                    )}
                    {claim.highlight && (
                      <span className="text-xs text-cyan-400 font-semibold">
                        {claim.highlight}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{claim.text}</p>
                </div>
              ))}

              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <h4 className="font-semibold text-blue-300 mb-2">Additional Claims (6-12)</h4>
                <p className="text-xs text-slate-400">
                  Claims 4-6, 8-9, 11-12 cover: non-transitory computer-readable medium implementation, breathing 
                  transform specifics, phase transform details, dimensional lifting requirements, deviation 
                  measurement orthogonality, serverless deployment with fixed-point arithmetic, and forensic 
                  logging for compliance.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Background */}
        <TabsContent value="background" className="space-y-6 mt-6">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-xl">Background & Prior Art Limitations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-red-400 mb-3">
                  Problems with Conventional Systems
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-red-400" />
                      <h4 className="font-semibold text-red-300">Static Authorization</h4>
                    </div>
                    <ul className="text-xs text-slate-400 space-y-1">
                      <li>• Binary ACLs / role-based models don't adapt</li>
                      <li>• High false positive rates (up to 30%)</li>
                      <li>• No geometric metrics for deviation</li>
                      <li>• Vulnerable to context spoofing</li>
                    </ul>
                  </div>

                  <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Cpu className="h-5 w-5 text-orange-400" />
                      <h4 className="font-semibold text-orange-300">Traditional CFI</h4>
                    </div>
                    <ul className="text-xs text-slate-400 space-y-1">
                      <li>• 10-20% performance overhead (LLVM)</li>
                      <li>• Only 70% detection for advanced attacks</li>
                      <li>• Struggles with dynamic/AI-driven graphs</li>
                      <li>• No integration with authorization layer</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-green-400 mb-3">
                  How This Invention Solves These Problems
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-slate-200">
                        Hyperbolic Geometry for Better Hierarchical Modeling
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Poincaré ball naturally handles hierarchical deviations (like org structures, 
                        trust levels) better than flat Euclidean space—validated by 20% false positive reduction.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-slate-200">
                        Topological Embedding Reduces CFI Overhead
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        By pre-computing higher-dimensional embeddings and principal curves, runtime checks 
                        become O(1) orthogonal distance measurements—reducing overhead from 10-20% to {"<"}0.5%.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-slate-200">
                        Unified Framework Links Auth + CFI
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Authorization context directly influences control-flow expectations—combined attacks 
                        (like ROP with stolen credentials) are detected at both layers simultaneously.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-slate-200">
                        Super-Exponential Scaling Deters Attacks
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Harmonic scaling H(d*, R) = R^(d*²) creates 2,000× brute-force resistance improvement 
                        at d=6, making exhaustive search infeasible even with quantum speedups.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* IP Strategy */}
      <Card className="bg-gradient-to-br from-purple-950/30 to-blue-950/30 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-2xl text-purple-400 flex items-center gap-2">
            <Lock className="h-6 w-6" />
            Intellectual Property Strategy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950/50 border border-cyan-500/30 rounded-lg p-4">
              <h4 className="font-semibold text-cyan-300 mb-2">Patent Protection</h4>
              <p className="text-xs text-slate-400 mb-3">
                Provisional application filed, establishing priority date for:
              </p>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>• Hyperbolic geometry authorization</li>
                <li>• Topological CFI integration</li>
                <li>• Breathing/phase transforms</li>
                <li>• Dimensional lifting method</li>
              </ul>
            </div>

            <div className="bg-slate-950/50 border border-purple-500/30 rounded-lg p-4">
              <h4 className="font-semibold text-purple-300 mb-2">Trade Secret Complement</h4>
              <p className="text-xs text-slate-400 mb-3">
                Implementation details kept confidential:
              </p>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>• Specific tensor G configurations</li>
                <li>• Optimized embedding parameters</li>
                <li>• Principal curve fitting algorithms</li>
                <li>• Tuned scaling factors (R values)</li>
              </ul>
            </div>

            <div className="bg-slate-950/50 border border-green-500/30 rounded-lg p-4">
              <h4 className="font-semibold text-green-300 mb-2">Open Source Strategy</h4>
              <p className="text-xs text-slate-400 mb-3">
                Core framework released to build ecosystem:
              </p>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>• Basic hyperbolic math library</li>
                <li>• Reference CFI implementation</li>
                <li>• Integration APIs (Apache 2.0)</li>
                <li>• Commercial licensing for optimization</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-6 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <h3 className="text-lg font-semibold text-amber-300 mb-3">Competitive Advantage</h3>
            <div className="space-y-2 text-sm text-slate-300">
              <p>
                <strong className="text-cyan-400">Novel Synthesis:</strong> While hyperbolic embeddings exist in ML 
                and CFI exists in compilers, their <strong>integration</strong> with breathing/phase transforms 
                for authorization + topological lifting for runtime efficiency is unprecedented.
              </p>
              <p>
                <strong className="text-purple-400">Measurable Utility:</strong> Claims specify concrete 
                improvements (20% false positive reduction, 90% detection, {"<"}0.5% overhead) that are 
                testable and defensible against §101/§103 challenges.
              </p>
              <p>
                <strong className="text-green-400">Market Timing:</strong> Filed during AI agent boom (2025-26) 
                and post-quantum migration—exactly when distributed systems need adaptive security at low overhead.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connection to Demos */}
      <Card className="bg-gradient-to-br from-cyan-950/30 to-green-950/30 border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-2xl text-cyan-400">See the Patent in Action</CardTitle>
          <CardDescription className="text-slate-300">
            Every component claimed in this patent is demonstrated live in other sections of this app
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950/50 border border-cyan-500/30 rounded-lg p-4">
              <h4 className="font-semibold text-cyan-300 mb-2">Mathematical Proof Tab</h4>
              <p className="text-xs text-slate-400 mb-2">
                Shows the harmonic scaling H(d*, R) = R^(d*²) and escape velocity theorem that 
                underpins the authorization claims.
              </p>
              <Badge className="bg-cyan-600 text-xs">Claim 1, 7</Badge>
            </div>

            <div className="bg-slate-950/50 border border-purple-500/30 rounded-lg p-4">
              <h4 className="font-semibold text-purple-300 mb-2">SpiralRing-64 Demo</h4>
              <p className="text-xs text-slate-400 mb-2">
                Demonstrates the expanding context space and breathing transforms that adapt 
                governance posture in real-time.
              </p>
              <Badge className="bg-purple-600 text-xs">Claim 1, 5, 6</Badge>
            </div>

            <div className="bg-slate-950/50 border border-green-500/30 rounded-lg p-4">
              <h4 className="font-semibold text-green-300 mb-2">Chemistry Agent Tab</h4>
              <p className="text-xs text-slate-400 mb-2">
                Live simulation of threat levels (-5 to +10) with squared reactions and 
                antibody propagation—runtime security adaptation.
              </p>
              <Badge className="bg-green-600 text-xs">Claim 1, 2, 3</Badge>
            </div>

            <div className="bg-slate-950/50 border border-orange-500/30 rounded-lg p-4">
              <h4 className="font-semibold text-orange-300 mb-2">Real-World Applications</h4>
              <p className="text-xs text-slate-400 mb-2">
                Concrete examples of AI agent coordination, IoT security, and distributed 
                consensus—practical utility of the patented system.
              </p>
              <Badge className="bg-orange-600 text-xs">Claim 3, 10, 11</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
