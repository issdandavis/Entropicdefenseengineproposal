import { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Progress } from './ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { RadioTower, ShieldCheck, Zap, Lock, AlertTriangle } from 'lucide-react';

interface SimulationPoint {
  step: number;
  trustPct: number;
  confidencePct: number;
  entropyPct: number;
}

interface SimulationStats {
  matches: number;
  ones: number;
  zeros: number;
  totalCounts: number;
  expectedOnes: number;
  expectedZeros: number;
  truePositives: number;
  falsePositives: number;
}

interface LastEvent {
  expected: 0 | 1;
  observed: 0 | 1;
  count: number;
}

interface SimulationState {
  step: number;
  points: SimulationPoint[];
  stats: SimulationStats;
  lastEvent: LastEvent | null;
}

const INITIAL_STATE: SimulationState = {
  step: 0,
  points: [],
  stats: {
    matches: 0,
    ones: 0,
    zeros: 0,
    totalCounts: 0,
    expectedOnes: 0,
    expectedZeros: 0,
    truePositives: 0,
    falsePositives: 0,
  },
  lastEvent: null,
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const shannonEntropy = (ones: number, zeros: number) => {
  const total = ones + zeros;
  if (total === 0) {
    return 0;
  }
  const p1 = ones / total;
  const p0 = zeros / total;
  const term = (p: number) => (p > 0 ? -p * Math.log2(p) : 0);
  return term(p1) + term(p0);
};

const samplePoisson = (lambda: number) => {
  if (lambda <= 0) {
    return 0;
  }
  const limit = Math.exp(-lambda);
  let product = 1;
  let k = 0;
  do {
    k += 1;
    product *= Math.random();
  } while (product > limit && k < 1000);
  return k - 1;
};

const textToBits = (text: string) => {
  const source = text.length > 0 ? text : 'ADMIN:ROOT_GRANT';
  const bytes = new TextEncoder().encode(source);
  const bits: (0 | 1)[] = [];
  for (const byte of bytes) {
    for (let i = 7; i >= 0; i--) {
      bits.push(((byte >> i) & 1) as 0 | 1);
    }
  }
  return bits.length > 0 ? bits : ([1, 0, 1, 0] as (0 | 1)[]);
};

const fnv1a32 = (input: string) => {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
};

const makeXorShift32 = (seed: number) => {
  let state = seed || 0x9e3779b9;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 4294967296;
  };
};

const buildSemanticBitstream = (
  payload: string,
  semanticKey: string,
  totalBits: number,
  spinCoupling: number,
  relationDepth: number,
) => {
  const source = payload.length > 0 ? payload : 'ADMIN:ROOT_GRANT';
  const baseBits = textToBits(source);
  const sourceBytes = new TextEncoder().encode(source);
  const seed = fnv1a32(`${source}|${semanticKey}`);
  const rand = makeXorShift32(seed);
  const out: (0 | 1)[] = [];

  for (let i = 0; i < totalBits; i++) {
    const base = baseBits[i % baseBits.length];
    const tokenClass = sourceBytes[i % sourceBytes.length] % 6;
    const classPhase = (tokenClass / 6) * Math.PI * 2;

    let relation = 0;
    for (let d = 1; d <= relationDepth; d++) {
      const prev = i - d >= 0 ? out[i - d] : (((seed >>> d) & 1) as 0 | 1);
      const sign = prev === 1 ? 1 : -1;
      relation += sign / (d + 1);
    }

    const keyPhase = (((seed >>> (i % 24)) & 0xff) / 255) * Math.PI;
    const wave = Math.sin((i + 1) * (0.2 + spinCoupling * 0.9) + classPhase + relation + keyPhase);
    const observerNoise = rand() > 0.5 ? 0.1 : -0.1;
    const spinBit = (wave + observerNoise > 0 ? 1 : 0) as 0 | 1;

    out.push((base ^ spinBit) as 0 | 1);
  }

  return out;
};

