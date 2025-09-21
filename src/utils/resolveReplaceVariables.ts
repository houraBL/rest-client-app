import { ClientState } from '@/store/clientSlice';
import { getFinalUrl } from './getFinalUrl';

export function resolveReplaceVariables(clientState: ClientState) {
  const { url, headers, body, variables, bodyHeader, method } = clientState;

  const replaceVariables = ({
    stringToReplace,
  }: {
    stringToReplace: string;
  }): string => {
    if (!stringToReplace) return stringToReplace;
    const reg = /{{\s*([^}\s]+)\s*}}/g;

    return stringToReplace.replace(reg, (matchStr, text) => {
      if (variables[text] !== undefined) {
        return variables[text] as string;
      }
      return matchStr;
    });
  };

  const finalUrlValue = replaceVariables({ stringToReplace: url });

  const finalHeaders: Record<string, string> = {};

  Object.entries(headers).forEach(([key, value]) => {
    const finalKey = replaceVariables({ stringToReplace: key });
    const finalValue = replaceVariables({ stringToReplace: value });
    finalHeaders[finalKey] = finalValue;
  });

  const finalBody =
    method === 'GET'
      ? undefined
      : replaceVariables({
          stringToReplace: body,
        });

  if (finalBody) {
    finalHeaders['Content-Type'] = bodyHeader;
  }

  const finalURL = getFinalUrl({
    ...clientState,
    url: finalUrlValue,
    headers: finalHeaders,
    body: finalBody || '',
  });

  return {
    url: finalUrlValue,
    headers: finalHeaders,
    body: finalBody,
    method,
    finalURL,
  };
}
