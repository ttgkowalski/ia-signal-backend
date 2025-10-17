import type { Request, Response, NextFunction } from 'express'
import { userService } from './user.service'

async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const created = await userService.create(req.body)
    return res.status(201).json(created)
  } catch (err) {
    next(err)
  }
}

async function list(_req: Request, res: Response, next: NextFunction) {
  try {
    return res.json(await userService.list())
  } catch (err) {
    next(err)
  }
}

async function get(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const item = await userService.get(req.params.id)
    return res.json(item)
  } catch (err) {
    next(err)
  }
}

async function update(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const updated = await userService.update(req.params.id, req.body)
    return res.json(updated)
  } catch (err) {
    next(err)
  }
}

async function remove(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    await userService.remove(req.params.id)
    return res.status(204).end()
  } catch (err) {
    next(err)
  }
}

export const userController = {
  create,
  list,
  get,
  update,
  remove,
}
