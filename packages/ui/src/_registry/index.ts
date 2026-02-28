import { fileURLToPath } from 'node:url';
import type {
  Registry,
  Reference,
  SourceReference,
  Component,
  ComponentFile,
} from '@xyzdocs/cli/build';
import * as path from 'node:path';
import { Glob } from 'bun';

const srcDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '../');

/** import specifier -> sub component & file */
const installables = new Map<
  string,
  {
    comp: Component;
    file: ComponentFile;
  }
>();

/** file path (relative to registry dir) -> import specifier */
const forwardedFiles = new Map<string, string>();

/**
 * - transform import to `@xyzdocs/ui` into sub component references, or forward to upstream package instead.
 * - when importing files from upstream package that's forwarded from `@xyzdocs/ui` (e.g. contexts), they will be treated as direct imports to `@xyzdocs/ui`.
 */
export function resolveForwardedAPIs(
  ref: SourceReference,
  upstreamPackage: string,
  upstreamRegistry: Registry,
): Reference | undefined {
  const renameDirs: [ui: string, upstream: string][] = [['hooks', 'utils']];

  if (ref.type === 'dependency' && ref.dep === '@xyzdocs/ui') {
    let specifier = ref.specifier;
    if (installables.has(specifier)) {
      const { comp, file } = installables.get(specifier)!;
      return {
        type: 'sub-component',
        resolved: {
          type: 'remote',
          registryName: registry.name,
          component: comp,
          file,
        },
      };
    }
    specifier =
      upstreamPackage +
      specifier
        .slice('@xyzdocs/ui'.length)
        .split('/')
        .map((v) => {
          for (const [ui, upstream] of renameDirs) {
            if (ui === v) return upstream;
          }
          return v;
        })
        .join('/');

    return {
      type: 'dependency',
      dep: upstreamPackage,
      specifier,
    };
  }

  if (ref.type === 'file') {
    const filePath = path
      .relative(upstreamRegistry.dir, ref.file)
      .split(/\/|\\/)
      .map((v) => {
        for (const [ui, upstream] of renameDirs) {
          if (v === upstream) return ui;
        }
        return v;
      })
      .join('/');
    const forwarded = forwardedFiles.get(filePath);

    if (forwarded)
      return resolveForwardedAPIs(
        {
          type: 'dependency',
          dep: '@xyzdocs/ui',
          specifier: forwarded,
        },
        upstreamPackage,
        upstreamRegistry,
      );
  }
}

export const registry: Registry = {
  name: 'xyzdocs/ui',
  dir: srcDir,
  tsconfigPath: '../tsconfig.json',
  packageJson: '../package.json',
  variables: {
    ui: {
      description: 'the main UI package',
      default: 'xyzdocs-ui',
    },
  },
  onResolve(ref) {
    if (ref.type !== 'file') return ref
    const filePath = path.relative(registry.dir, ref.file).replaceAll('\\', '/')
    const [dir, rest] = splitDir(filePath)
    switch (dir) {
      case 'contexts':
        return {
          type: 'custom',
          specifier: `<ui>/${dir}/${removeExtname(rest)}`,
        }
    }

    return ref
  },
  components: [
    {
      name: 'layouts/docs-min',
      description: 'Replace Docs Layout (Minimal)',
      files: [
        {
          type: 'block',
          path: '_registry/layout/docs-min.tsx',
          target: 'components/layout/docs/index.tsx',
        },
        {
          type: 'block',
          path: '_registry/layout/page-min.tsx',
          target: 'components/layout/docs/page.tsx',
        },
      ],
      unlisted: true,
    },
    {
      name: 'urls',
      unlisted: true,
      files: [
        {
          type: 'lib',
          path: 'urls.ts',
        },
      ],
    },
    {
      name: 'cn',
      unlisted: true,
      files: [
        {
          type: 'lib',
          path: 'cn.ts',
        },
      ],
    },
    {
      name: 'merge-refs',
      unlisted: true,
      files: [
        {
          type: 'lib',
          path: 'merge-refs.ts',
        },
      ],
    },
    {
      name: 'link-item',
      unlisted: true,
      files: [
        {
          type: 'components',
          path: 'link-item.tsx',
          target: '<dir>/layout/link-item.tsx',
        },
      ],
    },
    {
      name: 'toc',
      unlisted: true,
      files: [
        {
          type: 'components',
          path: 'components/toc/clerk.tsx',
          target: '<dir>/toc/clerk.tsx',
        },
        {
          type: 'components',
          path: 'components/toc/default.tsx',
          target: '<dir>/toc/default.tsx',
        },
        {
          type: 'components',
          path: 'components/toc/index.tsx',
          target: '<dir>/toc/index.tsx',
        },
      ],
    },
  ],
  dependencies: {
    'xyzdocs-core': null,
    react: null,
  },
}

function splitDir(filePath: string): [dir: string, rest: string] {
  const idx = filePath.indexOf('/');
  if (idx === -1) {
    return ['', filePath];
  } else {
    return [filePath.substring(0, idx), filePath.substring(idx + 1)];
  }
}

function removeExtname(file: string) {
  return file.slice(0, -path.extname(file).length);
}

for (const comp of registry.components) {
  for (const file of comp.files) {
    installables.set(`@xyzdocs/ui/${removeExtname(file.path).replaceAll('\\', '/')}`, {
      comp,
      file,
    });
  }
}

forwardedFiles.set('i18n.tsx', '@xyzdocs/ui/i18n');
for await (const file of new Glob('{contexts,hooks}/**/*').scan(srcDir)) {
  forwardedFiles.set(file, `@xyzdocs/ui/${removeExtname(file)}`);
}

for await (const file of new Glob('components/toc/**/*').scan(srcDir)) {
  forwardedFiles.set(file, `@xyzdocs/ui/${removeExtname(file)}`);
}
