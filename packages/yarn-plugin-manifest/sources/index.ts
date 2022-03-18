import { Plugin } from '@yarnpkg/core';
import { ManifestCommand } from './commands';

const plugin: Plugin = {
  commands: [ManifestCommand]
};

export default plugin;
