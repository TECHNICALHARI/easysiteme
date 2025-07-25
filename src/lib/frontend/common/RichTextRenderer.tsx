import React from 'react';

interface Props {
  html: string;
}

export default function RichTextRenderer({ html }: { html: string }) {
  return (
    <div
      className="prose prose-lg max-w-none text-[--color-text] dark:prose-invert"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

