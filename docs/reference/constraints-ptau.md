# Constraint Limits & PTAU

The size of circuit you can build with `zk-ava-sdk` is bounded by the bundled Powers of Tau
file. This page explains the limit and how to work with (or around) it.

## The bundled ptau

The SDK ships `ptau/pot12_final.ptau` and uses it for the Groth16 setup during
[`compile`](../cli/compile.md). The **12** in `pot12` is the power of two:

$$\text{max constraints} \approx 2^{12} = 4096$$

So circuits are limited to roughly **4,096 constraints**. (Precisely, the Powers of Tau of
size `2^k` supports circuits whose constraint count fits under `2^k`; the exact usable count
is slightly below the round number due to setup overhead.)

## How ptau size maps to circuit size

| ptau | `2^k` | Approx. max constraints |
| ---- | ----- | ----------------------- |
| `pot12` (bundled) | `2^12` | ~4,096 |
| `pot14` | `2^14` | ~16,384 |
| `pot16` | `2^16` | ~65,536 |
| `pot20` | `2^20` | ~1,048,576 |

Larger ptau files support bigger circuits but are larger to download and slower to set up.

## What counts as a constraint?

Each rank-1 constraint (roughly, each multiplication of signals) counts. A bare arithmetic
circuit like the multiplier uses a handful. Cryptographic primitives are far heavier:

| Operation | Rough constraint cost |
| --------- | --------------------- |
| Single multiplication | 1 |
| Comparator / range check (per bit) | a few each |
| Poseidon hash | hundreds |
| EdDSA signature verification | thousands |

This is why a circuit with one Poseidon hash is fine under `pot12`, but several hashes or a
signature check may approach or exceed the ceiling.

## What happens if you exceed the limit

Compilation's circom step succeeds, but the **Groth16 setup step fails** because the ptau is
too small for the circuit's constraint count. You'll see an error from `snarkjs` during
`compile` indicating the powers of tau is insufficient.

## How to handle larger circuits

You have two levers:

### 1. Shrink the circuit

* Reuse intermediate signals instead of recomputing.
* Choose cheaper primitives (e.g. Poseidon over heavier hashes where appropriate).
* Reduce bit widths in comparators/decompositions to the minimum you actually need.

### 2. Supply a larger ptau

The 4,096 ceiling is a property of the *bundled file*, not the SDK's design. To support a
larger circuit you can use a bigger Powers of Tau file. Today the setup path in
`lib/compile.js` points at the bundled `pot12_final.ptau`; using a larger one means
supplying a bigger ptau in its place (and accepting that file's trusted-setup assumptions).

{% hint style="info" %}
Larger ptau files are available from public Powers of Tau ceremonies (e.g. the Hermez/Perpetual
Powers of Tau). For high-value deployments, prefer a ceremony you trust — see
[Groth16 & Trusted Setup](../concepts/groth16-trusted-setup.md) and
[Security Considerations](../help/security.md).
{% endhint %}

## See also

* [Groth16 & Trusted Setup](../concepts/groth16-trusted-setup.md) — what ptau is and why.
* [Using circomlib Components](../guides/circomlib.md) — constraint costs of common components.
* [Troubleshooting](../help/troubleshooting.md) — the "too small ptau" error.