export function NeutrinoPermissionSphere() {
  const [isRunning, setIsRunning] = useState(false);
  const [tickMs, setTickMs] = useState(120);

  const [commandText, setCommandText] = useState('ADMIN:ROOT_GRANT');
  const [semanticKey, setSemanticKey] = useState('KO|AV|RU|CA');
  const [spinCoupling, setSpinCoupling] = useState(0.62);
  const [relationDepth, setRelationDepth] = useState(4);
  const [bitWindow, setBitWindow] = useState(96);
  const [detectorEfficiency, setDetectorEfficiency] = useState(0.78);
  const [lambdaBackground, setLambdaBackground] = useState(0.35);
  const [lambdaSignal, setLambdaSignal] = useState(1.6);
  const [bitThreshold, setBitThreshold] = useState(2);
  const [solarVariance, setSolarVariance] = useState(0.1);
  const [adminThreshold, setAdminThreshold] = useState(0.78);
  const [adminBias, setAdminBias] = useState(0.0);
  const [fastLane, setFastLane] = useState(false);

  const [sim, setSim] = useState<SimulationState>(INITIAL_STATE);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const sourceBits = useMemo(() => {
    return buildSemanticBitstream(commandText.trim(), semanticKey.trim(), bitWindow, spinCoupling, relationDepth);
  }, [commandText, semanticKey, bitWindow, spinCoupling, relationDepth]);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const applyStrictProfile = () => {
    setFastLane(false);
    setSemanticKey('KO|AV|RU|CA');
    setSpinCoupling(0.62);
    setRelationDepth(4);
    setBitWindow(96);
    setDetectorEfficiency(0.78);
    setLambdaBackground(0.35);
    setLambdaSignal(1.6);
    setBitThreshold(2);
    setSolarVariance(0.1);
    setAdminThreshold(0.78);
    setAdminBias(0.0);
  };

  const applyFastProfile = () => {
    setFastLane(true);
    setSemanticKey('KO|AV');
    setSpinCoupling(0.48);
    setRelationDepth(3);
    setBitWindow(32);
    setDetectorEfficiency(0.9);
    setLambdaBackground(0.22);
    setLambdaSignal(2.1);
    setBitThreshold(1);
    setSolarVariance(0.06);
    setAdminThreshold(0.68);
    setAdminBias(0.04);
  };

  const resetSimulation = () => {
    setIsRunning(false);
    clearTimer();
    setSim(INITIAL_STATE);
  };

  const runTick = () => {
    let shouldStop = false;

    setSim((prev) => {
      if (prev.step >= bitWindow) {
        shouldStop = true;
        return prev;
      }

      const expected = sourceBits[prev.step];
      const varianceFactor = 1 + (Math.random() * 2 - 1) * solarVariance;
      const background = Math.max(0.01, lambdaBackground * varianceFactor);
      const signal = expected === 1 ? lambdaSignal * detectorEfficiency : 0;
      const count = samplePoisson(background + signal);
      const observed = (count >= bitThreshold ? 1 : 0) as 0 | 1;
      const isMatch = observed === expected;
      const isTP = expected === 1 && observed === 1;
      const isFP = expected === 0 && observed === 1;

      const nextStats: SimulationStats = {
        matches: prev.stats.matches + (isMatch ? 1 : 0),
        ones: prev.stats.ones + (observed === 1 ? 1 : 0),
        zeros: prev.stats.zeros + (observed === 0 ? 1 : 0),
        totalCounts: prev.stats.totalCounts + count,
        expectedOnes: prev.stats.expectedOnes + (expected === 1 ? 1 : 0),
        expectedZeros: prev.stats.expectedZeros + (expected === 0 ? 1 : 0),
        truePositives: prev.stats.truePositives + (isTP ? 1 : 0),
        falsePositives: prev.stats.falsePositives + (isFP ? 1 : 0),
      };

      const processed = prev.step + 1;
      const accuracy = nextStats.matches / processed;
      const tpRate = nextStats.truePositives / Math.max(1, nextStats.expectedOnes);
      const fpRate = nextStats.falsePositives / Math.max(1, nextStats.expectedZeros);
      const confidence = clamp01(0.55 * accuracy + 0.3 * tpRate + 0.15 * (1 - fpRate));

      const entropy = shannonEntropy(nextStats.ones, nextStats.zeros);
      const targetEntropy = fastLane ? 0.58 : 0.5;
      const entropyScore = clamp01(1 - Math.abs(entropy - targetEntropy));
      const trust = clamp01(0.64 * confidence + 0.18 * entropyScore + 0.18 * (1 - fpRate) + adminBias + (fastLane ? 0.02 : 0));

      const nextStep = processed;
      if (nextStep >= bitWindow) {
        shouldStop = true;
      }

      const point: SimulationPoint = {
        step: nextStep,
        trustPct: trust * 100,
        confidencePct: confidence * 100,
        entropyPct: entropy * 100,
      };

      return {
        step: nextStep,
        points: [...prev.points, point],
        stats: nextStats,
        lastEvent: { expected, observed, count },
      };
    });

    if (shouldStop) {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    if (!isRunning) {
      clearTimer();
      return;
    }
    clearTimer();
    timerRef.current = setInterval(runTick, tickMs);
    return clearTimer;
  }, [
    isRunning,
    tickMs,
    sourceBits,
    bitWindow,
    detectorEfficiency,
    lambdaBackground,
    lambdaSignal,
    bitThreshold,
    solarVariance,
    adminBias,
    fastLane,
  ]);

  useEffect(() => () => clearTimer(), []);

  const latest = sim.points[sim.points.length - 1];
  const trust = latest ? latest.trustPct / 100 : 0;
  const confidence = latest ? latest.confidencePct / 100 : 0;
  const entropy = latest ? latest.entropyPct / 100 : 0;

  const minBitsForDecision = fastLane ? 16 : 48;
  const confidenceGate = fastLane ? 0.68 : 0.78;
  const decisionReady = sim.step >= minBitsForDecision;
  const adminGranted = decisionReady && trust >= adminThreshold && confidence >= confidenceGate;
  const adminDenied = sim.step >= bitWindow && !adminGranted;

  const riskBand =
    trust >= 0.85
      ? 'Green'
      : trust >= 0.7
        ? 'Blue'
        : trust >= 0.55
          ? 'Amber'
          : 'Red';

  const progress = (sim.step / bitWindow) * 100;
  const sphereAngle = (sim.step * (0.28 + spinCoupling * 0.4)) % (Math.PI * 2);
  const sphereRadius = (1 - trust) * 40;
  const sphereX = 50 + sphereRadius * Math.cos(sphereAngle);
  const sphereY = 50 + sphereRadius * Math.sin(sphereAngle);
  const pointColor =
    riskBand === 'Green'
      ? '#22c55e'
      : riskBand === 'Blue'
        ? '#38bdf8'
        : riskBand === 'Amber'
          ? '#f59e0b'
          : '#ef4444';

  return (
    <div className="space-y-6">
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-2xl text-cyan-400 flex items-center gap-2">
            <RadioTower className="h-6 w-6" />
            Neutrino Random Admin Check
          </CardTitle>
          <CardDescription className="text-slate-400">
            Function-first simulation: semantic-spin bitstream + Poisson neutrino count checks for governance admin gating.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg">Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label className="text-slate-300">Admin Command Payload</Label>
              <Input
                value={commandText}
                onChange={(e) => setCommandText(e.target.value)}
                disabled={isRunning}
                className="bg-slate-950 border-slate-700"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Semantic Key</Label>
              <Input
                value={semanticKey}
                onChange={(e) => setSemanticKey(e.target.value)}
                disabled={isRunning}
                className="bg-slate-950 border-slate-700"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Spin Coupling: {spinCoupling.toFixed(2)}</Label>
              <Slider
                value={[spinCoupling * 100]}
                onValueChange={(v) => setSpinCoupling(v[0] / 100)}
                min={10}
                max={100}
                step={1}
                disabled={isRunning}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Relation Depth: {relationDepth}</Label>
              <Slider
                value={[relationDepth]}
                onValueChange={(v) => setRelationDepth(v[0])}
                min={1}
                max={8}
                step={1}
                disabled={isRunning}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Bit Window: {bitWindow}</Label>
              <Slider
                value={[bitWindow]}
                onValueChange={(v) => setBitWindow(v[0])}
                min={16}
                max={256}
                step={8}
                disabled={isRunning}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Detector Efficiency: {(detectorEfficiency * 100).toFixed(0)}%</Label>
              <Slider
                value={[detectorEfficiency * 100]}
                onValueChange={(v) => setDetectorEfficiency(v[0] / 100)}
                min={50}
                max={99}
                step={1}
                disabled={isRunning}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Background λ: {lambdaBackground.toFixed(2)}</Label>
              <Slider
                value={[lambdaBackground * 100]}
                onValueChange={(v) => setLambdaBackground(v[0] / 100)}
                min={1}
                max={120}
                step={1}
                disabled={isRunning}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Signal λ (bit=1): {lambdaSignal.toFixed(2)}</Label>
              <Slider
                value={[lambdaSignal * 100]}
                onValueChange={(v) => setLambdaSignal(v[0] / 100)}
                min={20}
                max={400}
                step={1}
                disabled={isRunning}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Bit Threshold: {bitThreshold}</Label>
              <Slider
                value={[bitThreshold]}
                onValueChange={(v) => setBitThreshold(v[0])}
                min={1}
                max={6}
                step={1}
                disabled={isRunning}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Solar Variance: {(solarVariance * 100).toFixed(0)}%</Label>
              <Slider
                value={[solarVariance * 100]}
                onValueChange={(v) => setSolarVariance(v[0] / 100)}
                min={0}
                max={40}
                step={1}
                disabled={isRunning}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Admin Trust Threshold: {(adminThreshold * 100).toFixed(0)}%</Label>
              <Slider
                value={[adminThreshold * 100]}
                onValueChange={(v) => setAdminThreshold(v[0] / 100)}
                min={55}
                max={95}
                step={1}
                disabled={isRunning}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Execution Speed</Label>
              <Slider value={[tickMs]} onValueChange={(v) => setTickMs(v[0])} min={30} max={350} step={10} />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="border-slate-700" onClick={applyStrictProfile} disabled={isRunning}>
                <Lock className="h-4 w-4 mr-1" />
                Strict
              </Button>
              <Button variant="outline" className="border-slate-700" onClick={applyFastProfile} disabled={isRunning}>
                <Zap className="h-4 w-4 mr-1" />
                Fast Admin
              </Button>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => setIsRunning((v) => !v)} className="flex-1 bg-cyan-600 hover:bg-cyan-700">
                {isRunning ? 'Pause' : 'Start'}
              </Button>
              <Button variant="outline" className="border-slate-700" onClick={resetSimulation}>
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-cyan-400" />
              Governance Check Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>Frame Progress</span>
                <span className="font-mono">{sim.step}/{bitWindow} bits</span>
              </div>
              <Progress value={progress} className="bg-slate-800" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <p className="text-xs text-slate-500 mb-1">Trust</p>
                <p className="font-mono text-cyan-300">{(trust * 100).toFixed(2)}%</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <p className="text-xs text-slate-500 mb-1">Confidence</p>
                <p className="font-mono text-blue-300">{(confidence * 100).toFixed(2)}%</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <p className="text-xs text-slate-500 mb-1">Entropy</p>
                <p className="font-mono text-purple-300">{(entropy * 100).toFixed(2)}%</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <p className="text-xs text-slate-500 mb-1">Risk Band</p>
                <p className="font-medium text-slate-200">{riskBand}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge className="bg-slate-800 text-slate-200 border border-slate-700">
                Profile: {fastLane ? 'Fast Admin Lane' : 'Strict Governance'}
              </Badge>
              <Badge className="bg-slate-800 text-slate-200 border border-slate-700">
                Decision Window: {minBitsForDecision} bits
              </Badge>
              <Badge className="bg-slate-800 text-slate-200 border border-slate-700">
                Confidence Gate: {(confidenceGate * 100).toFixed(0)}%
              </Badge>
            </div>

            {sim.lastEvent && (
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-sm">
                <span className="text-slate-400">Last pulse:</span>{' '}
                <span className="font-mono text-slate-200">expected {sim.lastEvent.expected}</span>
                {'  '}|{'  '}
                <span className="font-mono text-slate-200">observed {sim.lastEvent.observed}</span>
                {'  '}|{'  '}
                <span className="font-mono text-slate-200">count {sim.lastEvent.count}</span>
              </div>
            )}

            <div className="p-4 rounded-lg border border-slate-700 bg-slate-950/70">
              {!decisionReady && (
                <div className="flex items-start gap-2 text-slate-300 text-sm">
                  <AlertTriangle className="h-4 w-4 mt-0.5 text-amber-400" />
                  <p>Collecting enough neutrino-bit evidence before admin decision.</p>
                </div>
              )}
              {decisionReady && adminGranted && (
                <div className="text-green-300 text-sm font-medium">
                  ADMIN ACCESS GRANTED: trust and confidence passed governance gates.
                </div>
              )}
              {adminDenied && (
                <div className="text-red-300 text-sm font-medium">
                  ADMIN ACCESS DENIED: random-check trust channel did not meet required gate.
                </div>
              )}
              {decisionReady && !adminGranted && !adminDenied && (
                <div className="text-slate-300 text-sm">
                  Decision gate open, waiting for stronger confidence/trust convergence.
                </div>
              )}
            </div>

            <div className="p-4 rounded-lg border border-slate-700 bg-slate-950/70">
              <p className="text-sm font-medium text-slate-200 mb-2">W-Sphere View</p>
              <div className="relative mx-auto h-56 w-56 rounded-full border border-slate-700 bg-slate-900/40">
                <div className="absolute left-[12.5%] top-[12.5%] h-[75%] w-[75%] rounded-full border border-slate-700/70" />
                <div className="absolute left-[25%] top-[25%] h-[50%] w-[50%] rounded-full border border-slate-700/70" />
                <div className="absolute left-[37.5%] top-[37.5%] h-[25%] w-[25%] rounded-full border border-slate-700/70" />
                <div
                  className="absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0_0_10px_rgba(56,189,248,0.8)]"
                  style={{ left: `${sphereX}%`, top: `${sphereY}%`, backgroundColor: pointColor }}
                />
              </div>
              <p className="mt-2 text-xs text-slate-400 text-center">
                Center = stable trust lane. Edge = high-risk lane.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-lg">Trust Curve vs Detection Curve</CardTitle>
          <CardDescription className="text-slate-400">
            Fast Admin lane trades sample size for speed; strict lane uses longer random-check evidence windows.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={sim.points}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="step" stroke="#64748b" />
              <YAxis stroke="#64748b" domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#e2e8f0',
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="trustPct" stroke="#22d3ee" strokeWidth={2} dot={false} name="Trust %" />
              <Line type="monotone" dataKey="confidencePct" stroke="#60a5fa" strokeWidth={2} dot={false} name="Confidence %" />
              <Line type="monotone" dataKey="entropyPct" stroke="#c084fc" strokeWidth={2} dot={false} name="Entropy %" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
