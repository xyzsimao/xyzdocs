import { z } from 'zod'
import { RemarkFeedbackBlockOptions } from 'xyzdocs-core/mdx-plugins'
import {
  applyMdxPreset,
  defineCollections,
  defineConfig,
  defineDocs,
  metaSchema,
  frontmatterSchema,
} from 'xyzdocs-mdx/config'
import jsonSchema from 'xyzdocs-mdx/plugins/json-schema'
import lastModified from 'xyzdocs-mdx/plugins/last-modified'
import type { ShikiTransformer } from 'shiki'
// import type { RemarkFeedbackBlockOptions } from 'xyzdocs-core/mdx-plugins'
import type { ElementContent } from 'hast'
import { shikiConfig } from './lib/shiki'
import type { RemarkAutoTypeTableOptions } from 'xyzdocs-typescript'

export const docs = defineDocs({
  dir: 'content/docs',
  meta: {
    schema: metaSchema.extend({
      description: z.string().optional(),
    }),
  },
  docs: {
    schema: frontmatterSchema.extend({
      preview: z.string().optional(),
      index: z.boolean().default(false),
      /**
       * API routes only
       */
      method: z.string().optional(),
    }),

    postprocess: {
      includeProcessedMarkdown: true,
      extractLinkReferences: true,
    },
    // async: true,
    async mdxOptions(environment) {
      const { rehypeCodeDefaultOptions } =
        await import('xyzdocs-core/mdx-plugins/rehype-code')
      const { remarkStructureDefaultOptions } =
        await import('xyzdocs-core/mdx-plugins/remark-structure')
      const { remarkSteps } =
        await import('xyzdocs-core/mdx-plugins/remark-steps')
      const { remarkFeedbackBlock } =
        await import('xyzdocs-core/mdx-plugins/remark-feedback-block')
      const { transformerTwoslash } = await import('xyzdocs-twoslash')
      const { createFileSystemTypesCache } =
        await import('xyzdocs-twoslash/cache-fs')
      const { default: remarkMath } = await import('remark-math')
      const { remarkTypeScriptToJavaScript } =
        await import('xyzdocs-docgen/remark-ts2js')
      const { default: rehypeKatex } = await import('rehype-katex')
      const {
        remarkAutoTypeTable,
        createGenerator,
        createFileSystemGeneratorCache,
      } = await import('xyzdocs-typescript')

      const feedbackOptions: RemarkFeedbackBlockOptions = {
        resolve(node) {
          // defensive approach
          if (node.type === 'mdxJsxFlowElement') return 'skip'
          return (
            node.type === 'paragraph' ||
            node.type === 'image' ||
            node.type === 'list'
          )
        },
      }
      const typeTableOptions: RemarkAutoTypeTableOptions = {
        generator: createGenerator({
          cache: createFileSystemGeneratorCache('.next/xyzdocs-typescript'),
        }),
        shiki: shikiConfig,
      }
      return applyMdxPreset({
        remarkStructureOptions: {
          types: [...remarkStructureDefaultOptions.types, 'code'],
        },
        rehypeCodeOptions: {
          langs: ['ts', 'js', 'html', 'tsx', 'mdx'],
          inline: 'tailing-curly-colon',
          themes: {
            light: 'catppuccin-latte',
            dark: 'catppuccin-mocha',
          },
          transformers: [
            ...(rehypeCodeDefaultOptions.transformers ?? []),
            transformerTwoslash({
              typesCache: createFileSystemTypesCache(),
            }),
            transformerEscape(),
          ],
        },
        remarkCodeTabOptions: {
          parseMdx: true,
        },
        remarkNpmOptions: {
          persist: {
            id: 'package-manager',
          },
        },
        remarkPlugins: [
          remarkSteps,
          remarkMath,
          [remarkFeedbackBlock, feedbackOptions],
          [remarkAutoTypeTable, typeTableOptions],
          remarkTypeScriptToJavaScript,
        ],
        rehypePlugins: (v) => [rehypeKatex, ...v],
      })(environment)
    },
  },
})



function transformerEscape(): ShikiTransformer {
  return {
    name: '@shikijs/transformers:remove-notation-escape',
    code(hast) {
      function replace(node: ElementContent) {
        if (node.type === 'text') {
          node.value = node.value.replace('[\\!code', '[!code')
        } else if ('children' in node) {
          for (const child of node.children) {
            replace(child)
          }
        }
      }

      replace(hast)
      return hast
    },
  }
}
export const blogs = defineCollections({
  type: 'doc',
  dir: 'content/blog',
})


export default defineConfig({
  plugins: [
    jsonSchema({
      insert: true,
    }),
    lastModified(),
  ],
})
