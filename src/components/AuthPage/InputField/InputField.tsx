import { useTranslations } from 'next-intl';

type InputFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  placeholder: string;
};

export const InputField = ({
  label,
  value,
  onChange,
  error,
  type = 'text',
  placeholder,
}: InputFieldProps) => {
  const t = useTranslations('Auth');

  return (
    <>
      <label htmlFor={label} className="block text-sm font-medium ">
        {t(label)}
      </label>
      <input
        id={label}
        type={type}
        className="input input-accent w-full"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t(placeholder)}
      />
      {error && <p className="text-red-500 m-0 text-xs ">{error}</p>}
    </>
  );
};
