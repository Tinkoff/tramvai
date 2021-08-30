import React, { isValidElement, cloneElement, useCallback } from 'react';
import { useNavigate } from './useNavigate';

interface Props {
  // если передан react элемент, то он будет использован в качестве компонента для рендера и в него будут переданы агрументы href и onClick
  // иначе будет отрендерен html-элемент <a> с переданной ссылкой и текстом из children
  children?: any;
  // урл для перехода
  url: string;
  // get-параметры для перехода
  query?: Record<string, string>;
  // должен ли новый урл заменить текущий в истории, или нужно добавить новый переход в историю
  replace?: boolean;
  // target свойства тега <a>
  target?: string;
  // калбек, при клике на ссылку
  onClick?: Function;
  // дополнительные опции перехода
  navigateOptions?: Record<string, any>;
}

function Link(props: Props) {
  const { children, onClick, url, query, replace, target, navigateOptions, ...otherProps } = props;
  const navigate = useNavigate({ url, query, replace, ...navigateOptions });

  const handleClick = useCallback(
    (event) => {
      // ignores the navigation when clicked using right mouse button or
      // by holding a special modifier key: ctrl, command, win, alt, shift
      if (
        target ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        event.shiftKey ||
        event.button !== 0
      ) {
        return;
      }

      event.preventDefault();
      navigate();
      onClick && onClick(event);
    },
    [navigate, target, onClick]
  );

  const extraProps = { href: url, onClick: handleClick, target };

  if (isValidElement(children)) {
    return cloneElement(children, extraProps);
  }

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <a {...otherProps} {...extraProps}>
      {children}
    </a>
  );
}

Link.displayName = 'Link';

export { Link };
