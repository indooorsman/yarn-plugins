import { BaseCommand } from '@yarnpkg/cli';
import { Configuration, Project } from '@yarnpkg/core';
import { Command, Option } from 'clipanion';
import { gitUtils } from '@yarnpkg/plugin-git';
import { COMMAND_NS, COMMAND_NS_SHORT } from './constants';

export class GetChangedPackagesCommand extends BaseCommand {
  static paths = [
    [COMMAND_NS, 'changed'],
    [COMMAND_NS_SHORT, 'changed']
  ];

  static usage = Command.Usage({
    description: 'get changed packages',
    examples: [
      [
        `yarn ${COMMAND_NS} changed --base=some_branch_name_or_commit`,
        'some_branch_name_or_commit is the base commit/branch. required.'
      ]
    ]
  });

  base = Option.String('--base', { required: true });

  async execute() {
    const { fetchChangedWorkspaces } = gitUtils;
    const configuration = await Configuration.find(this.context.cwd, this.context.plugins);
    const { project } = await Project.find(configuration, this.context.cwd);

    const changed = await fetchChangedWorkspaces({ ref: this.base, project });
    const changedPackages = [];
    Array.from(changed)
      .filter((w) => w.relativeCwd !== '.')
      .map((w) => {
        changedPackages.push(`${w.manifest.raw.name}`);
      });
    this.context.stdout.write(changedPackages.join(','));
  }
}
