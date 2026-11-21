# Quick OTP Kit

Quick OTP Kit is a lightweight CommonJS package for generating numeric and alphanumeric one-time passwords (OTPs), verifying a submitted value, and checking whether an OTP has expired. It uses Node.js's built-in `crypto` module and has no runtime dependencies.

- **NPM package:** [quick-otp-kit](https://www.npmjs.com/package/quick-otp-kit)
- **Live demo:** [Try Quick OTP Kit](https://quick-otp-kit-demo.vercel.app/)
- **Demo source:** [quick-otp-kit-demo on GitHub](https://github.com/onkarswamii/quick-otp-kit-demo)

This package generates and checks OTP values. It does not send codes, store them, manage users, limit guesses, or provide a complete authentication system.

## Features

- Generate secure numeric OTPs while preserving leading zeroes.
- Generate secure alphanumeric OTPs.
- Choose a custom OTP length.
- Compare a submitted OTP with an expected OTP.
- Check expiry using timestamps in milliseconds.
- Validate inputs and provide clear errors.
- Use Node.js built-in modules only; no runtime dependencies.

## Requirements

- Node.js 18 or newer
- npm

## Installation

```bash
npm install quick-otp-kit
```

## Quick start

```js
const {
  generateNumericOtp,
  generateAlphanumericOtp,
  verifyOtp,
  isOtpExpired
} = require("quick-otp-kit");

const numericCode = generateNumericOtp();
console.log(numericCode); // A six-digit string, for example "038251"

const alphaNumericCode = generateAlphanumericOtp({ length: 8 });
console.log(alphaNumericCode); // Eight letters or digits, for example "A7k2P9xQ"

// In a real application, compare the user's submitted value with the code
// you saved when generating it. This line simulates a matching submission.
const simulatedSubmission = numericCode;
console.log(verifyOtp(simulatedSubmission, numericCode)); // true

const createdAt = Date.now();
const expiresInMs = 5 * 60 * 1000; // five minutes
console.log(isOtpExpired(createdAt, expiresInMs)); // false just after creation
```

## API

### `generateNumericOtp(options?)`

Generates a numeric OTP and returns it as a string. A string is used so leading zeroes are not lost.

```js
generateNumericOtp(); // Defaults to six digits
generateNumericOtp({ length: 4 });
```

- `options` (optional): a plain options object.
- `options.length` (optional): an integer from 1 through 1000; defaults to `6`.
- Returns: a string containing digits only.
- Errors: throws `TypeError` if `options` is not a plain object; throws `RangeError` if `length` is outside the supported range or is not an integer.

### `generateAlphanumericOtp(options?)`

Generates an OTP from uppercase letters, lowercase letters, and digits (`A-Z`, `a-z`, `0-9`).

```js
generateAlphanumericOtp(); // Defaults to six characters
generateAlphanumericOtp({ length: 8 });
```

- `options` (optional): a plain options object.
- `options.length` (optional): an integer from 1 through 1000; defaults to `6`.
- Returns: a string containing only the documented letters and digits.
- Errors: throws `TypeError` if `options` is not a plain object; throws `RangeError` if `length` is outside the supported range or is not an integer.

### `verifyOtp(actualOtp, expectedOtp)`

Checks whether a submitted value matches the expected value.

```js
verifyOtp("012345", "012345"); // true
verifyOtp("111111", "012345"); // false
```

- `actualOtp`: the submitted string.
- `expectedOtp`: the saved or expected string.
- Returns: `true` for a match and `false` for a non-match.
- Errors: throws `TypeError` if either argument is not a string.

### `isOtpExpired(createdAt, expiresInMs, now?)`

Checks whether the expiry time has been reached. All time values are milliseconds since the Unix epoch, except `expiresInMs`, which is a duration.

```js
const createdAt = Date.now();
const expiresInMs = 5 * 60 * 1000;
isOtpExpired(createdAt, expiresInMs); // false just after creation
isOtpExpired(createdAt, 5000, createdAt + 5000); // true exactly at expiry
```

- `createdAt`: a non-negative, finite creation timestamp.
- `expiresInMs`: a non-negative, finite duration.
- `now` (optional): a non-negative, finite comparison timestamp; defaults to `Date.now()`.
- Returns: `true` at or after the expiry time; `false` before it.
- Errors: throws `TypeError` for negative, non-finite, or non-numeric time values; throws `RangeError` if the calculated expiry timestamp is non-finite.

## Run tests

The tests use Node.js's built-in test runner; no test framework needs to be installed.

```bash
npm test
```

## Security and responsible use

- OTPs use Node.js `crypto.randomInt`, rather than `Math.random()`, to generate random values.
- A random OTP can still be guessed. A six-digit numeric OTP has one million possible values. Choose a suitable code length and short expiry for your application.
- Limit verification attempts, invalidate an OTP after successful use, avoid logging OTP values, and protect stored OTP data. Hashing stored codes can reduce the impact of a database leak.
- `verifyOtp` uses Node's `timingSafeEqual` for equal-length values. Different-length values return `false` before that comparison, so this helper is not a complete defense against every timing side channel.
- This package does not send codes, store them, prevent replay, enforce rate limits, or authenticate users. Those responsibilities belong to the application using it.

## License

MIT. See [LICENSE](LICENSE).
