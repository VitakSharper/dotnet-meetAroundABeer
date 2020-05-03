using Data.Helpers.Pagination;
using Microsoft.AspNetCore.Http;
using System;
using System.Text.Json;

namespace Data
{
    public static class DataExt
    {
        public static int CalculateAge(this DateTime theDateTime) =>
            theDateTime.AddYears(DateTime.Today.Year - theDateTime.Year) > DateTime.Today
                ? (DateTime.Today.Year - theDateTime.Year) - 1
                : DateTime.Today.Year - theDateTime.Year;

        // Pagination
        public static void AddPagination(
            this HttpResponse response,
            int currentPage,
            int itemsPerPage,
            int totalItems,
            int totalPages)
        {
            response.Headers.Add("Pagination",
                JsonSerializer.Serialize(
                    new PaginationHeader(currentPage, itemsPerPage, totalItems, totalPages),
                    new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase }));
            response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
        }
    }
}