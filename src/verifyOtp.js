const { timingSafeEqual } = require("node:crypto");

function verifyOtp(actualOtp, expectedOtp) {
  if (typeof actualOtp !== "string" || typeof expectedOtp !== "string") {
    throw new TypeError("actualOtp and expectedOtp must both be strings");
  }

  const actualBuffer = Buffer.from(actualOtp, "utf8");
  const expectedBuffer = Buffer.from(expectedOtp, "utf8");

  if (actualBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(actualBuffer, expectedBuffer);
}

module.exports = { verifyOtp };
