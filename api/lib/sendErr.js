module.exports = (res, statusCode, message) => {
  res.status(statusCode).json({
    err: message
  });
};