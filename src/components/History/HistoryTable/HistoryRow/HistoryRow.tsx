import { FormFields } from '../../History';
import HistoryCell from '../HistoryCell/HistoryCell';

interface Props {
  columns: { key: keyof FormFields; label: string }[];
  data: FormFields;
  entryId: string;
}

export default function HistoryRow({ columns, data, entryId }: Props) {
  return (
    <tr key={entryId}>
      {columns.map((col) => (
        <HistoryCell key={col.key} colKey={col.key} data={data} />
      ))}
    </tr>
  );
}
