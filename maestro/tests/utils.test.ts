import { describe, it, expect } from 'vitest';
import { expandHome } from '../src/lib/utils';
import os from 'os';

describe('utils', () => {
  describe('expandHome', () => {
    it('should expand ~ to home directory', () => {
      const result = expandHome('~/test/path');
      expect(result).toBe(os.homedir() + '/test/path');
    });

    it('should not modify paths without ~', () => {
      const result = expandHome('/absolute/path');
      expect(result).toBe('/absolute/path');
    });

    it('should not modify relative paths', () => {
      const result = expandHome('relative/path');
      expect(result).toBe('relative/path');
    });
  });
});
