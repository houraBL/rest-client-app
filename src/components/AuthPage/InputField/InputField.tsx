import { useTranslations } from 'next-intl';

type InputFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  placeholder: string;
  disabled: boolean;
};

export const InputField = ({
  label,
  value,
  onChange,
  error,
  type = 'text',
  placeholder,
  disabled,
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
        disabled={disabled}
      />
      {error && <p className="text-red-500 m-0 text-xs ">{error}</p>}
    </>
  );
};
