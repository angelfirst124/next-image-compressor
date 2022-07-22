import { s3 } from './s3-config';
const multer = require('multer');
const multerS3 = require('multer-s3');

export const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'dev-image-list',
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
})
