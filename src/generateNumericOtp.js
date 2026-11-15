const { randomInt } = require("node:crypto");

function generateNumericOtp(options = {}) {
  if (!isPlainOptionsObject(options)) {
    throw new TypeError("options must be a plain object");
  }

  const { length = 6 } = options;

  if (!Number.isInteger(length) || length < 1 || length > 1000) {
    throw new RangeError("length must be an integer between 1 and 1000");
  }

  let otp = "";

  for (let index = 0; index < length; index += 1) {
    otp += randomInt(0, 10).toString();
  }

  return otp;
}

function isPlainOptionsObject(value) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

module.exports = { generateNumericOtp };
