export class Elements {
  constructor(rootValue) {
    this.elementsLoader = rootValue.loaders.elementsLoader;
  }

  getAllElements() {
    return this.elementsLoader.load(0);
  }

  async getElementById(id) {
    return (await this.getAllElements())
      .find(element => element.id === id);
  }
}
