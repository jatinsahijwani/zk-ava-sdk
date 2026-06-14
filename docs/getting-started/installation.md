# Installation

## Install from npm

Add the SDK to your project:

```bash
npm install zk-ava-sdk
```

That's it. The install pulls in everything the SDK needs, including the bundled tooling.

## What gets installed

The published package ships these files (declared in `package.json`'s `files` field):

| Path | Purpose |
| ---- | ------- |
| `bin/` | The CLI entry point (`cli.js`), the library entry (`index.js`), and the bundled `circom` binary. |
| `lib/` | The four core modules: `compile.js`, `test.js`, `deploy.js`, `verify.js`. |
| `circomlib/` | The standard Circom component library, used as an include path during compilation. |
| `ptau/` & `pot12_*.ptau` | Powers of Tau files used for the Groth16 trusted setup. |
| `README.md` | The package readme. |

npm dependencies installed alongside it:

| Dependency | Role in the SDK |
| ---------- | --------------- |
| `snarkjs` | Groth16 setup, proof generation (`fullprove`), and Solidity verifier export. |
| `solc` | Compiles the generated `verifier.sol` to EVM bytecode. |
| `web3` | Deploys the verifier and calls it on the Avalanche C-Chain. |
| `fs-extra` | File/JSON utilities used across the modules. |
| `commander` | Parses the CLI commands and flags. |
| `circom` / `circomlib` | Circom toolchain and standard library. |

## Verify the install

Run the CLI with no arguments to confirm it resolves and prints the command list:

```bash
npx zk-ava-sdk --help
```

You should see the `compile`, `test`, and `deploy` commands listed.

## Using it as a library

The package also exposes a programmatic API. In any Node file inside your project:

```js
const { verifyProof, compileCircuit, testCircuit, deployVerifier } = require("zk-ava-sdk");
```

See [Library Exports](../api/library-exports.md) for the full programmatic surface, and
[verifyProof](../api/verify-proof.md) for the most commonly used function.

## Next step

You're ready to build. Continue to the [Quick Start](quick-start.md) for a complete
end-to-end walkthrough.
