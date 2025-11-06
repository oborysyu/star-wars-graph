import { render, screen, waitFor } from '@testing-library/react';
import { HeroGraph } from '../components/HeroGraph';
import * as api from '../api';
import type { Hero } from '../types';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('HeroGraph', () => {
  const mockHero: Hero = {
    id: 1,
    name: 'Luke Skywalker',
    films: ["1"],
    starships: [],
    url: '1',
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('render graph with films and ships of hero', async () => {
    vi.spyOn(api, 'fetchMultiple').mockImplementation((type) => {
      if (type === 'films') {
        return Promise.resolve([
          { id: 1, title: 'A New Hope', starships: [2] },
        ]);
      }
      if (type === 'starships') {
        return Promise.resolve([
          { id: 2, name: 'X-wing' },
        ]);
      }
      return Promise.resolve([]);
    });

    render(<HeroGraph hero={mockHero} />);

    await waitFor(() => {
      expect(screen.queryByText(/A New Hope/i)).toBeTruthy();
      expect(screen.queryByText(/X-wing/i)).toBeTruthy();
    });
  });
});
