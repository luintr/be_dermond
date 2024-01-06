export const notFound = (req: { originalUrl: any }, res: { status: (arg0: number) => void }, next: (arg0: Error) => void) => {
  const error = new Error(`Not Found - ${req.originalUrl}`)
  res.status(404)
  next(error)
}

export const errorHandler = (err: any, req: any, res: any, next: any) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode
  let message = err.message

  if (err.name === "CastError" && err.kind === "ObjectId") {
    message = `Resource not found`
    statusCode = 404
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === 'production' ? 'prod' : err.stack
  })
}