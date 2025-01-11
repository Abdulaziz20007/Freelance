const router = require("express").Router();
const adminPolice = require("../middlewares/admin.police");
const selfPolice = require("../middlewares/admin.selfpolice");
const {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
  login,
  logout,
  refreshToken,
  changePassword,
} = require("../controllers/admin.controller");

router.get("/", adminPolice, getAll);
router.get("/:id", adminPolice, selfPolice, getById);
router.post("/", create);
router.put("/:id", adminPolice, selfPolice, updateById);
router.delete("/:id", adminPolice, selfPolice, deleteById);

router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refreshToken);
router.post("/changepassword/:id", adminPolice, selfPolice, changePassword);

module.exports = router;
