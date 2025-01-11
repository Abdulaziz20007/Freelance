const router = require("express").Router();
const userPolice = require("../middlewares/user.police");
const selfPolice = require("../middlewares/user.selfpolice");
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
} = require("../controllers/user.controller");

router.get("/", adminPolice, getAll);
router.get("/:id", userPolice, selfPolice, getById);
router.post("/", create);
router.put("/:id", userPolice, selfPolice, updateById);
router.delete("/:id", userPolice, selfPolice, deleteById);

router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refreshToken);
router.get("/verify/:id", verify);
router.post("/changepassword/:id", userPolice, selfPolice, changePassword);

module.exports = router;
