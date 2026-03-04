import type { ElementContent, Nodes } from 'hast';
import { remark } from 'remark';
import { remarkGfm } from 'xyzdocs-core/mdx-plugins/remark-gfm'
import { createRehypeCode } from 'xyzdocs-core/mdx-plugins/rehype-code.core'
import remarkRehype from 'remark-rehype';
import { highlightHast } from 'xyzdocs-core/highlight/core'
import { configDefault } from 'xyzdocs-core/highlight'

export interface MarkdownRenderer {
  renderTypeToHast: (type: string) => Nodes | Promise<Nodes>;
  renderMarkdownToHast: (md: string) => Nodes | Promise<Nodes>;
}

export function markdownRenderer(shiki = configDefault): MarkdownRenderer {
  const processor = remark()
    .use(remarkGfm)
    .use(remarkRehype)
    .use(createRehypeCode(shiki), {
      lazy: true,
      langs: ['ts', 'tsx'],
      // disable default transformers & meta parser
      transformers: [],
      parseMetaString: undefined,
    });
  return {
    async renderTypeToHast(type) {
      const nodes = await highlightHast(type, {
        config: shiki,
        lang: 'ts',
        structure: 'inline',
      });

      return {
        type: 'element',
        tagName: 'span',
        properties: {
          class: 'shiki',
        },
        children: [
          {
            type: 'element',
            tagName: 'code',
            properties: {},
            children: nodes.children as ElementContent[],
          },
        ],
      };
    },
    renderMarkdownToHast(md) {
      md = md.replace(/{@link (?<link>[^}]*)}/g, '$1'); // replace jsdoc links

      return processor.run(processor.parse(md));
    },
  };
}
