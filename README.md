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
$ npm install -g @londelo/pomo_go
$ pomo COMMAND
running command...
$ pomo (-v|--version|version)
@londelo/pomo_go/0.0.2 darwin-x64 node-v12.16.3
$ pomo --help [COMMAND]
USAGE
  $ pomo COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`pomo configure`](#pomo-configure)
* [`pomo go`](#pomo-go)
* [`pomo help [COMMAND]`](#pomo-help-command)
* [`pomo view`](#pomo-view)

## `pomo configure`

The Config command will allow you to adjust your pomodoro timer.

```
USAGE
  $ pomo configure
```

_See code: [src/commands/configure.js](https://github.com/websites/fictional-octo-dollop/blob/v0.0.2/src/commands/configure.js)_

## `pomo go`

The Go command starts your pomodoro and your break right after it.

```
USAGE
  $ pomo go
```

_See code: [src/commands/go.js](https://github.com/websites/fictional-octo-dollop/blob/v0.0.2/src/commands/go.js)_

## `pomo help [COMMAND]`

display help for pomo

```
USAGE
  $ pomo help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_

## `pomo view`

The View command allows you to view the saved records of your past pomodoro's.

```
USAGE
  $ pomo view
```

_See code: [src/commands/view.js](https://github.com/websites/fictional-octo-dollop/blob/v0.0.2/src/commands/view.js)_
<!-- commandsstop -->
