import { describe, it, expect } from 'vitest';
import { getGreeting } from './dashboardUtils';

function at(hour, minute = 0) {
  const d = new Date(2026, 5, 1, hour, minute);
  return d;
}

describe('getGreeting', () => {
  it('says good night in the early hours', () => {
    expect(getGreeting(at(1, 18))).toBe('Good night');
    expect(getGreeting(at(0))).toBe('Good night');
    expect(getGreeting(at(4, 59))).toBe('Good night');
  });

  it('says good morning from 5am to noon', () => {
    expect(getGreeting(at(5))).toBe('Good morning');
    expect(getGreeting(at(11, 30))).toBe('Good morning');
  });

  it('says good afternoon from noon to 5pm', () => {
    expect(getGreeting(at(12))).toBe('Good afternoon');
    expect(getGreeting(at(16))).toBe('Good afternoon');
  });

  it('says good evening from 5pm to 9pm', () => {
    expect(getGreeting(at(17))).toBe('Good evening');
    expect(getGreeting(at(20, 30))).toBe('Good evening');
  });

  it('says good night from 9pm onward', () => {
    expect(getGreeting(at(21))).toBe('Good night');
    expect(getGreeting(at(23))).toBe('Good night');
  });
});
