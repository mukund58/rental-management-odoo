namespace backend.Features.Auth;

public static class CookieHelper
{
    public static void SetTokens(
        HttpContext context,
        string accessToken,
        string refreshToken)
    {
        var isHttps = context.Request.IsHttps;

        context.Response.Cookies.Append(
            "accessToken",
            accessToken,
            CreateCookie(isHttps, TimeSpan.FromMinutes(15)));

        context.Response.Cookies.Append(
            "refreshToken",
            refreshToken,
            CreateCookie(isHttps, TimeSpan.FromDays(7)));
    }

    public static void Clear(HttpContext context)
    {
        context.Response.Cookies.Delete("accessToken");
        context.Response.Cookies.Delete("refreshToken");
    }

    private static CookieOptions CreateCookie(bool secure, TimeSpan expiry)
    {
        return new CookieOptions
        {
            HttpOnly = true,
            Secure = secure,
            SameSite = SameSiteMode.None,
            Expires = DateTime.UtcNow.Add(expiry)
        };
    }
}