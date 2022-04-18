import { Configuration, Project } from '@yarnpkg/core';
import { Command, Option } from 'clipanion';
import { matchesRegExp } from 'typanion';
import semver from 'semver';
import { COMMAND_NS, COMMAND_NS_SHORT } from './constants';
import VersionCommand from 'yarn-plugin-version-fork/sources/commands/version';

export class VersionPlusCommand extends VersionCommand {
  static paths = [[COMMAND_NS], [COMMAND_NS_SHORT]];

  static usage = Command.Usage({
    description: 'Bump package version',
    examples: [
      [`yarn ${COMMAND_NS} patch`, '1.2.2 ==> 1.2.3'],
      [`yarn ${COMMAND_NS} major`, '1.2.2 ==> 2.0.0'],
      [`yarn ${COMMAND_NS} minor --deferred`, ''],
      [`yarn ${COMMAND_NS} prerelease --preid=hotfix`, '1.2.2 ==> 1.2.3-hotfix.0'],
      [`yarn ${COMMAND_NS} patch --from=1.3.0`, '1.2.2 ==> 1.3.1']
    ]
  });

  preid = Option.String('--preid', {
    required: false,
    description: 'preid for prerelease, e.g. beta',
    // @ts-ignore
    validator: matchesRegExp(/^[a-zA-Z0-9]+$/)
  });

  from = Option.String('--from', {
    required: false,
    description: 'patch from a specific version'
  });

  async execute() {
    if (this.strategy !== 'prerelease' && this.preid) {
      this.context.stdout.write(
        `--preid will be ignored as it only works with prerelease strategy\n`
      );
    }

    const configuration = await Configuration.find(this.context.cwd, this.context.plugins);
    const { workspace } = await Project.find(configuration, this.context.cwd);

    const currentVersion = this.from || workspace?.manifest?.version || '0.0.0';

    const prepareWork = async (): Promise<void> => {
      delete workspace.manifest.raw['stableVersion'];
      workspace.manifest.version = workspace.manifest.raw['version'] = currentVersion;
      await workspace.persistManifest();
    };

    if (this.strategy === 'prerelease') {
      if (workspace && workspace.manifest && workspace.manifest.version) {
        const parsedVersion = semver.parse(currentVersion, {
          loose: true,
          includePrerelease: true
        });
        if (!parsedVersion) {
          throw new Error(
            `current version ${currentVersion} is not a valid semantic version(https://semver.org/), please correct it then try again`
          );
        }

        if (!this.preid) {
          await prepareWork();
          return await super.execute();
        }

        if (parsedVersion.prerelease?.includes?.(this.preid)) {
          await prepareWork();
          return await super.execute();
        }

        const nextVersion = semver.inc(
          currentVersion,
          'prerelease',
          { includePrerelease: true, loose: true },
          this.preid
        );
        workspace.manifest.version = nextVersion;
        workspace.manifest.raw['version'] = nextVersion;
        delete workspace.manifest.raw['stableVersion'];
        await workspace.persistManifest();

        return await super.execute();
      } else {
        // handle non-workspace error in super
        return await super.execute();
      }
    } else {
      // not prerelease stragegy
      await prepareWork();
      return await super.execute();
    }
  }
}
