class FakeHelper {
  /**
   * randomly pick an item from items array
   * @param items any
   */
  randomPick(items: any) {
    return items[Math.floor(Math.random() * items.length)]
  }
}

export default new FakeHelper()