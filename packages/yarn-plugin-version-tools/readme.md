## yarn-plugin-version-tools

**this plugin is conflict with [@yarnpkg/plugin-version](https://yarnpkg.com/cli/version), as it's designed to be drop-in replacement of `@yarnpkg/plugin-version` and they have same configuration keys which will cause errors if both of them are installed**

before install this plugin please remove `@yarnpkg/plugin-version` first:

```bash
yarn plugin remove @yarnpkg/plugin-version
```

install:

```bash
yarn plugin import https://github.com/indooorsman/yarn-plugins/releases/download/yarn-plugin-version-tools%401.0.6/plugin-version-tools.js
```

uninstall:

```bash
yarn plugin remove yarn-plugin-version-tools
```

### `yarn vt <stragegy>`

almost same with `yarn version` from [@yarnpkg/plugin-version](https://yarnpkg.com/cli/version), but add a `--preid` option for bump `prerelease` version, e.g.:

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

### `yarn vt apply`

same with `yarn version apply` from [@yarnpkg/plugin-version](https://yarnpkg.com/cli/version)

### `yarn vt check`

same with `yarn version check` from [@yarnpkg/plugin-version](https://yarnpkg.com/cli/version)