import { ClientState } from '@/store/clientSlice';
import { replaceURLVariables } from './replaceURLVariables';
import { getFinalUrl } from './getFinalUrl';

export function resolveReplaceVariables(clientState: ClientState) {
  const { url, headers, body, variables, bodyHeader, method } = clientState;

  const finalUrlValue = replaceURLVariables({
    stringToReplace: url,
    variables,
  });

  const finalHeaders: Record<string, string> = {};
  Object.entries(headers).forEach(([key, value]) => {
    const finalKey = replaceURLVariables({
      stringToReplace: key,
      variables,
    });

    const finalValue = replaceURLVariables({
      stringToReplace: value,
      variables,
    });

    finalHeaders[finalKey] = finalValue;
  });

  const finalBody = replaceURLVariables({
    stringToReplace: body,
    variables,
  });

  if (finalBody) {
    finalHeaders['Content-Type'] = bodyHeader;
  }

  const finalURL = getFinalUrl({
    ...clientState,
    url: finalUrlValue,
    headers: finalHeaders,
    body: finalBody,
  });

  return {
    url: finalUrlValue,
    headers: finalHeaders,
    body: finalBody,
    method,
    finalURL,
  };
}
