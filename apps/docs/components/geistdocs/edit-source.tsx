import { SiGithub } from "@icons-pack/react-simple-icons";
import {owner, repo } from "@/lib/github";

type EditSourceProps = {
  path: string | undefined;
};

export const EditSource = ({ path }: EditSourceProps) => {
  let url: string | undefined;

  if (owner && repo && path) {
    url=`https://github.com/${owner}/${repo}/blob/main/apps/docs/content/docs/${path.startsWith('/') ? path.slice(1) : path}`

  }

  if (!url) {
    return null;
  }

  return (
    <a
      className="flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
      href={url}
      rel="noopener noreferrer"
      target="_blank"
    >
      <SiGithub className="size-3.5" />
      <span>Edit this page on GitHub</span>
    </a>
  );
};
