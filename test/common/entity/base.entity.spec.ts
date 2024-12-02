import { BaseModel } from '@/common/entity/base.entity';
import { nanoid } from 'nanoid';

describe('BaseModel', () => {

  // Test Case 1: Should generate a UUID for `id` when no `id` is provided
  it('should generate a UUID for `id` when no `id` is provided', () => {
    const baseModel = new BaseModel();
    expect(baseModel.id).toBeDefined();
    expect(baseModel.id.length).toBeGreaterThan(0);  // Check if id is non-empty
  });

  // Test Case 2: Should set the `createdAt` field to the current timestamp
  it('should set the `createdAt` field when the entity is created', () => {
    const baseModel = new BaseModel();
    expect(baseModel.createdAt).toBeDefined();
    expect(baseModel.createdAt).toBeInstanceOf(Date);
    expect(baseModel.createdAt.getTime()).toBeLessThanOrEqual(new Date().getTime());
  });

  // Test Case 3: Should generate `updatedAt` field when the entity is updated
  it('should set the `updatedAt` field when the entity is updated', () => {
    const baseModel = new BaseModel();
    const initialUpdatedAt = baseModel.updatedAt;
    baseModel.setUpdatedAt(); // Simulate update
    expect(baseModel.updatedAt).toBeDefined();
    expect(baseModel.updatedAt).not.toEqual(initialUpdatedAt);
    expect(baseModel.updatedAt).toBeInstanceOf(Date);
  });

  // Test Case 4: Should handle `deletedAt` correctly (nullable)
  it('should handle `deletedAt` as nullable', () => {
    const baseModel = new BaseModel();
    expect(baseModel.deletedAt).toBeUndefined();
  });

  // Test Case 5: Should set `createdAt` when inserting and generate `id` if not present
  it('should set `createdAt` when inserted, and `id` should be generated if not present', () => {
    const baseModel = new BaseModel();
    baseModel.setCreatedAt();
    expect(baseModel.createdAt).toBeDefined();
    expect(baseModel.createdAt).toBeInstanceOf(Date);
    expect(baseModel.id).toBeDefined();
  });

  // Test Case 6: Should not override `id` if it's already set
  it('should not override `id` if it is already set', () => {
    const baseModel = new BaseModel();
    const existingId = nanoid();
    baseModel.id = existingId; // Set a custom id
    baseModel.setCreatedAt();
    expect(baseModel.id).toBe(existingId); // Ensure that the id stays the same
  });

  // Test Case 7: Should generate a valid custom ID using `nanoid` if needed
  it('should generate a custom `id` using nanoid if no `id` is set', () => {
    const baseModel = new BaseModel();
    baseModel.setCreatedAt();
    expect(baseModel.id).toBeDefined();
    expect(baseModel.id.length).toBeGreaterThan(0); // nanoid should produce a string
  });


  it('should set the `deletedAt` field when the entity is deleted', () => {
    const baseModel = new BaseModel();
    baseModel.setDeletedAt(); // Simulate update
    expect(baseModel.deletedAt).toBeDefined();
    expect(baseModel.deletedAt).toBeInstanceOf(Date);
  });

  it('should set the `deletedAt` field when the entity is deleted', () => {
    const baseModel = new BaseModel();
    baseModel.deletedAt = new Date();
    baseModel.setRecovery(); // Simulate update
    expect(baseModel.deletedAt).not.toBeDefined();
  });
});