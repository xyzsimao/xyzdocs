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
      // const { transformerTwoslash } = await import('xyzdoc-twoslash')
      // const { createFileSystemTypesCache } =
      //   await import('xyzdocs-twoslash/cache-fs')
      const { default: remarkMath } = await import('remark-math')
      // const { remarkTypeScriptToJavaScript } = await import(
      //   'fumadocs-docgen/remark-ts2js'
      // )
      const { default: rehypeKatex } = await import('rehype-katex')

      // const {
      //   remarkAutoTypeTable,
      //   createGenerator,
      //   createFileSystemGeneratorCache,
      // } = await import('xyzdocs-typescript')
      // const {
      //   remarkAutoTypeTable,
      //   createGenerator,
      //   createFileSystemGeneratorCache,
      // } = await import('fumadocs-typescript')

      // const generator = createGenerator({
      //   cache: createFileSystemGeneratorCache('.next/fumadocs-typescript'),
      // })

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
          // transformers: [
          //   ...(rehypeCodeDefaultOptions.transformers ?? []),
          //   transformerTwoslash({
          //     typesCache: createFileSystemTypesCache(),
          //   }),
          // ],
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
          // [
          //   remarkAutoTypeTable,
          //   // {
          //   //   generator,
          //   // },
          // ],
          // remarkTypeScriptToJavaScript,
        ],
        rehypePlugins: (v) => [rehypeKatex, ...v],
      })(environment)
    },
  },
})
export const blogs = defineCollections({
  type: 'doc',
  dir: 'content/blog',
})
export default defineConfig()
