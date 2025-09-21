import { Link } from '@/i18n/navigation';
import { FieldKey, FormFields } from '../../History';
import { format } from 'date-fns';
import { encodeBase64 } from '@/utils/encodeBase64';

interface Props {
  colKey: FieldKey;
  data: FormFields;
}
export default function HistoryCell({ colKey, data }: Props) {
  if (colKey === 'requestTimestamp') {
    const ts = data.requestTimestamp;
    const date = new Date(ts.seconds * 1000);
    return (
      <td key={colKey} className="p-2">
        {format(date, 'dd MMM yyyy, kk:mm:ss')}
      </td>
    );
  }

  if (colKey === 'endpointUrl') {
    const m = data.requestMethod;
    const u = encodeBase64(data.endpointUrl);

    const finalURL = data.finalURL || `/client/${m}/${u}`;
    return (
      <td key={colKey} className="p-2">
        <Link href={`${finalURL}`}>
          <span className="link-primary">{data.endpointUrl}</span>
        </Link>
      </td>
    );
  }
  const value = data[colKey];
  return (
    <td key={colKey} className="p-2">
      {value != null ? String(value) : ''}
    </td>
  );
}
