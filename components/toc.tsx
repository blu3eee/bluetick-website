'use client';

import * as React from 'react';

import type { TableOfContents } from '@/lib/toc';
import { cn } from '@/lib/utils';
import { useMounted } from '@/hooks/use-mounted';

interface TocProps {
  toc: TableOfContents;
}
/**
 * Component to display a table of contents for a dashboard, highlighting the active section.
 * @param {TocProps} props - The props for the component.
 * @param {TableOfContents} props.toc - The table of contents data to display.
 * @returns {React.JSX.Element | null} The table of contents component or null if there are no items.
 */
export function DashboardTableOfContents({
  toc,
}: TocProps): React.JSX.Element | null {
  const itemIds = React.useMemo(
    () =>
      toc.items
        ? toc.items
            .flatMap((item) => [item.url, item?.items?.map((item) => item.url)])
            .flat()
            .filter(Boolean)
            .map((id) => id?.split('#')[1])
        : [],
    [toc]
  );
  const activeHeading = useActiveItem(itemIds);
  const mounted = useMounted();

  if (!toc?.items) {
    return null;
  }

  return mounted ? (
    <div className="space-y-2">
      <p className="font-medium">On This Page</p>
      <Tree tree={toc} activeItem={activeHeading} />
    </div>
  ) : null;
}

/**
 * Custom hook to determine the currently active item based on the intersection observer.
 * @param {Array<string | undefined>} itemIds - The IDs of the items to observe.
 * @returns {string} The ID of the active item.
 */
function useActiveItem(itemIds: Array<string | undefined>): string {
  const [activeId, setActiveId] = React.useState<string>('');

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: `0% 0% -80% 0%` }
    );

    itemIds?.forEach((id) => {
      if (!id) {
        return;
      }

      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      itemIds?.forEach((id) => {
        if (!id) {
          return;
        }

        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [itemIds]);

  return activeId;
}

interface TreeProps {
  tree: TableOfContents;
  level?: number;
  activeItem?: string | null;
}

/**
 * Recursive component to display a tree structure, such as a table of contents.
 * @param {TreeProps} props - The props for the Tree component.
 * @param {TableOfContents} props.tree - The tree data to display.
 * @param {number} [props.level] - The current nesting level of the tree.
 * @param {string | null} [props.activeItem] - The currently active item's ID.
 * @returns {JSX.Element | null} The Tree component for the given level, or null if no items are present.
 */
function Tree({ tree, level = 1, activeItem }: TreeProps): JSX.Element | null {
  return tree?.items?.length && level < 3 ? (
    <ul className={cn('m-0 list-none', { 'pl-4': level !== 1 })}>
      {tree.items.map((item, index) => {
        return (
          <li key={index} className={cn('mt-0 pt-2')}>
            <a
              href={item.url}
              className={cn(
                'inline-block no-underline',
                item.url === `#${activeItem}`
                  ? 'font-medium text-primary'
                  : 'text-sm text-muted-foreground'
              )}
            >
              {item.title}
            </a>
            {item.items?.length ? (
              <Tree tree={item} level={level + 1} activeItem={activeItem} />
            ) : null}
          </li>
        );
      })}
    </ul>
  ) : null;
}
