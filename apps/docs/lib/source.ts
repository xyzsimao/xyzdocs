import { docs } from 'xyzdocs-mdx:collections/server'
import {
  InferPageType,
  InferMetaType,
  loader
} from 'xyzdocs-core/source'

// console.log(docs)
export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
});


export type Page = InferPageType<typeof source>
export type Meta = InferMetaType<typeof source>
