import { useMDXComponents } from '@/mdx-components';
import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';

export const useConvertMdxContent = async (
  input: string
): Promise<{
  content: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
}> => {
  const { content } = await compileMDX({
    source: input,
    options: {
      parseFrontmatter: true,
      mdxOptions: { remarkPlugins: [remarkGfm] },
    },
    components: useMDXComponents({}),
  });

  return { content };
};
