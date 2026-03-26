import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "radial-gradient(circle at top left, rgba(77,182,255,0.36), transparent 32%), linear-gradient(160deg, #050b14 0%, #08111f 45%, #0c1830 100%)",
          color: "#ebf3ff",
          padding: "56px 64px",
          fontFamily: "sans-serif"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: 999,
              background: "#4db6ff"
            }}
          />
          <div style={{ fontSize: 28, letterSpacing: 3, textTransform: "uppercase", color: "#85ffc7" }}>
            Base Mini App
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1 }}>Base Wallet Collect</div>
          <div style={{ fontSize: 36, color: "#9eb5d9", maxWidth: 920 }}>
            Supply, balance, transfer, approve, transferFrom on Base.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 26
          }}
        >
          <div style={{ color: "#9eb5d9" }}>Contract 0x787382798015f84171081675bbd33d3590e29b3e</div>
          <div
            style={{
              padding: "12px 18px",
              borderRadius: 999,
              background: "rgba(133,255,199,0.12)",
              color: "#85ffc7"
            }}
          >
            Builder bc_6r04cgxs
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630
    }
  );
}
