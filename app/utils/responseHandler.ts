/**
 * @description Returns an error responsege
 * @returns {Response} http response with error status and message
 */

const handlerResponse = (res, statusCode, data, message) => {
  let isError = false
  let errMessage = message
  let status = 'Success'
  switch (statusCode) {
    // No Content
    case 204:
      errMessage = message || 'Resource not found. '
      break

    //Bad Request
    case 400:
      isError = true
      status = 'Fail'
      errMessage = message || 'Invalid Request '
      break

    // Unauthorized
    case 401:
      isError = true
      status = 'Fail'
      errMessage = message || 'Unauthorized Request '
      break

    // Forbidden
    case 403:
      isError = true
      status = 'Fail'
      errMessage = message || 'Access to this recourses is denied!'
      break

    // Not Found
    case 404:
      isError = true
      errMessage = message || 'Internal server error'
      break

    // Inernal Server Error
    case 500:
      isError = true
      errMessage = message
      break

    default:
      errMessage = 'Internal server error'
      break
  }
  const response = data || {}
  if (isError) {
    response.error = true
    response.status = 'Fail'
    response.message = errMessage
  }
  return res.status(statusCode).json(response)
}

module.exports = handlerResponse
