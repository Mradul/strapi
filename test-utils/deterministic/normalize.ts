/**
 * Normalizes volatile fields for stable snapshots.
 * Maps id/documentId/timestamps to placeholders so
 * snapshot comparisons are not flaky across runs.
 */

const VOLATILE_FIELDS = new Set([
  'id',
  'documentId',
  'createdAt',
  'updatedAt',
  'publishedAt',
]);

export const normalize = (obj: any): any => {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) {
    return obj.map(normalize);
  }
  if (typeof obj === 'object') {
    const normalized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (VOLATILE_FIELDS.has(key)) {
        if (key === 'id' && typeof value === 'number') {
          normalized[key] = 0;
        } else if (key === 'documentId' && typeof value === 'string') {
          normalized[key] = 'normalized-documentId';
        } else if (key.endsWith('At') && typeof value === 'string') {
          normalized[key] = '1970-01-01T00:00:00.000Z';
        } else {
          normalized[key] = normalize(value);
        }
      } else {
        normalized[key] = normalize(value);
      }
    }
    return Object.keys(normalized)
      .sort()
      .reduce((acc: any, k) => {
        acc[k] = normalized[k];
        return acc;
      }, {});
  }
  return obj;
};

export const normalizeChangeRecord = (record: any) => {
  if (!record) return record;
  const copy = { ...record };
  if (copy.id) copy.id = 0;
  if (copy.documentId) copy.documentId = 'normalized-doc-id';
  if (copy.performedAt) copy.performedAt = '1970-01-01T00:00:00.000Z';
  if (copy.createdAt) copy.createdAt = '1970-01-01T00:00:00.000Z';
  if (copy.updatedAt) copy.updatedAt = '1970-01-01T00:00:00.000Z';
  return normalize(copy);
};
