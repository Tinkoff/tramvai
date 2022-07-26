import { createToken } from './createToken/createToken';
import type { RecordProvide } from './Container.h';
import { Container, NOT_YET } from './Container';
import { DI_TOKEN } from './tokens';
import { Scope } from './constant';

export const IS_DI_CHILD_CONTAINER_TOKEN = /* #__PURE__*/ createToken<boolean>(
  'isDiChildContainer'
);

export class ChildContainer extends Container {
  /**
   * Список дочерних провайдеров
   */
  private readonly root: Container;

  constructor(root: Container, fallback?: Container) {
    super(undefined, fallback);
    this.root = root;

    this.register({ provide: DI_TOKEN, useValue: this });
    this.register({ provide: IS_DI_CHILD_CONTAINER_TOKEN, useValue: true });
  }

  /**
   * Замена базовой реализации getRecord, которая инициализует children провайдеры внутри контейнера
   * При этом root провайдеры берет из корневого
   * @param token
   */
  getRecord<T>(token: symbol) {
    const record = super.getRecord<T>(token);

    if (record) {
      return record;
    }

    return this.root.getRecord<T>(token);
  }

  getValue<T>(record: RecordProvide<any>) {
    if (this.recordValues.has(record)) {
      return this.recordValues.get(record);
    }

    if (record.scope === Scope.SINGLETON || !record.factory) {
      return this.root.getValue<T>(record);
    }

    return NOT_YET;
  }

  /**
   * Замена базовой реализации hydrateDeps, которая резолвит зависимости относительно текущего контейнера,
   * если у записи выставлен scope === Scope.REQUEST, и относительно родительского иначе
   * @param record
   */
  protected hydrateDeps<T>(record: RecordProvide<T>) {
    if (record.scope === Scope.REQUEST) {
      return super.hydrateDeps(record);
    }

    return super.hydrateDeps.call(this.root, record);
  }

  protected hydrate<T>(record: RecordProvide<T>, token: symbol, optional: boolean): T | null {
    if (record.scope === Scope.REQUEST) {
      return super.hydrate(record, token, optional);
    }

    return super.hydrate.call(this.root, record, token, optional);
  }
}
