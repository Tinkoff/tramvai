import { CLICommand } from '../../models/command';
import { checkApplication } from '../../validators/commands/checkBuild';
import { checkConfigExists } from '../../validators/commands/checkConfigExists';

export type Params = {
  target: string;
  plugin?: 'bundle' | 'whybundled' | 'statoscope';
  showConfig?: boolean;
};

class AnalyzeCommand extends CLICommand<Params> {
  name = 'analyze';

  description = 'Команда для анализа приложений';

  command = 'analyze <target>';

  options = [
    {
      name: '-p, --plugin',
      value: '[plugin]',
      description: 'Тип плагина для анализа <bundle|whybundled|statoscope>',
      defaultValue: 'bundle',
    },
    {
      name: '--showConfig',
      value: '[showConfig]',
      description: 'Показать конфиг с которым был запущен cli',
    },
  ];

  alias = 'a';

  validators = [checkConfigExists, checkApplication];

  action(parameters: Params) {
    // сделано через require, что бы стартовать код только тогда, когда он нужен
    return require('./analyze').default(this.context, parameters);
  }
}

export default AnalyzeCommand;
