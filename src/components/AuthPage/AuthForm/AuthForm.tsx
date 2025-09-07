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
}: AuthFormProps) => {
  return (
    <form
      data-testid="form"
      className="flex flex-col gap-4"
      onSubmit={handleSubmit}
    >
      {!isLogin && (
        <InputField
          label="Name"
          value={name}
          onChange={setName}
          placeholder="Enter your name"
          error={errors.name}
        />
      )}
      <InputField
        label="Email"
        value={email}
        onChange={setEmail}
        placeholder="Enter your email"
        error={errors.email}
      />
      <InputField
        type="password"
        label="Password"
        value={password}
        onChange={setPassword}
        placeholder="Enter your password"
        error={errors.password}
      />
      <button
        type="submit"
        className="btn btn-info mt-5"
        disabled={isSubmitting}
      >
        {isLogin ? 'Sign In' : 'Sign Up'}
      </button>
    </form>
  );
};
