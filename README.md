fictional-octo-dollop
=====================

This is a. CLI that implements the pomodoro technique and tracks in on your local device.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/fictional-octo-dollop.svg)](https://npmjs.org/package/fictional-octo-dollop)
[![CircleCI](https://circleci.com/gh/websites/fictional-octo-dollop/tree/master.svg?style=shield)](https://circleci.com/gh/websites/fictional-octo-dollop/tree/master)
[![Downloads/week](https://img.shields.io/npm/dw/fictional-octo-dollop.svg)](https://npmjs.org/package/fictional-octo-dollop)
[![License](https://img.shields.io/npm/l/fictional-octo-dollop.svg)](https://github.com/websites/fictional-octo-dollop/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g fictional-octo-dollop
$ src COMMAND
running command...
$ src (-v|--version|version)
fictional-octo-dollop/0.0.1 darwin-x64 node-v12.16.3
$ src --help [COMMAND]
USAGE
  $ src COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`src configure`](#src-configure)
* [`src go`](#src-go)
* [`src help [COMMAND]`](#src-help-command)
* [`src view`](#src-view)

## `src configure`

The Config command will allow you to adjust your pomodoro timer.

```
USAGE
  $ src configure

OPTIONS
  -i, --isTesting
```

_See code: [src/commands/configure.js](https://github.com/websites/fictional-octo-dollop/blob/v0.0.1/src/commands/configure.js)_

## `src go`

The Go command starts your pomodoro and your break right after it.

```
USAGE
  $ src go

OPTIONS
  -i, --isTesting
```

_See code: [src/commands/go.js](https://github.com/websites/fictional-octo-dollop/blob/v0.0.1/src/commands/go.js)_

## `src help [COMMAND]`

display help for src

```
USAGE
  $ src help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_

## `src view`

The View command allows you to view the saved records of your past pomodoro's.

```
USAGE
  $ src view

OPTIONS
  -i, --isTesting
```

_See code: [src/commands/view.js](https://github.com/websites/fictional-octo-dollop/blob/v0.0.1/src/commands/view.js)_
<!-- commandsstop -->
