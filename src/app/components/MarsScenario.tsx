import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Rocket, Radio, Zap, Shield, Clock, Wifi } from 'lucide-react';
import { Progress } from './ui/progress';

interface TransmissionPhase {
  name: string;
  time: number;
  description: string;
  status: 'pending' | 'active' | 'complete';
}

export function MarsScenario() {
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [progress, setProgress] = useState(0);

  const phases: TransmissionPhase[] = [
    {
      name: 'Earth Transmission',
      time: 0,
      description: 'Message encoded with SpiralRing-64 at T=0',
      status: currentPhase > 0 ? 'complete' : currentPhase === 0 ? 'active' : 'pending'
    },
    {
      name: 'Light Propagation',
      time: 14,
      description: 'Signal travels at c (speed of light) for ~14 minutes',
      status: currentPhase > 1 ? 'complete' : currentPhase === 1 ? 'active' : 'pending'
    },
    {
      name: 'Mars Reception',
      time: 14,
      description: 'Receiver fast-forwards ring state to T=840s and decodes',
      status: currentPhase > 2 ? 'complete' : currentPhase === 2 ? 'active' : 'pending'
    }
  ];

  const startTransmission = () => {
    setIsTransmitting(true);
    setCurrentPhase(0);
    setProgress(0);

    // Phase 0: Earth transmission (instant)
    setTimeout(() => {
      setCurrentPhase(1);
      setProgress(33);

      // Phase 1: Light propagation (simulated)
      let lightProgress = 0;
      const lightInterval = setInterval(() => {
        lightProgress += 2;
        setProgress(33 + (lightProgress / 100) * 33);
        
        if (lightProgress >= 100) {
          clearInterval(lightInterval);
          setCurrentPhase(2);
          setProgress(66);

          // Phase 2: Mars reception (instant)
          setTimeout(() => {
            setProgress(100);
            setTimeout(() => {
              setIsTransmitting(false);
              setCurrentPhase(3);
            }, 1000);
          }, 2000);
        }
      }, 50);
    }, 2000);
  };

  const resetDemo = () => {
    setIsTransmitting(false);
    setCurrentPhase(0);
    setProgress(0);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-2xl text-orange-400">Mars Communication Scenario</CardTitle>
          <CardDescription className="text-slate-400">
            Why EDE is "Mars-Ready": Solving the 14-minute latency problem without handshakes
          </CardDescription>
        </CardHeader>
      </Card>

      {/* The Challenge */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Rocket className="h-5 w-5 text-orange-400" />
            The Challenge
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-slate-300">
          <p>
            <strong className="text-orange-400">The Problem:</strong> Mars is ~14 light-minutes from Earth. 
            Traditional cryptographic protocols require handshakes (key exchange, acknowledgments)—each 
            round-trip takes 28 minutes.
          </p>
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <p className="text-sm">
              <strong className="text-red-400">Traditional TLS Handshake:</strong>
            </p>
            <ul className="text-sm space-y-1 mt-2 list-disc list-inside text-slate-400">
              <li>Client Hello → 14 min → Server</li>
              <li>Server Hello + Certificate → 14 min → Client</li>
              <li>Key Exchange → 14 min → Server</li>
              <li>Finished → 14 min → Client</li>
              <li><strong className="text-red-400">Total: 56 minutes to send first encrypted byte!</strong></li>
            </ul>
          </div>
          <p>
            For real-time control (rover operations, life support systems), this is <strong className="text-red-400">unacceptable</strong>.
          </p>
        </CardContent>
      </Card>

      {/* The Solution */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="h-5 w-5 text-cyan-400" />
            The EDE Solution
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-slate-300">
          <p>
            <strong className="text-cyan-400">Deterministic Expansion:</strong> The SpiralRing expansion 
            is not random—it's a mathematical function of time and a shared seed.
          </p>
          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
            <p className="text-sm mb-2">
              <strong className="text-cyan-400">EDE Protocol:</strong>
            </p>
            <ol className="text-sm space-y-2 list-decimal list-inside text-slate-300">
              <li>
                <strong>Pre-shared Key:</strong> Earth and Mars stations share a seed during mission planning 
                (months before launch, verified multiple times).
              </li>
              <li>
                <strong>Synchronized Clocks:</strong> Both use atomic clocks synced to mission time T=0.
              </li>
              <li>
                <strong>Transmit with Timestamp:</strong> Message includes transmission time T_send.
              </li>
              <li>
                <strong>Receiver "Fast Forwards":</strong> Mars calculates ring state at T_send and decodes immediately—no handshake needed.
              </li>
            </ol>
          </div>
          <p>
            <strong className="text-green-400">Result:</strong> Zero-latency decryption. The 14-minute delay 
            is unavoidable (physics), but the <em>cryptographic</em> delay is eliminated.
          </p>
        </CardContent>
      </Card>

      {/* Interactive Demo */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-lg">Interactive Transmission Demo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Visualization */}
          <div className="relative">
            {/* Earth */}
            <div className="absolute left-0 top-0 flex flex-col items-center">
              <div className={`h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center transition-all duration-500 ${currentPhase >= 1 ? 'ring-4 ring-cyan-500 ring-opacity-50' : ''}`}>
                <Wifi className="h-10 w-10 text-white" />
              </div>
              <span className="text-xs text-slate-400 mt-2">Earth Station</span>
              {currentPhase === 0 && (
                <Badge className="mt-2 bg-cyan-600">Encoding...</Badge>
              )}
            </div>

            {/* Mars */}
            <div className="absolute right-0 top-0 flex flex-col items-center">
              <div className={`h-20 w-20 rounded-full bg-gradient-to-br from-orange-500 to-red-700 flex items-center justify-center transition-all duration-500 ${currentPhase >= 2 ? 'ring-4 ring-orange-500 ring-opacity-50' : ''}`}>
                <Rocket className="h-10 w-10 text-white" />
              </div>
              <span className="text-xs text-slate-400 mt-2">Mars Station</span>
              {currentPhase === 2 && (
                <Badge className="mt-2 bg-orange-600">Decoding...</Badge>
              )}
              {currentPhase === 3 && (
                <Badge className="mt-2 bg-green-600">Complete ✓</Badge>
              )}
            </div>

            {/* Signal Path */}
            <div className="absolute left-20 right-20 top-10 h-1 bg-slate-700">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-orange-500 transition-all duration-300"
                style={{ width: currentPhase === 1 ? `${(progress - 33) * 3}%` : currentPhase >= 2 ? '100%' : '0%' }}
              />
            </div>

            {/* Spacer for layout */}
            <div className="h-32"></div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Transmission Progress</span>
              <span className="text-cyan-400">{progress.toFixed(0)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          {/* Phase Timeline */}
          <div className="space-y-2">
            {phases.map((phase, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border transition-all ${
                  phase.status === 'active'
                    ? 'bg-cyan-500/20 border-cyan-500/50'
                    : phase.status === 'complete'
                    ? 'bg-green-500/20 border-green-500/50'
                    : 'bg-slate-800/50 border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {phase.status === 'complete' ? (
                      <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center">
                        <span className="text-white">✓</span>
                      </div>
                    ) : phase.status === 'active' ? (
                      <div className="h-8 w-8 rounded-full bg-cyan-600 flex items-center justify-center animate-pulse">
                        <Radio className="h-4 w-4 text-white" />
                      </div>
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center">
                        <Clock className="h-4 w-4 text-slate-400" />
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-slate-200">{phase.name}</div>
                      <div className="text-xs text-slate-400">{phase.description}</div>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-slate-600 text-slate-400">
                    T+{phase.time}m
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            <Button
              onClick={startTransmission}
              disabled={isTransmitting}
              className="flex-1 bg-orange-600 hover:bg-orange-700"
            >
              <Rocket className="h-4 w-4 mr-2" />
              Start Transmission
            </Button>
            <Button onClick={resetDemo} variant="outline" className="border-slate-700">
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Technical Details */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-lg">Why This Works: The Math</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-slate-950 border border-slate-700 rounded-lg p-4 space-y-3 font-mono text-sm">
            <div>
              <span className="text-slate-500">// Earth (T_earth = 0s)</span><br />
              <span className="text-cyan-400">ring_state_earth</span> = <span className="text-purple-400">SpiralRing</span>(seed, T=<span className="text-orange-400">0</span>)<br />
              <span className="text-cyan-400">message_encoded</span> = <span className="text-purple-400">encode</span>(message, ring_state_earth)<br />
              <span className="text-purple-400">transmit</span>(message_encoded, timestamp=<span className="text-orange-400">0</span>)
            </div>
            
            <div className="border-t border-slate-700 pt-3">
              <span className="text-slate-500">// Mars (T_mars = 840s = 14 minutes later)</span><br />
              <span className="text-cyan-400">timestamp_received</span> = <span className="text-orange-400">0</span> <span className="text-slate-500">// from message header</span><br />
              <span className="text-cyan-400">ring_state_mars</span> = <span className="text-purple-400">SpiralRing</span>(seed, T=<span className="text-orange-400">0</span>) <span className="text-slate-500">// Fast-forward to sender's time!</span><br />
              <span className="text-cyan-400">message_decoded</span> = <span className="text-purple-400">decode</span>(message_encoded, ring_state_mars)<br />
            </div>
          </div>

          <p className="text-sm text-slate-300">
            <strong className="text-cyan-400">Key Insight:</strong> The receiver doesn't need to know the 
            ring state at their <em>current</em> time (T=840). They reconstruct the ring state at the 
            <em>sender's</em> time (T=0) using the deterministic expansion function.
          </p>
        </CardContent>
      </Card>

      {/* Additional Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <Shield className="h-8 w-8 text-green-400 mb-2" />
            <CardTitle className="text-base">Cosmic Ray Resistance</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-400">
            High entropy encoding means bit-flips are more likely to produce invalid symbols 
            (not in the ring), which are caught by validation—natural error detection.
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <Clock className="h-8 w-8 text-blue-400 mb-2" />
            <CardTitle className="text-base">Time Dilation Ready</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-400">
            Relativity matters at high speeds. The Lorentz Factor can be incorporated into the 
            ring expansion rate—receivers account for time dilation automatically.
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <Zap className="h-8 w-8 text-purple-400 mb-2" />
            <CardTitle className="text-base">Low Bandwidth Cost</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-400">
            Adding 1 bit/sec of entropy costs ~0.125 bytes/sec. For a Mars link, 
            this is negligible compared to video/telemetry bandwidth.
          </CardContent>
        </Card>
      </div>

      {/* The Pitch */}
      <Card className="bg-gradient-to-br from-orange-950/30 to-red-950/30 border-orange-500/30">
        <CardHeader>
          <CardTitle className="text-lg text-orange-300">The "Elon Pitch"</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-300">
          <p>
            <strong className="text-orange-400">"SpaceX needs crypto that works at c (the speed of light), 
            not at handshake speed."</strong>
          </p>
          <p>
            Traditional protocols were designed for Earth—where latency is milliseconds and handshakes are free. 
            In space, every round-trip is <em>minutes</em>. EDE eliminates the handshake entirely.
          </p>
          <p className="text-cyan-400">
            This isn't just quantum-resistant cryptography. It's <strong>physics-resistant</strong> cryptography—
            designed for the constraints of relativity itself.
          </p>
          <div className="mt-4 pt-4 border-t border-orange-500/30">
            <p className="text-xs text-slate-400 italic">
              "When you're commanding a rover on Mars, you can't wait an hour for a TLS handshake. 
              You need security that works at the speed of light—and EDE delivers that."
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
