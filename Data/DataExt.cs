using Data.Helpers.Pagination;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using Domain.Identity;

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
            int totalPages) =>
            response.Headers.Add("Pagination",
                JsonSerializer.Serialize(
                    new PaginationHeader(currentPage, itemsPerPage, totalItems, totalPages),
                    new JsonSerializerOptions {PropertyNamingPolicy = JsonNamingPolicy.CamelCase}));

        //response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
        public static IEnumerable<string> GetUserLikesExt(this AppUser user, bool likers) =>
            likers
                ? user.Likers
                    .Where(u => u.LikeeId == user.Id)
                    .Select(u => u.LikerId)
                : user.Likees
                    .Where(u => u.LikerId == user.Id)
                    .Select(u => u.LikeeId);
    }
}