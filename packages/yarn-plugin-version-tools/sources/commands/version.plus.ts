import { Configuration, Project } from '@yarnpkg/core';
import { Command, Option } from 'clipanion';
import { matchesRegExp } from 'typanion';
import semver from 'semver';
import { COMMAND_NS } from './constants';
import VersionCommand from 'yarn-plugin-version-fork/sources/commands/version';

export class VersionPlusCommand extends VersionCommand {
  static paths = [[COMMAND_NS]];

  static usage = Command.Usage({
    description: 'Bump package version',
    examples: [
      [`yarn ${COMMAND_NS} patch`, '1.2.2 ==> 1.2.3'],
      [`yarn ${COMMAND_NS} major`, '1.2.2 ==> 2.0.0'],
      [`yarn ${COMMAND_NS} minor --deferred`, ''],
      [`yarn ${COMMAND_NS} prerelease --preid=hotfix`, '1.2.2 ==> 1.2.3-hotfix.0']
    ]
  });

  preid = Option.String('--preid', {
    required: false,
    description: 'preid for prerelease, e.g. beta',
    // @ts-ignore
    validator: matchesRegExp(/^[a-zA-Z0-9]+$/)
  });

  async execute() {
    if (this.strategy !== 'prerelease' && this.preid) {
      this.context.stdout.write(
        `--preid will be ignored as it only works with prerelease strategy\n`
      );
    }

    if (this.strategy === 'prerelease') {
      const configuration = await Configuration.find(this.context.cwd, this.context.plugins);
      const { workspace } = await Project.find(configuration, this.context.cwd);

      if (workspace && workspace.manifest && workspace.manifest.version) {
        const currentVersion = workspace.manifest.version;
        const parsedVersion = semver.parse(currentVersion, {
          loose: true,
          includePrerelease: true
        });
        if (!parsedVersion) {
          throw new Error(
            `current version ${currentVersion} is not a valid semantic version(https://semver.org/), please correct it then try again`
          );
        }

        if (
          parsedVersion.prerelease?.length &&
          this.preid &&
          parsedVersion.prerelease.includes(this.preid)
        ) {
          return await super.execute();
        }

        const nextVersion = semver.inc(currentVersion, 'prerelease', this.preid ?? '');
        workspace.manifest.version = nextVersion;
        workspace.manifest.raw['version'] = nextVersion;
        if (this.preid && !parsedVersion.prerelease?.includes?.(this.preid)) {
          delete workspace.manifest.raw.stableVersion;
        }
        await workspace.persistManifest();

        return await super.execute();
      } else {
        throw new Error(`Can't find package.json in current dir`);
      }
    } else {
      return await super.execute();
    }
  }
}
