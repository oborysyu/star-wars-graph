import { useEffect, useState } from 'react';
import ReactFlow, { Background, Controls, MiniMap, type Edge, type Node } from 'reactflow';
import 'reactflow/dist/style.css';
import type { Film, Hero, Starship } from '../types';
import { fetchMultiple } from '../api';


export function HeroGraph({ hero }: { hero: Hero }) {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);


    useEffect(() => {
        if (!hero) return;


        async function loadData() {
            try {
                const filmIds = hero.films.map((f: string | number) =>
                    typeof f === 'string' && f.includes('/') ? f.split('/').pop() : f
                ).filter(Boolean) as (string | number)[];
                const films = (await fetchMultiple('films', filmIds)) as Film[];


                const heroNode: Node = {
                    id: 'hero',
                    position: { x: 250, y: 0 },
                    data: { label: hero.name },
                    type: 'input',
                };


                const filmNodes: Node[] = (films as Film[]).map((film, i) => ({
                    id: `film-${film.id || i}`,
                    position: { x: i * 180, y: 150 },
                    data: { label: film.title },
                }));


                const filmEdges: Edge[] = (films as Film[]).map((film: Film, i: number) => ({
                    id: `e-hero-film-${i}`,
                    source: 'hero',
                    target: `film-${film.id || i}`,
                }));



                const allStarshipPromises = (films as Film[]).map((film: Film) => {
                    const shipIds = (film.starships || []).map((s: string | number) =>
                        typeof s === 'string' && s.includes('/') ? s.split('/').pop() : s
                    ).filter(Boolean) as (string | number)[];
                    return fetchMultiple('starships', shipIds);
                });


                const allStarships = await Promise.all(allStarshipPromises);


                const starshipNodes: Node[] = [];
                const starshipEdges: Edge[] = [];


                allStarships.forEach((ships, fi) => {
                    (ships as Starship[]).forEach((ship:Starship , si: number) => {
                        const nodeId = `starship-${fi}-${si}`;
                        starshipNodes.push({
                            id: nodeId,
                            position: { x: fi * 180 + si * 60, y: 300 },
                            data: { label: ship.name },
                        });
                        starshipEdges.push({
                            id: `e-film-${fi}-ship-${si}`,
                            source: `film-${films[fi].id || fi}`,
                            target: nodeId,
                        });
                    });
                });


                setNodes([heroNode, ...filmNodes, ...starshipNodes]);
                setEdges([...filmEdges, ...starshipEdges]);
            } catch (err) {
                console.error('Failed to load graph data:', err);
            }
        }


        loadData();
    }, [hero]);


    return (
        <div style={{ height: '100%', width: '100%' }}>
            <ReactFlow nodes={nodes} edges={edges} fitView>
                <Background />
                <MiniMap />
                <Controls />
            </ReactFlow>
        </div>
    );
}
