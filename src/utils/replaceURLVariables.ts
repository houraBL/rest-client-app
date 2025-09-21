type ReplaceArgs = {
  stringToReplace: string;
  variables: Record<string, string | undefined>;
};

export const replaceURLVariables = ({
  stringToReplace,
  variables,
}: ReplaceArgs): string => {
  if (!stringToReplace) return stringToReplace;

  const reg = /{{\s*([^}\s]+)\s*}}/g;

  return stringToReplace.replace(reg, (matchStr, text) => {
    if (variables[text] !== undefined) {
      return variables[text] as string;
    }

    return matchStr;
  });
};
