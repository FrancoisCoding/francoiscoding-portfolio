import { atom } from 'jotai';

import type { TLeadStatus } from '@/lib/admin/lead-constants';

export const leadSearchAtom = atom('');
export const leadCompanyFilterAtom = atom('');
export const leadTagFilterAtom = atom('');
export const leadStatusFilterAtom = atom<TLeadStatus | 'ALL'>('ALL');
export const leadViewModeAtom = atom<'table' | 'cards'>('table');
