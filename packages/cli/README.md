# Fura Graph CLI
## Fura Graph Command Line Interface

### Installation

The Graph CLI can be installed with `npm` or `yarn`:

```sh
# NPM
npm install -g @core-dev-fura/graph-cli

# Yarn
yarn global add @core-dev-fura/graph-cli
```

### Usage

```
Fura subgraph commands, send to fura graph node

USAGE
  $ graph fura [SUBGRAPH-NAME] -g <value> --access-token <value> [-h] [--command <value>] [--ipfs-hash <value>] [--version-label <value>]

FLAGS
  -g, --node=<value>       (required) Fura graph node
  -h, --help               Show CLI help.
  --access-token=<value>   (required) Fura graph access token.
  --command=<value>        Fura graph command. Supported commands are: info, list, submit, revoke. You can also use commands:
                           fura:info, fura:list, fura:submit, fura:revoke, which will be executed separately. Remeber
                           fura:submit builds your project first, while fura --command=submit only does the submit and you need
                           to give the ipfsHash and versionLabel as follows:
  --ipfs-hash=<value>      Fura graph command submit ipfsHash.
  --version-label=<value>  Fura graph command submit versionLabel.

DESCRIPTION
  Fura subgraph commands, send to fura graph node

COMMANDS
  fura:info    Get subgraph info from fura graph node
  fura:list    List subgraphs from fura graph node
  fura:revoke  Revoke a subgraph from fura graph node
  fura:submit  Submit a subgraph to fura graph node.
```

### Build and Run
```
git clone 'https://github.com/fura-protocol/graph-tooling.git'
cd graph-tooling/packages/cli

npm i --verbose
npm run-script build

./dist/bin.js fura --help
```

### Build and Run with Docker
```
git clone 'https://github.com/fura-protocol/graph-tooling.git'
cd graph-tooling
docker build . -t fura-graph-cli

docker run -it --rm graph-cli ./dist/bin.js fura --help
```

# The Graph CLI (graph-cli)

[![npm (scoped)](https://img.shields.io/npm/v/@graphprotocol/graph-cli.svg?color=success)](https://www.npmjs.com/package/@graphprotocol/graph-cli)
[![Tests](https://github.com/graphprotocol/graph-cli/actions/workflows/ci.yml/badge.svg)](https://github.com/graphprotocol/graph-cli/actions/workflows/ci.yml)

## The Graph Command Line Interface

As of today, the command line interface supports the following commands:

- `graph init` — Creates a new subgraph project from an example or an existing contract.
- `graph create` — Registers a subgraph name with a Graph Node.
- `graph remove` — Unregisters a subgraph name with a Graph Node.
- `graph codegen` — Generates AssemblyScript types for smart contract ABIs and the subgraph schema.
- `graph build` — Compiles a subgraph to WebAssembly.
- `graph deploy` — Deploys a subgraph to a
  [Graph Node](https://github.com/graphprotocol/graph-node).
- `graph auth` — Stores a [Graph Node](https://github.com/graphprotocol/graph-node) access token in
  the system's keychain.
- `graph local` — Runs tests against a [Graph Node](https://github.com/graphprotocol/graph-node)
  test environment (using Ganache by default).
- `graph test` — Downloads and runs the [Matchstick](https://github.com/LimeChain/matchstick) rust
  binary in order to test a subgraph.
- `graph add` - Adds a new datasource to the yaml file and writes the necessary changes to other
  files - schema.graphql, abi and mapping.

## How It Works

The Graph CLI takes a subgraph manifest (defaults to `subgraph.yaml`) with references to:

- A GraphQL schema,
- Smart contract ABIs, and
- Mappings written in AssemblyScript.

It compiles the mappings to WebAssembly, builds a ready-to-use version of the subgraph saved to IPFS
or a local directory for debugging, and deploys the subgraph to a
[Graph Node](https://github.com/graphprotocol/graph-node).

## Installation

The Graph CLI can be installed with `npm` or `yarn`:

```sh
# NPM
npm install -g @graphprotocol/graph-cli

# Yarn
yarn global add @graphprotocol/graph-cli
```

### On Linux

`libsecret` is used for storing access tokens, so you may need to install it before getting started.
Use one of the following commands depending on your distribution:

- Debian/Ubuntu: `sudo apt-get install libsecret-1-dev`
- Red Hat: `sudo yum install libsecret-devel`
- Arch Linux: `sudo pacman -S libsecret`

## Getting Started

The Graph CLI can be used with a local or self-hosted
[Graph Node](https://github.com/graphprotocol/graph-node) or with the
[Hosted Service](https://thegraph.com/explorer/). To help you get going, there are
[quick start guides](https://thegraph.com/docs/en/developer/quick-start/) available for both.

If you are ready to dive into the details of building a subgraph from scratch, there is a
[detailed walkthrough](https://thegraph.com/docs/en/developer/create-subgraph-hosted/) for that as
well, along with API documentation for the
[AssemblyScript API](https://thegraph.com/docs/en/developer/assemblyscript-api/).

## License

Copyright &copy; 2018-2019 Graph Protocol, Inc. and contributors.

The Graph CLI is dual-licensed under the [MIT license](LICENSE-MIT) and the
[Apache License, Version 2.0](LICENSE-APACHE).

Unless required by applicable law or agreed to in writing, software distributed under the License is
distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either expressed or
implied. See the License for the specific language governing permissions and limitations under the
License.
