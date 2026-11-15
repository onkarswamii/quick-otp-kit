const test = require("node:test");
const assert = require("node:assert/strict");
const {
  generateNumericOtp,
  generateAlphanumericOtp,
  verifyOtp,
  isOtpExpired
} = require("..");

test("numeric OTP uses the default length and is a string", () => {
  const otp = generateNumericOtp();
  assert.equal(typeof otp, "string");
  assert.equal(otp.length, 6);
  assert.match(otp, /^\d{6}$/);
});

test("numeric OTP respects a custom length", () => {
  assert.match(generateNumericOtp({ length: 10 }), /^\d{10}$/);
});

test("numeric OTP supports length one", () => {
  assert.match(generateNumericOtp({ length: 1 }), /^\d$/);
});

test("numeric OTP rejects invalid lengths", () => {
  for (const length of [0, -1, 1.5, "6", 1001]) {
    assert.throws(() => generateNumericOtp({ length }), RangeError);
  }
});

test("numeric OTP rejects null options", () => {
  assert.throws(() => generateNumericOtp(null), TypeError);
});

test("numeric OTP accepts omitted options and uses default length", () => {
  assert.match(generateNumericOtp(), /^\d{6}$/);
});

test("numeric OTP rejects non-object options", () => {
  for (const options of ["6", 6, true, []]) {
    assert.throws(() => generateNumericOtp(options), TypeError);
  }
});

test("alphanumeric OTP has the requested length and allowed characters", () => {
  const otp = generateAlphanumericOtp({ length: 32 });
  assert.equal(otp.length, 32);
  assert.match(otp, /^[A-Za-z0-9]+$/);
});

test("alphanumeric OTP uses the default length", () => {
  assert.equal(generateAlphanumericOtp().length, 6);
});

test("alphanumeric OTP rejects invalid lengths", () => {
  for (const length of [0, -3, 2.2, "8", 1001]) {
    assert.throws(() => generateAlphanumericOtp({ length }), RangeError);
  }
});

test("alphanumeric OTP rejects null options", () => {
  assert.throws(() => generateAlphanumericOtp(null), TypeError);
});

test("alphanumeric OTP accepts omitted options and uses default length", () => {
  assert.match(generateAlphanumericOtp(), /^[A-Za-z0-9]{6}$/);
});

test("alphanumeric OTP rejects non-object options", () => {
  for (const options of ["6", 6, false, []]) {
    assert.throws(() => generateAlphanumericOtp(options), TypeError);
  }
});

test("verifyOtp returns true for matching values", () => {
  assert.equal(verifyOtp("012345", "012345"), true);
});

test("verifyOtp returns false for different values", () => {
  assert.equal(verifyOtp("123456", "654321"), false);
});

test("verifyOtp returns false for different lengths", () => {
  assert.equal(verifyOtp("12345", "012345"), false);
});

test("verifyOtp requires strings", () => {
  assert.throws(() => verifyOtp(123456, "123456"), TypeError);
  assert.throws(() => verifyOtp("123456", null), TypeError);
});

test("OTP is not expired before its deadline", () => {
  assert.equal(isOtpExpired(1000, 5000, 5999), false);
});

test("OTP expires at its deadline", () => {
  assert.equal(isOtpExpired(1000, 5000, 6000), true);
});

test("OTP is expired after its deadline", () => {
  assert.equal(isOtpExpired(1000, 5000, 6001), true);
});

test("expiration rejects invalid input", () => {
  assert.throws(() => isOtpExpired(-1, 5000, 6000), TypeError);
  assert.throws(() => isOtpExpired(1000, -1, 6000), TypeError);
  assert.throws(() => isOtpExpired(1000, 5000, NaN), TypeError);
  assert.throws(() => isOtpExpired("1000", 5000, 6000), TypeError);
  assert.throws(() => isOtpExpired(1000, "5000", 6000), TypeError);
  assert.throws(() => isOtpExpired(1000, 5000, "6000"), TypeError);
  assert.throws(() => isOtpExpired(Infinity, 5000, 6000), TypeError);
  assert.throws(() => isOtpExpired(1000, Infinity, 6000), TypeError);
  assert.throws(() => isOtpExpired(1000, 5000, Infinity), TypeError);
});

test("expiration rejects a non-finite calculated expiry timestamp", () => {
  assert.throws(() => isOtpExpired(Number.MAX_VALUE, Number.MAX_VALUE, 0), RangeError);
});
