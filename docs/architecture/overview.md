# System Overview

`zk-ava-sdk` is a thin, well-defined orchestration layer over established ZK and EVM
tooling. It does not reimplement cryptography — it **wires together** the right tools in
the right order and hides the friction.

## Layered architecture

```mermaid
flowchart TB
    subgraph Interface["Interface layer"]
        CLI["bin/cli.js<br/>(commander CLI)"]
        LIB["bin/index.js<br/>(library exports)"]
    end

    subgraph Core["Core modules — lib/"]
        COMP["compile.js"]
        TEST["test.js"]
        DEP["deploy.js"]
        VER["verify.js"]
    end

    subgraph Tools["Bundled & dependency tooling"]
        CIRCOM["circom binary<br/>(bin/circom)"]
        CL["circomlib/"]
        PTAU["pot12_final.ptau"]
        SNARK["snarkjs"]
        SOLC["solc"]
        WEB3["web3"]
    end

    Chain[(Avalanche C-Chain)]

    CLI --> COMP & TEST & DEP
    LIB --> COMP & TEST & DEP & VER

    COMP --> CIRCOM & CL & PTAU & SNARK
    TEST --> SNARK
    DEP --> SOLC & WEB3
    VER --> SNARK & WEB3

    DEP --> Chain
    VER --> Chain

    classDef chain fill:#e84142,stroke:#b00,color:#fff;
    class Chain chain;
```

## The two entry points

The SDK is usable in two ways, both backed by the same four core modules:

* **CLI** (`bin/cli.js`) — exposes `compile`, `test`, and `deploy` as terminal commands
  via [commander](https://github.com/tj/commander.js). This is the path most people use to
  build and ship.
* **Library** (`bin/index.js`) — exports `compileCircuit`, `testCircuit`,
  `deployVerifier`, and `verifyProof` for programmatic use. The on-chain `verifyProof` is
  the function you call from your own app.

{% hint style="info" %}
Note the deliberate split: **proof verification is library-only**, not a CLI command.
Verifying a proof is something your application does at runtime, so it's exposed as a
function. See [verifyProof](../api/verify-proof.md).
{% endhint %}

## The four core modules

| Module | Responsibility | Key tools used |
| ------ | -------------- | -------------- |
| `lib/compile.js` | Circuit → R1CS/WASM, Groth16 setup, export verifier | `circom`, `circomlib`, `pot12_final.ptau`, `snarkjs` |
| `lib/test.js` | Generate a proof from inputs | `snarkjs groth16 fullprove` |
| `lib/deploy.js` | Compile & deploy `verifier.sol` to Avalanche | `solc`, `web3` |
| `lib/verify.js` | Generate a proof and verify it on-chain | `snarkjs`, `web3` |

## Design principles

* **Zero-setup** — heavyweight tooling (`circom`, `circomlib`, a Powers of Tau file) is
  bundled so users don't manage it.
* **Convention over configuration** — outputs always go to a folder named after the
  circuit; the proof, verifier, and deployment info live together; `verifyProof()` finds
  everything by convention.
* **Stateful by file** — each step persists what the next step needs (`circuit_final.zkey`,
  `proof.json`, `deployment.json`), so steps are independent and resumable.

See [Components](components.md) for a file-by-file breakdown, or
[End-to-End Lifecycle](lifecycle.md) for how data flows through the whole pipeline.
