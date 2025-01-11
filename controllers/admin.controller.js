const { errorHandler } = require("../helpers/error_handler");
const Admin = require("../models/Admin");
const { adminValidation } = require("../validations/admin.validation");
const { hashPassword, comparePassword } = require("../helpers/bcrypt");
const jwt = require("jsonwebtoken");
const jwtService = require("../services/jwt.service");
const config = require("config");

const getAll = async (req, res) => {
  try {
    const admins = await Admin.findAll({
      attributes: { exclude: ["refresh_token", "verification", "password"] },
    });
    res.status(200).send(admins);
  } catch (err) {
    errorHandler(err, res);
  }
};

const getById = async (req, res) => {
  try {
    const id = req.params.id;
    const admin = await Admin.findByPk(id, {
      attributes: { exclude: ["refresh_token", "verification", "password"] },
    });
    if (!admin) {
      return res.status(404).send({ msg: "Admin topilmadi" });
    }
    return res.status(200).send(admin);
  } catch (err) {
    errorHandler(err, res);
  }
};

const create = async (req, res) => {
  try {
    const { error, value } = adminValidation(req.body);
    if (error) errorHandler(error, res);

    const otherData = {
      password: hashPassword(value.password),
    };

    const admin = await Admin.create(
      {
        ...value,
        ...otherData,
      },
      {
        attributes: { exclude: ["refresh_token", "verification", "password"] },
      }
    );
    res.status(200).send(admin);
  } catch (err) {
    errorHandler(err, res);
  }
};

const updateById = async (req, res) => {
  try {
    const id = req.params.id;
    const oldAdmin = await Admin.findByPk(id, {
      attributes: {
        exclude: ["refresh_token", "verification", "createdAt", "updatedAt"],
      },
    });

    if (!oldAdmin) {
      return res.status(404).send({ msg: "Admin topilmadi" });
    }

    const isMatch = comparePassword(req.body.password, oldAdmin.password);
    if (!isMatch) {
      return res.status(400).send({ msg: "Parol noto'g'ri" });
    }

    const { error, value } = adminValidation({ ...req.body });

    if (error) {
      return errorHandler(error, res);
    }

    const admin = await Admin.update(
      { ...value, password: oldAdmin.password },
      { where: { id } },
      {
        attributes: { exclude: ["refresh_token", "verification", "password"] },
      }
    );
    res.status(200).send(admin);
  } catch (err) {
    errorHandler(err, res);
  }
};

const changePassword = async (req, res) => {
  try {
    const id = req.params.id;
    const oldAdmin = await Admin.findByPk(id);

    if (!oldAdmin) {
      return res.status(404).send({ msg: "Admin topilmadi" });
    }

    const { currentPassword, newPassword } = req.body;

    const isMatch = comparePassword(currentPassword, oldAdmin.password);
    if (!isMatch) {
      return res.status(400).send({ msg: "Parol noto'g'ri" });
    }

    const hashedNewPassword = hashPassword(newPassword);

    await Admin.update({ password: hashedNewPassword }, { where: { id } });

    res.status(200).send({ msg: "Parol muvaffaqiyatli o'zgartirildi" });
  } catch (err) {
    errorHandler(err, res);
  }
};

const deleteById = async (req, res) => {
  try {
    const id = req.params.id;
    const oldAdmin = await Admin.findByPk(id, {
      attributes: { exclude: ["refresh_token", "verification", "password"] },
    });
    if (!oldAdmin) {
      return res.status(404).send({ msg: "Admin topilmadi" });
    }

    await Admin.destroy({ where: { id } });
    res.status(200).send(oldAdmin);
  } catch (err) {
    errorHandler(err, res);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.send({ msg: "Email yoki parol noto'g'ri" });
    }

    const isMatch = comparePassword(password, admin.password);
    if (!isMatch) {
      return res.send({ msg: "Email yoki parol noto'g'ri" });
    }

    const payload = {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      surname: admin.surname,
      phone: admin.phone,
    };
    const tokens = jwtService.generateTokens(payload);
    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: config.get("cookieTime"),
      httpOnly: true,
    });

    await Admin.update(
      { refreshToken: tokens.refreshToken },
      { where: { id: admin.id } }
    );

    res.status(200).send({ accessToken: tokens.accessToken });
  } catch (err) {
    errorHandler(err, res);
  }
};

const logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.send({ msg: "Noto'g'ri token" });
    }

    const decoded = jwt.verify(token, config.get("refreshKey"));
    if (!decoded) {
      return res.send({ msg: "Noto'g'ri token" });
    }

    await Admin.update({ refreshToken: "" }, { where: { id: decoded.id } });
    res.clearCookie("refreshToken");

    res.status(200).send({ msg: "Tizimdan chiqildi" });
  } catch (err) {
    errorHandler(err, res);
  }
};

const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.send({ msg: "Noto'g'ri token" });
    }

    const decoded = jwt.verify(token, config.get("refreshKey"));
    if (!decoded) {
      return res.send({ msg: "Noto'g'ri token" });
    }

    const admin = await Admin.findByPk(decoded.id);
    if (!admin) {
      return res.send({ msg: "Noto'g'ri token" });
    }

    const payload = {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      surname: admin.surname,
      phone: admin.phone,
    };
    const tokens = jwtService.generateTokens(payload);
    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: config.get("cookieTime"),
      httpOnly: true,
    });

    await Admin.update(
      { refreshToken: tokens.refreshToken },
      { where: { id: admin.id } }
    );

    res.status(200).send({ accessToken: tokens.accessToken });
  } catch (err) {
    errorHandler(err, res);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
  login,
  logout,
  refreshToken,
  changePassword,
};
