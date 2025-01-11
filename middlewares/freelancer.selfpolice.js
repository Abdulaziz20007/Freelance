module.exports = async (req, res, next) => {
  try {
    const freelancer = req.freelancer;
    if (!freelancer) {
      return res.status(401).send({ msg: "Unauthorized" });
    }
    if (freelancer.id != req.params.id) {
      return res.status(403).send({ msg: "Ruxsat yo'q" });
    }
    next();
  } catch (error) {
    return res.status(401).send({ msg: "Unauthorized" });
  }
};
