import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from '@/shared/token/token.service';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { addYears } from 'date-fns';

describe('UserService', () => {
    let service: TokenService;
    let configService: ConfigService;

    const mockConfigService = {
        get: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TokenService,
                {
                    provide: ConfigService,
                    useValue: mockConfigService,
                },
            ],
        })
            .compile();

        service = module.get<TokenService>(TokenService);
        configService = module.get<ConfigService>(ConfigService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('generateToken', () => {
        it('should throw a BadRequestException if no parameters are provided', () => {
            try {
                service.generateToken([])
            } catch (err) {
                expect(err).toBeInstanceOf(BadRequestException);
            }
        });

        it('should generate a token with valid parameters', () => {
            const params = ['param1', 123, null, undefined, 'param2'];
            const options = { expiration: addYears(new Date(), 1) };

            const token = service.generateToken(params, options);

            expect(token).toBeDefined();
            expect(token).toMatch(/^[A-Za-z0-9+/=]+$/); // Base64 validation
        });

        it('should include the parameters in the generated token', () => {
            const params = ['param1', 123];
            const options = { expiration: addYears(new Date(), 1) };

            const token = service.generateToken(params, options);
            const decodedToken = Buffer.from(token, 'base64').toString('ascii');
            const expectedString = `${params[0]}|${params[1]}`;

            expect(decodedToken).toContain(expectedString);
        });
    });

    describe('validateAccessToken', () => {
        it('should throw a BadRequestException if the token is missing', () => {
            try {
                service.validateAccessToken('')
            } catch (err) {
                expect(err).toBeInstanceOf(BadRequestException)
            }
        });

        it('should throw a ForbiddenException if the appId is invalid', () => {
            jest.spyOn(configService, 'get').mockReturnValue('invalidAppId');

            const token = service.generateToken(['param1']);
            try {
                service.validateAccessToken(token)
            } catch (err) {
                expect(err).toBeInstanceOf(ForbiddenException)
            }
        });

        it('should throw an UnauthorizedException if the token is expired', () => {
            const expiredToken = service.generateToken(['param1'], { expiration: new Date(2000, 1, 1) });
            try {
                service.validateAccessToken(expiredToken)
            } catch (err) {
                expect(err).toBeInstanceOf(UnauthorizedException);
            }
        });

        it('should validate a correct token successfully', () => {
            const validToken = service.generateToken(['param1'], { expiration: addYears(new Date(), 1) });
            expect(() => service.validateAccessToken(validToken)).not.toThrow();
        });
    });

    describe('getTokenData', () => {
        it('should return parameters after token validation', () => {
            const params = ['param1', 'param2'];
            const token = service.generateToken(params, { expiration: addYears(new Date(), 1) });

            const data = service.getTokenData(token);
            expect(data).toEqual(params);
        });

        it('should throw a ForbiddenException if token is invalid', () => {
            const invalidToken = 'invalidToken';
            try {
                service.getTokenData(invalidToken)
            } catch (err) {
                expect(err).toBeInstanceOf(ForbiddenException)
            }
        });
    });
})