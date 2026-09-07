import React from 'react';

interface FormattedTextProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'content'> {
  content?: string | null;
  as?: React.ElementType;
  className?: string;
}

/**
 * FormattedText Component
 * 
 * Safely renders string or HTML content saved from CMS editors.
 * If the content contains HTML tags (e.g. <p>, <br>, <strong>, <a>, <ul>),
 * it renders via dangerouslySetInnerHTML. Otherwise, it renders as plain text.
 */
export function FormattedText({ content, as: Component = 'div', className, ...props }: FormattedTextProps) {
  if (!content) return null;

  // Unescape HTML entities if DB content contains encoded tags (e.g. &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;)
  let rawStr = typeof content === 'string' ? content : '';
  // Multi-pass unescape to handle single, double, or numeric HTML entity encoding
  for (let i = 0; i < 3; i++) {
    if (!rawStr.includes('&')) break;
    rawStr = rawStr
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/&amp;/gi, '&')
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/&#x2F;/gi, '/')
      .replace(/&#60;/gi, '<')
      .replace(/&#62;/gi, '>');
  }

  const isHtml = rawStr.includes('<') && rawStr.includes('>');

  const containerClass = className ? `formatted-text-content ${className}` : 'formatted-text-content';

  if (isHtml) {
    return (
      <Component
        className={containerClass}
        dangerouslySetInnerHTML={{ __html: rawStr }}
        {...props}
      />
    );
  }

  return (
    <Component className={containerClass} {...props}>
      {rawStr}
    </Component>
  );
}
