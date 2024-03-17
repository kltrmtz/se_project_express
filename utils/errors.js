module.exports = {
  HTTP_BAD_REQUEST: 400, // CastError, ValidationError, AssertionError

  HTTP_UNAUTHORIZED: 401, // UnauthorizedError

  HTTP_FORBIDDEN: 403, // ForbiddenError

  HTTP_NOT_FOUND: 404, // DocumentNotFoundError

  HTTP_USER_DUPLICATED: 409, // DuplicateError

  HTTP_INTERNAL_SERVER_ERROR: 500, // DefaultError
};
