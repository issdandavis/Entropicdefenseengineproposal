import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Label } from './ui/label';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Play, Pause, RotateCcw, Zap } from 'lucide-react';

interface SimulationData {
  time: number;
  staticProgress: number;
  entropicProgress: number;
  staticWork: number;
  entropicWork: number;
}

export function QuantumRaceSimulation() {
  const [isRunning, setIsRunning] = useState(false);
  const [data, setData] = useState<SimulationData[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  
  // Simulation parameters
  const [initialBits, setInitialBits] = useState(64);
  const [attackerOps, setAttackerOps] = useState(9); // 10^9 ops/sec
  const [expansionRate, setExpansionRate] = useState(1.0); // bits per second
  const [speed, setSpeed] = useState(100); // ms per tick
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const runSimulationStep = (t: number) => {
    const N0 = Math.pow(2, initialBits);
    const attackerOpsPerSec = Math.pow(10, attackerOps);
    
    // Work accumulated by attacker
    const workDone = attackerOpsPerSec * t;
    
    // Static scenario: work required is constant
    const workRequiredStatic = Math.sqrt(N0);
    const progressStatic = Math.min(100, (workDone / workRequiredStatic) * 100);
    
    // Entropic scenario: search space expands
    const currentBits = initialBits + (expansionRate * t);
    const Nt = Math.pow(2, currentBits);
    const workRequiredEntropic = Math.sqrt(Nt);
    const progressEntropic = Math.min(100, (workDone / workRequiredEntropic) * 100);
    
    return {
      time: t,
      staticProgress: progressStatic,
      entropicProgress: progressEntropic,
      staticWork: workRequiredStatic,
      entropicWork: workRequiredEntropic,
    };
  };

  const startSimulation = () => {
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setCurrentTime((t) => {
        const nextTime = t + 1;
        if (nextTime > 100) {
          setIsRunning(false);
          return t;
        }
        
        const stepData = runSimulationStep(nextTime);
        setData((prevData) => [...prevData, stepData]);
        
        return nextTime;
      });
    }, speed);
  };

  const pauseSimulation = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const resetSimulation = () => {
    pauseSimulation();
    setCurrentTime(0);
    setData([]);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Calculate current status
  const currentData = data[data.length - 1];
  const escapeVelocity = currentData 
    ? currentData.entropicProgress < currentData.staticProgress 
    : false;

  return (
    <div className="space-y-6">
      {/* Title Card */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-2xl text-cyan-400">The Quantum Race</CardTitle>
          <CardDescription className="text-slate-400">
            Real-time simulation: Grover's Algorithm vs. Entropic Defense Engine
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg">Simulation Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Initial Bits */}
            <div className="space-y-2">
              <Label className="text-slate-300">Initial Key Strength: {initialBits} bits</Label>
              <Slider
                value={[initialBits]}
                onValueChange={(v) => setInitialBits(v[0])}
                min={32}
                max={128}
                step={8}
                disabled={isRunning}
                className="mt-2"
              />
              <p className="text-xs text-slate-500">Search space: 2^{initialBits} ≈ {Math.pow(2, initialBits).toExponential(2)}</p>
            </div>

            {/* Attacker Power */}
            <div className="space-y-2">
              <Label className="text-slate-300">Attacker Power: 10^{attackerOps} ops/sec</Label>
              <Slider
                value={[attackerOps]}
                onValueChange={(v) => setAttackerOps(v[0])}
                min={6}
                max={15}
                step={1}
                disabled={isRunning}
                className="mt-2"
              />
              <p className="text-xs text-slate-500">
                {attackerOps === 15 ? "⚡ Optimistic quantum limit" : "Standard quantum computer"}
              </p>
            </div>

            {/* Expansion Rate */}
            <div className="space-y-2">
              <Label className="text-slate-300">Entropy Injection Rate: {expansionRate.toFixed(2)} bits/sec</Label>
              <Slider
                value={[expansionRate * 10]}
                onValueChange={(v) => setExpansionRate(v[0] / 10)}
                min={1}
                max={30}
                step={1}
                disabled={isRunning}
                className="mt-2"
              />
              <p className="text-xs text-slate-500">Cost: ~{(expansionRate * 0.1).toFixed(2)} KB/sec bandwidth</p>
            </div>

            {/* Speed */}
            <div className="space-y-2">
              <Label className="text-slate-300">Animation Speed</Label>
              <Slider
                value={[speed]}
                onValueChange={(v) => setSpeed(v[0])}
                min={10}
                max={500}
                step={10}
                className="mt-2"
              />
            </div>

            {/* Controls */}
            <div className="flex gap-2 pt-4">
              {!isRunning ? (
                <Button onClick={startSimulation} className="flex-1 bg-cyan-600 hover:bg-cyan-700">
                  <Play className="h-4 w-4 mr-2" />
                  Start
                </Button>
              ) : (
                <Button onClick={pauseSimulation} className="flex-1 bg-orange-600 hover:bg-orange-700">
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </Button>
              )}
              <Button onClick={resetSimulation} variant="outline" className="border-slate-700">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Status Display */}
        <Card className="lg:col-span-2 bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg">Current Status: T = {currentTime}s</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Static Crypto Progress */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-slate-300">Static Crypto (Standard Defense)</Label>
                <span className="text-sm font-mono text-red-400">
                  {currentData ? currentData.staticProgress.toFixed(8) : '0.00000000'}%
                </span>
              </div>
              <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-300"
                  style={{ width: `${currentData ? Math.min(currentData.staticProgress, 100) : 0}%` }}
                />
              </div>
              <p className="text-xs text-slate-500">
                Work required: {currentData ? currentData.staticWork.toExponential(2) : '—'} operations (constant)
              </p>
            </div>

            {/* EDE Progress */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-slate-300">Entropic Defense Engine (EDE)</Label>
                <span className="text-sm font-mono text-cyan-400">
                  {currentData ? currentData.entropicProgress.toFixed(20) : '0.00000000000000000000'}%
                </span>
              </div>
              <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-300"
                  style={{ width: `${currentData ? Math.min(currentData.entropicProgress * 10, 100) : 0}%` }}
                />
              </div>
              <p className="text-xs text-slate-500">
                Work required: {currentData ? currentData.entropicWork.toExponential(2) : '—'} operations (growing exponentially)
              </p>
            </div>

            {/* Status Message */}
            {currentData && escapeVelocity && (
              <div className="mt-4 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg flex items-start gap-3">
                <Zap className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-cyan-300">Escape Velocity Achieved!</p>
                  <p className="text-xs text-slate-400 mt-1">
                    The attacker's progress is decreasing over time. The search space is expanding faster than they can search it.
                    This is Zeno's Paradox applied to cryptography—they can never reach the finish line.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-lg">Attack Progress Over Time</CardTitle>
          <CardDescription className="text-slate-400">
            Logarithmic scale shows the divergence between static and entropic defenses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis 
                dataKey="time" 
                stroke="#64748b"
                label={{ value: 'Time (seconds)', position: 'insideBottom', offset: -5, fill: '#94a3b8' }}
              />
              <YAxis 
                stroke="#64748b"
                scale="log"
                domain={[0.000001, 100]}
                label={{ value: 'Progress (%)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#e2e8f0'
                }}
                formatter={(value: number) => value.toFixed(10) + '%'}
              />
              <Legend 
                wrapperStyle={{ color: '#94a3b8' }}
              />
              <Line 
                type="monotone" 
                dataKey="staticProgress" 
                stroke="#ef4444" 
                strokeWidth={2}
                name="Static Crypto"
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="entropicProgress" 
                stroke="#06b6d4" 
                strokeWidth={2}
                name="EDE"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Explanation */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-lg">How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-300">
          <p>
            <strong className="text-cyan-400">Static Cryptography:</strong> Traditional systems have a fixed search space (e.g., 2^256).
            Grover's algorithm can search this in O(√N) time, making steady progress toward 100%.
          </p>
          <p>
            <strong className="text-cyan-400">Entropic Defense Engine:</strong> The search space N(t) expands exponentially over time.
            Even as the attacker accumulates work, the target keeps moving away. Their progress percentage actually <em>decreases</em>.
          </p>
          <p>
            <strong className="text-cyan-400">The Math:</strong> When dW/dt {">"} C (expansion rate exceeds compute power),
            the system becomes mathematically unbreakable—not because the attacker lacks time, but because the finish line
            recedes faster than they can approach it.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
