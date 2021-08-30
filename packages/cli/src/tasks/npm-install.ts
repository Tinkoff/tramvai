import { Task } from '../models/task';

class NpmInstallTask extends Task {
  name = 'npm-install';

  description = 'Установка зависимостей для платформы';

  command = 'npm';

  arguments = ['run', 'bootstrap'];
}

export default NpmInstallTask;
