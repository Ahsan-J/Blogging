import { SieveFilter } from '@/common/pipes/sieve-filter.pipe';
import { Test, TestingModule } from '@nestjs/testing';
import { Equal, EqualOperator, FindOperator } from 'typeorm';

describe('SieveFilter Pipe', () => {
    let pipe: SieveFilter;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [SieveFilter],
        }).compile();

        pipe = module.get<SieveFilter>(SieveFilter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('transform', () => {

        it('should return an empty array when no filters are provided', () => {
            const result = pipe.transform('');
            expect(result).toEqual([]);
        });

        it('should parse a single filter and apply equality', () => {
            const result = pipe.transform('name==John');

            expect(result.length).toBe(1);
            expect(result[0]).toMatchObject({ "name": {} })
            expect(result[0].name).toBeInstanceOf(EqualOperator)
        });

        it('should parse a filter with a like operator', () => {
            const result = pipe.transform('name@=John');

            expect(result.length).toBe(1);
            expect(result[0]).toMatchObject({ "name": {} })
            expect(result[0].name).toBeInstanceOf(FindOperator)
        });

        it('should parse a filter with ilike operator', () => {
            const result = pipe.transform('name@=*John');

            expect(result.length).toBe(1);
            expect(result[0]).toMatchObject({ "name": {} })
            expect(result[0].name).toBeInstanceOf(FindOperator)
        });

        it('should parse a filter with multiple values (OR)', () => {
            const result = pipe.transform('name==John|Jane');

            expect(result).toEqual([{ name: Equal('John') }, { name: Equal('Jane') }]);
            expect(result.length).toBe(2);
            expect(result[0]).toMatchObject({ "name": {} })
            expect(result[1]).toMatchObject({ "name": {} })
            expect(result[0].name).toBeInstanceOf(EqualOperator)
            expect(result[0].name as FindOperator<string>).toBeInstanceOf(EqualOperator)
            expect(result[1].name).toBeInstanceOf(EqualOperator)
        });

        it('should parse a filter with multiple keys and multiple values', () => {
            const result = pipe.transform('name@==John|Jane,age>25|30');

            expect(result.length).toBe(4);
            expect(result[0]).toMatchObject({ "name": {} })
            expect(result[1]).toMatchObject({ "name": {} })
            expect(result[2]).toMatchObject({ "age": {} })
            expect(result[3]).toMatchObject({ "age": {} })
            expect(result[0].name).toBeInstanceOf(FindOperator)
            expect(result[1].name).toBeInstanceOf(FindOperator)
            expect(result[2].age).toBeInstanceOf(FindOperator)
            expect(result[3].age).toBeInstanceOf(FindOperator)
        });

        it('should handle null filter values correctly (IsNull)', () => {
            const result = pipe.transform('name==null');

            expect(result.length).toBe(1);
            expect(result[0]).toMatchObject({ "name": {} })
            expect(result[0].name).toBeInstanceOf(FindOperator)
        });

        it('should handle Like search filter values correctly', () => {
            const result = pipe.transform('name_=*John');

            expect(result.length).toBe(1);
            expect(result[0]).toMatchObject({ "name": {} })
            expect(result[0].name).toBeInstanceOf(FindOperator)
        });

        it('should handle Like search filter values correctly', () => {
            const result = pipe.transform('name@=*null');
      
            expect(result.length).toBe(1);
            expect(result[0]).toMatchObject({"name":{}})
            expect(result[0].name).toBeInstanceOf(FindOperator)
          });

        it('should parse a filter with inequality operator (!=)', () => {
            const result = pipe.transform('name!=John');

            expect(result.length).toBe(1);
            expect(result[0]).toMatchObject({ "name": {} })
            expect(result[0].name).toBeInstanceOf(FindOperator)
        });

        it('should parse greater than filter (> operator)', () => {
            const result = pipe.transform('age>30');

            expect(result.length).toBe(1);
            expect(result[0]).toMatchObject({ "age": {} })
            expect(result[0].age).toBeInstanceOf(FindOperator)
        });

        it('should parse less than or equal filter (<= operator)', () => {
            const result = pipe.transform('age<=30');

            expect(result.length).toBe(1);
            expect(result[0]).toMatchObject({ "age": {} })
            expect(result[0].age).toBeInstanceOf(FindOperator)
        });

        it('should correctly handle the match operator (@==)', () => {
            const result = pipe.transform('description@==test');

            expect(result.length).toBe(1);
            expect(result[0]).toMatchObject({ "description": {} })
            expect((result[0].description as FindOperator<string>).getSql?.("")).toBeDefined()
            expect(result[0].description).toBeInstanceOf(FindOperator)
        });

        it('should handle multiple operators on the same key correctly', () => {
            const result = pipe.transform('name==John|Jane,age>=25|<30');

            expect(result.length).toBe(4);
            expect(result[0]).toMatchObject({ "name": {} })
            expect(result[1]).toMatchObject({ "name": {} })
            expect(result[2]).toMatchObject({ "age": {} })
            expect(result[3]).toMatchObject({ "age": {} })
            expect(result[0].name).toBeInstanceOf(EqualOperator)
            expect(result[1].name).toBeInstanceOf(EqualOperator)
            expect(result[2].age).toBeInstanceOf(FindOperator)
            expect(result[3].age).toBeInstanceOf(FindOperator)
        });

        it('should return an empty array for invalid filter format', () => {
            const result = pipe.transform('invalidFilter');
            expect(result).toEqual([]);
        });

        it('should handle null values properly for the != operator', () => {
            const result = pipe.transform('name!=null');

            expect(result.length).toBe(1);
            expect(result[0]).toMatchObject({ "name": {} })
            expect(result[0].name).toBeInstanceOf(FindOperator)
        });

        it('should return an empty array if filter does not match regex', () => {
            const result = pipe.transform('!@=unknown');
            expect(result).toEqual([]);
        });

        it('should correctly handle the case insensitive like operator (@=*)', () => {
            const result = pipe.transform('description@=*test');
        
            expect(result.length).toBe(1);
            expect(result[0]).toMatchObject({ "description": {} });
            expect(result[0].description).toBeInstanceOf(FindOperator)
        });

        it('should correctly handle the Case-insensitive string Equals operator (==*)', () => {
            const result = pipe.transform('description==*test');
        
            expect(result.length).toBe(1);
            expect(result[0]).toMatchObject({ "description": {} });
            // expect(result[0].description).toBeInstanceOf(FindOperator)
        });

        it('should correctly handle the Case-insensitive string Not equals operator (==*)', () => {
            const result = pipe.transform('description!=*test');
        
            expect(result.length).toBe(1);
            expect(result[0]).toMatchObject({ "description": {} });
            // expect(result[0].description).toBeInstanceOf(FindOperator)
        });

        it('should correctly handle the Starts with operator (_=)', () => {
            const result = pipe.transform('description_=test');
        
            expect(result.length).toBe(1);
            expect(result[0]).toMatchObject({ "description": {} });
            expect(result[0].description).toBeInstanceOf(FindOperator)
        });

        it('should correctly handle the Case-insensitive string does not Contains (!@=*)', () => {
            const result = pipe.transform('description!@=*test');
        
            expect(result.length).toBe(1);
            expect(result[0]).toMatchObject({ "description": {} });
            expect(result[0].description).toBeInstanceOf(FindOperator)
        });

        it('should correctly handle the Case-insensitive string Contains (@=*)', () => {
            const result = pipe.transform('description@=*test');
        
            expect(result.length).toBe(1);
            expect(result[0]).toMatchObject({ "description": {} });
            expect(result[0].description).toBeInstanceOf(FindOperator)
        });

        it('should correctly handle the Case-insensitive string does not Starts with (!_=*)', () => {
            const result = pipe.transform('description!_=*test');
        
            expect(result.length).toBe(1);
            expect(result[0]).toMatchObject({ "description": {} });
            expect(result[0].description).toBeInstanceOf(FindOperator)
        });
        

        it('should correctly handle the Does not Contains (!@=)', () => {
            const result = pipe.transform('description!@=test');
        
            expect(result.length).toBe(1);
            expect(result[0]).toMatchObject({ "description": {} });
            expect(result[0].description).toBeInstanceOf(FindOperator)
        });

        it('should correctly handle the Does not Starts with (!_=)', () => {
            const result = pipe.transform('description!_=test');
        
            expect(result.length).toBe(1);
            expect(result[0]).toMatchObject({ "description": {} });
            expect(result[0].description).toBeInstanceOf(FindOperator)
        });
        


        // it('should handle complex filters', () => {
        //   const result = pipe.transform('name==John|Jane|description@=test|age>=25|<30');
        //   expect(result).toEqual([
        //     { name: Equal('John') },
        //     { name: Equal('Jane') },
        //     { description: Like('%test%') },
        //     { age: MoreThanOrEqual(25) },
        //     { age: LessThan(30) },
        //   ]);
        // });
    });
});
