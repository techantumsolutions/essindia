export interface ContactMapContent {
  mapUrl?: string;
}

function parseMapUrl(input: string): string {
  if (!input) return "";
  
  // 1. If user pasted an entire iframe embed snippet, extract the src
  const iframeMatch = input.match(/<iframe[^>]+src=["']([^"']+)["']/i);
  if (iframeMatch && iframeMatch[1]) {
    return iframeMatch[1];
  }

  // 2. If it's already an embed URL (contains /embed/), use it
  if (input.includes('/embed/') || input.includes('/embed?')) {
    return input;
  }

  // 3. If it's a standard maps.google.com/maps/place/XYZ link, extract the place
  const placeMatch = input.match(/\/place\/([^\/]+)/);
  if (placeMatch && placeMatch[1]) {
    return `https://maps.google.com/maps?q=${placeMatch[1]}&output=embed`;
  }

  // 4. If it's a standard maps.google.com/maps/search/XYZ link, extract the search
  const searchMatch = input.match(/\/search\/([^\/]+)/);
  if (searchMatch && searchMatch[1]) {
    return `https://maps.google.com/maps?q=${searchMatch[1]}&output=embed`;
  }

  // 5. If it's just a query string or unrecognized url, fallback
  return input;
}

export function ContactMap({ content }: { content?: ContactMapContent }) {
  const defaultUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3505.3523498808546!2d77.3371900742881!3d28.528456687050516!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce5cf518a24bd%3A0x6b7fa4366eb4fcd3!2sLotus%20Business%20Park%2C%20Sector%20127%2C%20Noida%2C%20Uttar%20Pradesh%20201301!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin";
  
  const rawUrl = content?.mapUrl || defaultUrl;
  const processedUrl = parseMapUrl(rawUrl);

  return (
    <div className="w-full h-[500px] mt-12 bg-gray-100">
      <iframe
        title="ESS India Office Location"
        src={processedUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="grayscale-[0.3] contrast-125"
      ></iframe>
    </div>
  );
}
