import { Plugin } from '@yarnpkg/core';
import { GetChangedPackagesCommand, VersionPlusCommand } from './commands';

const plugin: Plugin = {
  commands: [GetChangedPackagesCommand, VersionPlusCommand]
};

export default plugin;
