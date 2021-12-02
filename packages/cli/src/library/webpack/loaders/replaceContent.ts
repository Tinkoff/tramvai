export default function () {
  const { code } = this.getOptions();

  // выставляем флаг, что данный модуль не кешируется т.к. в контенте могут быть данные которые будут меняться от сборки к сборке,
  // но из-за кешей обновляться не будут
  this.cacheable(false);

  return code;
}
