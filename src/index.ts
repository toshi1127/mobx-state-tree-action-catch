import {
  IMiddlewareEvent,
  IAnyStateTreeNode,
  getSnapshot,
} from 'mobx-state-tree';

export default function actionCatch(
  errorHandler: (
    error?: Error,
    snapshot?: ReturnType<typeof getSnapshot>,
    lastActionName?: string
  ) => void,
  store: IAnyStateTreeNode
) {
  return (
    call: IMiddlewareEvent,
    next: (
      actionCall: IMiddlewareEvent,
      callback?: (value: any) => any
    ) => void,
    abort: (value: any) => void
  ) => {
    try {
      return next(call);
    } catch (err) {
      errorHandler(err, getSnapshot(store), call.name);
      return err;
    }
  };
}
