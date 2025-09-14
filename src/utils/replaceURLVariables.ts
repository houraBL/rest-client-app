type ReplaceArgs = {
  input: string;
  variables: Record<string, string | undefined>;
};

export const replaceURLVariables = ({
  input,
  variables,
}: ReplaceArgs): string => {
  if (!input) return input;

  const reg = /{{\s*([^}\s]+)\s*}}/g;

  return input.replace(reg, (matchStr, text) => {
    if (variables[text] !== undefined) {
      return variables[text] as string;
    }

    return matchStr;
  });
};
