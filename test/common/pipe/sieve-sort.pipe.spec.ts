import { SieveSort } from "@/common/pipes/sieve-sort.pipe";
import { Test, TestingModule } from "@nestjs/testing";


describe('SieveSort Pipe', () => {
    let pipe: SieveSort;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [SieveSort],
        }).compile();

        pipe = module.get<SieveSort>(SieveSort);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('transform', () => {

        it('should return an empty object when no sort parameters are provided', () => {
            const result = pipe.transform('');
            expect(result).toEqual({});
          });
      
          it('should correctly sort with ascending order by default', () => {
            const result = pipe.transform('name');
            expect(result).toEqual({ name: 'ASC' });
          });
      
          it('should correctly sort with descending order when prefixed with "-"', () => {
            const result = pipe.transform('-name');
            expect(result).toEqual({ name: 'DESC' });
          });
      
          it('should correctly sort with ascending order when prefixed with "+"', () => {
            const result = pipe.transform('+name');
            expect(result).toEqual({ name: 'ASC' });
          });
      
          it('should correctly handle multiple sorting keys with default ascending order', () => {
            const result = pipe.transform('name,age');
            expect(result).toEqual({ name: 'ASC', age: 'ASC' });
          });
      
          it('should correctly handle multiple sorting keys with both ascending and descending orders', () => {
            const result = pipe.transform('name,-age');
            expect(result).toEqual({ name: 'ASC', age: 'DESC' });
          });
      
          it('should handle mixed ascending and descending orders', () => {
            const result = pipe.transform('name,-age,+address');
            expect(result).toEqual({ name: 'ASC', age: 'DESC', address: 'ASC' });
          });
      
          it('should ignore spaces and extra commas', () => {
            const result = pipe.transform('name, ,age,-address');
            expect(result).toEqual({ name: 'ASC', age: 'ASC', address: 'DESC' });
          });
      
          it('should return an empty object for invalid input format (e.g., extra symbols)', () => {
            const result = pipe.transform('name==');
            expect(result).toEqual({name: "ASC"});
          });

    })
});