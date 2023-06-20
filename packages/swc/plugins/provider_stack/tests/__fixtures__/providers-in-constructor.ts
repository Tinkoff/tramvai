const DI_TOKEN = "token";

export class Container {

  constructor() {

    this.register({ provide: DI_TOKEN, useValue: this });
  }

  register(provider) {}
}
