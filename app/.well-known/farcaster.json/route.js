function withValidProperties(properties) {
  return Object.fromEntries(
    Object.entries(properties).filter(([, value]) =>
      Array.isArray(value) ? value.length > 0 : value !== undefined && value !== null
    )
  );
}

export async function GET() {
  const appUrl = "https://base-wallet-collect.vercel.app";
  const accountAssociation = {
    header: process.env.FARCASTER_HEADER || "",
    payload: process.env.FARCASTER_PAYLOAD || "",
    signature: process.env.FARCASTER_SIGNATURE || ""
  };

  return Response.json({
    accountAssociation,
    miniapp: withValidProperties({
      version: "1",
      name: "Base Wallet Collect",
      subtitle: "Create and manage ERC-20 activity",
      description:
        "Query supply and balances, transfer tokens, approve spenders, and execute transferFrom on Base.",
      tagline: "ERC-20 control room for Base",
      iconUrl: `${appUrl}/api/icon`,
      splashImageUrl: `${appUrl}/api/icon`,
      splashBackgroundColor: "#08111f",
      homeUrl: appUrl,
      heroImageUrl: `${appUrl}/api/og`,
      imageUrl: `${appUrl}/api/og`,
      canonicalDomain: "base-wallet-collect.vercel.app",
      primaryCategory: "finance",
      tags: ["base", "wallet", "token", "erc20", "finance"],
      requiredChains: ["eip155:8453"]
    })
  });
}
