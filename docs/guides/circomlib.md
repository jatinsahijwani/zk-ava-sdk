# Using circomlib Components

Real circuits rarely implement cryptography from scratch. `zk-ava-sdk` bundles
[**circomlib**](https://github.com/iden3/circomlib) — a library of audited, reusable Circom
components — and wires it into the compiler automatically.

## How the include path works

During [`compile`](../cli/compile.md), the SDK passes circomlib as the Circom include path:

```
circom your.circom --wasm --r1cs -l <bundled circomlib/circuits> -o ./out
```

That means you can `include` circomlib files by name without any path configuration:

```circom
include "poseidon.circom";
include "comparators.circom";
```

## What circomlib gives you

A sampling of commonly used components:

| Component | File | Use |
| --------- | ---- | --- |
| `Poseidon` | `poseidon.circom` | ZK-friendly hashing (cheap in constraints). |
| `MiMC` | `mimcsponge.circom` | Alternative ZK-friendly hash. |
| `IsZero`, `IsEqual` | `comparators.circom` | Equality checks. |
| `LessThan`, `GreaterThan` | `comparators.circom` | Range/inequality checks. |
| `Num2Bits`, `Bits2Num` | `bitify.circom` | Bit decomposition / recomposition. |
| `EdDSAVerifier` | `eddsa.circom` | Signature verification inside a circuit. |

## Example: prove knowledge of a Poseidon preimage

A common pattern — prove you know the preimage of a public hash without revealing it:

```circom
pragma circom 2.0.0;

include "poseidon.circom";

// Proves knowledge of `secret` such that Poseidon(secret) == hash.
template KnowsPreimage() {
    signal input secret;        // private
    signal output hash;         // public

    component h = Poseidon(1);
    h.inputs[0] <== secret;
    hash <== h.out;
}

component main = KnowsPreimage();
```

Compile, prove, deploy, and verify exactly as in
[Your First Circuit](first-circuit.md) — only the circuit changed:

```bash
npx zk-ava-sdk compile knowsPreimage.circom
# input.json: { "secret": 12345 }
npx zk-ava-sdk test ./knowsPreimage ./input.json
npx zk-ava-sdk deploy ./knowsPreimage $PRIVATE_KEY
```

`public.json` will contain the Poseidon hash — the value others can check a proof against,
while `secret` stays private.

## Example: range check with `LessThan`

```circom
pragma circom 2.0.0;

include "comparators.circom";

// Proves a private value is below a public threshold, e.g. age < 18 stays hidden,
// but "is under 18" is provable.
template UnderThreshold(nBits) {
    signal input value;       // private
    signal input threshold;   // public-ish (an input)
    signal output ok;

    component lt = LessThan(nBits);
    lt.in[0] <== value;
    lt.in[1] <== threshold;
    ok <== lt.out;            // 1 if value < threshold
}

component main = UnderThreshold(8);
```

{% hint style="info" %}
Comparators require values to fit in the declared bit width (`nBits`). Remember Circom math
is over a finite field — see [Circom & Circuits](../concepts/circom-circuits.md). Bigger
circuits use more constraints; mind the [constraint ceiling](../reference/constraints-ptau.md).
{% endhint %}

## Keeping within the constraint budget

circomlib components add constraints. Poseidon and signature verification in particular can
be heavy. The bundled `pot12_final.ptau` supports up to ~4,096 constraints — if you exceed
it, compilation's setup step will fail. See
[Constraint Limits & PTAU](../reference/constraints-ptau.md) for how to handle larger
circuits.

## Reference

Browse the full component set in the bundled `circomlib/circuits/` directory, or the
upstream [circomlib repository](https://github.com/iden3/circomlib).
