module.exports = function getValidationError(e = Error.prototype) {
  const validationError = {};
  const rawErr = e.errors;
  for (const key in rawErr) {
    if (Object.prototype.hasOwnProperty.call(rawErr, key)) {
      const element = rawErr[key];
      validationError[key] = element.message;
    }
  }
  return validationError;
};
