import { BaseCommand, WorkspaceRequiredError } from '@yarnpkg/cli';
import { Configuration, Project } from '@yarnpkg/core';
import { Command, Option } from 'clipanion';
import { COMMAND_NS, COMMAND_NS_SHORT } from './constants';

export class ManifestCommand extends BaseCommand {
  static paths = [[COMMAND_NS], [COMMAND_NS_SHORT]];

  static usage = Command.Usage({
    description: `Show manifest of workspace`,
    examples: [
      [
        `show all fields in package.json`,
        `yarn ${COMMAND_NS}\n    name: yarn-plugins\n    version: 1.0.0\n    #...other fields`
      ],
      [
        `show specific fields`,
        `yarn ${COMMAND_NS} --fields=name,version\n    name: yarn-plugins\n    version: 1.0.0`
      ],
      [`show as json`, `yarn ${COMMAND_NS} --fields=name --json\n    {\n      "name": "yarn-plugins"\n    }`],
      [
        `show in oneline`,
        `yarn ${COMMAND_NS} --fields=name,version --oneline\n    name: yarn-plugins, version: 1.0.0`
      ]
    ]
  });

  fields = Option.String('-f,--fields', {
    required: false,
    description: `only show specific fields, separate by comma`
  });
  json = Option.Boolean('--json', { required: false, description: `show as json` });
  oneline = Option.Boolean('--oneline', { required: false, description: `show in oneline` });

  async execute(): Promise<number | void> {
    const configuration = await Configuration.find(this.context.cwd, this.context.plugins);
    const { project, workspace } = await Project.find(configuration, this.context.cwd);
    if (!workspace) {
      throw new WorkspaceRequiredError(project.cwd, this.context.cwd);
    }
    const manifest = workspace.manifest.raw;
    const fields = this.fields ? this.fields.split(',') : Object.keys(manifest);
    if (this.json) {
      const result = {};
      fields.forEach((f) => {
        const k = f.trim();
        result[k] = manifest[k];
      });
      const output = this.oneline ? JSON.stringify(result) : JSON.stringify(result, null, 2);
      this.context.stdout.write(output + '\n');
    } else {
      const outputLines = fields.map((f) => {
        const k = f.trim();
        const v = manifest[k];
        return `${k}: ${v}`;
      });
      const output = outputLines.join(this.oneline ? ', ' : '\n');
      this.context.stdout.write(output + '\n');
    }
  }
}
