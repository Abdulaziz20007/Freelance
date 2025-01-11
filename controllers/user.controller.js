const { errorHandler } = require("../helpers/error_handler");
const User = require("../models/User");
const { userValidation } = require("../validations/user.validation");
const { hashPassword, comparePassword } = require("../helpers/bcrypt");
const jwt = require("jsonwebtoken");
const jwtService = require("../services/jwt.service");
const config = require("config");
const uuid = require("uuid");
const mailService = require("../services/mail.service");

const getAll = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["refresh_token", "verification", "password"] },
    });
    res.status(200).send(users);
  } catch (err) {
    errorHandler(err, res);
  }
};

const getById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByPk(id, {
      attributes: { exclude: ["refresh_token", "verification", "password"] },
    });
    if (!user) {
      return res.send({ msg: "User topilmadi" });
    }
    res.status(200).send(user);
  } catch (err) {
    errorHandler(err, res);
  }
};

const create = async (req, res) => {
  try {
    const { error, value } = userValidation(req.body);
    if (error) {
      return errorHandler(error, res);
    }

    const otherData = {
      password: hashPassword(value.password),
      verification: uuid.v4(),
      is_active: false,
    };

    const user = await User.create(
      {
        ...value,
        ...otherData,
      },
      {
        attributes: { exclude: ["refresh_token", "verification", "password"] },
      }
    );
    await mailService.sendMailActivationCode(
      value.email,
      "user",
      otherData.verification
    );
    res.status(200).send(user);
  } catch (err) {
    errorHandler(err, res);
  }
};

const updateById = async (req, res) => {
  try {
    const id = req.params.id;
    const oldUser = await User.findByPk(id, {
      attributes: {
        exclude: ["refresh_token", "verification", "createdAt", "updatedAt"],
      },
    });

    if (!oldUser) {
      return res.status(404).send({ msg: "User topilmadi" });
    }

    const isMatch = comparePassword(req.body.password, oldUser.password);
    if (!isMatch) {
      return res.status(400).send({ msg: "Parol noto'g'ri" });
    }

    const { error, value } = userValidation({ ...req.body });

    if (error) {
      return errorHandler(error, res);
    }

    const verification = uuid.v4();

    if (value.email !== oldUser.email) {
      await mailService.sendMailActivationCode(
        value.email,
        "user",
        verification
      );
      await User.update(
        { is_active: false, verification },
        { where: { id: oldUser.id } }
      );
    }

    const user = await User.update(
      { ...value, password: oldUser.password },
      { where: { id } },
      {
        attributes: { exclude: ["refresh_token", "verification", "password"] },
      }
    );
    res.status(200).send(user);
  } catch (err) {
    errorHandler(err, res);
  }
};

const changePassword = async (req, res) => {
  try {
    const id = req.params.id;
    const oldUser = await User.findByPk(id);

    if (!oldUser) {
      return res.status(404).send({ msg: "User topilmadi" });
    }

    const { currentPassword, newPassword } = req.body;

    const isMatch = comparePassword(currentPassword, oldUser.password);
    if (!isMatch) {
      return res.status(400).send({ msg: "Joriy parol noto'g'ri" });
    }

    const hashedNewPassword = hashPassword(newPassword);

    await User.update({ password: hashedNewPassword }, { where: { id } });

    res.status(200).send({ msg: "Parol muvaffaqiyatli o'zgartirildi" });
  } catch (err) {
    errorHandler(err, res);
  }
};

const deleteById = async (req, res) => {
  try {
    const id = req.params.id;
    const oldUser = await User.findByPk(id, {
      attributes: { exclude: ["refreshToken", "verification", "password"] },
    });
    if (!oldUser) {
      return res.send(404).send({ msg: "User topilmadi" });
    }

    await User.destroy({ where: { id } });
    res.status(200).send(oldUser);
  } catch (err) {
    errorHandler(err, res);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.send({ msg: "Email yoki parol noto'g'ri" });
    }

    const isMatch = comparePassword(password, user.password);
    if (!isMatch) {
      return res.send({ msg: "Email yoki parol noto'g'ri" });
    }

    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      surname: user.surname,
      phone: user.phone,
    };
    const tokens = jwtService.generateTokens(payload);
    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: config.get("cookieTime"),
      httpOnly: true,
    });

    await User.update(
      { refreshToken: tokens.refreshToken },
      { where: { id: user.id } }
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

    await User.update({ refreshToken: "" }, { where: { id: decoded.id } });
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

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.send({ msg: "Noto'g'ri token" });
    }

    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      surname: user.surname,
      phone: user.phone,
    };
    const tokens = jwtService.generateTokens(payload);
    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: config.get("cookieTime"),
      httpOnly: true,
    });

    await User.update(
      { refreshToken: tokens.refreshToken },
      { where: { id: user.id } }
    );

    res.status(200).send({ accessToken: tokens.accessToken });
  } catch (err) {
    errorHandler(err, res);
  }
};

const verify = async (req, res) => {
  try {
    const verification = req.params.id;
    const user = await User.findOne({ where: { verification } });

    if (!user) {
      return res.status(404).send({ msg: "User topilmadi" });
    }

    if (user.is_active) {
      return res.status(400).send({ msg: "User aktiv" });
    }

    await User.update({ is_active: true }, { where: { id: user.id } });
    return res.status(200).send({ msg: "User aktivlashtirildi" });
  } catch (err) {
    return errorHandler(err, res);
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
  verify,
  changePassword,
};
