import Link from "next/link";
import {
  freeShippingLabel,
  hasSupportPhone,
  siteConfig,
  telHref,
} from "@/lib/site";

export function AnnouncementBar({ message }: { message?: string }) {
  const text = message || freeShippingLabel();
  const phone = hasSupportPhone();

  return (
    <div className="bg-brand-forest text-[#f4f1e8]">
      <div className="container-wide relative flex h-[var(--announcement-height)] items-center justify-center gap-3 px-4 text-center text-xs tracking-[0.12em] uppercase sm:text-[0.7rem]">
        <span>{text}</span>
        <Link
          href="/shop"
          className="hidden font-medium text-[#e8d5a3] underline-offset-4 hover:underline sm:inline"
        >
          Shop Tea
        </Link>
        {phone && (
          <a
            href={telHref()}
            className="absolute right-4 hidden items-center text-[0.65rem] tracking-[0.08em] text-[#e8d5a3]/90 underline-offset-4 hover:underline lg:inline-flex"
            data-analytics="announcement_call"
          >
            Call us
          </a>
        )}
        {!phone && siteConfig.market === "CA" && (
          <span className="absolute right-4 hidden text-[0.65rem] tracking-[0.1em] text-[#e8d5a3]/80 lg:inline">
            Prices in CAD
          </span>
        )}
      </div>
    </div>
  );
}
