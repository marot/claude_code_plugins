import { describe, it, expect } from 'vitest';
import { formatFlow } from '../src/lib/formatter';

describe('formatFlow', () => {
  it('should add header if missing', () => {
    const input = 'tapOn: button';
    const result = formatFlow(input);
    expect(result).toBe('appId: any\n---\n- tapOn: button\n');
  });

  it('should preserve existing header', () => {
    const input = 'appId: com.example\n---\ntapOn: button';
    const result = formatFlow(input);
    expect(result).toContain('appId: com.example');
    expect(result).toContain('---');
    expect(result).toContain('- tapOn: button');
  });

  it('should add dash prefix to commands', () => {
    const input = 'tapOn: button\nscroll';
    const result = formatFlow(input);
    expect(result).toContain('- tapOn: button');
    expect(result).toContain('- scroll');
  });

  it('should not duplicate dash prefix', () => {
    const input = '- tapOn: button\n- scroll';
    const result = formatFlow(input);
    expect(result).toBe('appId: any\n---\n- tapOn: button\n- scroll\n');
  });

  it('should remove empty lines', () => {
    const input = '\n\ntapOn: button\n\n\nscroll\n\n';
    const result = formatFlow(input);
    expect(result).not.toContain('\n\n');
  });

  it('should handle empty input', () => {
    const input = '';
    const result = formatFlow(input);
    expect(result).toBe('appId: any\n---\n');
  });

  it('should handle complex header', () => {
    const input = `appId: com.example
env:
  VAR: value
---
tapOn: button`;
    const result = formatFlow(input);
    expect(result).toContain('appId: com.example');
    expect(result).toContain('VAR: value');
    expect(result).toContain('---');
    expect(result).toContain('- tapOn: button');
  });
});
