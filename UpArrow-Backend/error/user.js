class ResponseError {
  code;
  message;
  errorType;
  constructor() {}

  responseError(res) {
    return res.status(this.code).json({
      errorType: this.errorType,
      message: this.message,
      code: this.code,
    });
  }
}

const USER_ALREADY_EXIST = 'UserAlreadyExistError';
const NO_TOKEN_ERROR = 'NoTokenError';
const INVALID_TOKEN_ERROR = 'InvalidTokenError';

class UserAlreadyExistError extends ResponseError {
  constructor() {
    super();
    this.code = 400;
    this.message = 'user already exist';
    this.errorType = USER_ALREADY_EXIST;
  }
}

class NoTokenError extends ResponseError {
  constructor() {
    super();
    this.code = 401;
    this.message = 'empty token';
    this.errorType = NO_TOKEN_ERROR;
  }
}

class InvalidTokenError extends ResponseError {
  constructor() {
    super();
    this.code = 401;
    this.message = 'invalid token';
    this.errorType = INVALID_TOKEN_ERROR;
  }
}

const UserAlreadyExist = new UserAlreadyExistError();
const NoToken = new NoTokenError();
const InvalidToken = new InvalidTokenError();

module.exports = {
  USER_ALREADY_EXIST,
  UserAlreadyExist,
  NO_TOKEN_ERROR,
  NoToken,
  INVALID_TOKEN_ERROR,
  InvalidToken,
};
