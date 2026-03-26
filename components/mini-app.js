"use client";

import { useEffect, useMemo, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  WagmiProvider,
  useAccount,
  useConnect,
  useDisconnect,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract
} from "wagmi";
import { formatUnits, isAddress, parseUnits } from "viem";
import { base } from "wagmi/chains";
import { injected, coinbaseWallet } from "wagmi/connectors";
import { createConfig, http } from "wagmi";

import { baseWalletCollectAbi, contractAddress } from "@/lib/contract";
import { trackTransaction } from "@/utils/track";

const queryClient = new QueryClient();

const config = createConfig({
  chains: [base],
  connectors: [
    injected({ shimDisconnect: true }),
    coinbaseWallet({
      appName: "Base Wallet Collect"
    })
  ],
  transports: {
    [base.id]: http("https://mainnet.base.org")
  }
});

function shorten(value) {
  if (!value) return "";
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

function ActionButton({ children, busy, ...props }) {
  return (
    <button className="action-button" disabled={busy || props.disabled} {...props}>
      {busy ? "Processing..." : children}
    </button>
  );
}

function MetricCard({ label, value, caption }) {
  return (
    <div className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{caption}</small>
    </div>
  );
}

function Section({ eyebrow, title, description, children }) {
  return (
    <section className="panel">
      <div className="section-heading">
        <span>{eyebrow}</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {children}
    </section>
  );
}

function MiniAppInner() {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending: connecting, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();
  const [status, setStatus] = useState("Connect a wallet on Base to start managing this ERC-20 contract.");
  const [activeHash, setActiveHash] = useState("");
  const [transferForm, setTransferForm] = useState({ to: "", amount: "" });
  const [approveForm, setApproveForm] = useState({ spender: "", amount: "" });
  const [delegatedForm, setDelegatedForm] = useState({ from: "", to: "", amount: "" });

  const contractConfig = {
    abi: baseWalletCollectAbi,
    address: contractAddress,
    chainId: base.id
  };

  const { data: tokenName } = useReadContract({
    ...contractConfig,
    functionName: "name"
  });

  const { data: tokenSymbol } = useReadContract({
    ...contractConfig,
    functionName: "symbol"
  });

  const { data: tokenDecimals } = useReadContract({
    ...contractConfig,
    functionName: "decimals"
  });

  const decimals = Number(tokenDecimals ?? 18);

  const { data: totalSupply } = useReadContract({
    ...contractConfig,
    functionName: "totalSupply"
  });

  const { data: walletBalance } = useReadContract({
    ...contractConfig,
    functionName: "balanceOf",
    args: [address],
    query: {
      enabled: Boolean(address)
    }
  });

  const { data: walletAllowance } = useReadContract({
    ...contractConfig,
    functionName: "allowance",
    args: [address, approveForm.spender || "0x0000000000000000000000000000000000000000"],
    query: {
      enabled: Boolean(address) && isAddress(approveForm.spender || "0x0000000000000000000000000000000000000000")
    }
  });

  const { writeContractAsync, isPending: isWritePending } = useWriteContract();

  const receipt = useWaitForTransactionReceipt({
    chainId: base.id,
    hash: activeHash || undefined,
    query: {
      enabled: Boolean(activeHash)
    }
  });

  useEffect(() => {
    if (receipt.isSuccess && activeHash && address) {
      setStatus(`Transaction confirmed on Base: ${activeHash}`);
      trackTransaction("app-001", "Base Wallet Collect", address, activeHash);
      setActiveHash("");
    }
  }, [receipt.isSuccess, activeHash, address]);

  const formattedSupply = useMemo(() => {
    if (typeof totalSupply === "undefined") return "--";
    return Number(formatUnits(totalSupply, decimals)).toLocaleString(undefined, {
      maximumFractionDigits: 4
    });
  }, [totalSupply, decimals]);

  const formattedBalance = useMemo(() => {
    if (typeof walletBalance === "undefined") return "--";
    return Number(formatUnits(walletBalance, decimals)).toLocaleString(undefined, {
      maximumFractionDigits: 6
    });
  }, [walletBalance, decimals]);

  const formattedAllowance = useMemo(() => {
    if (typeof walletAllowance === "undefined") return "--";
    return Number(formatUnits(walletAllowance, decimals)).toLocaleString(undefined, {
      maximumFractionDigits: 6
    });
  }, [walletAllowance, decimals]);

  async function submitWrite(fnName, args, label) {
    try {
      setStatus(`Awaiting wallet confirmation for ${label}...`);
      const hash = await writeContractAsync({
        ...contractConfig,
        functionName: fnName,
        args
      });
      setActiveHash(hash);
      setStatus(`Transaction submitted. Waiting for confirmation: ${hash}`);
    } catch (error) {
      setStatus(error?.shortMessage || error?.message || `${label} failed.`);
    }
  }

  function ensureReady() {
    if (!isConnected || !address) {
      setStatus("Please connect your wallet first.");
      return false;
    }

    if (chain?.id !== base.id) {
      setStatus("Please switch your wallet to Base mainnet.");
      return false;
    }

    return true;
  }

  async function handleTransfer(event) {
    event.preventDefault();
    if (!ensureReady()) return;
    if (!isAddress(transferForm.to)) {
      setStatus("Enter a valid recipient address.");
      return;
    }
    await submitWrite(
      "transfer",
      [transferForm.to, parseUnits(transferForm.amount || "0", decimals)],
      "transfer"
    );
  }

  async function handleApprove(event) {
    event.preventDefault();
    if (!ensureReady()) return;
    if (!isAddress(approveForm.spender)) {
      setStatus("Enter a valid spender address.");
      return;
    }
    await submitWrite(
      "approve",
      [approveForm.spender, parseUnits(approveForm.amount || "0", decimals)],
      "approval"
    );
  }

  async function handleDelegatedTransfer(event) {
    event.preventDefault();
    if (!ensureReady()) return;
    if (!isAddress(delegatedForm.from) || !isAddress(delegatedForm.to)) {
      setStatus("Enter valid source and destination addresses.");
      return;
    }
    await submitWrite(
      "transferFrom",
      [
        delegatedForm.from,
        delegatedForm.to,
        parseUnits(delegatedForm.amount || "0", decimals)
      ],
      "delegated transfer"
    );
  }

  return (
    <main className="page-shell">
      <div className="content-grid">
        <section className="hero panel panel-hero">
          <div className="hero-copy">
            <span className="pill">Base Mini App</span>
            <h1>Base Wallet Collect</h1>
            <p>
              A polished ERC-20 control room for supply intelligence, wallet balances, direct transfers,
              approvals, and delegated transfers on Base.
            </p>
            <div className="hero-actions">
              {!isConnected ? (
                connectors.map((connector) => (
                  <ActionButton
                    key={connector.uid}
                    busy={connecting && pendingConnector?.uid === connector.uid}
                    onClick={() => connect({ connector })}
                  >
                    Connect {connector.name}
                  </ActionButton>
                ))
              ) : (
                <>
                  <div className="wallet-chip">
                    <span>{shorten(address)}</span>
                    <small>{chain?.name || "Unknown network"}</small>
                  </div>
                  <ActionButton onClick={() => disconnect()}>Disconnect</ActionButton>
                </>
              )}
            </div>
          </div>
          <div className="hero-side">
            <div className="contract-card">
              <span>Contract</span>
              <strong>{contractAddress}</strong>
              <small>ERC-20 token contract on Base mainnet</small>
            </div>
            <div className="status-box">
              <span>Live status</span>
              <p>{status}</p>
              {receipt.isLoading ? <small>Base confirmation in progress...</small> : null}
              {activeHash ? (
                <a href={`https://basescan.org/tx/${activeHash}`} target="_blank" rel="noreferrer">
                  View pending tx on Basescan
                </a>
              ) : null}
            </div>
          </div>
        </section>

        <section className="metrics-grid">
          <MetricCard label="Token Name" value={tokenName || "--"} caption="Read directly from contract" />
          <MetricCard label="Symbol" value={tokenSymbol || "--"} caption="Base ERC-20 identifier" />
          <MetricCard label="Total Supply" value={formattedSupply} caption={`Decimals: ${decimals}`} />
          <MetricCard label="Your Balance" value={formattedBalance} caption={address ? "Wallet-linked balance" : "Connect to read"} />
        </section>

        <Section
          eyebrow="Allowance insight"
          title="Check spend room before moving funds"
          description="Allowance refreshes against the current wallet and the spender address entered below."
        >
          <div className="allowance-banner">
            <span>Current allowance</span>
            <strong>{formattedAllowance}</strong>
            <small>Owner: {address ? shorten(address) : "--"} / Spender: {approveForm.spender ? shorten(approveForm.spender) : "--"}</small>
          </div>
        </Section>

        <div className="forms-grid">
          <Section
            eyebrow="Action 01"
            title="Transfer tokens"
            description="Send tokens directly from your connected wallet to another Base address."
          >
            <form className="token-form" onSubmit={handleTransfer}>
              <label>
                Recipient
                <input
                  placeholder="0x..."
                  value={transferForm.to}
                  onChange={(event) => setTransferForm((prev) => ({ ...prev, to: event.target.value.trim() }))}
                />
              </label>
              <label>
                Amount
                <input
                  placeholder="0.0"
                  inputMode="decimal"
                  value={transferForm.amount}
                  onChange={(event) => setTransferForm((prev) => ({ ...prev, amount: event.target.value }))}
                />
              </label>
              <ActionButton type="submit" busy={isWritePending || receipt.isLoading}>
                Send Transfer
              </ActionButton>
            </form>
          </Section>

          <Section
            eyebrow="Action 02"
            title="Approve a spender"
            description="Grant another address permission to spend a defined amount of your tokens."
          >
            <form className="token-form" onSubmit={handleApprove}>
              <label>
                Spender
                <input
                  placeholder="0x..."
                  value={approveForm.spender}
                  onChange={(event) => setApproveForm((prev) => ({ ...prev, spender: event.target.value.trim() }))}
                />
              </label>
              <label>
                Amount
                <input
                  placeholder="0.0"
                  inputMode="decimal"
                  value={approveForm.amount}
                  onChange={(event) => setApproveForm((prev) => ({ ...prev, amount: event.target.value }))}
                />
              </label>
              <ActionButton type="submit" busy={isWritePending || receipt.isLoading}>
                Approve Amount
              </ActionButton>
            </form>
          </Section>

          <Section
            eyebrow="Action 03"
            title="Transfer from allowance"
            description="Use an existing allowance to move tokens from one address to another."
          >
            <form className="token-form" onSubmit={handleDelegatedTransfer}>
              <label>
                From
                <input
                  placeholder="0x..."
                  value={delegatedForm.from}
                  onChange={(event) => setDelegatedForm((prev) => ({ ...prev, from: event.target.value.trim() }))}
                />
              </label>
              <label>
                To
                <input
                  placeholder="0x..."
                  value={delegatedForm.to}
                  onChange={(event) => setDelegatedForm((prev) => ({ ...prev, to: event.target.value.trim() }))}
                />
              </label>
              <label>
                Amount
                <input
                  placeholder="0.0"
                  inputMode="decimal"
                  value={delegatedForm.amount}
                  onChange={(event) => setDelegatedForm((prev) => ({ ...prev, amount: event.target.value }))}
                />
              </label>
              <ActionButton type="submit" busy={isWritePending || receipt.isLoading}>
                Execute transferFrom
              </ActionButton>
            </form>
          </Section>
        </div>

        <section className="panel footer-panel">
          <div>
            <span className="eyebrow">Builder-ready metadata</span>
            <h2>Prepared for Base app directory and attribution tracking</h2>
          </div>
          <div className="footer-meta">
            <div>
              <span>App ID</span>
              <strong>69ba504a5b0dee671be77ead</strong>
            </div>
            <div>
              <span>Talent verification</span>
              <strong>Embedded in page head</strong>
            </div>
            <div>
              <span>Attribution</span>
              <strong>Tracks confirmed transaction hashes</strong>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export function MiniApp() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <MiniAppInner />
      </QueryClientProvider>
    </WagmiProvider>
  );
}

