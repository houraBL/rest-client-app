import { describe, it, expect, vi } from 'vitest';
import { formatXml } from './formatXml';

describe('formatXml', () => {
  it('formats a minified XML string', () => {
    const onError = vi.fn();
    const input = '<root><item>Value</item></root>';
    const output = formatXml(input, onError);

    expect(output).toBe(`<root>
  <item>Value</item>
</root>`);
    expect(onError).not.toHaveBeenCalled();
  });

  it('calls onError if XML is already formatted', () => {
    const onError = vi.fn();
    const input = `<root>
  <item>Value</item>
</root>`;
    const output = formatXml(input, onError);

    expect(output).toBe(input);
    expect(onError).toHaveBeenCalledTimes(1);
  });

  it('returns original XML and calls onError on malformed input', () => {
    const onError = vi.fn();
    const input = '<root>item>Value</root>';
    const output = formatXml(input, onError);

    expect(onError).toHaveBeenCalled();
    expect(typeof output).toBe('string');
  });
});
