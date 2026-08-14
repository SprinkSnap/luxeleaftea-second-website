import { ImageResponse } from "next/og";

export const alt = "Lux Leaf Tea — Premium loose-leaf tea";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "linear-gradient(145deg, #f8f5ee 0%, #efe8da 48%, #e4dcc8 100%)",
          color: "#12261f",
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: 28,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#5a655e",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Lux Leaf Tea
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 72,
              lineHeight: 1.05,
              maxWidth: 900,
              fontWeight: 500,
            }}
          >
            Premium loose-leaf tea
          </div>
          <div
            style={{
              fontSize: 30,
              color: "#5a655e",
              maxWidth: 720,
              fontFamily: "system-ui, sans-serif",
              lineHeight: 1.35,
            }}
          >
            Chosen for flavour, aroma, origin and character.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 22,
            color: "#1b3a2f",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: "#b8923f",
            }}
          />
          Whole-leaf quality · Brewing guidance included
        </div>
      </div>
    ),
    { ...size },
  );
}
