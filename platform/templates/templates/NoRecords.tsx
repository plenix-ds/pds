import { EmptyState } from '../../components/EmptyState/EmptyState.tsx';
import { useWords } from './words.ts';
export function NoRecords({ strings, empty }: any) { const t = useWords(strings); return empty || <EmptyState title={t.empty}>{t.emptyDescription}</EmptyState>; }
