# Roadmap

Candidate directions for `zk-ava-sdk`. This is a living wishlist, not a commitment — it
captures where the project could grow.

## Near-term

* **Configurable Powers of Tau** — allow `compile` to accept a custom/larger `.ptau` path so
  users can build circuits beyond the ~4,096-constraint ceiling without editing the source.
  See [Constraint Limits & PTAU](../reference/constraints-ptau.md).
* **Safer key handling** — read the deploy private key from an environment variable or an
  interactive prompt instead of a plain CLI argument. See
  [Security Considerations](../help/security.md).
* **`verify` CLI command** — a terminal counterpart to the [`verifyProof()`](../api/verify-proof.md)
  function for quick on-chain checks without writing a script.

## Medium-term

* **Multi-chain support** — generalize deployment and verification to other EVM chains while
  keeping Avalanche the default. The `deploy`/`verify` modules already isolate the RPC, so
  this is mostly configuration.
* **Concurrency-safe proving** — isolate per-call artifacts so `verifyProof()` can be used
  safely from a concurrent server (today it writes shared files in the circuit folder). See
  [Integrating Verification into a dApp](../guides/dapp-integration.md).
* **Automated test suite** — fixture circuits and an end-to-end compile → test → verify run
  in CI.

## Longer-term / exploratory

* **Additional proving systems** — e.g. PLONK (universal setup, no per-circuit ceremony) as
  an alternative to Groth16. See [Groth16 & Trusted Setup](../concepts/groth16-trusted-setup.md).
* **Deployment registry** — track multiple deployments (testnet + mainnet, multiple circuits)
  rather than a single `deployment.json` per folder.
* **Project scaffolding** — an `init` command that generates a starter circuit, input, and
  verify script.
* **Gas/cost reporting** — surface deployment cost estimates before sending the transaction.

## Want to help?

Pick anything above (or propose your own) and see [Contributing](contributing.md) for the
codebase layout and local setup. The modular `lib/` structure means most features land in a
single file.
