# Library Exports

Beyond the CLI, every core function is exported for programmatic use. This lets you build
the entire pipeline into your own scripts, tests, or tooling.

## Importing

```js
const {
  compileCircuit,
  testCircuit,
  deployVerifier,
  verifyProof,
} = require("zk-ava-sdk");
```

These come from the package's `main` entry (`bin/index.js`).

## API surface

### `compileCircuit(circuitPath)`

Compiles a circuit, runs the Groth16 setup, and exports the verifier — the programmatic
equivalent of the [`compile`](../cli/compile.md) command.

```js
await compileCircuit("multiplier.circom");
// → creates ./multiplier/ with .r1cs, .wasm, circuit_final.zkey, verifier.sol
```

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `circuitPath` | `string` | Path to the `.circom` file. |

Returns a promise. The output folder is derived from the circuit's base name, relative to
the current working directory.

---

### `testCircuit(folderPath, inputPath)`

Generates a proof from an input file — the equivalent of [`test`](../cli/test.md).

```js
testCircuit("./multiplier", "./input.json");
// → writes proof.json and public.json into ./multiplier/
```

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `folderPath` | `string` | The compiled circuit folder. |
| `inputPath` | `string` | Path to the input JSON file. |

---

### `deployVerifier(folderPath, privateKey, options?)`

Compiles and deploys `verifier.sol` — the equivalent of [`deploy`](../cli/deploy.md).

```js
await deployVerifier("./multiplier", process.env.PRIVATE_KEY);            // Fuji
await deployVerifier("./multiplier", process.env.PRIVATE_KEY, { mainnet: true }); // mainnet
```

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `folderPath` | `string` | Folder containing `verifier.sol`. |
| `privateKey` | `string` | Wallet key that pays gas. |
| `options.mainnet` | `boolean` | `true` → C-Chain mainnet; otherwise Fuji testnet. |

Writes `deployment.json` and returns a promise.

{% hint style="danger" %}
Pass the private key from an environment variable, never a literal. See
[Security Considerations](../help/security.md).
{% endhint %}

---

### `verifyProof(input, folderPath)`

Generates a proof and verifies it on-chain. This is the most commonly used export and has
its own page: [verifyProof](verify-proof.md).

```js
const { result, publicSignals } = await verifyProof({ a: 3, b: 11 }, "./multiplier");
```

## Building the full pipeline in code

```js
const { compileCircuit, deployVerifier, verifyProof } = require("zk-ava-sdk");

(async () => {
  await compileCircuit("multiplier.circom");
  await deployVerifier("./multiplier", process.env.PRIVATE_KEY);
  const { result } = await verifyProof({ a: 3, b: 11 }, "./multiplier");
  console.log(result ? "✅ valid" : "❌ invalid");
})();
```

{% hint style="info" %}
`compileCircuit`, `testCircuit`, and `deployVerifier` are CLI-oriented: on errors,
`deployVerifier` and `testCircuit` call `process.exit(1)` and print to the console. Keep
that in mind when embedding them in long-running processes.
{% endhint %}
