/**
 * Pure label formatting for <__ELEMENT__>: trim and collapse internal
 * whitespace. Kept in `src/lib` and unit-tested in isolation — the component is
 * only a thin renderer over helpers like this.
 */
export const formatLabel = (raw: string): string => raw.trim().replace(/\s+/g, ' ');
