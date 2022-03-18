# yarn-plugin-manifest

Show manifest of workspace

## Install

```bash
$ yarn plugin import 
```

## Usage

```bash
$ yarn manifest --help
# or
$ yarn m --help
```

## Options

```text
  -f,--fields #0    only show specific fields, separate by comma
  --json            show as json
  --oneline         show in oneline
```

## Examples

show all fields in package.json

```bash
  $ yarn manifest
  # name: yarn-plugins
  # version: 1.0.0
  # ...other fields
```

show specific fields

```bash
  $ yarn manifest --fields=name,version
  # name: yarn-plugins
  # version: 1.0.0
```

show as json

```bash
  $ yarn manifest --fields=name --json
  # {
  #   "name": "yarn-plugins"
  # }
```

show in oneline

```bash
  $ yarn manifest --fields=name,version --oneline
  # name: yarn-plugins, version: 1.0.0
```
