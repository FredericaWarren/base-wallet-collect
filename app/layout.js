import "./globals.css";

const appUrl = "https://base-wallet-collect.vercel.app";
const embedMetadata = JSON.stringify({
  version: "next",
  imageUrl: `${appUrl}/api/og`,
  button: {
    title: "Open Mini App",
    action: {
      type: "launch_frame",
      name: "Base Wallet Collect",
      url: appUrl,
      splashImageUrl: `${appUrl}/api/icon`,
      splashBackgroundColor: "#08111f"
    }
  }
});

export const metadata = {
  metadataBase: new URL(appUrl),
  title: "Base Wallet Collect",
  description: "Create and manage ERC-20 token activity on Base with supply, balances, transfers, approvals, and delegated transfers.",
  openGraph: {
    title: "Base Wallet Collect",
    description: "A polished Base mini app for ERC-20 supply, balance, transfer, approval, and transferFrom actions.",
    url: appUrl,
    siteName: "Base Wallet Collect",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "Base Wallet Collect"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Base Wallet Collect",
    description: "Manage ERC-20 actions on Base in a refined mini app.",
    images: ["/api/og"]
  },
  other: {
    "fc:miniapp": embedMetadata,
    "fc:frame": embedMetadata
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="base:app_id" content="69ba504a5b0dee671be77ead" />
        <meta
          name="talentapp:project_verification"
          content="bf7b2519ea691d2d8e34974ca30a4d7e86169f7a87c189ed655baadeaad0bcbd63a82ebffaa2c2b5c647018697e530421729345170585eb362dad0dafd12761a"
        />
        <meta name="application-name" content="Base Wallet Collect" />
        <meta name="apple-mobile-web-app-title" content="Base Wallet Collect" />
        <meta
          name="keywords"
          content="Base, Mini App, ERC-20, token dashboard, transfer, approve, transferFrom"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
