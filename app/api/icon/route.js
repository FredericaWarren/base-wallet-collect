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
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at top left, rgba(77,182,255,0.4), transparent 32%), linear-gradient(160deg, #050b14 0%, #08111f 45%, #0c1830 100%)",
          color: "#ebf3ff",
          fontFamily: "sans-serif"
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 18
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 999,
              background: "#4db6ff",
              boxShadow: "0 0 0 16px rgba(77,182,255,0.18)"
            }}
          />
          <div style={{ fontSize: 36, fontWeight: 700, textAlign: "center" }}>Base Wallet Collect</div>
        </div>
      </div>
    ),
    {
      width: 200,
      height: 200
    }
  );
}
