using System.Collections.Generic;
using System.Net;

namespace API.Models
{
    public class ApiError
    {
        public int StatusCode { get; set; }
        public string Message { get; set; }
        public string Details { get; set; }
        public IDictionary<string, string[]> ValidationErrors { get; set; }

        public ApiError(HttpStatusCode statusCode, string message = null, string details = null)
        {
            StatusCode = (int)statusCode;
            Message = message ?? GetDefaultMessageForStatusCode(statusCode);
            Details = details;
        }

        private static string GetDefaultMessageForStatusCode(HttpStatusCode statusCode)
        {
            return statusCode switch
            {
                HttpStatusCode.BadRequest => "A bad request was made",
                HttpStatusCode.Unauthorized => "You are not authorized",
                HttpStatusCode.NotFound => "Resource was not found",
                HttpStatusCode.InternalServerError => "An internal server error occurred",
                _ => null
            };
        }
    }
}