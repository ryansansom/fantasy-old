export class Elements {
  constructor(rootValue) {
    this.elementsLoader = rootValue.loaders.elementsLoader;

    this._elementsMap = new Map();
  }

  getAllElements() {
    return this.elementsLoader.load(0);
  }

  async getElementById(id) {
    if (!this._elementsMap.has(id)) {
      this._elementsMap.set(
        id,
        this._getElementById(id),
      );
    }

    return this._elementsMap.get(id);
  }

  async _getElementById(id) {
    return (await this.getAllElements())
      .find(element => element.id === id);
  }
}
