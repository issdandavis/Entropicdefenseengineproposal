import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { RotateCw, Sparkles, Lock } from 'lucide-react';

// SpiralRing-64 Core32 Symbol Set (Mass)
const CORE32 = [
  'KO', 'KU', 'KA', 'KI', 'KE', 'TO', 'TU', 'TA', 'TI', 'TE', 'NO', 'NU',
  'NA', 'NI', 'NE', 'HO', 'HU', 'HA', 'HI', 'HE', 'MO', 'MU', 'MA', 'MI',
  'ME', 'YO', 'YU', 'YA', 'RA', 'RI', 'WA', 'NG'
];

// Expansion Runes (Dark Energy) - Tagged with ~
const EXPANSION_RUNES = [
  '~ZO', '~ZU', '~ZA', '~ZI', '~ZE', '~DO', '~DU', '~DA', '~DI', '~DE',
  '~BO', '~BU', '~BA', '~BI', '~BE', '~GO', '~GU', '~GA', '~GI', '~GE',
  '~SO', '~SU', '~SA', '~SI', '~SE', '~RO', '~RU', '~RE', '~WO', '~WU',
  '~FO', '~FU'
];

interface EncodingState {
  epoch: number;
  ringSize: number;
  symbolSet: string[];
}

export function SpiralRingDemo() {
  const [message, setMessage] = useState('HELLO');
  const [encoded, setEncoded] = useState<string[]>([]);
  const [states, setStates] = useState<EncodingState[]>([]);
  const [currentEpoch, setCurrentEpoch] = useState(0);
  const [expansionRate, setExpansionRate] = useState(2);

  // Encode message with expanding ring
  const encodeMessage = () => {
    const bytes = message.toUpperCase().split('');
    const newEncoded: string[] = [];
    const newStates: EncodingState[] = [];
    
    let currentSymbolSet = [...CORE32];
    
    bytes.forEach((byte, index) => {
      // Determine epoch (which version of the ring)
      const epoch = Math.floor(index / expansionRate);
      
      // Expand the ring for this epoch
      const expansionsNeeded = epoch;
      const expandedSet = [
        ...CORE32,
        ...EXPANSION_RUNES.slice(0, Math.min(expansionsNeeded * 2, EXPANSION_RUNES.length))
      ];
      
      // Encode the byte (simple mapping for demo)
      const charCode = byte.charCodeAt(0);
      const symbolIndex = charCode % expandedSet.length;
      const symbol = expandedSet[symbolIndex];
      
      newEncoded.push(symbol);
      newStates.push({
        epoch,
        ringSize: expandedSet.length,
        symbolSet: expandedSet
      });
    });
    
    setEncoded(newEncoded);
    setStates(newStates);
  };

  // Calculate current ring state
  const currentRing = states[currentEpoch] || {
    epoch: 0,
    ringSize: 32,
    symbolSet: CORE32
  };

  const massSymbols = currentRing.symbolSet.filter(s => !s.startsWith('~'));
  const darkEnergySymbols = currentRing.symbolSet.filter(s => s.startsWith('~'));
  const expansionRatio = ((darkEnergySymbols.length / currentRing.ringSize) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Title */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-2xl text-purple-400">SpiralRing-64 Encoding</CardTitle>
          <CardDescription className="text-slate-400">
            A dynamic symbol space that expands with each transmission—where mass (valid data) 
            and dark energy (entropy) coexist
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Interactive Encoder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg">Encode Message</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Message to Encode</Label>
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter message..."
                className="bg-slate-950 border-slate-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label>Expansion Rate: {expansionRate} bytes per epoch</Label>
              <Input
                type="range"
                min="1"
                max="5"
                value={expansionRate}
                onChange={(e) => setExpansionRate(Number(e.target.value))}
                className="w-full"
              />
              <p className="text-xs text-slate-500">
                Lower = more frequent ring expansion (higher entropy)
              </p>
            </div>

            <Button onClick={encodeMessage} className="w-full bg-purple-600 hover:bg-purple-700">
              <RotateCw className="h-4 w-4 mr-2" />
              Encode with Spiral Ring
            </Button>

            {encoded.length > 0 && (
              <div className="mt-4 space-y-2">
                <Label>Encoded Output</Label>
                <div className="bg-slate-950 border border-slate-700 rounded-lg p-4 font-mono text-sm">
                  <div className="flex flex-wrap gap-2">
                    {encoded.map((symbol, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentEpoch(idx)}
                        className={`px-2 py-1 rounded transition-colors ${
                          currentEpoch === idx
                            ? 'bg-purple-600 text-white'
                            : symbol.startsWith('~')
                            ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30'
                            : 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
                        }`}
                      >
                        {symbol}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  Click a symbol to inspect its encoding epoch
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Ring Visualizer */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg">
              Ring State at Byte {currentEpoch + 1} (Epoch {currentRing.epoch})
            </CardTitle>
            <CardDescription>
              Symbol space size: {currentRing.ringSize} | Expansion: {expansionRatio}%
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="mass" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-slate-950">
                <TabsTrigger value="mass" className="data-[state=active]:bg-purple-600">
                  Mass ({massSymbols.length})
                </TabsTrigger>
                <TabsTrigger value="dark" className="data-[state=active]:bg-cyan-600">
                  Dark Energy ({darkEnergySymbols.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="mass" className="mt-4">
                <div className="bg-slate-950 border border-slate-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Lock className="h-4 w-4 text-purple-400" />
                    <span className="text-sm font-semibold text-purple-400">Core32 Symbols (Valid Data)</span>
                  </div>
                  <div className="grid grid-cols-8 gap-2">
                    {massSymbols.map((symbol, idx) => (
                      <div
                        key={idx}
                        className="bg-purple-500/20 border border-purple-500/30 rounded px-2 py-1 text-center text-xs font-mono text-purple-300"
                      >
                        {symbol}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-3">
                    These symbols represent the "mass" of the system—the actual data payload.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="dark" className="mt-4">
                <div className="bg-slate-950 border border-slate-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-4 w-4 text-cyan-400" />
                    <span className="text-sm font-semibold text-cyan-400">Expansion Runes (Entropy)</span>
                  </div>
                  {darkEnergySymbols.length > 0 ? (
                    <>
                      <div className="grid grid-cols-8 gap-2">
                        {darkEnergySymbols.map((symbol, idx) => (
                          <div
                            key={idx}
                            className="bg-cyan-500/20 border border-cyan-500/30 rounded px-2 py-1 text-center text-xs font-mono text-cyan-300"
                          >
                            {symbol}
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-slate-500 mt-3">
                        Tagged with ~ to denote "void space"—injected entropy that expands the search space.
                      </p>
                    </>
                  ) : (
                    <div className="text-center py-6 text-slate-500">
                      <p className="text-sm">No expansion runes yet at Epoch {currentRing.epoch}</p>
                      <p className="text-xs mt-1">Ring expansion begins in later epochs</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            {/* Stats */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="bg-slate-950 border border-slate-700 rounded-lg p-3">
                <div className="text-xs text-slate-400">Epoch</div>
                <div className="text-xl font-bold text-purple-400">{currentRing.epoch}</div>
              </div>
              <div className="bg-slate-950 border border-slate-700 rounded-lg p-3">
                <div className="text-xs text-slate-400">Ring Size</div>
                <div className="text-xl font-bold text-cyan-400">{currentRing.ringSize}</div>
              </div>
              <div className="bg-slate-950 border border-slate-700 rounded-lg p-3">
                <div className="text-xs text-slate-400">Entropy %</div>
                <div className="text-xl font-bold text-blue-400">{expansionRatio}%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Architecture Explanation */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-lg">Architecture: The Expanding Alphabet</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
              <Badge className="mb-3 bg-purple-600">Layer 1: Initialization</Badge>
              <ul className="text-sm text-slate-300 space-y-2 list-disc list-inside">
                <li>Sender/Receiver share Seed Key</li>
                <li>Initial State: Core32 symbols (32 tokens)</li>
                <li>Deterministic expansion rules</li>
              </ul>
            </div>

            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
              <Badge className="mb-3 bg-cyan-600">Layer 2: Transmission</Badge>
              <ul className="text-sm text-slate-300 space-y-2 list-disc list-inside">
                <li>Byte 1: Encoded with Ring_Epoch_0</li>
                <li>Byte N: Ring expands every K bytes</li>
                <li>Expansion Runes injected (~ZO, ~ZU...)</li>
              </ul>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <Badge className="mb-3 bg-blue-600">Layer 3: Validation</Badge>
              <ul className="text-sm text-slate-300 space-y-2 list-disc list-inside">
                <li>Receiver syncs to sender's epoch</li>
                <li>Symphonic Cipher validates structure</li>
                <li>Invalid symbols rejected (not in ring)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cosmic Metaphor */}
      <Card className="bg-gradient-to-br from-purple-950/30 to-blue-950/30 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-lg text-purple-300">The Cosmological Analogy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-300">
          <p>
            <strong className="text-purple-400">Mass (Core32):</strong> Like visible matter in the universe, 
            these symbols carry the actual information. They're the "galaxies" of your message.
          </p>
          <p>
            <strong className="text-cyan-400">Dark Energy (Expansion Runes):</strong> Like the mysterious force 
            expanding the universe, these symbols stretch the search space. An attacker must search through 
            them all, but they contain no information—they're "void space."
          </p>
          <p>
            <strong className="text-blue-400">The Big Bang (Session Start):</strong> At t=0, the ring is 
            small (32 symbols). As time progresses, it expands exponentially. By byte 1000, the ring might 
            contain 10,000 symbols—99% of which are entropy.
          </p>
          <p className="text-cyan-400 italic">
            "The attacker must search an ever-expanding universe, while you only need to navigate the 
            known coordinates (the deterministic seed)."
          </p>
        </CardContent>
      </Card>

      {/* Technical Details */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-lg">Technical Implementation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-purple-400 mb-2">Symbol Encoding Format</h4>
              <div className="bg-slate-950 border border-slate-700 rounded-lg p-3 font-mono text-xs text-slate-300">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-500">// Core32 (Mass)</span><br />
                    <span className="text-purple-400">KO-01</span> <span className="text-slate-500">→ 0x4B4F</span><br />
                    <span className="text-purple-400">TA-07</span> <span className="text-slate-500">→ 0x5441</span><br />
                  </div>
                  <div>
                    <span className="text-slate-500">// Expansion (Dark Energy)</span><br />
                    <span className="text-cyan-400">~ZO-33</span> <span className="text-slate-500">→ 0x7E5A4F</span><br />
                    <span className="text-cyan-400">~GA-42</span> <span className="text-slate-500">→ 0x7E4741</span><br />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-cyan-400 mb-2">Deterministic Expansion</h4>
              <div className="bg-slate-950 border border-slate-700 rounded-lg p-3 font-mono text-xs text-slate-300">
                epoch(n) = ⌊byte_index / expansion_rate⌋<br />
                ring_size(epoch) = 32 + (epoch × injection_rate)<br />
                symbol_set(epoch) = Core32 + ExpansionRunes[0..ring_size-32]
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-blue-400 mb-2">Security Properties</h4>
              <ul className="text-sm text-slate-300 space-y-1 list-disc list-inside">
                <li>Attacker doesn't know which symbols are entropy vs. data</li>
                <li>Every epoch requires re-learning the symbol mapping</li>
                <li>Brute forcing requires O(ring_size<sup>message_length</sup>) attempts</li>
                <li>As message_length grows, ring_size grows exponentially</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
