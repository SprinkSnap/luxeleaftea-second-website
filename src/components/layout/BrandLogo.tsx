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
 * Target visual widths: mobile 155–180 · tablet 180–205 · desktop 210–250.
 * Aspect ratio preserved (1200×791). Assets include a dark plate — on the ivory
 * header that plate reads as a premium brand badge. Do not stretch or crop.
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
            ? // Compact scroll state — still prominent, avoids header jump
              "h-[3.1rem] w-[9.75rem] sm:h-[3.35rem] sm:w-[11rem] md:h-14 md:w-[12rem] lg:h-[3.65rem] lg:w-[13.5rem]"
            : // Default: mobile ~156px, tablet ~192px, desktop ~220–240px
              "h-[3.35rem] w-[9.75rem] xs:w-[10.5rem] sm:h-[3.6rem] sm:w-[11.5rem] md:h-[3.85rem] md:w-[12.75rem] lg:h-[4.15rem] lg:w-[14rem] xl:h-[4.35rem] xl:w-[15rem]",
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
