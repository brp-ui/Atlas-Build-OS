import React, { useState } from 'react';
import { Store, Download, Upload, PackageCheck, Layers, Sparkles, Building, Flame, DollarSign, Check } from 'lucide-react';

export interface DomainBlueprint {
  id: string;
  name: string;
  category: 'Construction' | 'Specialty Trade' | 'Services' | 'Finance';
  version: string;
  description: string;
  author: string;
  price: string;
  entitiesCount: number;
  widgetsCount: number;
  installed: boolean;
}

const PRESET_BLUEPRINTS: DomainBlueprint[] = [
  {
    id: 'pack-youngman',
    name: 'Youngman Services Commercial Pack',
    category: 'Construction',
    version: '2.4.0',
    description: 'Turnkey enterprise blueprint for commercial general contractors with Estimating Calculator, Gantt Timelines, and WIP Revenue Recognition.',
    author: 'Atlas Master Architecture',
    price: 'Included',
    entitiesCount: 14,
    widgetsCount: 22,
    installed: true,
  },
  {
    id: 'pack-century',
    name: 'Century Fire Protection Pack',
    category: 'Specialty Trade',
    version: '1.8.0',
    description: 'Fire protection, AHJ sprinkler permitting, hydrostatic testing logs, and progress billing calculator.',
    author: 'Century OS Team',
    price: 'Included',
    entitiesCount: 9,
    widgetsCount: 16,
    installed: true,
  },
  {
    id: 'pack-roofing',
    name: 'Roofing Enterprise Commercial Blueprint',
    category: 'Specialty Trade',
    version: '1.0.0',
    description: 'Commercial flat roofing & membrane repair OS with drone site walks, weather alerts, and warranty tracking.',
    author: 'Atlas Commercial Store',
    price: '$2,499 / yr',
    entitiesCount: 11,
    widgetsCount: 18,
    installed: false,
  },
  {
    id: 'pack-hvac',
    name: 'HVAC & Mechanical Services Blueprint',
    category: 'Specialty Trade',
    version: '1.2.0',
    description: 'Preconstruction duct takeoff, chiller maintenance dispatch, and submittal review workflows.',
    author: 'Atlas Commercial Store',
    price: '$2,999 / yr',
    entitiesCount: 12,
    widgetsCount: 20,
    installed: false,
  },
];

export const DomainMarketplace: React.FC = () => {
  const [blueprints, setBlueprints] = useState<DomainBlueprint[]>(PRESET_BLUEPRINTS);
  const [importJson, setImportJson] = useState<string>('');
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);

  const toggleInstall = (id: string) => {
    setBlueprints(
      blueprints.map((bp) => (bp.id === id ? { ...bp, installed: !bp.installed } : bp))
    );
  };

  const handleExportWorkspacePack = () => {
    const packData = {
      platform: 'Atlas Adaptive Operations OS',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      blueprints: blueprints.filter((b) => b.installed),
    };

    const blob = new Blob([JSON.stringify(packData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `atlas-domain-pack-${Date.now()}.json`;
    a.click();
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-slate-900 p-5 border border-slate-800 rounded-2xl gap-4 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Enterprise Domain Blueprint Marketplace & Exporter</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Package workspace entities, financial calculators, and saved dashboard views into commercial $100K+ vertical domain packs.
          </p>
        </div>

        <button
          onClick={handleExportWorkspacePack}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md transition-all self-start md:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Active Blueprint Pack</span>
        </button>
      </div>

      {exportSuccess && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Domain blueprint bundle exported successfully as JSON!</span>
        </div>
      )}

      {/* Blueprint Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {blueprints.map((bp) => (
          <div key={bp.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 bg-slate-800 text-indigo-300 rounded border border-slate-700">
                {bp.category} • v{bp.version}
              </span>
              <span className="text-xs font-bold text-slate-200">{bp.price}</span>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white">{bp.name}</h4>
              <p className="text-xs text-slate-400 mt-1">{bp.description}</p>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-slate-400 pt-2 border-t border-slate-800/80">
              <div>Entities: <span className="text-slate-200 font-bold">{bp.entitiesCount}</span></div>
              <div>Widgets: <span className="text-slate-200 font-bold">{bp.widgetsCount}</span></div>
            </div>

            <button
              onClick={() => toggleInstall(bp.id)}
              className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                bp.installed
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-800/60'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              {bp.installed ? (
                <>
                  <PackageCheck className="w-4 h-4 text-emerald-400" />
                  <span>Installed & Operational</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Install Domain Blueprint</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
