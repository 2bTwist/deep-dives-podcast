type Props = {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
};

/**
 * Renders structured data as a JSON-LD <script>. Place anywhere in a server component.
 * Pass a single object or an array of objects (each becomes its own <script>).
 */
export function JsonLd({ data }: Props) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          // Sanitize against </script> via JSON.stringify escape, then explicit replace.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(item).replace(/</g, "\\u003c"),
          }}
        />
      ))}
    </>
  );
}
