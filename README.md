# mobx-state-tree-action-catch

Error catcher middleware for mobx state tree.

Created with reference to [redux-catch](https://github.com/PlatziDev/redux-catch)



## Installing

```
$ npm i mobx-state-tree-action-catch
# or
$ yarn add mobx-state-tree-action-catch
```

## How to use

```
import actionCatch from 'mobx-state-tree-action-catch';

function errorHandler(error, snapshot: ReturnType<typeof getSnapshot>, lastAction: string) {
  console.error(error);
  console.error(snapshot)
  console.error(lastAction)
}

const Store = types.model({
  UIStore: types.optional(UIStore, {}),
})

export interface IStore extends Instance<typeof Store> {}

const createStore = (snapshot = null): IStore => {
  MobxStore = Store.create()
  if (snapshot) {
    applySnapshot(MobxStore, snapshot)
  }
  // Add actionCatch to middleware
  addMiddleware(MobxStore, actionCatch(errorHandler))
  return MobxStore
}

export default createStore
```

- actionCatch receive a function to use when an error happen.
- The error handler function could be just a console.error like the example above or a function to log the error in some kind of error tracking platform.
- You should use this middleware as the first middleware in the chain, so its allowed to catch all the possible errors in the application.


## Using it with Sentry

To use it with Sentry just download the Sentry script from npm:

```
npm i -S raven-js raven
```
- raven-js: This is the client for browser usage.
- raven-node: This is the client for server usage.

Now load and configure your client:
```
import Raven from 'raven-js';

const sentryKey = '<key>';

Raven
  .config(`https://${sentryKey}@app.getsentry.com/<project>`)
  .install();
```

And then use Raven.captureException as the error handler like this:
```
const createStore = (snapshot = null): IStore => {
  MobxStore = Store.create()
  if (snapshot) {
    applySnapshot(MobxStore, snapshot)
  }
  // Add actionCatch to middleware
  addMiddleware(MobxStore, actionCatch((error) => Raven.captureException(error), MobxStore))
  return MobxStore
}
```