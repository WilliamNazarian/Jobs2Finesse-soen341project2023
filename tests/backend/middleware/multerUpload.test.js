const multer = require('multer');
const upload = require('../multerMiddleware');

//test from jest
// Mocks for multer middleware
jest.mock('multer');

describe('Multer Middleware Test', () => {
  test('Should setup multer diskStorage configuration', () => {
    expect(multer.diskStorage).toHaveBeenCalledWith({
      destination: expect.any(Function),
      filename: expect.any(Function),
    });
  });

  test('Should setup fileFilter function', () => {
    expect(upload).toHaveProperty('fileFilter', expect.any(Function));
  });

  test('Should setup multer instance with diskStorage and fileFilter options', () => {
    expect(multer).toHaveBeenCalledWith({
      storage: expect.any(Object),
      fileFilter: expect.any(Function),
    });
  });

  test('Should allow PDF files and reject other file types', () => {
    const file = { mimetype: 'application/pdf' };
    const cb = jest.fn();
    upload.fileFilter(null, file, cb);
    expect(cb).toHaveBeenCalledWith(null, true);
    
    const file2 = { mimetype: 'image/jpeg' };
    const cb2 = jest.fn();
    upload.fileFilter(null, file2, cb2);
    expect(cb2).toHaveBeenCalledWith(new Error('Only PDF files are allowed'), false);
  });

});
