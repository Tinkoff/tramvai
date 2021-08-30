import { CLICommand } from '../../models/command';
import { checkConfigExists } from '../../validators/commands/checkConfigExists';

export type GeneratorName = 'action' | 'reducer' | 'component' | 'page' | 'bundle' | 'module';
export type Params = {
  generator?: GeneratorName;
  target?: string;
};

class GenerateCommand extends CLICommand<Params> {
  name = 'generate';

  description =
    'Команда для кодогенерации\n' +
    '  [target] - название приложения\n' +
    '  [generator] - action|reducer|bundle|component|page|module';

  command = 'generate [target] [generator]';

  options = [];

  alias = 'g';

  validators = [checkConfigExists];

  action(parameters: Params) {
    // сделано через require, что бы стартовать код только тогда, когда он нужен
    return require('./generate').default(this.context, parameters);
  }
}

export default GenerateCommand;
