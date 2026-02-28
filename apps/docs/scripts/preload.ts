import { createMdxPlugin } from 'xyzdocs-mdx/bun';
import { postInstall } from 'xyzdocs-mdx/next';

const configPath = 'source.script.ts';
await postInstall({ configPath });
Bun.plugin(createMdxPlugin({ configPath }));
