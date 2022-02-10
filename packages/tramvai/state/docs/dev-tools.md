# Redux devtools

To enable devtools, you need to run:

- Install browser extension: [Chrome extension](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd) or [FireFox extension](https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools/)
- Open the page on `tramvai` and open the extension by clicking on the Redux devtools icon

![Redux devtools](https://cloud.githubusercontent.com/assets/7957859/18002950/aacb82fc-6b93-11e6-9ae9-609862c18302.png)

### Possible problems

1. For a better user experience, you need to use a separate redux dev tools extension window, not a tab in chrome developer tools, because otherwise the action history is not saved, see [issue](https://github.com/zalmoxisus/redux-devtools-extension/issues/505).

### Performance

Since the entire state of the application with all the actions is quite large, there are noticeable brakes when working with devtools when using jumps over states/events and when a large number of actions are triggered simultaneously. That's why:

1. Use customization techniques to set pickState to reduce the size of data in devtools.
1. Increase the value of the latency parameter (passed to connectViaExtension.connect), which essentially debounces sending actions to the extension, see [docs](https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md#latency)

### Additional links

- [Devtools repository](https://github.com/zalmoxisus/redux-devtools-extension)
- [Getting Started with Redux DevTools Extension ](https://egghead.io/lessons/javascript-getting-started-with-redux-dev-tools)
