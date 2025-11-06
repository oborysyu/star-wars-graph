import { render } from '@testing-library/react';
import { fireEvent, screen } from '@testing-library/dom';
import { describe, it, expect, vi } from 'vitest';
import { HeroList } from '../components/HeroList';

vi.mock('../api', () => ({
  fetchHeroesPage: vi.fn(() => Promise.resolve({ results: [{ name: 'Luke Skywalker', url: '1' }] }))
}));

describe('HeroList', () => {
  it('renders heroes and triggers onSelect', async () => {
    const onSelect = vi.fn();
    render(<HeroList onSelect={onSelect} />);
    const hero = await screen.findByText('Luke Skywalker');
    fireEvent.click(hero);
    expect(onSelect).toHaveBeenCalled();
  });
});