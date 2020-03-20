using Data.Repository;
using Data.Repository.Interfaces;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Persistence;
using System.Reflection;

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

        public void ConfigureServices(IServiceCollection services)
        {
            // CORS Policy
            services.AddCors(opt =>
            {
                opt.AddPolicy("CorsPolicy", policy =>
                {
                    policy
                        .WithHeaders("authorization",
                            "accept",
                            "content-type",
                            "origin",
                            "x-requested-with")
                        .WithExposedHeaders("WWW-Authenticate")
                        .WithMethods("GET", "POST", "UPDATE", "PUT")
                        .WithOrigins("http://localhost:4200")
                        .AllowCredentials();
                });
            });

            services.AddScoped<IAuthRepository, AuthRepository>();

            services.AddControllers()
                .AddFluentValidation(opt =>
                    {
                        opt.RunDefaultMvcValidationAfterFluentValidationExecutes = false;
                        opt.RegisterValidatorsFromAssembly(Assembly.GetExecutingAssembly());
                    }
                );

            services.AddAuthorization();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            //app.UseHttpsRedirection();

            app.UseRouting();

            app.UseCors("CorsPolicy");

            app.UseAuthorization();

            app.UseEndpoints(endpoints => { endpoints.MapControllers(); });
        }
    }
}