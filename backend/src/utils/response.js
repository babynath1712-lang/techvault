/**
 * Send a standardized success response
 */
const sendSuccess = (res, statusCode = 200, message = 'Success', data = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Send a standardized error response
 */
const sendError = (res, statusCode = 500, message = 'An error occurred') => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

/**
 * Send a paginated response
 */
const sendPaginated = (res, data, page, limit, total) => {
  return res.status(200).json({
    success: true,
    data,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  });
};

module.exports = { sendSuccess, sendError, sendPaginated };
