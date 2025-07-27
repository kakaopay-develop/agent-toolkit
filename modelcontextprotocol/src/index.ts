#!/usr/bin/env node

import { KakaoPayAgentToolkit } from '@kakaopay-develop/agent-toolkit/modelcontextprotocol';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { green, red, yellow } from 'colors';

type ToolkitConfig = {
  actions: {
    [product: string]: { [action: string]: boolean };
  };
  context?: {
    cid: string;
  };
};

type Options = {
  tools?: string[];
  secretKey?: string;
  cid?: string;
};

const ACCEPTED_ARGS = ['secret-key', 'tools', 'cid'];
const ACCEPTED_TOOLS = [
  'payment.demo',
  'payment.get',
  'payment.ready',
  'payment.approve',
  'payment.cancel',
  'subscription.get',
  'subscription.request',
  'subscription.inactive',
];

export function parseArgs(args: string[]): Options {
  const options: Options = {};

  args.forEach((arg) => {
    if (arg.startsWith('--')) {
      const [key, value] = arg.slice(2).split('=');

      if (key == 'tools') {
        options.tools = value.split(',');
      } else if (key == 'secret-key') {
        options.secretKey = value;
      } else if (key == 'cid') {
        options.cid = value;
      } else {
        throw new Error(
          `Invalid argument: ${key}. Accepted arguments are: ${ACCEPTED_ARGS.join(', ')}`
        );
      }
    }
  });

  // Check if required tools arguments is present
  if (!options.tools) {
    throw new Error('The --tools arguments must be provided.');
  }

  // Validate tools against accepted enum values
  options.tools.forEach((tool: string) => {
    if (tool == 'all') {
      return;
    }
    if (!ACCEPTED_TOOLS.includes(tool.trim())) {
      throw new Error(
        `Invalid tool: ${tool}. Accepted tools are: ${ACCEPTED_TOOLS.join(', ')}`
      );
    }
  });

  // Check if secret key is either provided in args or set in environment variables
  const secretKey = options.secretKey || process.env.KAKAOPAY_SECRET_KEY;
  if (!secretKey) {
    throw new Error(
      'KakaoPay Secret Key not provided. Please either pass it as an argument --secret-key=$KEY or set the KAKAOPAY_SECRET_KEY environment variable.'
    );
  }
  options.secretKey = secretKey;

  return options;
}

function handleError(error: any) {
  console.error(red('\n🚨  Error initializing KakaoPay MCP server:\n'));
  console.error(yellow(`   ${error.message}\n`));
}

export async function main() {
  const options = parseArgs(process.argv.slice(2));

  // Create the KakaoPayAgentToolkit instance
  const selectedTools = options.tools!;
  const configuration: ToolkitConfig = { actions: {} };

  if (selectedTools.includes('all')) {
    ACCEPTED_TOOLS.forEach((tool) => {
      const [product, action] = tool.split('.');
      configuration.actions[product] = {
        ...configuration.actions[product],
        [action]: true,
      };
    });
  } else {
    selectedTools.forEach((tool: any) => {
      const [product, action] = tool.split('.');
      configuration.actions[product] = {
        ...configuration.actions[product],
        [action]: true,
      };
    });
  }

  if (options.cid) {
    configuration.context = {
      cid: options.cid,
    };
  }

  const server = new KakaoPayAgentToolkit({
    secretKey: options.secretKey!,
    configuration: configuration,
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error(green('✅ KakaoPay MCP Server running on stdio'));
}

if (require.main === module) {
  main().catch((error) => {
    handleError(error);
  });
}
