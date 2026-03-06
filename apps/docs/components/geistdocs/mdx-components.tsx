import { DynamicLink } from "xyzdocs-core/dynamic-link";
import { Heading } from "xyzdocs-ui/components/heading";

import { PackageManagerTabs } from './tabs'
import defaultMdxComponents from "xyzdocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { cn } from "@/lib/utils";
import {
  Tab,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from 'xyzdocs-ui/components/tabs'

import {
  Callout,
  CalloutContainer,
  CalloutDescription,
  CalloutTitle
} from "./callout";
import { Card, Cards } from "./card";

// import {
//   CodeBlockTab,
//   CodeBlockTabs,
//   CodeBlockTabsList,
//   CodeBlockTabsTrigger
// } from "./code-block-tabs";
// import { ExamplesTable } from "./examples-table";
import { ExperimentalBadge } from "./experimental-badge";
import { PrereleaseBadge } from "./prerelease-badge";
import { File, Files, Folder } from "./files";
import { InVersion } from "./in-version";
import { LinkToDocumentation } from "./link-to-documentation";
import { Mermaid } from "./mermaid";
import { Step, Steps } from "./steps";
import { ThemeAwareImage } from "./theme-aware-image";
import { Video } from "./video";
import { Accordion, Accordions } from "./accordion";

import * as icons from 'lucide-react';
import { FeedbackBlock } from "../feedback/client";
import { Wrapper } from '@/components/preview/wrapper'
import { Example } from '@/components/example'

import * as Twoslash from 'xyzdocs-twoslash/ui'
// import * as Preview from '@/components/preview'
import { createMetadata, getPageImage } from '@/lib/metadata'
import { getLLMText, source } from '@/lib/source'
import {
  onBlockFeedbackAction,
  onPageFeedbackAction,
  owner,
  repo,
} from '@/lib/github'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import Link from 'xyzdocs-core/link'

import { createRelativeLink } from 'xyzdocs-ui/mdx'
import { findSiblings } from 'xyzdocs-core/page-tree'

import { Installation } from '@/components/preview/installation'
import { Customisation } from '@/components/preview/customisation'

import { NotFound } from '@/components/not-found'

import { PathUtils } from 'xyzdocs-core/source'
import { TypeTable } from 'xyzdocs-ui/components/type-table'
import { ComponentProps, FC } from 'react'
import { CodeBlock } from '../code-block'
import { Pre } from 'xyzdocs-ui/components/codeblock'

import { BlogCallout } from '@/components/blog/callout'

interface GetMDXComponentsOptions {
  components?: MDXComponents;
  /** Use the old site's typography styling for H1 elements (centered, semibold) */
  isBlog?: boolean;
}

export const getMDXComponents = (
  options: GetMDXComponentsOptions = {}
): MDXComponents => {
  const { components, isBlog } = options
  // console.log('isBlog')
  // console.log(options)
  return {
    ...(icons as unknown as MDXComponents),
    ...defaultMdxComponents,
    ...components,
    ...(isBlog && {
      h1: (props: React.ComponentProps<'h1'>) => {
        const { className, ...rest } = props
        return (
          <Heading
            className={cn(
              'font-semibold text-center text-4xl tracking-wide!',
              className
            )}
            as="h1"
            {...rest}
          />
        )
      },
    }),
    Pre: CodeBlock,
    // Pre: ({ ref: _ref, ...props }) => (
    //   <CodeBlock {...props}>
    //     <Pre className={cn('text-lg')}>{props.children}</Pre>
    //   </CodeBlock>
    // ),

    // a: ({ href, ...props }) =>
    //   href.startsWith('/') ? (
    //     <DynamicLink
    //       className="font-normal text-primary no-underline"
    //       href={`/[lang]${href}`}
    //       {...props}
    //     />
    //   ) : (
    //     <a
    //       href={href}
    //       {...props}
    //       className="font-normal text-primary no-underline"
    //     />
    //   ),
    // CodeBlockTabs,
    // CodeBlockTabsList,
    // CodeBlockTabsTrigger,
    // CodeBlockTab,
    Tabs,
    Tab,
    TabsContent,
    TabsList,
    PackageManagerTabs,
    TabsTrigger,
    Callout,
    CalloutContainer,
    CalloutTitle,
    CalloutDescription,
    Mermaid,
    Video,
    LinkToDocumentation,
    Cards,
    Card,
    Files,
    File,
    Folder,
    Steps,
    Step,
    // ExamplesTable,
    Accordion,
    Accordions,
    ThemeAwareImage,
    InVersion,
    ExperimentalBadge,
    PrereleaseBadge,
    FeedbackBlock: ({ children, ...props }) => (
      <FeedbackBlock {...props} onSendAction={onBlockFeedbackAction}>
        {children}
      </FeedbackBlock>
    ),
    Example,
    ...Twoslash,
    TypeTable,
    Wrapper,
    blockquote: Callout as unknown as FC<ComponentProps<'blockquote'>>,
    // blockquote: BlogCallout as unknown as FC<ComponentProps<'blockquote'>>,
    // blockquote: isBlog
    //   ? (BlogCallout as unknown as FC<ComponentProps<'blockquote'>>)
    //   : (Callout as unknown as FC<ComponentProps<'blockquote'>>),
    // blockquote: ({ ...props }) => (
    //   <div
    //     className={cn(
    //       'bg-amber-200 mr-[-50vw] ml-[-50vw] relative w-screen backdrop-blur-[6px] mt-0 mb-9 py-10 inset-x-2/4'
    //     )}
    //   >
    //     <div className={cn('text-cyan-800')}></div>
    //     'blockquote'
    //   </div>
    // ),
    Installation,
    Customisation,
  }
}

