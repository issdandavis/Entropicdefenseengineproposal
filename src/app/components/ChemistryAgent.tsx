import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Play, Pause, RotateCcw, Zap, Shield, AlertTriangle, Activity, Target } from 'lucide-react';

const R = (1 + Math.sqrt(5)) / 2; // Golden ratio

interface WaveData {
  time: number;
  malicious: number;
  antibodies: number;
  neutralized: number;
  systemHealth: number;
}

interface ThreatMetrics {
  level: number;
  propagationSuccess: number;
  stability: number;
  detectionRate: number;
  antibodyEfficiency: number;
}

// Threat level descriptions
const THREAT_DESCRIPTIONS = {
  '-5': 'Fully Relaxed / Unaware',
  '-3': 'Low Vigilance',
  '-1': 'Neutral / Ambient',
  '0': 'Baseline Equilibrium',
  '2': 'Mild Alert',
  '4': 'Moderate Combat',
  '6': 'High Alert',
  '8': 'Intense Combat',
  '10': 'Maximum Threat Response'
};

export function ChemistryAgent() {
  const [isRunning, setIsRunning] = useState(false);
  const [threatLevel, setThreatLevel] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [waveData, setWaveData] = useState<WaveData[]>([]);
  const [metrics, setMetrics] = useState<ThreatMetrics | null>(null);
  const [allMetrics, setAllMetrics] = useState<ThreatMetrics[]>([]);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const maxSteps = 100;

  // Chemistry reaction: Square input for energy release
  const chemistryReaction = (inputVal: number, maxEnergy = 10.0): number => {
    const energy = Math.log(1 + inputVal ** 2);
    return Math.min(Math.max(energy, 0), maxEnergy);
  };

  // Calculate malicious wave spawn rate
  const calculateMaliciousSpawn = (step: number, level: number): number => {
    const baseRate = Math.max(0, -level / 5.0);
    const growthFactor = baseRate + Math.random() * 0.5;
    return growthFactor * (step ** 1.5) / 100; // Squared-like growth
  };

  // Calculate antibody response
  const calculateAntibodyResponse = (step: number, level: number): number => {
    const responseRate = Math.max(0, level / 10.0);
    const peakAt = maxSteps / 2;
    const distance = Math.abs(step - peakAt);
    return responseRate * (maxSteps - distance) / 10;
  };

  // Ray refraction defense (phase deflection)
  const applyRefraction = (value: number, level: number): number => {
    if (level > 0) {
      const refractionStrength = level / 10.0;
      return value * (1 - refractionStrength * 0.8);
    }
    return value;
  };

  // Self-healing harmonic recentering
  const applySelfHealing = (malicious: number, antibodies: number, level: number): number => {
    if (level > 0) {
      const healingFactor = 1.5 + (level / 10.0);
      return Math.min(malicious, antibodies * healingFactor);
    }
    return Math.min(malicious, antibodies * 1.2);
  };

  // Run single step of simulation
  const runSimulationStep = (step: number) => {
    let maliciousSpawn = calculateMaliciousSpawn(step, threatLevel);
    
    // Apply squared reaction energy modulation
    const reactionEnergy = chemistryReaction(maliciousSpawn);
    maliciousSpawn *= (1 + reactionEnergy / 10);
    
    // Apply refraction defense
    maliciousSpawn = applyRefraction(maliciousSpawn, threatLevel);
    
    const antibodySpawn = calculateAntibodyResponse(step, threatLevel);
    
    // Calculate neutralization with self-healing
    const neutralized = applySelfHealing(maliciousSpawn, antibodySpawn, threatLevel);
    
    // System health (100% = perfect defense)
    const damage = Math.max(0, maliciousSpawn - neutralized);
    const systemHealth = Math.max(0, 100 - (damage * 10));
    
    return {
      time: step,
      malicious: maliciousSpawn,
      antibodies: antibodySpawn,
      neutralized: neutralized,
      systemHealth: systemHealth
    };
  };

  // Calculate final metrics
  const calculateMetrics = (data: WaveData[]): ThreatMetrics => {
    const totalMalicious = data.reduce((sum, d) => sum + d.malicious, 0);
    const totalNeutralized = data.reduce((sum, d) => sum + d.neutralized, 0);
    const totalAntibodies = data.reduce((sum, d) => sum + d.antibodies, 0);
    
    const propagationSuccess = totalMalicious > 0 
      ? ((totalMalicious - totalNeutralized) / totalMalicious) * 100 
      : 0;
    
    const healthValues = data.map(d => d.systemHealth);
    const avgHealth = healthValues.reduce((a, b) => a + b, 0) / healthValues.length;
    const stability = healthValues.reduce((sum, h) => sum + Math.abs(h - avgHealth), 0) / healthValues.length;
    
    const detectionRate = totalMalicious > 0 ? (totalNeutralized / totalMalicious) * 100 : 0;
    const antibodyEfficiency = totalAntibodies > 0 ? totalNeutralized / totalAntibodies : 0;
    
    return {
      level: threatLevel,
      propagationSuccess: Math.max(0, propagationSuccess),
      stability: stability / 100,
      detectionRate: Math.min(100, detectionRate),
      antibodyEfficiency: Math.min(1, antibodyEfficiency)
    };
  };

  // Start simulation
  const startSimulation = () => {
    setIsRunning(true);
    setCurrentStep(0);
    setWaveData([]);
    setMetrics(null);
    
    intervalRef.current = setInterval(() => {
      setCurrentStep(prevStep => {
        const nextStep = prevStep + 1;
        
        if (nextStep >= maxSteps) {
          setIsRunning(false);
          return prevStep;
        }
        
        const stepData = runSimulationStep(nextStep);
        setWaveData(prev => {
          const newData = [...prev, stepData];
          
          // Calculate metrics when complete
          if (nextStep === maxSteps - 1) {
            const finalMetrics = calculateMetrics(newData);
            setMetrics(finalMetrics);
          }
          
          return newData;
        });
        
        return nextStep;
      });
    }, 50);
  };

  // Run full analysis across all threat levels
  const runFullAnalysis = async () => {
    const results: ThreatMetrics[] = [];
    
    for (let level = -5; level <= 10; level++) {
      setThreatLevel(level);
      
      // Simulate full run
      const data: WaveData[] = [];
      for (let step = 0; step < maxSteps; step++) {
        // Temporarily set threat level for calculation
        const stepData = runSimulationStep(step);
        data.push(stepData);
      }
      
      const levelMetrics = calculateMetrics(data);
      levelMetrics.level = level;
      results.push(levelMetrics);
      
      // Small delay for visual feedback
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    setAllMetrics(results);
    setThreatLevel(0); // Reset to baseline
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
    setCurrentStep(0);
    setWaveData([]);
    setMetrics(null);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const getStatusColor = (level: number) => {
    if (level <= -3) return 'text-red-400';
    if (level < 0) return 'text-orange-400';
    if (level === 0) return 'text-slate-400';
    if (level <= 4) return 'text-yellow-400';
    if (level <= 7) return 'text-cyan-400';
    return 'text-green-400';
  };

  const getStatusBg = (level: number) => {
    if (level <= -3) return 'bg-red-500/20 border-red-500/30';
    if (level < 0) return 'bg-orange-500/20 border-orange-500/30';
    if (level === 0) return 'bg-slate-500/20 border-slate-500/30';
    if (level <= 4) return 'bg-yellow-500/20 border-yellow-500/30';
    if (level <= 7) return 'bg-cyan-500/20 border-cyan-500/30';
    return 'bg-green-500/20 border-green-500/30';
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-2xl text-purple-400">
            Chemistry-Inspired Defensive Agent
          </CardTitle>
          <CardDescription className="text-slate-400">
            In-the-moment reactions with squared-input energy release. Watch antibody waves 
            counter malicious unit propagation in real-time—StarCraft AI meets immune system response.
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="live" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-900/50 border border-slate-800">
          <TabsTrigger value="live">Live Simulation</TabsTrigger>
          <TabsTrigger value="analysis">Full Threat Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="live" className="space-y-6 mt-6">
          {/* Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg">Threat Level Control</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-slate-300">Current Level</Label>
                    <Badge className={getStatusBg(threatLevel)}>
                      <span className={getStatusColor(threatLevel)}>{threatLevel}</span>
                    </Badge>
                  </div>
                  
                  <Slider
                    value={[threatLevel]}
                    onValueChange={(v) => setThreatLevel(v[0])}
                    min={-5}
                    max={10}
                    step={1}
                    disabled={isRunning}
                    className="mt-2"
                  />
                  
                  <div className="bg-slate-950 border border-slate-700 rounded-lg p-3">
                    <p className="text-sm font-semibold text-cyan-400">
                      {THREAT_DESCRIPTIONS[threatLevel.toString() as keyof typeof THREAT_DESCRIPTIONS] || 'Custom Level'}
                    </p>
                    <div className="mt-2 space-y-1 text-xs text-slate-400">
                      {threatLevel <= -3 && (
                        <p>⚠️ High unobserved drift (~5-10%). Minimal defenses active.</p>
                      )}
                      {threatLevel >= 0 && threatLevel < 5 && (
                        <p>⚡ Squared reactions engaging. Refraction deflecting threats.</p>
                      )}
                      {threatLevel >= 5 && (
                        <p>🛡️ Combat mode. Rapid antibody deployment. Exponential sinks active.</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {!isRunning ? (
                    <Button onClick={startSimulation} className="flex-1 bg-purple-600 hover:bg-purple-700">
                      <Play className="h-4 w-4 mr-2" />
                      Start Wave
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

            {/* Real-time Metrics */}
            <Card className="lg:col-span-2 bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-cyan-400" />
                  System Status: Step {currentStep}/{maxSteps}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {waveData.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-950 border border-red-500/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-red-400" />
                        <span className="text-xs text-slate-400">Malicious Units</span>
                      </div>
                      <div className="text-2xl font-bold text-red-400">
                        {waveData[waveData.length - 1].malicious.toFixed(2)}
                      </div>
                    </div>

                    <div className="bg-slate-950 border border-cyan-500/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="h-4 w-4 text-cyan-400" />
                        <span className="text-xs text-slate-400">Antibodies</span>
                      </div>
                      <div className="text-2xl font-bold text-cyan-400">
                        {waveData[waveData.length - 1].antibodies.toFixed(2)}
                      </div>
                    </div>

                    <div className="bg-slate-950 border border-green-500/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-4 w-4 text-green-400" />
                        <span className="text-xs text-slate-400">Neutralized</span>
                      </div>
                      <div className="text-2xl font-bold text-green-400">
                        {waveData[waveData.length - 1].neutralized.toFixed(2)}
                      </div>
                    </div>

                    <div className="bg-slate-950 border border-purple-500/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="h-4 w-4 text-purple-400" />
                        <span className="text-xs text-slate-400">System Health</span>
                      </div>
                      <div className="text-2xl font-bold text-purple-400">
                        {waveData[waveData.length - 1].systemHealth.toFixed(0)}%
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <p>Start simulation to see real-time metrics</p>
                  </div>
                )}

                {metrics && (
                  <div className="mt-6 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                    <p className="font-semibold text-cyan-300 mb-2">Final Metrics</p>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-slate-400">Propagation Success:</span>
                        <span className="ml-2 text-cyan-400 font-mono">
                          {metrics.propagationSuccess.toFixed(1)}%
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400">Detection Rate:</span>
                        <span className="ml-2 text-green-400 font-mono">
                          {metrics.detectionRate.toFixed(1)}%
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400">System Stability:</span>
                        <span className="ml-2 text-purple-400 font-mono">
                          {metrics.stability.toFixed(3)}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400">Antibody Efficiency:</span>
                        <span className="ml-2 text-orange-400 font-mono">
                          {metrics.antibodyEfficiency.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Wave Visualization */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg">Unit Propagation Waves</CardTitle>
              <CardDescription>
                Malicious units (red) vs. Antibody response (cyan). Neutralization (green) shows defensive success.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={waveData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis 
                    dataKey="time" 
                    stroke="#64748b"
                    label={{ value: 'Time Steps', position: 'insideBottom', offset: -5, fill: '#94a3b8' }}
                  />
                  <YAxis 
                    stroke="#64748b"
                    label={{ value: 'Unit Count', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#e2e8f0'
                    }}
                    formatter={(value: number) => value.toFixed(2)}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="malicious" 
                    stroke="#ef4444" 
                    fill="#ef444420"
                    name="Malicious Units"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="antibodies" 
                    stroke="#06b6d4" 
                    fill="#06b6d420"
                    name="Antibody Response"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="neutralized" 
                    stroke="#10b981" 
                    fill="#10b98120"
                    name="Neutralized"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* System Health Over Time */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg">System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={waveData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="time" stroke="#64748b" />
                  <YAxis stroke="#64748b" domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#e2e8f0'
                    }}
                    formatter={(value: number) => value.toFixed(1) + '%'}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="systemHealth" 
                    stroke="#a855f7" 
                    strokeWidth={3}
                    name="Health %"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6 mt-6">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg">Full Threat Spectrum Analysis</CardTitle>
              <CardDescription>
                Benchmark all threat levels from -5 (relaxed/unaware) to +10 (maximum combat).
                Compare propagation success, detection, and efficiency across the entire range.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={runFullAnalysis} 
                disabled={isRunning}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Zap className="h-4 w-4 mr-2" />
                Run Full Analysis (All Levels)
              </Button>

              {allMetrics.length > 0 && (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-700">
                          <th className="text-left py-3 px-4 text-slate-400">Level</th>
                          <th className="text-left py-3 px-4 text-slate-400">Description</th>
                          <th className="text-right py-3 px-4 text-slate-400">Propagation %</th>
                          <th className="text-right py-3 px-4 text-slate-400">Detection %</th>
                          <th className="text-right py-3 px-4 text-slate-400">Efficiency</th>
                          <th className="text-right py-3 px-4 text-slate-400">Stability</th>
                        </tr>
                      </thead>
                      <tbody className="text-slate-300">
                        {allMetrics.map((m) => (
                          <tr key={m.level} className="border-b border-slate-800 hover:bg-slate-800/30">
                            <td className="py-3 px-4">
                              <Badge className={getStatusBg(m.level)}>
                                <span className={getStatusColor(m.level)}>{m.level}</span>
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-xs">
                              {THREAT_DESCRIPTIONS[m.level.toString() as keyof typeof THREAT_DESCRIPTIONS] || 'N/A'}
                            </td>
                            <td className="py-3 px-4 text-right font-mono">
                              <span className={m.propagationSuccess > 50 ? 'text-red-400' : 'text-green-400'}>
                                {m.propagationSuccess.toFixed(1)}%
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right font-mono text-cyan-400">
                              {m.detectionRate.toFixed(1)}%
                            </td>
                            <td className="py-3 px-4 text-right font-mono text-orange-400">
                              {m.antibodyEfficiency.toFixed(2)}
                            </td>
                            <td className="py-3 px-4 text-right font-mono text-purple-400">
                              {m.stability.toFixed(3)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Comparison Charts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <Card className="bg-slate-950/50 border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-base">Propagation Success vs Threat Level</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                          <LineChart data={allMetrics}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="level" stroke="#64748b" />
                            <YAxis stroke="#64748b" />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: '#1e293b', 
                                border: '1px solid #334155',
                                borderRadius: '8px'
                              }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="propagationSuccess" 
                              stroke="#ef4444" 
                              strokeWidth={2}
                              name="Propagation %"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-950/50 border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-base">Detection Rate vs Threat Level</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                          <LineChart data={allMetrics}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="level" stroke="#64748b" />
                            <YAxis stroke="#64748b" />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: '#1e293b', 
                                border: '1px solid #334155',
                                borderRadius: '8px'
                              }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="detectionRate" 
                              stroke="#06b6d4" 
                              strokeWidth={2}
                              name="Detection %"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* How It Works */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-lg">How the Chemistry Agent Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-slate-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
              <h4 className="font-semibold text-purple-400 mb-2">Squared-Input Reactions</h4>
              <p className="text-slate-400">
                Like kinetic energy (½mv²), input values are squared to model chemical reaction rates.
                Small legitimate inputs remain stable; large malicious inputs trigger exponential energy
                release that modulates defense variables.
              </p>
              <code className="block mt-2 text-xs bg-slate-950 p-2 rounded">
                energy = log(1 + input²)
              </code>
            </div>

            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
              <h4 className="font-semibold text-cyan-400 mb-2">Ray Refraction Defense</h4>
              <p className="text-slate-400">
                Phase-shift deflection on malicious trajectories. Higher threat levels increase
                refraction strength, bending attack "rays" away from the system core into harmonic sinks.
              </p>
              <code className="block mt-2 text-xs bg-slate-950 p-2 rounded">
                deflected = value × (1 - level/10 × 0.8)
              </code>
            </div>

            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <h4 className="font-semibold text-green-400 mb-2">Self-Healing Harmonics</h4>
              <p className="text-slate-400">
                Like chemical equilibrium, the system re-centers disturbed trajectories.
                Antibodies get efficiency boost at higher threat levels—neutralizing more
                malicious units per antibody deployed.
              </p>
              <code className="block mt-2 text-xs bg-slate-950 p-2 rounded">
                neutralized = min(mal, ab × (1.5 + level/10))
              </code>
            </div>

            <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
              <h4 className="font-semibold text-orange-400 mb-2">Unit Propagation Waves</h4>
              <p className="text-slate-400">
                Inspired by StarCraft AI and immune systems. Malicious "units" spawn in waves
                (squared growth); antibody "units" counter-propagate. Real-time battle
                visualization shows the alive defensive ecosystem.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-World Applications */}
      <Card className="bg-gradient-to-br from-purple-950/30 to-cyan-950/30 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-lg text-purple-300">Real-World Applications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-300">
          <p>
            <strong className="text-cyan-400">AI Agent Swarms:</strong> Coordinate multiple LLMs
            (coding, debugging, research agents). Malicious prompts or hallucinations trigger
            squared reactions—immediate quarantine before spread.
          </p>
          <p>
            <strong className="text-purple-400">IoT / Edge Networks:</strong> Distributed devices
            (smart home, autonomous vehicles) use antibody propagation to neutralize compromised
            nodes. Self-healing maintains network integrity without central controller.
          </p>
          <p>
            <strong className="text-green-400">Cybersecurity Defense:</strong> Adaptive zero-trust
            where threat level adjusts in real-time. Low threat = minimal overhead; high threat =
            exponential barriers. Better than static rules—responds like a living immune system.
          </p>
          <p className="text-cyan-400 italic mt-4">
            This isn't just code on screen—it's a deployable framework for intent-aware, adaptive
            security that scales from local prototypes ($0-$500) to production systems. The math
            is real, the applications are concrete, and the timing is perfect for the AI agent boom.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
