import { requestHistory } from '@/lib/firebase/requestHistory';
import { historyEntry } from '@/lib/validation/historyEntry';
import React from 'react';
import z from 'zod';
import HistoryTable from './HistoryTable/HistoryTable';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export type FormFields = z.infer<typeof historyEntry>;
export type FieldKey = keyof FormFields;

export default async function History() {
  const t = await getTranslations('History');
  const { error, history } = await requestHistory();
  const columns: { key: keyof FormFields; label: string }[] = [
    { key: 'requestTimestamp', label: t('requestTimestamp') },
    { key: 'requestMethod', label: t('requestMethod') },
    { key: 'endpointUrl', label: t('endpointUrl') },
    { key: 'responseStatusCode', label: t('responseStatusCode') },
    { key: 'requestDuration', label: t('requestDuration') },
    { key: 'requestSize', label: t('requestSize') },
    { key: 'responseSize', label: t('responseSize') },
    { key: 'errorDetails', label: t('errorDetails') },
  ];

  return (
    <div className="max-w-screen mx-auto sm:px-6 pb-6">
      <div className="rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold m-4 mx-auto w-fit">
          {t('historyTitle')}
        </h2>
        {error && <div>{error}</div>}
        {history.length === 0 && (
          <div className="flex flex-col items-center gap-4">
            <h3 className="text-base font-normal">{t('emptyHistory')}</h3>
            <Link href="/client" className="btn btn-primary">
              <span className="w-fit">{t('client')}</span>
            </Link>
          </div>
        )}
        {history.length > 0 && (
          <div className="h-100 overflow-x-auto overflow-y-auto mx-6">
            <HistoryTable columns={columns} history={history} />
          </div>
        )}
      </div>
    </div>
  );
}
