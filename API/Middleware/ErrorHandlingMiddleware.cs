using System;
using System.Collections.Generic;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using API.Models;
using Application.Errors;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace API.Middleware
{
    public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ErrorHandlingMiddleware> _logger;
        private readonly IHostEnvironment _env;
        private readonly JsonSerializerOptions _jsonOptions;

        public ErrorHandlingMiddleware(
            RequestDelegate next,
            ILogger<ErrorHandlingMiddleware> logger,
            IHostEnvironment env)
        {
            _next = next;
            _logger = logger;
            _env = env;
            _jsonOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            var error = CreateApiError(exception);
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = error.StatusCode;

            var response = JsonSerializer.Serialize(error, _jsonOptions);
            await context.Response.WriteAsync(response);
        }

        private ApiError CreateApiError(Exception exception)
        {
            _logger.LogError(exception, exception.Message);

            return exception switch
            {
                RestException restException => new ApiError(
                    restException.Code,
                    "Rest Error",
                    _env.IsDevelopment() ? restException.Message : null)
                {
                    ValidationErrors = (IDictionary<string, string[]>)restException.Errors
                },

                // Add more specific exception types here as needed
                _ => new ApiError(
                    HttpStatusCode.InternalServerError,
                    "Server Error",
                    _env.IsDevelopment() ? exception.Message : null)
            };
        }
    }
}
