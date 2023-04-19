const fs = require('fs');
const User = require('../mongooseCollections/User');
const deleteJobMiddleware = require('./deleteJobMiddleware');

jest.mock('fs');

describe('deleteJobMiddleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        id: 'jobId123',
      },
    };
    res = {};
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should remove the applied job from all users who have applied for the job and delete the CV file', async () => {
    const user1 = {
      _id: 'userId1',
      appliedJobs: [
        {
          job: 'jobId123',
          CV: 'path/to/CV1',
        },
      ],
      save: jest.fn(),
    };

    const user2 = {
      _id: 'userId2',
      appliedJobs: [
        {
          job: 'jobId123',
          CV: 'path/to/CV2',
        },
      ],
      save: jest.fn(),
    };

    User.find = jest.fn().mockResolvedValue([user1, user2]);

    await deleteJobMiddleware(req, res, next);

    expect(User.find).toHaveBeenCalledWith({ 'appliedJobs.job': 'jobId123' });
    expect(fs.unlink).toHaveBeenCalledWith('path/to/CV1', expect.any(Function));
    expect(fs.unlink).toHaveBeenCalledWith('path/to/CV2', expect.any(Function));
    expect(user1.appliedJobs).toEqual([]);
    expect(user1.save).toHaveBeenCalled();
    expect(user2.appliedJobs).toEqual([]);
    expect(user2.save).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it('should handle errors while deleting the CV file', async () => {
    const user1 = {
      _id: 'userId1',
      appliedJobs: [
        {
          job: 'jobId123',
          CV: 'path/to/CV1',
        },
      ],
      save: jest.fn(),
    };

    const user2 = {
      _id: 'userId2',
      appliedJobs: [
        {
          job: 'jobId123',
          CV: 'path/to/CV2',
        },
      ],
      save: jest.fn(),
    };

    User.find = jest.fn().mockResolvedValue([user1, user2]);
    fs.unlink.mockImplementation((path, cb) => cb(new Error('Failed to delete file')));

    await deleteJobMiddleware(req, res, next);

    expect(User.find).toHaveBeenCalledWith({ 'appliedJobs.job': 'jobId123' });
    expect(fs.unlink).toHaveBeenCalledWith('path/to/CV1', expect.any(Function));
    expect(fs.unlink).toHaveBeenCalledWith('path/to/CV2', expect.any(Function));
    expect(user1.appliedJobs).toEqual([]);
    expect(user1.save).toHaveBeenCalled();
    expect(user2.appliedJobs).toEqual([]);
    expect(user2.save).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('Failed to delete the CV file:', expect.any(Error));
  });

  it('should not do anything if there are no users who have applied for the job', async () => {
    User.find = jest.fn().mockResolvedValue([]);

    await deleteJobMiddleware(req, res, next);

    expect(User.find).toHaveBeenCalledWith({ 'appliedJobs.job': 'jobId123' });
    expect(fs.unlink).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });
});
