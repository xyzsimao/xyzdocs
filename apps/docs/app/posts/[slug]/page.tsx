import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { InlineTOC } from 'xyzdocs-ui/components/inline-toc';
import { blog } from '@/lib/source';
import { createMetadata } from '@/lib/metadata';
import { buttonVariants } from '@/components/ui/button';
import { ShareButton,TocItem } from '@/app/(home)/blog/[slug]/page.client';

import path from 'node:path';
import { cn } from '@/lib/cn';
import { AnchorProvider } from 'xyzdocs-core/toc';
import { getMDXComponents } from '@/components/geistdocs/mdx-components'


export default async function Page(props: PageProps<'/posts/[slug]'>) {
  const params = await props.params
  const page = blog.getPage([params.slug])

  if (!page) notFound()
  const { body: Mdx, toc } = await page.data.load()

  return (
    // <AnchorProvider toc={toc}>
    <article className="flex flex-col mx-auto w-full max-w-[800px] px-4 py-8">
      <div className="prose min-w-0 flex-1">
        {/* <InlineTOC items={toc} /> */}
        <Mdx components={getMDXComponents({ components: {}, isBlog: true })} />
      </div>
    </article>
    // </AnchorProvider>
  )
}

export async function generateMetadata(props: PageProps<'/blog/[slug]'>): Promise<Metadata> {
  const params = await props.params;
  const page = blog.getPage([params.slug]);

  if (!page) notFound();

  return createMetadata({
    title: page.data.title,
    description: page.data.description ?? 'The library for building documentation sites',
  });
}

export function generateStaticParams(): { slug: string }[] {
  return blog.getPages().map((page) => ({
    slug: page.slugs[0],
  }));
}
