# Contributing

`zk-ava-sdk` is a small, focused codebase — easy to read end to end and easy to extend.
This page orients you for local development.

## Repository layout

```
zk-ava-sdk/
├── bin/
│   ├── cli.js          # commander CLI (compile, test, deploy)
│   ├── index.js        # library entry — exports all four functions
│   └── circom          # bundled Circom compiler binary
├── lib/
│   ├── compile.js      # compile + groth16 setup + export verifier
│   ├── test.js         # groth16 fullprove → proof.json / public.json
│   ├── deploy.js       # solc compile + web3 deploy → deployment.json
│   └── verify.js       # regenerate proof + on-chain verifyProof call
├── circomlib/          # bundled standard component library
├── ptau/               # pot12_final.ptau (Powers of Tau)
├── docs/               # this GitBook documentation
└── package.json
```

See [Components](../architecture/components.md) for a file-by-file description.

## Local setup

```bash
git clone <repo-url>
cd zk-ava-sdk
npm install
```

Run the CLI from source:

```bash
node bin/cli.js compile path/to/circuit.circom
node bin/cli.js test ./circuit ./input.json
node bin/cli.js deploy ./circuit $PRIVATE_KEY
```

Or link it globally for `zk-ava-sdk` on your PATH:

```bash
npm link
zk-ava-sdk --help
```

## How the pieces connect

* `bin/cli.js` parses commands and delegates to the `lib/` modules.
* `bin/index.js` re-exports the same functions for programmatic use.
* Each `lib/` module is self-contained and shells out to the relevant tool
  (`circom`, `snarkjs`, `solc`, `web3`).

The clean separation means most changes touch a single `lib/` file.

## Ideas for extension

A few natural enhancements (see also the [Roadmap](roadmap.md)):

* **Configurable ptau** — let `compile` accept a path to a larger Powers of Tau file to lift
  the [constraint ceiling](../reference/constraints-ptau.md).
* **More networks** — generalize `deploy`/`verify` beyond Avalanche to other EVM chains.
* **Safer key input** — read the private key from an env var or prompt instead of a CLI arg.
* **A `verify` CLI command** — a terminal companion to the `verifyProof()` function.
* **Automated tests** — fixture circuits exercising compile → test → verify.

## Editing these docs

The documentation lives in `docs/` and is published via GitBook Git Sync. To add or change a
page:

1. Edit/create the Markdown file under the relevant `docs/<section>/` folder.
2. Add or update its entry in `docs/SUMMARY.md` (this drives the left-nav).
3. Use ```` ```mermaid ```` fenced blocks for diagrams — GitBook renders them natively.
4. Push; GitBook republishes automatically.

Keep examples faithful to the actual behavior in `bin/cli.js` and `lib/*.js`.

## Conventions

* Match the existing style of the surrounding code.
* Keep each `lib/` module focused on one stage of the pipeline.
* Preserve the folder-per-circuit convention and the artifact names other steps depend on.
