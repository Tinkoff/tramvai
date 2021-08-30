import { Task } from '../models/task';

class BuildAppTask extends Task {
  name = 'build-app';

  description = 'Сборка платформы';

  command = 'npm';

  arguments = ['run'];
}

export default BuildAppTask;
