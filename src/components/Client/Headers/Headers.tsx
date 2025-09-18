'use client';

import { GenericTable } from '@/components/GenericTable/GenericTable';
import useHeaders, { HeadersType } from '@/hooks/useHeaders/useHeaders';
import { useTranslations } from 'next-intl';

export default function Headers() {
  const {
    headers,
    newHeader,
    setNewHeader,
    addHeader,
    updateHeader,
    deleteHeader,
  } = useHeaders();

  const t = useTranslations('Headers');

  return (
    <div className="w-full text-start flex flex-col gap-2">
      <span className="text-xl px-2">{t('headersTitle')}</span>
      <GenericTable<HeadersType>
        items={headers}
        columns={[
          { key: 'name', label: t('header') },
          { key: 'initialValue', label: t('value') },
        ]}
        onChange={updateHeader}
        onDelete={deleteHeader}
        newItem={newHeader}
        setNewItem={(item) => setNewHeader(item)}
        onAdd={addHeader}
      />
    </div>
  );
}
