# yarn-plugins-cy

some usefull yarn 3.x custom plugins

## yarn-plugin-version-tools

install:

```bash
yarn plugin import https://github.com/indooorsman/yarn-plugins/releases/download/v1.0.1/plugin-version-tools.js
```

### `yarn vt <stragegy>`

almost same with [@yarnpkg/plugin-version](https://yarnpkg.com/cli/version), but add a `--preid` option for bump `prerelease` version, e.g.:

```bash
yarn vt prerelease --preid beta
#=> 1.2.2 ==> 1.2.3-beta.1
```

### `yarn vt changed --base <branch name or commit hash>`

show changed packages

```bash
yarn vt changed --base main
#=> yarn-plugin-version-tools,yarn-plugin-version-fork
```