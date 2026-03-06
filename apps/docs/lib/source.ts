import { docs, blog as blogPosts } from 'xyzdocs-mdx:collections/server'
import {
  InferPageType,
  InferMetaType,
  loader,
  LoaderPlugin,
} from 'xyzdocs-core/source'
import { lucideIconsPlugin } from 'xyzdocs-core/source/lucide-icons'
import { toxyzdocsSource } from 'xyzdocs-mdx/runtime/server'

// import { lucideIconsPlugin } from 'xyzdocs-core/source/lucide-icons';
// console.log(docs)
export const source = loader({
  baseUrl: '/docs',
  source: docs.toxyzdocsSource(),
  plugins: [lucideIconsPlugin()],
})

export const blog = loader(toxyzdocsSource(blogPosts, []), {
  baseUrl: '/blog',
})

export const post = loader(toxyzdocsSource(blogPosts, []), {
  baseUrl: '/posts',
})

export type Page = InferPageType<typeof source>
export type Meta = InferMetaType<typeof source>

// function pageTreeCodeTitles(): LoaderPlugin {
//   return {
//     transformPageTree: {
//       file(node) {
//         if (
//           typeof node.name === 'string' &&
//           (node.name.endsWith('()') || node.name.match(/^<\w+ \/>$/))
//         ) {
//           return {
//             ...node,
//             name: (
//               <code key="0" className="text-[0.8125rem]">
//                 {node.name}
//               </code>
//             ),
//           };
//         }
//         return node;
//       },
//     },
//   };
// }

export const getLLMText = async (page: InferPageType<typeof source>) => {
  const processed = await page.data.getText('raw')

  // Clean up the markdown for LLM consumption
  const cleaned = processed
    // Remove import statements
    .replace(/^import\s+.*?from\s+["'].*?["'];?\s*$/gm, '')
    // Collapse multiple consecutive blank lines into a single blank line
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  return `# ${page.data.title}

${cleaned}`
}
