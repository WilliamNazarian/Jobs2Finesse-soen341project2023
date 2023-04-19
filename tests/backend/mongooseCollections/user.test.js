const mongoose = require('mongoose');
const User = require('../userModel');

// Mocks for dependencies
jest.mock('mongoose');

describe('User Model Test', () => {
  test('Should create a user model with the correct schema', () => {
    const userSchema = {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      password: { type: String, required: true },
      accountType: { type: String, default: 'student' },
      appliedJobs: [
        {
          job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
          CV: { type: String, required: true },
          coverLetter: { type: String, required: true },
        },
      ],
    };

    const preSaveSpy = jest.fn();
    const modelSpy = jest.spyOn(mongoose, 'model').mockReturnValue({ pre: preSaveSpy });

    const result = User;

    expect(mongoose.Schema).toHaveBeenCalledWith(userSchema);
    expect(modelSpy).toHaveBeenCalledWith('User', userSchema);
    expect(preSaveSpy).toHaveBeenCalledWith('save', expect.any(Function));
    expect(result).toEqual(expect.any(Function));
  });

  test('Should invoke pre save hook when saving a user', () => {
    const preSaveSpy = jest.fn();
    const userInstance = { accountType: 'company', appliedJobs: [] };
    const modelSpy = jest.spyOn(mongoose, 'model').mockReturnValue({
      pre: preSaveSpy,
      findOne: jest.fn().mockReturnValueOnce({ exec: jest.fn().mockResolvedValueOnce(userInstance) }),
    });

    const result = User;

    expect(preSaveSpy).toHaveBeenCalledWith('save', expect.any(Function));
    expect(result).toEqual(expect.any(Function));
  });
});
