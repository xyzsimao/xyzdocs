import { cn } from '@/lib/cn';
import { CircleCheck, CircleX, Info, Lightbulb, TriangleAlert } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';


export type CalloutType = 'info' | 'warn' | 'error' | 'success' | 'warning' | 'idea';

const iconClass = 'size-5 -me-0.5 fill-(--callout-color) text-fd-card';

export function BlogCallout({
  children,
  title,
  ...props
}: { title?: ReactNode } & Omit<CalloutContainerProps, 'title'>) {
  return (
    <CalloutContainer {...props}>

      <CalloutDescription>{children}</CalloutDescription>
    </CalloutContainer>
  );
}

export interface CalloutContainerProps extends ComponentProps<'div'> {
  /**
   * @defaultValue info
   */
  type?: CalloutType;

  /**
   * Force an icon
   */
  icon?: ReactNode;
}

function resolveAlias(type: CalloutType) {
  if (type === 'warn') return 'warning';
  if ((type as unknown) === 'tip') return 'info';
  return type;
}

export function CalloutContainer({
  type: inputType = 'info',
  icon,
  children,
  className,
  style,
  ...props
}: CalloutContainerProps) {
  const type = resolveAlias(inputType);

  return (
    <div
      className={cn(
        'bg-blue-300 mr-[-50vw] ml-[-50vw] relative w-screen backdrop-blur-[6px] mt-0 mb-9 py-10 inset-x-2/4',
        className,
      )}

      {...props}
    >




      <div className="flex flex-col gap-2 min-w-0 flex-1">{children}</div>
    </div>
  );
}

export function CalloutTitle({ children, className, ...props }: ComponentProps<'p'>) {
  return (
    <p className={cn('font-medium my-0!', className)} {...props}>
      {children}
    </p>
  );
}

export function CalloutDescription({ children, className, ...props }: ComponentProps<'p'>) {
  return (
    <div
      className={cn('text-center', className)}
      {...props}
    >
      {children}
    </div>
  );
}
