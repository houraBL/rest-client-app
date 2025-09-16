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
  return (
    <>
      <label htmlFor={label} className="block text-sm font-medium ">
        {label}
      </label>
      <input
        id={label}
        type={type}
        className="input input-accent w-full"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
      />
      {error && <p className="text-red-500 m-0 text-xs ">{error}</p>}
    </>
  );
};
