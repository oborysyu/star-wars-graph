import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import HeroGraph from '../components/HeroGraph';
import { fetchHero, fetchMultiple } from '../api';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../api', () => ({
  fetchHero: vi.fn(),
  fetchMultiple: vi.fn(),
}));

describe('HeroGraph (simplified)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('display hero and films', async () => {
    vi.mocked(fetchHero).mockResolvedValueOnce({
      id: 20,
      name: 'Yoda',
      films: [1, 2],
      starships: [],
    });

    vi.mocked(fetchMultiple).mockImplementation((type: string) => {
      if (type === 'films') {
        return Promise.resolve([
          { id: 1, title: 'A New Hope', starships: [] },
          { id: 2, title: 'The Empire Strikes Back', starships: [] },
        ]);
      }
      return Promise.resolve([]);
    });

    render(<HeroGraph heroId={20} />);

    await waitFor(() => {
      expect(screen.getByText('Yoda')).toBeInTheDocument();
      expect(screen.getByText('A New Hope')).toBeInTheDocument();
      expect(screen.getByText('The Empire Strikes Back')).toBeInTheDocument();
    });
  });

  it('displays starships (if exist)', async () => {
    vi.mocked(fetchHero).mockResolvedValueOnce({
      id: 1,
      name: 'Luke Skywalker',
      films: [1],
      starships: [12],
    });

    vi.mocked(fetchMultiple).mockImplementation((type: string) => {
      if (type === 'films') {
        return Promise.resolve([
          { id: 1, title: 'A New Hope', starships: [12] },
        ]);
      }
      if (type === 'starships') {
        return Promise.resolve([{ id: 12, name: 'X-wing' }]);
      }
      return Promise.resolve([]);
    });

    render(<HeroGraph heroId={1} />);

    await waitFor(() => {
      expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
      expect(screen.getByText('A New Hope')).toBeInTheDocument();
      expect(screen.getByText('X-wing')).toBeInTheDocument();
    });
  });

  it('display nothing', () => {
    render(<HeroGraph heroId={null} />);
    expect(screen.getByText(/Choose the hero/i)).toBeInTheDocument();
  });
});
