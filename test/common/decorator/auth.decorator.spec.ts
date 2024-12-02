import { getAuthUser } from '@/common/decorator/auth.decorator';
import { User } from '@/modules/user/user.entity';
import { ExecutionContext } from '@nestjs/common';

describe('getAuthUser', () => {

  // Test Case 1: Should return the entire user object
  it('should return the entire user object when no data is provided', () => {
    const user: Partial<User> = { id: "1", name: 'john_doe', email: 'john@example.com' };
    const ctx = { switchToHttp: () => ({ getRequest: () => ({ user }) }) } as ExecutionContext;
    
    expect(getAuthUser(undefined, ctx)).toEqual(user);
  });

  // Test Case 2: Should return the specific property of the user
  it('should return the specific property of the user when data is provided', () => {
    const user: Partial<User> = { id: "1", name: 'john_doe', email: 'john@example.com' };
    const ctx = { switchToHttp: () => ({ getRequest: () => ({ user }) }) } as ExecutionContext;
    
    expect(getAuthUser('id', ctx)).toBe("1");
    expect(getAuthUser('name', ctx)).toBe('john_doe');
  });

  // Test Case 3: Should return undefined if no user is present in the context
  it('should return undefined if no user is present in the context', () => {
    const ctx = { switchToHttp: () => ({ getRequest: () => ({ user: undefined }) }) } as ExecutionContext;
    
    expect(getAuthUser('id', ctx)).toBeUndefined();
    expect(getAuthUser(undefined, ctx)).toBeUndefined();
  });

  // Test Case 4: Should return undefined for invalid property
  it('should return undefined if an invalid property is requested', () => {
    const user: Partial<User> = { id: "1", name: 'john_doe', email: 'john@example.com' };
    const ctx = { switchToHttp: () => ({ getRequest: () => ({ user }) }) } as ExecutionContext;
    
    expect(getAuthUser('nonExistentProperty' as keyof User, ctx)).toBeUndefined();
  });

  // Test Case 5: Should handle empty user object correctly
  it('should handle empty user object correctly', () => {
    const user: Partial<User> = {};  // Empty user object
    const ctx = { switchToHttp: () => ({ getRequest: () => ({ user }) }) } as ExecutionContext;
    
    expect(getAuthUser('id', ctx)).toBeUndefined();
    expect(getAuthUser(undefined, ctx)).toEqual(user);
  });

  // Test Case 6: Should return undefined if user is null
  it('should return undefined if user is null', () => {
    const ctx = { switchToHttp: () => ({ getRequest: () => ({ user: undefined }) }) } as ExecutionContext;
    
    expect(getAuthUser('id', ctx)).toBeUndefined();
    expect(getAuthUser(undefined, ctx)).toBeUndefined();
  });

});
