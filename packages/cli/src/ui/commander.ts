import program from 'commander';
import chalk from 'chalk';
import type { Command, CommandResult } from '../models/command';

function unknownCommand(prog) {
  prog.arguments('<command>').action((cmd) => {
    prog.outputHelp();
    console.log(`  ${chalk.red(`Unknown command ${chalk.yellow(cmd)}.`)}`);
    console.log();
  });
}

function helpCommand(prog) {
  prog.on('--help', () => {
    console.log();
    console.log(`  Run ${chalk.cyan(`tramvai <command> --help`)}
 for detailed usage of given command.`);
    console.log();
  });
}

const enhanceErrorMessages = (methodName, log) => {
  program.Command.prototype[methodName] = function (...args) {
    if (methodName === 'unknownOption' && this._allowUnknownOption) {
      return;
    }
    this.outputHelp();
    console.log(`  ${chalk.red(log(...args))}`);
    console.log();
    process.exit(1);
  };
};

function getOptions(cmd) {
  const args = {};

  cmd.options.forEach((o) => {
    const key = o.long.replace(/^--/, '');

    if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
      args[key] = cmd[key];
    }
  });

  return args;
}

function getParameters(args, commandObject) {
  const result = {};

  commandObject._args.forEach((param, index) => {
    result[param.name] = args[index];
  });

  return result;
}

function normalizeArgs(args) {
  const commandObject = args.find((test) => typeof test === 'object' && !Array.isArray(test));

  return { ...getOptions(commandObject), ...getParameters(args, commandObject) };
}

export function commander(commands: Command[], resolve: (res: Promise<CommandResult>) => void) {
  program
    .version(require('../../package.json').version, '-v, --version')
    .usage('<command> [options]');

  // Добавляем команды
  commands.forEach((command) => {
    const chain = program
      .command(command.command)
      .alias(command.alias)
      .description(command.description);

    command.options.forEach((option) => {
      chain.option(
        `${option.name} ${option.value}`,
        option.description,
        option.transformer,
        option.defaultValue
      );
    });

    chain.action((...args) => resolve(command.run(normalizeArgs(args))));

    if (command.help) {
      chain.on('--help', () => {
        const lineText = command.help();

        lineText.forEach((line) => console.log(line));
        console.log();
      });
    }
  });

  // Закидываем команды для ошибок
  unknownCommand(program);
  helpCommand(program);

  enhanceErrorMessages('missingArgument', (argName) => {
    return `Missing required argument ${chalk.yellow(`<${argName}>`)}.`;
  });

  enhanceErrorMessages('unknownOption', (optionName) => {
    return `Unknown option ${chalk.yellow(optionName)}.`;
  });

  enhanceErrorMessages('optionMissingArgument', (option, flag) => {
    return `Missing required argument for option ${chalk.yellow(option.flags)}
 ${flag ? `, got ${chalk.yellow(flag)}` : ''}`;
  });

  return (args) => {
    program.parse(args);

    // показываем help если ничего не ввели
    if (!args.slice(2).length) {
      program.outputHelp();
    }
  };
}
