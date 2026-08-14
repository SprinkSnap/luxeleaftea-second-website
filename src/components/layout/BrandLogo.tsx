import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  compact?: boolean;
  className?: string;
  priority?: boolean;
  /** Inverse surfaces (e.g. dark mobile drawer) */
  onDark?: boolean;
};

/**
 * Responsive Lux Leaf Tea logo (source-of-truth assets).
 * Target visual widths: mobile 130–155 · tablet 150–180 · desktop 180–220.
 * Aspect ratio preserved (1200×791). Assets include a dark plate — on the ivory
 * header that plate reads as a premium brand badge.
 */
export function BrandLogo({
  compact = false,
  className,
  priority = true,
  onDark = false,
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
          "relative block overflow-hidden transition-[width,height] duration-300 ease-out motion-reduce:transition-none",
          onDark && "rounded-sm",
          compact
            ? "h-[2.75rem] w-[7.5rem] sm:h-12 sm:w-[8.5rem] lg:h-[3.25rem] lg:w-[10rem]"
            : "h-12 w-[8.5rem] sm:h-[3.35rem] sm:w-[10rem] md:h-14 md:w-[11rem] lg:h-[3.75rem] lg:w-[13rem]",
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
            className="h-full w-full object-contain object-center"
            draggable={false}
          />
        </picture>
      </span>
    </Link>
  );
}
