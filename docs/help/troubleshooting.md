# Troubleshooting

Common errors, what causes them, and how to fix them. Messages below are the actual strings
the SDK prints.

## Compile errors

### `❌ Circomlib not found at: …`

**Cause:** the bundled `circomlib/circuits` directory is missing.
**Fix:** reinstall the package (`npm install zk-ava-sdk`). Don't delete or `.npmignore`
bundled folders.

### `❌ Compilation failed: <name>.r1cs not found.`

**Cause:** the circom compiler didn't produce an R1CS — usually a circuit error (syntax
mistake, missing `component main`, a bad `include`).
**Fix:** scroll up to read the circom compiler output printed just before this line, and fix
the reported issue in your `.circom` file. See [Circom & Circuits](../concepts/circom-circuits.md).

### `❌ Missing PTAU file at: …`

**Cause:** `ptau/pot12_final.ptau` is absent.
**Fix:** reinstall the package.

### Setup fails — "powers of tau too small" / constraint count error

**Cause:** the circuit exceeds the ~4,096-constraint ceiling of the bundled `pot12` ptau.
**Fix:** shrink the circuit or supply a larger ptau — see
[Constraint Limits & PTAU](../reference/constraints-ptau.md).

## Test errors

### `❌ Folder not found: …` / `❌ input.json not found: …`

**Cause:** a wrong path argument.
**Fix:** pass the folder created by `compile` and a valid path to your input JSON.

### `❌ .wasm file not found: …`

**Cause:** the folder wasn't compiled, or it was renamed so `<folder>/<name>_js/<name>.wasm`
no longer resolves.
**Fix:** re-run `compile`; keep the folder name as generated.

### `❌ circuit_final.zkey not found. Make sure to compile first.`

**Cause:** compilation didn't complete.
**Fix:** run `compile` before `test`.

### `fullprove` errors about inputs

**Cause:** the input JSON doesn't match the circuit's input signals (missing/extra fields),
or the values violate the circuit's constraints.
**Fix:** make the input keys exactly match the circuit's `signal input` names and provide
satisfying values.

## Deploy errors

### `❌ verifier.sol not found in folder: …`

**Cause:** the folder wasn't compiled.
**Fix:** run [`compile`](../cli/compile.md) first.

### `Compilation failed, no bytecode found.`

**Cause:** `solc` couldn't compile `verifier.sol`.
**Fix:** re-export the verifier via `compile`; ensure the bundled `solc` version is intact
(reinstall if needed).

### `insufficient funds` / gas estimation failures

**Cause:** the deploying wallet has no AVAX on the target network.
**Fix:** fund the wallet. For Fuji use the [faucet](https://faucet.avax.network/); for
mainnet send real AVAX. Confirm the balance on [Snowtrace](https://snowtrace.io/).

### `invalid private key` / account errors

**Cause:** the key argument is malformed.
**Fix:** pass a valid hex private key. Prefer an environment variable so it isn't mistyped or
exposed — see [Security Considerations](security.md).

## Verify errors

### `deployment.json not found in <folder>`

**Cause:** the verifier hasn't been deployed for this folder.
**Fix:** run [`deploy`](../cli/deploy.md) first so `deployment.json` exists.

### A valid-looking proof returns `false`

**Causes & fixes:**
* **Wrong `pi_b` ordering** when calling the contract yourself — the G2 inner arrays must be
  reversed. See [Proof Calldata Format](../reference/calldata.md). (`verifyProof()` handles
  this automatically.)
* **Mismatched public signals** — the `input` you pass must produce the public signals the
  contract checks.
* **Wrong network** — make sure `deployment.json`'s `rpcUrl`/`network` matches where the
  contract actually lives.

### RPC timeouts or rate limits

**Cause:** the public Avalanche RPC is throttling.
**Fix:** retry, or set a dedicated provider's URL in `deployment.json` — see
[Network & RPC Details](../reference/networks.md).

## Still stuck?

* Re-read the relevant [CLI Reference](../cli/overview.md) page — each lists its own common
  errors.
* Check the [FAQ](faq.md).
* Confirm your environment meets the [Prerequisites](../getting-started/prerequisites.md).
