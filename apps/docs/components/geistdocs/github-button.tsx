import { SiGithub } from "@icons-pack/react-simple-icons";
// import { github } from "@/geistdocs";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { owner, repo } from '@/lib/github'
interface GitHubButtonProps {
  className?: string;
}

export const GitHubButton = ({ className }: GitHubButtonProps) => {
  if (!(owner && repo)) {
    return null
  }

  const url = `https://github.com/${owner}/${repo}`

  return (
    <Button
      asChild
      className={cn(className)}
      size="icon-sm"
      type="button"
      variant="ghost"
    >
      <a href={url} rel="noopener" target="_blank">
        <SiGithub className="size-4" />
      </a>
    </Button>
  );
};
