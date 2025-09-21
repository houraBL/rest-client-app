import { historyEntry } from '@/lib/validation/historyEntry';
import { FormFields } from '../History';
import HistoryRow from './HistoryRow/HistoryRow';

interface Props {
  columns: { key: keyof FormFields; label: string }[];
  history: { id: string; request: unknown }[];
}

export default function HistoryTable({ columns, history }: Props) {
  return (
    <table className="table table-pin-rows table-zebra">
      <thead>
        <tr className="bg-base-300">
          {columns.map((col) => {
            if (col.key === 'uid') return null;
            return <th key={col.key}>{col.label}</th>;
          })}
        </tr>
      </thead>
      <tbody>
        {history.map((entry) => {
          const parsed = historyEntry.safeParse(entry.request);
          if (!parsed.success) {
            return null;
          }
          return (
            <HistoryRow
              key={entry.id}
              columns={columns}
              data={parsed.data}
              entryId={entry.id}
            />
          );
        })}
      </tbody>
    </table>
  );
}
