import { Plugin } from '@yarnpkg/core';
import { GetChangedPackagesCommand, PrereleaseVersion } from './commands';

const plugin: Plugin = {
  commands: [GetChangedPackagesCommand, PrereleaseVersion]
};

export default plugin;
