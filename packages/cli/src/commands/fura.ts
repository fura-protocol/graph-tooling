import { URL } from 'url';
import { Args, Command, Flags } from '@oclif/core';
import { print } from 'gluegun';
import { identifyDeployKey as identifyAccessToken } from '../command-helpers/auth';
import { createJsonRpcClient } from '../command-helpers/jsonrpc';
import { validateNodeUrl } from '../command-helpers/node';

export default class FuraCommand extends Command {
  static description = 'Fura subgraph commands, send to fura graph node';

  static args = {
    'subgraph-name': Args.string({
        required: false,
    })
  };

  static flags = {
    help: Flags.help({
      char: 'h',
    }),

    node: Flags.string({
      summary: 'Fura graph node',
      char: 'g',
      required: true,
    }),
    'access-token': Flags.string({
      summary: 'Fura graph access token.',
      required: true
    }),
    'command': Flags.string({
        summary: 'Fura graph command. Supported commands are: info, list, submit, revoke. You can also use commands: fura:info, fura:list, fura:submit, fura:revoke, which will be executed separately. Remeber fura:submit builds your project first, while fura --command=submit only does the submit and you need to give the ipfsHash and versionLabel as follows:',
    }),
    'ipfs-hash': Flags.string({
      summary: 'Fura graph command submit ipfsHash.',
    }),
    'version-label': Flags.string({
      summary: 'Fura graph command submit versionLabel.',
    }),
  };

  async run() {
    const {
        args: { 'subgraph-name': subgraphName },
        flags: { 'command': commandName, 'access-token': accessTokenFlag, node, 'ipfs-hash' : ipfsHash, 'version-label' : versionLabel },
    } = await this.parse(FuraCommand);

    try {
      validateNodeUrl(node);
    } catch (e) {
      this.error(`Graph node "${node}" is invalid: ${e.message}`, { exit: 1 });
    }

    const requestUrl = new URL(node);
    const client = createJsonRpcClient(requestUrl);

    // Exit with an error code if the client couldn't be created
    if (!client) {
      this.exit(1);
      return;
    }

    const accessToken = await identifyAccessToken(node, accessTokenFlag);
    if (accessToken !== undefined && accessToken !== null) {
    // @ts-expect-error options property seems to exist
        client.options.headers = { Authorization: `Bearer ${accessToken}` };
    }

    if(commandName == 'list'){
        const spinner = print.spin(`List subgraph in Graph node: ${requestUrl}`);
        client.request(
        'subgraph_list',
        { name: '*'},
        (
            // @ts-expect-error TODO: why are the arguments not typed?
            requestError,
            // @ts-expect-error TODO: why are the arguments not typed?
            jsonRpcError,
            // @ts-expect-error TODO: why are the arguments not typed?
            _res,
        ) => {
            if (jsonRpcError) {
              spinner.fail(`Error list the subgraph: ${jsonRpcError.message}`);
            } else if (requestError) {
              spinner.fail(`HTTP error list the subgraph: ${requestError.code}`);
            } else {
              spinner.stop();
              print.success(`These subgraphs belong to you: ${_res}`);
            }
        },
        );
        return;
    }

    if(commandName == 'info'){
        // Use the access token, if one is set
        
        const spinner = print.spin(`Get subgraph info from fura graph node: ${requestUrl}`);
        client.request(
        'subgraph_info',
        { name: subgraphName },
        (
            // @ts-expect-error TODO: why are the arguments not typed?
            requestError,
            // @ts-expect-error TODO: why are the arguments not typed?
            jsonRpcError,
            // @ts-expect-error TODO: why are the arguments not typed?
            _res,
        ) => {
            if (jsonRpcError) {
              spinner.fail(`Error get the subgraph: ${jsonRpcError.message}`);
            } else if (requestError) {
              spinner.fail(`HTTP error get the subgraph: ${requestError.code}`);
            } else {
              spinner.stop();
              print.success(`Subgraph info: ${_res}`);
            }
        },
        );
        return;
    }

    if(commandName === 'submit'){
        const spinner = print.spin(`Deploying to fura graph node ${requestUrl}`);
        client.request(
          'subgraph_submit',
          {
            name: subgraphName,
            ipfs_hash: ipfsHash,
            version_label: versionLabel
          },
          (
            // @ts-expect-error TODO: why are the arguments not typed?
            requestError,
            // @ts-expect-error TODO: why are the arguments not typed?
            jsonRpcError,
            // @ts-expect-error TODO: why are the arguments not typed?
            _res,
        ) => {
            if (jsonRpcError) {
              spinner.fail(`Error deploy the subgraph: ${jsonRpcError.message}`);
            } else if (requestError) {
              spinner.fail(`HTTP error deploy the subgraph: ${requestError.code}`);
            } else {
              spinner.stop();

              const base = requestUrl.protocol + '//' + requestUrl.hostname;
              let playground = _res.playground;
              let queries = _res.queries;

              // Add a base URL if graph-node did not return the full URL
              if (playground.charAt(0) === ':') {
                playground = base + playground;
              }
              if (queries.charAt(0) === ':') {
                queries = base + queries;
              }

              print.success(`Deployed to ${subgraphName}`);
              print.info('\nSubgraph endpoints:');
              print.info(`Queries (HTTP):     ${queries}`);
              print.info(``);
            }
        },
        );
        return;
    }

    if(commandName === 'revoke'){
        const spinner = print.spin(`Revoking subgraph in fura graph node: ${requestUrl}`);
        client.request(
        'subgraph_revoke',
        { name: subgraphName },
        (
            // @ts-expect-error TODO: why are the arguments not typed?
            requestError,
            // @ts-expect-error TODO: why are the arguments not typed?
            jsonRpcError,
            // @ts-expect-error TODO: why are the arguments not typed?
            _res,
        ) => {
            if (jsonRpcError) {
              spinner.fail(`Error revoking the subgraph: ${jsonRpcError.message}`);
            } else if (requestError) {
              spinner.fail(`HTTP error revoking the subgraph: ${requestError.code}`);
            } else {
              spinner.stop();
              print.success(`Revoked subgraph: ${subgraphName}`);
            }
        },
        );
        return;
    }

    print.success(`Unsupported Command: ${commandName}`);
  }
}
