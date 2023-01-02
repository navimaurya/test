import { Request, Response, NextFunction } from "express";

const catchAsync = (fun: Function) => (req: Request, res: Response, next: NextFunction) => fun(req, res, next).catch((err: any) => (next(err)));
export default catchAsync;