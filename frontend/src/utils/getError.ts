type customError = {
  message: string;
  response: {
    data: {
      message: string;
    };
  };
};

export const getError = (error: customError) => {
  return error.response && error.response.data.message
    ? error.response.data.message
    : error.message;
};
