import fs from 'fs';
import path from 'path';
import { compileMDX } from 'next-mdx-remote/rsc';
import { useMDXComponents } from '@/mdx-components';
import { type TableOfContents, getTableOfContents } from './toc';
import remarkGfm from 'remark-gfm';

const rootDirectory = path.join(process.cwd(), 'content');

export const useGetMdxBySlugs = async (
  slugs: string[]
): Promise<{
  meta: {
    slug: string;
  };
  content: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
  toc: TableOfContents;
}> => {
  const lastSlug = slugs.at(-1) ?? '';
  const realSlug = lastSlug.replace(/\.mdx$/, '');
  const filePath = path.join(
    rootDirectory,
    ...slugs.slice(0, -1),
    `${realSlug}.mdx`
  );

  const fileContent: string = fs.readFileSync(filePath, { encoding: 'utf8' });

  const { frontmatter, content } = await compileMDX({
    source: fileContent,
    options: {
      parseFrontmatter: true,
      mdxOptions: { remarkPlugins: [remarkGfm] },
    },
    components: useMDXComponents({}),
  });
  const toc = await getTableOfContents(fileContent);

  return { meta: { ...frontmatter, slug: realSlug }, content, toc };
};
