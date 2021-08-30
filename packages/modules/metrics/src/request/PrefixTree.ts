interface IndexObject<T> {
  [key: string]: IndexObject<T> | T;
  value?: T;
}
type UpdateFn<T> = (oldValue: T | void) => T;

// Дерево использует подход структуры данных trie для прямого доступа к serviceName, но в отличие от
// trie возвращает не все значения соответствующие префиксу, а значение соответствующее самому
// длинному ключу в дереве который является подстрокой входной строки
export class PrefixTree<T> {
  index: IndexObject<T>;

  delimiter: string;

  constructor(options: { delimiter?: string } = {}) {
    this.index = Object.create(null);
    this.delimiter = options.delimiter || '';
  }

  // На случай если value не примитивные значения есть возможность передать функцию и там как угодно
  // модифицировать объект
  set(key: string, valueOrUpdateFn: UpdateFn<T> | T): void {
    let tree: IndexObject<T> = this.index;
    const parts = key.split(this.delimiter);

    do {
      const letter = parts.shift();
      if (letter === '') continue;

      if (!tree[letter]) {
        tree[letter] = Object.create(null) as IndexObject<T>;
      }

      tree = tree[letter] as IndexObject<T>;
    } while (parts.length);

    if (valueOrUpdateFn instanceof Function) {
      tree.value = valueOrUpdateFn(tree.value);
    } else {
      tree.value = valueOrUpdateFn;
    }
  }

  get(key: string): void | T {
    let tree: IndexObject<T> | void = this.index;
    const parts = key.split(this.delimiter);
    let prevTree: IndexObject<T>;

    do {
      const letter = parts.shift();
      if (letter === '') continue;

      prevTree = tree as IndexObject<T>;
      tree = tree[letter] as IndexObject<T>;
    } while (parts.length && tree);

    if (tree) {
      return tree.value;
    }

    return prevTree.value;
  }
}
