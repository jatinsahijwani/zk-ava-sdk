# Prerequisites

`zk-ava-sdk` is designed to be **zero-setup** — it bundles the heavy ZK tooling so you
don't have to install it globally. You still need a few basics on your machine and a
funded wallet to deploy to a real network.

## What you need

| Requirement | Why | Notes |
| ----------- | --- | ----- |
| **Node.js** (v16+ recommended) | The SDK is a Node CLI and library. | Includes `npx`, used to run the CLI. |
| **npm** | Install the package and its dependencies. | Ships with Node.js. |
| **An Avalanche wallet private key** | Needed to pay gas when you `deploy` the verifier. | A standard EVM private key (e.g. from MetaMask). |
| **AVAX for gas** | Deploying a contract costs gas. | Use the free [Fuji faucet](https://faucet.avax.network/) for testnet AVAX. |

## What you do **not** need to install

The following are bundled with the package — there is no separate install step:

* 🧰 **The Circom compiler** — a `circom` binary ships in `bin/circom`.
* 📚 **circomlib** — the standard Circom component library ships in `circomlib/`.
* 🔑 **A Powers of Tau file** — `ptau/pot12_final.ptau` is bundled for the trusted setup.
* ⚙️ **snarkjs / solc / web3** — installed automatically as npm dependencies.

{% hint style="info" %}
Because a Powers of Tau file of size `2^12` is bundled, circuits are limited to roughly
**4,096 constraints**. See [Constraint Limits & PTAU](../reference/constraints-ptau.md)
for details and how to think about circuit size.
{% endhint %}

## Helpful background

You'll get more out of the SDK if you're comfortable with:

* **Basic Circom** — how to declare signals, write constraints, and instantiate templates.
  See the [Circom & Circuits](../concepts/circom-circuits.md) primer for a refresher.
* **The idea of a zero-knowledge proof** — see [Zero-Knowledge Proofs](../concepts/zero-knowledge-proofs.md).

You do **not** need prior experience with Solidity, web3.js, or blockchain deployment —
that's exactly what the SDK abstracts away.

## Getting testnet AVAX

1. Copy your wallet address.
2. Visit the [Avalanche Fuji faucet](https://faucet.avax.network/).
3. Request test AVAX (you may need a small mainnet balance or a coupon code depending on
   the faucet's current policy).
4. Confirm the balance on the [Fuji explorer](https://testnet.snowtrace.io/).

Once you have Node.js and a funded testnet wallet, head to
[Installation](installation.md).
