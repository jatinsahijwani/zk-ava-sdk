# zk-ava-sdk 

**Write Circom. Compile. Deploy. Verify — all in just one click, Powered by Avalanche**

A zero-setup toolkit to build, deploy, and verify ZK circuits using Circom — with **no Web3 knowledge required**.

---

## ✨ Features

- 🧠 Write simple Circom circuits
- 🛠 Compile to `.r1cs`, `.wasm`, `.zkey`, and Solidity verifier
- 🚀 Deploy verifier to **Avalanche** with one command
- ✅ Verify proofs using a single JavaScript function
- 🧪 No Web3 scripting, no ABI handling — fully abstracted

---

## 📦 Installation

Install in your project:

```bash
npm install zk-ava-sdk
```

⚡ Usage

### ✅ Compile Circom circuit

```bash
npx zk-ava-sdk compile <path-to-your-circom-file>
```

This command:

- Compiles your .circom file
- Runs Groth16 trusted setup
- Outputs .r1cs, .wasm, circuit_final.zkey, and verifier.sol
- All files are saved in a folder named after your circuit (e.g., ./yourCircuit/)

### ✅ Test Compiled Circom Circuit

```bash
npx zk-ava-sdk test <path-to-generated-folder> <path-to-input.json>
```

This command:

- Tests the zk System produced by the compile command
- Uses inputs provided by the developer from input.json provided
- produces proof.json and public.json
- proof.json contains the smart contract parameters, which will be used to verify it onchain
- public.json contains human verifiable outputs and proofs

### ✅ Deploy Compiled Circom Circuit

Deploy to **Avalanche Fuji testnet** (default):

```bash
npx zk-ava-sdk deploy <path-to-generated-folder> <PRIVATE_KEY_OF_WALLET>
```

Deploy to **Avalanche C-Chain mainnet** with the `--mainnet` flag:

```bash
npx zk-ava-sdk deploy --mainnet <path-to-generated-folder> <PRIVATE_KEY_OF_WALLET>
```

This command:

- Compiles verifier.sol generated during compilation using solc
- Deploys the compiled binary to Avalanche (Fuji by default, mainnet with `--mainnet`), taking fees from the provided wallet's private key
- Persists the chosen network into `deployment.json`, so `verifyProof` automatically uses the correct RPC


### ✅ Verify ZK Proof Programmatically

You can verify a proof directly using a single function call.

```js
const { verifyProof } = require("zk-ava-sdk");

const result = await verifyProof({
  input: {
    // Your circuit input goes here
  },
  "<relative-path-to-generated-folder>",
});

console.log(result ? "✅ Valid proof" : "❌ Invalid proof");
```

- You pass input (in the form of json) & Relative path to the generated folder, which was generated during compilation process
- Automatically generates the proof and public signals
- Formats the calldata for the Solidity verifier
- Calls the deployed verifier contract on Avalanche and returns the result

# You don’t need to manually use snarkjs or interact with web3 directly — the SDK abstracts it all for you.

## 🛠 Commands Overview

| Command                                       | Description                                      |
|----------------------------------------------|--------------------------------------------------|
| `npx zk-ava-sdk compile <path-to-circuit>` | Compiles the `.circom` file and runs Groth16 setup |
| `npx zk-ava-sdk test <output-folder> <path-to-input.json>` | Tests the Circom logic locally using ZK Proofs        |
| `npx zk-ava-sdk deploy [--mainnet] <output-folder> <private-key>` | Deploys the verifier contract to Avalanche (Fuji by default; pass `--mainnet` for C-Chain mainnet) |
| `verifyProof(input,"<relative-path-to-output-folder>")` *(programmatic only)* | Generates proof and verifies it on-chain using deployed contract |


