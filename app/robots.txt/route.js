import { serverApi } from "@/lib/serverApi";
import { SITE_URL } from "@/lib/seo";

// A route handler (rather than the app/robots.js metadata convention) so
// the admin's "custom" mode can serve completely raw, admin-authored
// robots.txt content verbatim — the metadata convention only supports a
// fixed structured shape.
export async function GET() {
  const data = await serverApi.getSitemapData();

  let body;
  if (data?.robotsMode === "custom" && data.robotsCustomContent) {
    body = data.robotsCustomContent;
  } else {
    const disallow = data?.robotsDisallow?.length ? data.robotsDisallow : ["/admin"];
    body = [
      "User-agent: *",
      "Allow: /",
      ...disallow.map((path) => `Disallow: ${path}`),
      "",
      `Sitemap: ${SITE_URL}/sitemap.xml`,
    ].join("\n");
  }

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=600" },
  });
}
