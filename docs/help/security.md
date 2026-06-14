# Security Considerations

`zk-ava-sdk` touches private keys, real funds, and cryptographic trust assumptions. Read
this before deploying anything of value.

## Private key handling

The [`deploy`](../cli/deploy.md) command and `deployVerifier()` take a **private key** that
pays gas. Treat it like the password to your funds.

**Do:**

* Read the key from an environment variable or a secrets manager:
  ```bash
  export PRIVATE_KEY=0x...
  npx zk-ava-sdk deploy ./multiplier $PRIVATE_KEY
  ```
* Use a **dedicated deployment wallet** with only enough AVAX for gas.
* Use a testnet (Fuji) wallet for development.

**Don't:**

* ❌ Hard-code the key in source files or commit it to git.
* ❌ Paste it into shared terminals, screenshots, CI logs, or chat.
* ❌ Reuse a high-value wallet for routine deployments.

{% hint style="danger" %}
A leaked private key can drain the wallet immediately and irreversibly. If you suspect a key
is exposed, move funds to a new wallet at once.
{% endhint %}

## Trusted setup assumptions

Groth16 requires a circuit-specific trusted setup built on a Powers of Tau file. The SDK
**bundles** `pot12_final.ptau`, so by default you are trusting that file's ceremony.

* **What's at risk:** *soundness* — in the worst case, whoever holds the setup's secret
  ("toxic waste") could forge proofs that pass verification.
* **What's never at risk:** *zero-knowledge* — your private inputs stay private regardless of
  the setup.

For learning, prototyping, and testnet use, the bundled ptau is fine. For **high-value
mainnet** deployments, prefer a Powers of Tau from a public ceremony you trust and supply
that file. See [Groth16 & Trusted Setup](../concepts/groth16-trusted-setup.md) and
[Constraint Limits & PTAU](../reference/constraints-ptau.md).

## Circuit correctness is your responsibility

A deployed verifier faithfully checks whatever circuit you compiled. If your **constraints
don't actually capture your intended statement**, the verifier will happily accept proofs
that satisfy a weaker condition than you meant.

* Test edge cases with [`test`](../cli/test.md) before deploying.
* Have non-trivial circuits reviewed.
* Prefer audited [circomlib](../guides/circomlib.md) components over hand-rolled crypto.

## Network and deployment hygiene

* **Start on Fuji.** Validate the full flow on testnet before mainnet — behavior is
  identical. See [Deploying to Mainnet](../guides/mainnet.md).
* **The verifier is immutable.** You cannot patch a deployed verifier; a fix means a new
  deployment at a new address. Get the circuit right first.
* **`deployment.json` contains no secrets** (address, ABI, network, RPC) — it's safe to
  commit, and doing so keeps your app pointed at the right contract.

## What stays private vs public — recap

| Data | Visibility |
| ---- | ---------- |
| Circuit private inputs (`a`, `b`, secrets) | **Private** — never published |
| Public signals (`public.json`) | **Public** — revealed to and checked by the verifier |
| Private key | **Secret** — protect it; needed only to deploy |
| `deployment.json` | **Public** — safe to share/commit |

## See also

* [Zero-Knowledge Proofs](../concepts/zero-knowledge-proofs.md) — the privacy guarantees.
* [Troubleshooting](troubleshooting.md) — operational issues.
