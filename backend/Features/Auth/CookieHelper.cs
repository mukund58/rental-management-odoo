namespace backend.Features.Auth;

public static class CookieHelper
{
    public static void SetTokens(
        HttpContext context,
        string accessToken,
        string refreshToken)
    {
        context.Response.Cookies.Append(
            "accessToken",
            accessToken,
            CreateCookie(TimeSpan.FromMinutes(15)));

        context.Response.Cookies.Append(
            "refreshToken",
            refreshToken,
            CreateCookie(TimeSpan.FromDays(7)));
    }

    public static void Clear(HttpContext context)
    {
        context.Response.Cookies.Delete("accessToken");
        context.Response.Cookies.Delete("refreshToken");
    }

    private static CookieOptions CreateCookie(TimeSpan expiry)
    {
        return new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = DateTime.UtcNow.Add(expiry)
        };
    }
}