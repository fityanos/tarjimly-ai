/**
 * CLI argument parsing utilities for Tarjimly.
 * Supports robust extraction of text, from, and to arguments, including multi-word language names.
 */
import languageNames from "./languageNames.js";

// Build a set of all possible language names and codes (lowercase)
const allLangs = new Set([
  ...Object.keys(languageNames),
  ...Object.values(languageNames).map(n => n.toLowerCase())
]);

/**
 * Parses CLI positional arguments to extract text, from, and to, supporting multi-word language names.
 * @param {string[]} args - Positional arguments from CLI
 * @returns {{text: string, fromInput: string, toInput: string}}
 */
export function parseArgs(args) {
  // Try all possible splits for the last two arguments
  for (let i = args.length - 1; i > 0; i--) {
    const toCandidate = args.slice(i).join(' ').toLowerCase();
    if (allLangs.has(toCandidate)) {
      for (let j = i - 1; j > 0; j--) {
        const fromCandidate = args.slice(j, i).join(' ').toLowerCase();
        if (allLangs.has(fromCandidate)) {
          const text = args.slice(0, j).join(' ');
          return { text, fromInput: fromCandidate, toInput: toCandidate };
        }
      }
    }
  }
  // fallback: treat last two as from/to
  return {
    text: args.slice(0, args.length - 2).join(' '),
    fromInput: args[args.length - 2],
    toInput: args[args.length - 1]
  };
} 