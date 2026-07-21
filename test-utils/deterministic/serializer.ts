/**
 * Canonical JSON serializer with sorted keys.
 * Produces byte-identical output for the same input,
 * useful for stable snapshot files and deterministic
 * comparisons.
 */

export const canonicalStringify = (obj: any): string => {
  if (obj === null || obj === undefined) return JSON.stringify(obj);
  if (Array.isArray(obj)) {
    return '[' + obj.map(canonicalStringify).join(',') + ']';
  }
  if (typeof obj === 'object') {
    const keys = Object.keys(obj).sort();
    return (
      '{' +
      keys
        .map((k) => JSON.stringify(k) + ':' + canonicalStringify(obj[k]))
        .join(',') +
      '}'
    );
  }
  return JSON.stringify(obj);
};

export const serializeChangeSet = (changeSet: any): string => {
  return canonicalStringify(changeSet);
};

export const deserializeChangeSet = (str: string): any => {
  return JSON.parse(str);
};
