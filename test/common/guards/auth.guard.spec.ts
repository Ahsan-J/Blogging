import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from '@/shared/token/token.service';
import { ExecutionContext, ForbiddenException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@/common/guards/auth.guard';
import { UserRepository } from '@/modules/user/user.repository';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@/modules/user/user.enum';

describe('UserService', () => {
    let guard: AuthGuard;

    const userId = "1";

    const mockUserRepository: Partial<UserRepository> = {
        findUserById: jest.fn(),
    };

    const mockTokenService: Partial<TokenService> = {
        generateToken: jest.fn(),
        getTokenData: jest.fn(),
        validateAccessToken: jest.fn(),
    }

    const mockReflector: Partial<Reflector> = {
        getAllAndOverride: jest.fn()
    }

    const mockContext: ExecutionContext = {
        switchToHttp: jest.fn().mockReturnValue({
            getRequest: jest.fn().mockReturnValue({ headers: {}, query: {} }),
            getResponse: jest.fn(),
            getNext: jest.fn(),
        }),
        getHandler: jest.fn(),
        getClass: jest.fn(),
        getArgs: jest.fn(),
        getArgByIndex: jest.fn(),
        switchToRpc: jest.fn(),
        switchToWs: jest.fn(),
        getType: jest.fn()
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthGuard,
                {
                    provide: TokenService,
                    useValue: mockTokenService,
                },
                {
                    provide: UserRepository,
                    useValue: mockUserRepository,
                },
                {
                    provide: Reflector,
                    useValue: mockReflector,
                },
            ],
        })
            .compile();

        guard = module.get<AuthGuard>(AuthGuard);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });


    describe('canActivate', () => {
        it('should throw UnauthorizedException if no authorization header is provided', async () => {
            jest.spyOn(mockContext.switchToHttp(), 'getResponse').mockReturnValue({ headers: {} });

            try {
                await guard.canActivate(mockContext)
            } catch (err) {
                expect(err).toBeInstanceOf(UnauthorizedException)
            }
        });

        it('should throw UnauthorizedException if token is invalid or malformed', async () => {
            jest.spyOn(mockTokenService, 'getTokenData').mockImplementationOnce(() => {throw new UnauthorizedException()});

            jest.spyOn(mockContext, 'switchToHttp').mockReturnValue({
                getRequest: jest.fn().mockReturnValue({ headers: { 'authorization': 'invalid-token' }, query: {} }),
                getResponse: jest.fn(),
                getNext: jest.fn(),
            });

            try {
                await guard.canActivate(mockContext)
            } catch (err) {
                expect(err).toBeInstanceOf(UnauthorizedException)
            }
        });

        it('should throw ForbiddenException if the user does not have the required role', async () => {
            const requiredRoles = [UserRole.ADMIN];

            const validToken = "VUIzU0dzMUR3UmVkM0k5NWk0Vkd6fHVuZGVmaW5lZHwyMDI0LTExLTI5VDIwOjU4OjMzLjU0M1p8MjAyNS0xMS0yOVQyMDo1ODozMy41NDJafDE=";

            jest.spyOn(mockContext, 'switchToHttp').mockReturnValue({
                getRequest: jest.fn().mockReturnValue({ headers: { 'authorization': validToken }, query: {} }),
                getResponse: jest.fn(),
                getNext: jest.fn(),
            });

            mockReflector.getAllAndOverride = jest.fn().mockReturnValue(requiredRoles);
            mockTokenService.getTokenData = jest.fn().mockReturnValue([userId, 2]);
            mockUserRepository.findUserById = jest.fn().mockResolvedValue({ id: userId, role: UserRole.USER });

            try {
                await guard.canActivate(mockContext)
            } catch (err) {
                expect(err).toBeInstanceOf(ForbiddenException)
            }

        });

        it('should allow access if the user has the required role', async () => {

            const validToken = "VUIzU0dzMUR3UmVkM0k5NWk0Vkd6fHVuZGVmaW5lZHwyMDI0LTExLTI5VDIwOjU4OjMzLjU0M1p8MjAyNS0xMS0yOVQyMDo1ODozMy41NDJafDE=";

            jest.spyOn(mockContext, 'switchToHttp').mockReturnValue({
                getRequest: jest.fn().mockReturnValue({ headers: { 'authorization': validToken }, query: {} }),
                getResponse: jest.fn(),
                getNext: jest.fn(),
            });

            const requiredRoles = [UserRole.ADMIN];

            mockReflector.getAllAndOverride = jest.fn().mockReturnValue(requiredRoles);
            mockTokenService.getTokenData = jest.fn().mockReturnValue([userId, 1]);
            mockUserRepository.findUserById = jest.fn().mockResolvedValue({ id: userId, role: UserRole.ADMIN });

            const result = await guard.canActivate(mockContext);

            expect(result).toBe(true); // Access granted
        });

        it('should throw UnauthorizedException if user is not found in the database', async () => {
            const validToken = "VUIzU0dzMUR3UmVkM0k5NWk0Vkd6fHVuZGVmaW5lZHwyMDI0LTExLTI5VDIwOjU4OjMzLjU0M1p8MjAyNS0xMS0yOVQyMDo1ODozMy41NDJafDE=";

            const requiredRoles = [UserRole.ADMIN];

            mockReflector.getAllAndOverride = jest.fn().mockReturnValue(requiredRoles);
            mockTokenService.getTokenData = jest.fn().mockReturnValue([userId, 1]);
            jest.spyOn(mockUserRepository, 'findUserById').mockImplementation(() => { throw new NotFoundException() });

            jest.spyOn(mockContext, 'switchToHttp').mockReturnValue({
                getRequest: jest.fn().mockReturnValue({ headers: { 'authorization': validToken }, query: {} }),
                getResponse: jest.fn(),
                getNext: jest.fn(),
            });

            try {
                await guard.canActivate(mockContext)
            } catch (err) {
                expect(err).toBeInstanceOf(UnauthorizedException)
            }
        });
    });
});