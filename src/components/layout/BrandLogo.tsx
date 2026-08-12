import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  compact?: boolean;
  className?: string;
  priority?: boolean;
};

/**
 * Responsive Lux Leaf Tea logo (source-of-truth assets).
 * Breakpoints:
 * - Mobile <768px → 600px WebP
 * - Tablet 768–1023px → 900px WebP
 * - Desktop ≥1024px → 1200px WebP
 * Intrinsic ratio 1200×791 preserved via height-driven width:auto.
 */
export function BrandLogo({
  compact = false,
  className,
  priority = true,
}: BrandLogoProps) {
  return (
    <Link
      href="/"
      aria-label="Lux Leaf Tea — Home"
      className={cn(
        "group relative inline-flex shrink-0 items-center justify-center",
        className,
      )}
    >
      <span
        className={cn(
          "relative block transition-[height] duration-300 ease-out motion-reduce:transition-none",
          compact
            ? "h-10 sm:h-11 lg:h-12"
            : "h-12 sm:h-14 md:h-[3.75rem] lg:h-[4.25rem]",
        )}
      >
        <picture>
          <source
            media="(min-width: 1024px)"
            srcSet={siteConfig.logo.desktop}
            type="image/webp"
          />
          <source
            media="(min-width: 768px)"
            srcSet={siteConfig.logo.tablet}
            type="image/webp"
          />
          <img
            src={siteConfig.logo.mobile}
            alt=""
            width={1200}
            height={791}
            decoding="async"
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            className="h-full w-auto max-w-none object-contain object-center"
            draggable={false}
          />
        </picture>
      </span>
    </Link>
  );
}
