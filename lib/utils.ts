// Utility functions

/**
 * Combines conditional class names into a single string
 * 
 * @param inputs - Class name strings or objects where key is class name and value is boolean
 * @returns string of combined class names
 */
export function cn(...inputs: (string | undefined | null | boolean | { [key: string]: boolean })[]) {
  return inputs
    .filter(Boolean)
    .map((input) => {
      if (typeof input === 'string') return input;
      if (typeof input === 'object') {
        return Object.entries(input)
          .filter(([_, value]) => Boolean(value))
          .map(([key]) => key)
          .join(' ');
      }
      return '';
    })
    .join(' ');
}