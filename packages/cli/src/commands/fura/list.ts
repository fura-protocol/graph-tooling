import { URL } from 'url';
import { Args, Command, Flags } from '@oclif/core';
import { print } from 'gluegun';
import { identifyDeployKey as identifyAccessToken } from '../../command-helpers/auth';
import { createJsonRpcClient } from '../../command-helpers/jsonrpc';
import { validateNodeUrl } from '../../command-helpers/node';

export default class ListCommand extends Command {
  static description = 'List subgraphs from fura graph node';

  static args = {
    'name': Args.boolean({
        required: false,
      }),
  };

  static flags = {
    help: Flags.help({
      char: 'h',
    }),

    node: Flags.string({
      summary: 'Graph node to list the subgraph from.',
      char: 'g',
      required: true,
    }),
    'access-token': Flags.string({
      summary: 'Graph access token.',
    }),
  };

  async run() {
    const {
      args: {  },
      flags: { 'access-token': accessTokenFlag, node },
    } = await this.parse(ListCommand);

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

    // Use the access token, if one is set
    const accessToken = await identifyAccessToken(node, accessTokenFlag);
    if (accessToken !== undefined && accessToken !== null) {
      // @ts-expect-error options property seems to exist
      client.options.headers = { Authorization: `Bearer ${accessToken}` };
    }

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
  }
}
