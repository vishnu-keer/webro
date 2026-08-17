import type { KnowledgeEntry } from '@/types';
import { knowledgeBase, fallbackAnswer } from './knowledge-base';

const PHRASE_EXACT = 6;
const PHRASE_PARTIAL = 4;
const WORD_EXACT = 3;
const WORD_PARTIAL = 1.5;
const MIN_CONFIDENCE = 1.5;

/** Short keywords must match whole words. Without this, "yo" matched inside
 *  "you" and "us" inside "custom", producing confidently wrong answers. */
const MIN_SUBSTRING_LENGTH = 5;

function normalise(input: string): string {
  return ` ${input.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim()} `;
}

/** Whole-word match, tolerating simple plurals ("app" also matches "apps"). */
function matchesWord(haystack: string, keyword: string): boolean {
  return (
    haystack.includes(` ${keyword} `) ||
    haystack.includes(` ${keyword}s `) ||
    haystack.includes(` ${keyword}es `)
  );
}

function score(query: string, entry: KnowledgeEntry): number {
  return entry.keywords.reduce((total, keyword) => {
    const isPhrase = keyword.includes(' ');

    if (matchesWord(query, keyword)) {
      return total + (isPhrase ? PHRASE_EXACT : WORD_EXACT);
    }
    if (keyword.length >= MIN_SUBSTRING_LENGTH && query.includes(keyword)) {
      return total + (isPhrase ? PHRASE_PARTIAL : WORD_PARTIAL);
    }
    return total;
  }, 0);
}

/** Best-scoring answer, or the handoff message when confidence is too low. */
export function findAnswer(input: string): string {
  const query = normalise(input);

  let best: KnowledgeEntry | undefined;
  let bestScore = 0;

  for (const entry of knowledgeBase) {
    const entryScore = score(query, entry);
    if (entryScore > bestScore) {
      bestScore = entryScore;
      best = entry;
    }
  }

  return best && bestScore >= MIN_CONFIDENCE ? best.answer : fallbackAnswer;
}
