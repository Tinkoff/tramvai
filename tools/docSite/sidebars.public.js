const sidebars = require('./sidebars');

module.exports = {
  sidebar: [
    ...sidebars.sidebar.map((category) => {
      if (category.label === 'Features') {
        return {
          ...category,
          items: [
            ...category.items.map((subcategory) => {
              if (subcategory.items) {
                return {
                  ...subcategory,
                  items: subcategory.items.filter((item) => {
                    if (typeof item !== 'object' || !item.id) {
                      return item;
                    }
                    return !item.id.includes('tinkoff');
                  }),
                };
              }
              return subcategory;
            }),
          ].filter(Boolean),
        };
      }
      return category;
    }),
  ].filter(Boolean),
};
