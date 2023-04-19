const mongoose = require('mongoose');
const Job = require('../jobModel');

// Mocks for dependencies
jest.mock('mongoose');

describe('Job Model Test', () => {
  test('Should create a job model with the correct schema', () => {
    const jobSchema = {
      companyName: { type: String },
      numberOfPositions: { type: Number },
      position: { type: String },
      country: { type: String },
      address: { type: String },
      description: { type: String },
      jobType: { type: [String] },
      dateCreated: { type: Date, immutable: true, default: () => Date.now() },
      expiryDate: { type: Date },
      postedBy: { type: String },
    };

    mongoose.Schema.mockReturnValue(jobSchema);
    const modelSpy = jest.spyOn(mongoose, 'model');

    const result = Job;

    expect(mongoose.Schema).toHaveBeenCalledWith(jobSchema);
    expect(modelSpy).toHaveBeenCalledWith('Job', jobSchema);
    expect(result).toEqual(expect.any(Function));
  });
});
