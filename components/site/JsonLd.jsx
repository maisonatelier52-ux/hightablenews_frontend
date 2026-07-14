// Injects a JSON-LD <script> tag for structured data / rich results.
// Safe to render from a Server Component — no client JS required.
export default function JsonLd({ data }) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
