// const multer = require("multer");
// const path = require("path");
// const cyrpto = require("crypto");

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './uploads/userimage')
//     },
//     filename: function (req, file, cb) {
//         require("crypto").randomBytes(14, (err, buf) => {
//             // if (err) throw err;
//             let fn = buf.toString('hex');
//             cb(null, fn+path.extname(file.originalname));

//         });
//     }
// })


// module.exports= storage;




const multer = require('multer');
const crypto = require('crypto');
const path = require('path');


const userimagestorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/uploads/userimage')
    },
    filename: function (req, file, cb) {
        require('crypto').randomBytes(14, function (err, buffer) {
            var token = buffer.toString('hex');
            cb(null, token + path.extname(file.originalname));
        });
    }
})
const productimagestorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/uploads/productimg')
    },
    filename: function (req, file, cb) {
        require('crypto').randomBytes(14, function (err, buffer) {
            var token = buffer.toString('hex');
            cb(null, token + path.extname(file.originalname));
        });
    }
})

module.exports = { userimagestorage, productimagestorage };