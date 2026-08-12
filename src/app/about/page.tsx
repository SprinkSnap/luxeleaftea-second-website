import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "About Lux Leaf Tea",
  description:
    "Lux Leaf Tea is a premium loose-leaf tea boutique for people who want an elevated tea experience without needing to be a tea expert.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="container-page px-4 py-12 md:py-16">
      <h1 className="font-display text-4xl md:text-5xl">About Lux Leaf Tea</h1>
      <div className="prose-tea mt-6 space-y-4">
        <p>
          Lux Leaf Tea sources premium loose-leaf teas selected for flavour,
          aroma, and quality — then presents them with clarity so anyone can
          choose confidently.
        </p>
        <p>
          We believe exceptional tea should feel refined, calm, and welcoming:
          never clinical, never pretentious, never complicated.
        </p>
        <p>
          From sensory profiles to brewing guidance and honest inventory, every
          detail is designed to help you discover, understand, and enjoy the cup
          in front of you.
        </p>
      </div>
    </div>
  );
}
