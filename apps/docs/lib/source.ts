import { docs } from 'xyzdocs-mdx:collections/server'
import {
  InferPageType,
  InferMetaType,
  loader,
  LoaderPlugin,
} from 'xyzdocs-core/source'
import { lucideIconsPlugin } from 'xyzdocs-core/source/lucide-icons'

// import { toxyzdocsSource } from 'xyzdocs-mdx/runtime/server';
// import { lucideIconsPlugin } from 'xyzdocs-core/source/lucide-icons';
// console.log(docs)
export const source = loader({
  baseUrl: '/docs',
  source: docs.toxyzdocsSource(),
  plugins: [lucideIconsPlugin()],
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
// export const blog = loader(toxyzdocsSource(blogPosts, []), {
//   baseUrl: '/blog',
// });
