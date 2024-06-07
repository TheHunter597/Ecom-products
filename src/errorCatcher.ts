export default function errorCatcher(fn: Function) {
  return async function (req: any, res: any, next: any) {
    try {
      await fn(req, res, next);
    } catch (err) {
      console.log(err);

      next(err);
    }
  };
}
