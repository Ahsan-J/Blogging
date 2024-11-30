import { BitwiseOperator } from '@/common/utils/bitwise.utility';

const enum Status {
  ACTIVE,
  BLOCKED,
  VERIFIED
}

describe('BitwiseOperator', () => {
  let bitwiseOperator: BitwiseOperator<Status>;

  beforeEach(() => {
    bitwiseOperator = new BitwiseOperator<Status>();
  });

  describe('setValue', () => {
    it('should set the correct bit in the number using bitwise OR', () => {
      let src = 0;

      src = bitwiseOperator.setValue(src, Status.BLOCKED);
      expect(src).toBe(2); // Binary: 10

      src = bitwiseOperator.setValue(src, Status.VERIFIED);
      expect(src).toBe(6); // Binary: 110

      src = bitwiseOperator.setValue(src, Status.ACTIVE);
      expect(src).toBe(7); // Binary: 111
    });

    it('should not overwrite already set bits', () => {
      let src = 2;

      src = bitwiseOperator.setValue(src, Status.BLOCKED);
      expect(src).toBe(2); // Binary: 10

      src = bitwiseOperator.setValue(src, Status.VERIFIED);
      expect(src).toBe(6); // Binary: 110
    });
  });

  describe('hasValue', () => {
    it('should return true when the specific bit is set', () => {
      const src = 6;

      expect(bitwiseOperator.hasValue(src, Status.BLOCKED)).toBe(true);

      expect(bitwiseOperator.hasValue(src, Status.VERIFIED)).toBe(true);
    });

    it('should return false when the specific bit is not set', () => {
      const src = 2; // Binary: 10

      expect(bitwiseOperator.hasValue(src, Status.ACTIVE)).toBe(false);

      expect(bitwiseOperator.hasValue(src, Status.VERIFIED)).toBe(false);
    });

    it('should return false when the number is 0', () => {
      const src = 0;
      expect(bitwiseOperator.hasValue(src, Status.BLOCKED)).toBe(false);
      expect(bitwiseOperator.hasValue(src, Status.VERIFIED)).toBe(false);
    });
  });

  describe('removeValue', () => {
    it('should remove the specific bit using bitwise NOT and AND', () => {
      let src = 7;

      src = bitwiseOperator.removeValue(src, Status.ACTIVE);
      expect(src).toBe(6); // Binary: 110

      src = bitwiseOperator.removeValue(src, Status.VERIFIED);
      expect(src).toBe(2); // Binary: 10
    });

    it('should not affect other bits when removing a specific bit', () => {
      let src = 6;

      src = bitwiseOperator.removeValue(src, Status.BLOCKED);
      expect(src).toBe(4); // Binary: 100 

      src = bitwiseOperator.removeValue(src, Status.VERIFIED);
      expect(src).toBe(0); // Binary: 0
    });

    it('should return the same value if the bit is not set', () => {
      let src = 2;

      src = bitwiseOperator.removeValue(src, Status.ACTIVE);
      expect(src).toBe(2); // Binary: 10, no change

      src = bitwiseOperator.removeValue(src, Status.VERIFIED);
      expect(src).toBe(2); // Binary: 10, no change
    });
  });
});
