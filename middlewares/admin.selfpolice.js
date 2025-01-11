module.exports = async (req, res, next) => {
  try {
    const admin = req.admin;
    if (!admin) {
      return res.status(401).send({ msg: "Unauthorized" });
    }
    if (admin.id != req.params.id) {
      return res.status(403).send({ msg: "Ruxsat yo'q" });
    }
    next();
  } catch (error) {
    return res.status(401).send({ msg: "Unauthorized" });
  }
};
