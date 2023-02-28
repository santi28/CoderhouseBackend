const authMiddleware = (req, res, next) => {
  const { administrator } = req.headers

  if (administrator) return next()
  return res.status(401).json({ error: 401, message: 'Unauthorized' })
}

export default authMiddleware
