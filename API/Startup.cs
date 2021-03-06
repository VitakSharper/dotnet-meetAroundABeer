using API.Helpers;
using API.Services;
using AutoMapper;
using Data.Interfaces;
using Data.Repository;
using Data.Repository.Interfaces;
using Data.Security;
using Data.Security.Photo;
using Domain.Identity;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Persistence;
using System.Net;
using System.Reflection;
using System.Text;
using System.Text.Json;
using Newtonsoft.Json.Serialization;

namespace API
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }


        // This method gets called by the runtime. Use this method to add services to the container.

        public void ConfigureDevelopmentServices(IServiceCollection services)
        {
            var server = Configuration["DbServer"] ?? "localhost";
            var port = Configuration["DbPort"] ?? "1433";
            var user = Configuration["DbUser"] ?? "sa";
            var password = Configuration["DbPassword"] ?? "4zpYD72Av";

            services.AddDbContext<DataContext>(opt =>
            {
                opt.UseLazyLoadingProxies();
                opt.UseSqlServer(
                    $"Server={server},{port};Initial Catalog=devSqlDb;User ID={user};Password={password}");
            });

            ConfigureServices(services);
        }

        public void ConfigureProductionServices(IServiceCollection services)
        {
            var server = Configuration["DbServer"] ?? "localhost";
            var port = Configuration["DbPort"] ?? "1433";
            var user = Configuration["DbUser"] ?? "sa";
            var password = Configuration["DbPassword"] ?? "4zpYD72Av";

            services.AddDbContext<DataContext>(opt =>
            {
                opt.UseLazyLoadingProxies();
                opt.UseSqlServer(
                    $"Server={server},{port};Initial Catalog=devSqlDb;User ID={user};Password={password}");
            });

            ConfigureServices(services);
        }

        public void ConfigureServices(IServiceCollection services)
        {
                // CORS Policy
            services.AddCors(opt =>
            {
                opt.AddPolicy("CorsPolicy", policy =>
                {
                    policy
                        .WithHeaders(
                            "authorization",
                            "accept",
                            "content-type",
                            "origin",
                            "x-requested-with")
                        .WithExposedHeaders("WWW-Authenticate", "Pagination")
                        .WithMethods("GET", "POST", "UPDATE", "PUT","PATCH", "DELETE")
                        .WithOrigins("http://localhost:4200")
                        .AllowCredentials();
                });
            });

            services.AddSingleton<FileManager>();

                // AutoMapper
            services.AddAutoMapper(typeof(AuthRepository).Assembly);

                 // Repository services
            services.AddScoped<IAuthRepository, AuthRepository>();
            services.AddScoped<IUsersRepository, UsersRepository>();
            services.AddScoped<IDatingRepository, DatingRepository>();

                 // Log User Activity service
            services.AddScoped<LogUserActivity>();

                 // JWT service
            services.AddScoped<IJwtGenerator, JwtGenerator>();

                 // User accessor service
            services.AddScoped<IUserAccessor, UserAccessor>();

                 // Identity config
            services.TryAddSingleton<ISystemClock, SystemClock>();
            var builder = services.AddIdentityCore<AppUser>();
            var identityBuilder = new IdentityBuilder(builder.UserType, builder.Services);
            identityBuilder.AddEntityFrameworkStores<DataContext>();
            identityBuilder.AddSignInManager<SignInManager<AppUser>>();

                 // JWT config
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(opt =>
                {
                    opt.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["tokenKey"])),
                        ValidateAudience = false,
                        ValidateIssuer = false
                    };
                });

            services.AddControllers(opt =>
                {
                    var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
                    opt.Filters.Add(new AuthorizeFilter(policy));
                })
                .AddJsonOptions(opt =>
                {
                    opt.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
                    //opt.JsonSerializerOptions.PropertyNamingPolicy = null;
                    //opt.JsonSerializerOptions.DictionaryKeyPolicy = null;
                })
                    // NewtonSoft JSON for JsonPatch
                .AddNewtonsoftJson(opt =>
                {
                    opt.SerializerSettings.ContractResolver=new CamelCasePropertyNamesContractResolver();
                })
                     // Fluent Validation
                .AddFluentValidation(opt =>
                    {
                        opt.RunDefaultMvcValidationAfterFluentValidationExecutes = false;
                        opt.RegisterValidatorsFromAssembly(Assembly.GetExecutingAssembly());
                    }
                );

                     // Cloudinary
            services.Configure<CloudinarySettings>(Configuration.GetSection("Cloudinary"));
                    // Cloudinary Accessor
            services.AddScoped<IPhotoAccessor, PhotoAccessor>();

            services.AddAuthorization();
        }

                     // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                // Error handler for production mode
                app.UseExceptionHandler(builder =>
                {
                    builder.Run(async context =>
                    {
                        // add some headers
                        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

                        var error = context.Features.Get<IExceptionHandlerFeature>();
                        if (error != null)
                        {
                            context.Response.AddApplicationError(error.Error.Message);
                            //context.Response.Headers.Append("Access-Control-Expose-Headers", "WWW-Authenticate");
                            await context.Response.WriteAsync(error.Error.Message);
                        }
                    });
                });
            }

            app.UseStaticFiles();
            //app.UseHttpsRedirection();

            app.UseRouting();

            app.UseCors("CorsPolicy");

            app.UseAuthentication();

            app.UseAuthorization();

            app.UseEndpoints(endpoints => { endpoints.MapControllers(); });
        }
    }
}