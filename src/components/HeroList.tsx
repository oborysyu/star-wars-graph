import { useEffect, useRef, useState } from 'react';
import { fetchHeroesPage } from '../api';
import type { Hero } from '../types';

export function HeroList({ onSelect }: { onSelect: (hero: Hero) => void }) {
    const [heroes, setHeroes] = useState<Hero[]>([]);
    const [page, setPage] = useState(1);
    const [next, setNext] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const loaderRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        fetchHeroesPage(page)
            .then((data) => {
                if (cancelled) return;
                const results = data.results ?? data.items ?? [];
                setHeroes((h) => [...h, ...results]);
                setNext(data.next ?? null);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
        return () => {
            cancelled = true;
        };
    }, [page]);

    useEffect(() => {
        if (!loaderRef.current) return;
        const obs = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !loading && next !== null) {
                    setPage((p) => p + 1);
                }
            });
        });
        obs.observe(loaderRef.current);
        return () => obs.disconnect();
    }, [loading, next]);

    return (
        <aside
            style={{
                width: 360,
                borderRight: '1px solid #ddd',
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
            }}
        >
            <header style={{ padding: 12, borderBottom: '1px solid #eee' }}>
                <h3 style={{ margin: 0 }}>Star Wars — Heroes</h3>
            </header>

            <div
                style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '0 12px',
                }}
            >
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {heroes.map((hero) => (
                        <li
                            key={hero.url}
                            style={{ padding: 8, borderBottom: '1px solid #eee' }}
                        >
                            <button
                                onClick={() => onSelect(hero)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    textAlign: 'left',
                                    width: '100%',
                                    cursor: 'pointer',
                                }}
                            >
                                <strong>{hero.name}</strong>
                            </button>
                        </li>
                    ))}
                </ul>
                <div
                    ref={loaderRef}
                    style={{ padding: 12, textAlign: 'center', fontSize: 13 }}
                >
                    {loading ? 'Loading...' : next ? 'Scroll to load more' : 'No more heroes'}
                </div>
            </div>
        </aside>
    );
}
