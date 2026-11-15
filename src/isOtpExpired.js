function isOtpExpired(createdAt, expiresInMs, now = Date.now()) {
  if (!Number.isFinite(createdAt) || createdAt < 0) {
    throw new TypeError("createdAt must be a non-negative timestamp in milliseconds");
  }

  if (!Number.isFinite(expiresInMs) || expiresInMs < 0) {
    throw new TypeError("expiresInMs must be a non-negative number of milliseconds");
  }

  if (!Number.isFinite(now) || now < 0) {
    throw new TypeError("now must be a non-negative timestamp in milliseconds");
  }

  const expiresAt = createdAt + expiresInMs;

  if (!Number.isFinite(expiresAt)) {
    throw new RangeError("createdAt plus expiresInMs must produce a finite expiry timestamp");
  }

  return now >= expiresAt;
}

module.exports = { isOtpExpired };
