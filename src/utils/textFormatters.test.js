import { toTitleCase } from './textFormatters';

describe('textFormatters', () => {
  describe('toTitleCase', () => {
    it('should convert string to title case', () => {
      expect(toTitleCase('test string')).toBe('Test String');
    });

    it('should handle empty string', () => {
      expect(toTitleCase('')).toBe('');
    });

    it('should handle string with leading/trailing spaces', () => {
      expect(toTitleCase('  test string  ')).toBe('  Test String  ');
    });

    it('should handle string with multiple spaces between words', () => {
      expect(toTitleCase('test   string')).toBe('Test   String');
    });

    it('should handle string with numbers and special characters', () => {
      expect(toTitleCase('test 123 string!@#')).toBe('Test 123 String!@#');
    });
  });
});
