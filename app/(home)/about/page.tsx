import * as React from 'react';

import Content from '@/content/about.mdx';

/**
 * Page component that renders the About page content.
 *
 * This component serves as a wrapper for the About page, importing and displaying MDX content
 * from a specific file. It applies consistent padding around the content to ensure proper
 * layout and readability across various screen sizes.
 * @returns {JSX.Element} The rendered About page content.
 */
export default function Page(): JSX.Element {
  return (
    <div className="px-6 xs:px-8 sm:px-12 md:px-[15%] py-8">
      <Content />
    </div>
  );
}
