/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';
import { fetchHero, fetchMultiple } from '../api';

interface HeroGraphProps {
    heroId: number | null;
}

const HeroGraph: React.FC<HeroGraphProps> = ({ heroId }) => {
    const [nodes, setNodes] = useState<any[]>([]);
    const [edges, setEdges] = useState<any[]>([]);

    const loadData = useCallback(async () => {
        if (!heroId) return;

        // load hero details
        const hero = await fetchHero(heroId);

        // load films of the hero
        const films = await fetchMultiple('films', hero.films);

        // get starship IDs of the hero
        const heroStarshipIds = (hero.starships || [])
            .map((s: string | number) =>
                typeof s === 'string' && s.includes('/')
                    ? s.split('/').filter(Boolean).pop()
                    : String(s)
            )
            .filter(Boolean);

        let starships: any[] = [];

        // if hero has starships, load them for films
        if (heroStarshipIds.length > 0) {
            const heroShipIdsSet = new Set(heroStarshipIds);

            const allStarships = await Promise.all(
                films.map(async (film: any) => {
                    const filmShipIds = (film.starships || [])
                        .map((s: string | number) =>
                            typeof s === 'string' && s.includes('/')
                                ? s.split('/').filter(Boolean).pop()
                                : String(s)
                        )
                        .filter((id: number) => heroShipIdsSet.has(id));

                    return fetchMultiple('starships', filmShipIds);
                })
            );

            starships = Array.from(
                new Map(allStarships.flat().map((s) => [s.id, s])).values()
            );
        }

        // build nodes and edges
        const newNodes: any[] = [
            {
                id: `hero-${hero.id}`,
                data: { label: hero.name },
                position: { x: 0, y: 0 },
                type: 'input',
            },
        ];

        const newEdges: any[] = [];

        // films  for hero
        films.forEach((film: any, idx: number) => {
            const filmNodeId = `film-${film.id}`;
            newNodes.push({
                id: filmNodeId,
                data: { label: film.title },
                position: { x: 0, y: (idx + 1) * 200 },
            });
            newEdges.push({
                id: `edge-hero-${hero.id}-film-${film.id}`,
                source: `hero-${hero.id}`,
                target: filmNodeId,
            });

            // starships for film (if any)
            if (starships.length > 0) {
                starships
                    .filter((s) => film.starships.includes(s.id))
                    .forEach((ship, sIdx) => {
                        const shipNodeId = `ship-${ship.id}`;
                        if (!newNodes.find((n) => n.id === shipNodeId)) {
                            newNodes.push({
                                id: shipNodeId,
                                data: { label: ship.name },
                                position: { x: (sIdx + 1) * 200, y: (idx + 1) * 250 },
                            });
                        }
                        newEdges.push({
                            id: `edge-film-${film.id}-ship-${ship.id}`,
                            source: filmNodeId,
                            target: shipNodeId,
                        });
                    });
            }
        });

        setNodes(newNodes);
        setEdges(newEdges);
    }, [heroId]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    if (!heroId) return <div className="text-gray-500 p-4">Choose the hero</div>;

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <ReactFlow nodes={nodes} edges={edges} fitView>
                <Background />
                <Controls />
                <MiniMap />
            </ReactFlow>
        </div>
    );
};

export default HeroGraph;
