/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { HeroGraph } from '../components/HeroGraph';

vi.mock('../api', () => ({
    fetchResource: vi.fn((url: string) => {
        if (url.includes('films')) return Promise.resolve({ title: 'A New Hope', url, starships: ['ship1'] });
        return Promise.resolve({ name: 'X-Wing', url });
    }),
    idFromUrl: (u: string) => u
}));

describe('HeroGraph', () => {
    it('renders graph nodes for hero', async () => {
        const hero = { name: 'Luke', url: 'hero1', films: ['films/1'] } as any;
        render(<HeroGraph hero={hero} />);
        expect(await screen.findByText('A New Hope')).toBeTruthy();
    });
});