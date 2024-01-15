export const authorizeAdmin = (req, res, next) => {
  const user = req.session.user

  if (!user || user.role !== 'admin') {
    return res.status(403).json({
      message: 'Forbidden. Insufficient permissions.',
    })
  }

  next()
}
