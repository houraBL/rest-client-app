export function formatXml(xml: string, onError: () => void): string {
  const indent = '  ';
  try {
    const reg = /(>)(<)(\/*)/g;
    const formatted = xml
      .replace(reg, '$1\r\n$2$3')
      .split('\r\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    let pad = 0;
    const result = formatted
      .map((line) => {
        let currentPad = pad;
        if (/^<\/[^>]+>/.test(line)) {
          if (pad > 0) {
            currentPad = --pad;
          }
        }

        const padding = indent.repeat(currentPad);
        if (/^<[^!?][^>]*[^/>]>$/.test(line)) {
          pad++;
        }

        return padding + line;
      })
      .join('\n');
    if (result === xml) {
      onError();
    }
    return result;
  } catch {
    onError();
    return xml;
  }
}
