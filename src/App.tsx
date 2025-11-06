import { useState } from 'react';
import { HeroGraph } from './components/HeroGraph';
import { HeroList } from './components/HeroList';
import type { Hero } from './types';

export default function App() {
  const [selected, setSelected] = useState<Hero | null>(null);

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }} className="app-layout">
      <HeroList onSelect={setSelected} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={{ padding: 12, borderBottom: '1px solid #eee' }}>
          <h2>Star Wars Graph Explorer</h2>
        </header>
        <main style={{ flex: 1 }}>
          <HeroGraph hero={selected} />
        </main>
      </div>
    </div>
  );
}