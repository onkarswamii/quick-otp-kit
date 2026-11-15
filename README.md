# Quick OTP Kit

Quick OTP Kit is a small CommonJS package for generating numeric or alphanumeric one-time passwords (OTPs), comparing a submitted code with an expected code, and checking whether a code has expired. It uses Node.js's built-in `crypto` module and has no runtime dependencies.

This package only creates and checks OTP values. It does not send codes, store them, manage users, limit guesses, or provide a complete authentication system.

## Requirements

- Node.js 18 or newer

## Installation

After the first npm publication, install the package with:

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

const code = generateNumericOtp();
console.log(code); // A random six-digit string, for example "038251"

const otherCode = generateAlphanumericOtp({ length: 8 });
console.log(otherCode); // Eight letters or digits, for example "A7k2P9xQ"

// This simulates a user entering the code they received.
const submittedCode = code;
console.log(verifyOtp(submittedCode, code)); // true

const createdAt = Date.now();
const expiresInMs = 5 * 60 * 1000; // five minutes
console.log(isOtpExpired(createdAt, expiresInMs)); // false just after creation
```

In an application, save the generated code and its creation time, deliver the code using your own service, and compare the user's submission with the saved code. Invalidate it after successful use.

## API

### `generateNumericOtp(options?)`

Generates and returns a numeric OTP as a string. Returning a string preserves leading zeroes.

```js
generateNumericOtp(); // Defaults to six digits
generateNumericOtp({ length: 4 });
```

- `options` (optional): a plain object.
- `options.length` (optional): an integer from 1 through 1000; defaults to `6`.
- Returns: a string containing only digits.
- Errors: throws `TypeError` if `options` is not a plain object; throws `RangeError` if `length` is not an integer from 1 through 1000.

### `generateAlphanumericOtp(options?)`

Generates and returns an OTP using uppercase letters, lowercase letters, and digits (`A-Z`, `a-z`, `0-9`).

```js
generateAlphanumericOtp(); // Defaults to six characters
generateAlphanumericOtp({ length: 8 });
```

- `options` (optional): a plain object.
- `options.length` (optional): an integer from 1 through 1000; defaults to `6`.
- Returns: a string containing only the documented letters and digits.
- Errors: throws `TypeError` if `options` is not a plain object; throws `RangeError` if `length` is not an integer from 1 through 1000.

### `verifyOtp(actualOtp, expectedOtp)`

Checks whether the submitted value matches the expected value.

```js
const savedOtp = "012345";
const submittedOtp = "012345";
verifyOtp(submittedOtp, savedOtp); // true
verifyOtp("111111", savedOtp); // false
```

- `actualOtp`: the submitted string.
- `expectedOtp`: the saved or expected string.
- Returns: `true` if they match, otherwise `false`.
- Errors: throws `TypeError` if either argument is not a string.

### `isOtpExpired(createdAt, expiresInMs, now?)`

Checks whether the code's expiry time has arrived. All time values are in milliseconds.

```js
const createdAt = Date.now();
isOtpExpired(createdAt, 5 * 60 * 1000); // false just after creation
isOtpExpired(createdAt, 5000, createdAt + 5000); // true exactly at expiry
```

- `createdAt`: the non-negative timestamp when the code was created.
- `expiresInMs`: a non-negative duration.
- `now` (optional): the timestamp to compare against; defaults to `Date.now()`.
- Returns: `true` at or after the expiry time; `false` before it.
- Errors: throws `TypeError` if a time argument is negative or non-finite; throws `RangeError` if adding the creation timestamp and duration produces a non-finite expiry time.

## Testing

Run the built-in Node.js test suite with:

```bash
npm test
```

## Security and responsible use

- OTPs are generated with Node.js `crypto.randomInt`, not `Math.random()`.
- A random code can still be guessed. A six-digit numeric OTP has one million possible values. Use an appropriate code length and a short expiry.
- Limit verification attempts, invalidate codes after use, avoid logging OTP values, and protect any stored OTP data. Hashing stored codes can reduce the impact of a database leak.
- `verifyOtp` uses Node's `timingSafeEqual` for equal-length values. Different-length inputs return `false` before that comparison, so this helper should not be treated as a complete defense against every timing side channel.
- This package does not send codes, store them, prevent replay, apply rate limits, or authenticate users. Those responsibilities belong to the application using it.

## License

MIT. See [LICENSE](LICENSE).
