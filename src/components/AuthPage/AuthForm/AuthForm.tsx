import { useTranslations } from 'next-intl';
import { InputField } from '../InputField/InputField';

type Errors = {
  name?: string;
  email?: string;
  password?: string;
};

type AuthFormProps = {
  isLogin: boolean;
  name: string;
  email: string;
  password: string;
  setName: (value: string) => void;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  errors: Errors;
  handleSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  isPending: boolean;
};

export const AuthForm = ({
  isLogin,
  name,
  email,
  password,
  setName,
  setEmail,
  setPassword,
  errors,
  handleSubmit,
  isSubmitting,
  isPending,
}: AuthFormProps) => {
  const t = useTranslations('Auth');

  return (
    <form
      data-testid="form"
      className="flex flex-col gap-4"
      onSubmit={handleSubmit}
    >
      {!isLogin && (
        <InputField
          label="nameLabel"
          value={name}
          onChange={setName}
          placeholder="namePlaceholder"
          error={errors.name}
          disabled={isSubmitting || isPending}
        />
      )}
      <InputField
        label="emailLabel"
        value={email}
        onChange={setEmail}
        placeholder="emailPlaceholder"
        error={errors.email}
        disabled={isSubmitting || isPending}
      />
      <InputField
        type="password"
        label="passwordLabel"
        value={password}
        onChange={setPassword}
        placeholder="passwordPlaceholder"
        error={errors.password}
        disabled={isSubmitting || isPending}
      />
      <button
        type="submit"
        className="btn btn-info mt-5"
        disabled={isSubmitting || isPending}
      >
        {isLogin ? t('signIn') : t('signUp')}
      </button>
    </form>
  );
};
