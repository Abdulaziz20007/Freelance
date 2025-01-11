module.exports = async (req, res, next) => {
  try {
    const user = req.user;
    console.log(req.user);

    if (!user) {
      return res.status(401).send({ msg: "Unauthorized" });
    }
    if (user.id != req.params.id) {
      console.log(user.id);
      console.log(req.params.id);

      return res.status(403).send({ msg: "Ruxsat yo'q" });
    }
    next();
  } catch (error) {
    return res.status(401).send({ msg: "Unauthorized" });
  }
};
