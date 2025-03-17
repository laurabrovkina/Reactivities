using Application.Activities;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.Extensions.DependencyInjection;

namespace API.Extensions
{
    public static class ApiServiceExtensions
    {
        public static IServiceCollection AddApiServices(this IServiceCollection services)
        {
            services.AddControllers(opt =>
            {
                var policy = new AuthorizationPolicyBuilder()
                    .RequireAuthenticatedUser()
                    .Build();

                opt.Filters.Add(new AuthorizeFilter(policy));
            });

            services.AddFluentValidationAutoValidation()
                   .AddFluentValidationClientsideAdapters()
                   .AddValidatorsFromAssemblyContaining<Create>();

            services.AddCors(opt =>
            {
                opt.AddPolicy("CorsPolicy", policy =>
                {
                    policy.WithOrigins("http://localhost:3000")
                         .SetIsOriginAllowed(host => true)
                         .AllowAnyMethod()
                         .AllowAnyHeader()
                         .AllowCredentials();
                });
            });

            return services;
        }
    }
}