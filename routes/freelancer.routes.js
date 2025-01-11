const router = require("express").Router();
const freelancerPolice = require("../middlewares/freelancer.police");
const selfPolice = require("../middlewares/freelancer.selfpolice");
const adminPolice = require("../middlewares/admin.police");
const {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
  login,
  logout,
  refreshToken,
  verify,
  changePassword,
} = require("../controllers/freelancer.controller");

router.get("/", adminPolice, getAll);
router.get("/:id", freelancerPolice, selfPolice, getById);
router.post("/", create);
router.put("/:id", freelancerPolice, selfPolice, updateById);
router.delete("/:id", freelancerPolice, selfPolice, deleteById);

router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refreshToken);
router.get("/verify/:id", verify);
router.post("/changepassword/:id", freelancerPolice, selfPolice, changePassword);

module.exports = router;
