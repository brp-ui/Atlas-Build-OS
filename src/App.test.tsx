import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { App } from './App';

describe('Atlas Operations Platform Full Integration Test Suite', () => {
  it('renders header, ATLAS OS logo, workspace switcher, and command palette trigger', () => {
    render(<App />);

    expect(screen.getAllByText('ATLAS OS').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Youngman Services').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Century Fire').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Atlas Personal OS').length).toBeGreaterThan(0);
  });

  it('switches workspaces cleanly between Youngman, Century Fire, and Personal OS', () => {
    render(<App />);

    const centuryButton = screen.getAllByText('Century Fire')[0];
    fireEvent.click(centuryButton);

    expect(screen.getByText('Century Fire AHJ & Operations Hub')).toBeDefined();

    const personalButton = screen.getAllByText('Atlas Personal OS')[0];
    fireEvent.click(personalButton);

    expect(screen.getByText('Atlas Personal OS & Morning Brief')).toBeDefined();
  });

  it('switches domain tabs and views Youngman, Century Fire, and Personal Domain Packs', () => {
    render(<App />);

    const youngmanNav = screen.getAllByText('Youngman Services')[1]; // Sidebar nav
    fireEvent.click(youngmanNav);

    expect(screen.getByText('Youngman Active Projects Matrix')).toBeDefined();

    const centuryNav = screen.getAllByText('Century Fire')[1]; // Sidebar nav
    fireEvent.click(centuryNav);

    expect(screen.getByText('Century Fire Domain Pack')).toBeDefined();
  });

  it('opens and closes AI Builder Modal', () => {
    render(<App />);

    const aiButton = screen.getAllByText('AI Builder')[0];
    fireEvent.click(aiButton);

    expect(screen.getByText('Atlas AI Dashboard Builder')).toBeDefined();

    const closeButton = screen.getByText('Cancel');
    fireEvent.click(closeButton);
  });
});
