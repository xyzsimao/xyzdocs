'use client';
import { Check, Share } from 'lucide-react';
import { cn } from '@/lib/cn';
import { buttonVariants } from '@/components/ui/button';
import { useCopyButton } from 'xyzdocs-ui/utils/use-copy-button';
import { AnchorProvider, type TOCItemType, useActiveAnchors } from 'xyzdocs-core/toc';



export function ShareButton({ url }: { url: string }) {
  const [isChecked, onCopy] = useCopyButton(() => {
    void navigator.clipboard.writeText(`${window.location.origin}${url}`);
  });

  return (
    <button type="button" className={cn(buttonVariants({ className: 'gap-2' }))} onClick={onCopy}>
      {isChecked ? <Check className="size-4" /> : <Share className="size-4" />}
      {isChecked ? 'Copied URL' : 'Share Post'}
    </button>
  );
}


export function TocItem({ item }: { item: TOCItemType }) {
  const isActive = useActiveAnchors().includes(item.url.slice(1));

  return (
    <a
      href={item.url}
      className={cn(
        'text-sm text-fd-foreground/80 py-1',
        isActive && 'text-fd-primary'
      )}
      style={{
        paddingLeft: Math.max(0, item.depth - 2) * 16,
      }}
    >
      {/* {item.title} */}
    </a>
  )
}
