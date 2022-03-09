import { BaseCommand } from '@yarnpkg/cli';
import { Configuration, Project } from '@yarnpkg/core';
import { Command, Option } from 'clipanion';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import semver from 'semver';
import { COMMAND_NS } from 'yarn-plugins-cy-common';

export class PrereleaseVersion extends BaseCommand {
  static paths = [[COMMAND_NS, 'prerelease']];

  static usage = Command.Usage({
    description: 'upgrade package prerelease version with a prefix, e.g.: 1.2.3-hotfix.0',
    examples: [[`yarn ${COMMAND_NS} prerelease --prefix=hotfix`, 'prefix is required']]
  });

  prefix = Option.String('--prefix', { required: true });

  async execute() {
    const fakeVersionPeriod = 'fakeversionperiod';
    const configuration = await Configuration.find(this.context.cwd, this.context.plugins);
    const { workspace } = await Project.find(configuration, this.context.cwd);
    if (!this.prefix) {
      throw new Error(`no prefix, --prefix=xxx is required.`);
    }
    if (workspace && workspace.manifest && workspace.manifest.version) {
      const patchedPrefix = this.prefix.replace(/(\s|-|\.)/g, '_');

      const currentVersion = workspace.manifest.version.replace(patchedPrefix, fakeVersionPeriod);
      const nextVersion = semver
        .inc(currentVersion, 'prerelease', fakeVersionPeriod)
        .replace(fakeVersionPeriod, patchedPrefix);
      this.context.stdout.write(`Upgrading ${workspace.manifest.version} to ${nextVersion}`);
      const packageJsonFile = path.join(workspace.cwd, 'package.json');
      const packageJson = JSON.parse(await readFile(packageJsonFile, { encoding: 'utf8' }));
      packageJson.version = nextVersion;
      await writeFile(packageJsonFile, JSON.stringify(packageJson, null, 2), { encoding: 'utf8' });
    } else {
      throw new Error(`Can't find package.json in current dir`);
    }
  }
}
