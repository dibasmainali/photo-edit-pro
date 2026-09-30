import { describe, expect, it } from 'vitest';
import { calculateBatchSavings, filterValidFiles } from './image-utils';

describe('filterValidFiles', () => {
  it('accepts supported image and PDF files when allowed by the uploader', () => {
    const image = new File(['image-data'], 'photo.png', { type: 'image/png' });
    const pdf = new File(['%PDF-1.4'], 'notes.pdf', { type: 'application/pdf' });

    expect(filterValidFiles([image, pdf], 'image/*,application/pdf')).toEqual([image, pdf]);
  });

  it('rejects unsupported file types and oversized files', () => {
    const textFile = new File(['hello'], 'notes.txt', { type: 'text/plain' });
    const oversized = new File(['x'.repeat(20 * 1024 * 1024)], 'large.png', { type: 'image/png' });

    expect(filterValidFiles([textFile], 'image/*')).toEqual([]);
    expect(filterValidFiles([oversized], 'image/*')).toEqual([]);
  });
});

describe('calculateBatchSavings', () => {
  it('sums original and processed sizes and computes the percentage saved', () => {
    expect(calculateBatchSavings([
      { originalSize: 1000, processedSize: 400 },
      { originalSize: 2000, processedSize: 600 },
    ])).toEqual({
      totalOriginal: 3000,
      totalProcessed: 1000,
      percentSaved: 67,
    });
  });
});
