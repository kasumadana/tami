import { ReactNode } from "react";
import { Tabs, cn, type TabsItem } from "@cloudflare/kumo";

export interface PageHeaderProps {
  title: string;
  description?: string;
  titleBadge?: ReactNode;
  breadcrumbs?: ReactNode;
  actions?: ReactNode;
  tabs?: TabsItem[];
  tabsVariant?: "segmented" | "underline";
  value?: string;
  defaultTab?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children?: ReactNode;
  borderBottom?: boolean;
}

export function PageHeader({
  title,
  description,
  titleBadge,
  breadcrumbs,
  actions,
  tabs,
  tabsVariant = "segmented",
  value,
  defaultTab,
  onValueChange,
  className,
  children,
  borderBottom = true,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-3",
        borderBottom && "border-b border-[var(--color-tami-line)]/50 pb-4 sm:pb-5 mb-5",
        className
      )}
    >
      {/* Optional Breadcrumb Trail (Subtle hierarchy, zero arbitrary divider lines) */}
      {breadcrumbs && (
        <div className="text-xs text-[var(--color-tami-text-muted)] flex items-center gap-1.5 -mb-0.5">
          {breadcrumbs}
        </div>
      )}

      {/* Main Title, Subtitle, and Actions Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="font-heading text-xl sm:text-2xl lg:text-[26px] font-bold tracking-tight text-[var(--color-tami-text)] leading-tight">
              {title}
            </h1>
            {titleBadge}
          </div>
          {description && (
            <p className="max-w-3xl text-sm text-[var(--color-tami-text-muted)] leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-2.5 sm:self-center shrink-0 flex-wrap">
            {actions}
          </div>
        )}
      </div>

      {/* Optional Integrated Tabs Row */}
      {tabs && tabs.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1.5">
          <Tabs
            variant={tabsVariant}
            tabs={tabs}
            value={value}
            selectedValue={defaultTab}
            onValueChange={(nextValue) => {
              const stringValue = String(nextValue);
              onValueChange?.(stringValue);
            }}
            className="w-full sm:w-auto"
          />
          {children && <div className="flex items-center gap-2 shrink-0">{children}</div>}
        </div>
      )}
    </header>
  );
}
