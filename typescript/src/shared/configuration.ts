export type Context = {
  cid?: string;
};

export type Configuration = {
  actions: {
    [product: string]: { [action: string]: boolean };
  };
  context?: Context;
};

export function isToolAllowed(
  tool: any,
  configuration: Configuration
): boolean {
  if (!configuration.actions) {
    return true;
  }

  const toolActions = tool.actions;
  if (!toolActions) {
    return true;
  }

  for (const [product, actions] of Object.entries(
    toolActions as Record<string, any>
  )) {
    if (configuration.actions[product]) {
      for (const [action, allowed] of Object.entries(
        actions as Record<string, boolean>
      )) {
        if (allowed && configuration.actions[product][action]) {
          return true;
        }
      }
    }
  }

  return false;
}
