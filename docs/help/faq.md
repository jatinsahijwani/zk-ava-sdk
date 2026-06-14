# FAQ

### Do I need to install Circom, snarkjs, solc, or web3 separately?

No. The `circom` binary and `circomlib` are **bundled** with the package, and `snarkjs`,
`solc`, `web3`, and the rest are installed automatically as npm dependencies. Just
`npm install zk-ava-sdk`. See [Installation](../getting-started/installation.md).

### Which proving system does it use?

**Groth16**. It produces tiny proofs and has cheap, constant-time on-chain verification,
which is ideal for blockchains. See [Groth16 & Trusted Setup](../concepts/groth16-trusted-setup.md).

### How large can my circuit be?

Up to roughly **4,096 constraints**, set by the bundled `pot12_final.ptau`. Larger circuits
need a larger Powers of Tau file. See [Constraint Limits & PTAU](../reference/constraints-ptau.md).

### Does verifying a proof cost gas?

No. [`verifyProof()`](../api/verify-proof.md) calls the contract as a read-only `view` call,
which is free. You only pay gas to **deploy** the verifier (or if you verify inside a
state-changing transaction from another contract).

### Which networks are supported?

Avalanche **C-Chain**: Fuji testnet (default) and mainnet (via `--mainnet`). See
[Network & RPC Details](../reference/networks.md).

### Do I need to know Solidity or web3?

No. The SDK generates, compiles, deploys, and calls the verifier for you. Knowing Solidity
helps only if you want to verify proofs from your *own* contract — see
[Integrating Verification into a dApp](../guides/dapp-integration.md).

### Can I verify a proof from a frontend / another contract instead of the SDK?

Yes. Use the address and ABI in `deployment.json`. Remember the G2 `pi_b` inner-array swap
when formatting calldata — [Proof Calldata Format](../reference/calldata.md) and the
[dApp guide](../guides/dapp-integration.md) cover both patterns.

### Where do my private inputs go? Are they leaked?

Private inputs stay on your machine — they're used to generate the proof and are never
published. Only the **public signals** (`public.json`) are revealed. This is the
zero-knowledge property; see [Zero-Knowledge Proofs](../concepts/zero-knowledge-proofs.md).

### Is the bundled trusted setup safe to use on mainnet?

It carries a trust assumption (you're trusting the ceremony that produced the bundled ptau).
That's fine for learning and testnet. For high-value mainnet use, prefer a ptau from a
ceremony you trust. The trusted setup affects soundness, never zero-knowledge — see
[Security Considerations](security.md).

### What happens if I change my circuit after deploying?

You must re-`compile` and re-`deploy`. The verifier is immutable and circuit-specific, so a
changed circuit means a new verifier at a new address. See [Deploying to Mainnet](../guides/mainnet.md).

### Why does my valid proof return `false` on-chain?

Almost always the `pi_b` ordering (if you call the contract yourself), mismatched public
signals, or the wrong network. See [Troubleshooting](troubleshooting.md).

### Can I keep both a testnet and a mainnet deployment?

Yes — `deployment.json` is overwritten on each deploy, so keep separate circuit folders (or
back up the file) to retain both. See [Generated Artifacts](../architecture/artifacts.md).
