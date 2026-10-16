import type { LoggedSet } from '@/core/models';
import { isWorkingSet } from '@/brain/exposure';

/**
 * R11 (D-A3-5b): the sets an exercise card counts as done: filled in and not a warm-up, typed or
 * saved. Train's card and Escobar's live read both use this, so the two counts cannot drift.
 */
export const countsAsDone = isWorkingSet;
export const doneSets = <T extends LoggedSet>(sets: readonly T[]): T[] => sets.filter(countsAsDone);
