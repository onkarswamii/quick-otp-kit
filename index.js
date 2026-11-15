const { generateNumericOtp } = require("./src/generateNumericOtp");
const { generateAlphanumericOtp } = require("./src/generateAlphanumericOtp");
const { verifyOtp } = require("./src/verifyOtp");
const { isOtpExpired } = require("./src/isOtpExpired");

module.exports = {
  generateNumericOtp,
  generateAlphanumericOtp,
  verifyOtp,
  isOtpExpired
};
