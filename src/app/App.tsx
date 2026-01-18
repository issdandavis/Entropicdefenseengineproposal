import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Card } from './components/ui/card';
import { QuantumRaceSimulation } from './components/QuantumRaceSimulation';
import { MathematicalProof } from './components/MathematicalProof';
import { SpiralRingDemo } from './components/SpiralRingDemo';
import { MarsScenario } from './components/MarsScenario';
import { ChemistryAgent } from './components/ChemistryAgent';
import { RealWorldApplications } from './components/RealWorldApplications';
import { AcademicValidation } from './components/AcademicValidation';
import { PatentShowcase } from './components/PatentShowcase';
import { SystemTest } from './components/SystemTest';
import { Atom, Brain, Radio, Orbit, FlaskConical, Lightbulb, BookOpen, Scale, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('validation');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Atom className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Entropic Defense Engine
              </h1>
              <p className="text-slate-400">
                Information-Theoretic Security via Exponential Expansion
              </p>
            </div>
          </div>
          <div className="mt-4 flex gap-3 text-sm">
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Quantum-Resistant
            </span>
            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Post-Quantum Cryptography
            </span>
            <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
              SpiralRing-64
            </span>
            <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
              System Validated
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-9 bg-slate-900/50 border border-slate-800">
            <TabsTrigger value="validation" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400">
              <ShieldCheck className="h-4 w-4 mr-2" />
              Test
            </TabsTrigger>
            <TabsTrigger value="patent" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400">
              <Scale className="h-4 w-4 mr-2" />
              Patent
            </TabsTrigger>
            <TabsTrigger value="applications" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <Lightbulb className="h-4 w-4 mr-2" />
              Apps
            </TabsTrigger>
            <TabsTrigger value="research" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
              <BookOpen className="h-4 w-4 mr-2" />
              Research
            </TabsTrigger>
            <TabsTrigger value="simulation" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <Brain className="h-4 w-4 mr-2" />
              Sim
            </TabsTrigger>
            <TabsTrigger value="proof" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
              <Atom className="h-4 w-4 mr-2" />
              Proof
            </TabsTrigger>
            <TabsTrigger value="spiral" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
              <Orbit className="h-4 w-4 mr-2" />
              Ring
            </TabsTrigger>
            <TabsTrigger value="chemistry" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400">
              <FlaskConical className="h-4 w-4 mr-2" />
              Chem
            </TabsTrigger>
            <TabsTrigger value="mars" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400">
              <Radio className="h-4 w-4 mr-2" />
              Mars
            </TabsTrigger>
          </TabsList>

          <TabsContent value="validation" className="mt-6">
            <SystemTest />
          </TabsContent>

          <TabsContent value="applications" className="mt-6">
            <RealWorldApplications />
          </TabsContent>

          <TabsContent value="research" className="mt-6">
            <AcademicValidation />
          </TabsContent>

          <TabsContent value="simulation" className="mt-6">
            <QuantumRaceSimulation />
          </TabsContent>

          <TabsContent value="proof" className="mt-6">
            <MathematicalProof />
          </TabsContent>

          <TabsContent value="spiral" className="mt-6">
            <SpiralRingDemo />
          </TabsContent>

          <TabsContent value="chemistry" className="mt-6">
            <ChemistryAgent />
          </TabsContent>

          <TabsContent value="mars" className="mt-6">
            <MarsScenario />
          </TabsContent>

          <TabsContent value="patent" className="mt-6">
            <PatentShowcase />
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center text-slate-500 text-sm">
          <p>
            Entropic Defense Engine™ — Where the target moves faster than the search beam.
          </p>
        </div>
      </div>
    </div>
  );
}