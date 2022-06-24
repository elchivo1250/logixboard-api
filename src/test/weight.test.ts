import { describe, it, expect } from '@jest/globals'
import { Tracing } from 'trace_events';
import * as weightConversion from '../utils/weight';

describe('Test weight conversion', () => {
  it.each([
    [1, 'GRAMS', 1],
    [1, 'KILOGRAMS', 1000],
    [1, 'POUNDS', 453.592],
    [1, 'OUNCES', 28.3495],
    [1, 'TON', 907185],
    [1, 'TONNE', 1000000],
  ])('converts units to grams correctly', (weight: number, unit: string, expected: number) => {
    expect(weightConversion.convertToGrams(weight, unit)).toBeCloseTo(expected, 2);
  });

  it.each([
    [1, 'GRAMS', 1],
    [1000, 'KILOGRAMS', 1],
    [453.592, 'POUNDS', 1],
    [28.3495, 'OUNCES', 1],
    [907185, 'TON', 1],
    [1000000, 'TONNE', 1],
  ])('converts units from grams correctly', (weight: number, unit: string, expected: number) => {
    expect(weightConversion.convertFromGrams(weight, unit)).toBeCloseTo(expected, 2);
  });

  it.each([
    [1, 'GRAMS', 'KILOGRAMS', 0.001],
    [1, 'KILOGRAMS', 'POUNDS', 2.2],
    [1, 'POUNDS', 'OUNCES', 16],
    [2, 'POUNDS', 'OUNCES', 32],
    [1, 'TON', 'POUNDS', 2000],
    [1, 'TONNE', 'POUNDS', 2204.62],
  ])('converts units between arbitrary units correctly', (weight: number, unitFrom: string, unitTo: string, expected: number) => {
    expect(weightConversion.convertWeight(weight, unitFrom, unitTo)).toBeCloseTo(expected, 2);
  });
  
  // test exceptions
});