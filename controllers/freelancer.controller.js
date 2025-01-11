const { errorHandler } = require("../helpers/error_handler");
const Freelancer = require("../models/Freelancer");
const {
  freelancerValidation,
} = require("../validations/freelancer.validation");
const { hashPassword, comparePassword } = require("../helpers/bcrypt");
const jwt = require("jsonwebtoken");
const jwtService = require("../services/jwt.service");
const config = require("config");

const getAll = async (req, res) => {
  try {
    const freelancers = await Freelancer.findAll({
      attributes: { exclude: ["refreshToken", "verification", "password"] },
    });
    res.status(200).send(freelancers);
  } catch (err) {
    errorHandler(err, res);
  }
};

const getById = async (req, res) => {
  try {
    const id = req.params.id;
    const freelancer = await Freelancer.findByPk(id, {
      attributes: { exclude: ["refreshToken", "verification", "password"] },
    });
    if (!freelancer) {
      return res.send({ msg: "Freelancer topilmadi" });
    }
    res.status(200).send(freelancer);
  } catch (err) {
    errorHandler(err, res);
  }
};

const create = async (req, res) => {
  try {
    const { error, value } = freelancerValidation(req.body);
    if (error) {
      return errorHandler(error, res);
    }

    const otherData = {
      password: hashPassword(value.password),
      verification: uuid.v4(),
      is_active: false,
    };

    const freelancer = await Freelancer.create(
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
      "freelancer",
      otherData.verification
    );
    res.status(200).send(freelancer);
  } catch (err) {
    errorHandler(err, res);
  }
};

const updateById = async (req, res) => {
  try {
    const id = req.params.id;
    const oldFreelancer = await Freelancer.findByPk(id, {
      attributes: {
        exclude: ["refresh_token", "verification", "createdAt", "updatedAt"],
      },
    });

    if (!oldFreelancer) {
      return res.status(404).send({ msg: "Freelancer topilmadi" });
    }

    const isMatch = comparePassword(req.body.password, oldFreelancer.password);
    if (!isMatch) {
      return res.status(400).send({ msg: "Parol noto'g'ri" });
    }

    const { error, value } = freelancerValidation({ ...req.body });

    if (error) {
      return errorHandler(error, res);
    }

    const verification = uuid.v4();

    if (value.email !== oldFreelancer.email) {
      await mailService.sendMailActivationCode(
        value.email,
        "freelancer", 
        verification
      );
      await Freelancer.update(
        { is_active: false, verification },
        { where: { id: oldFreelancer.id } }
      );
    }

    const freelancer = await Freelancer.update(
      { ...value, password: oldFreelancer.password },
      { where: { id } },
      {
        attributes: { exclude: ["refresh_token", "verification", "password"] },
      }
    );
    res.status(200).send(freelancer);
  } catch (err) {
    errorHandler(err, res);
  }
};

const changePassword = async (req, res) => {
  try {
    const id = req.params.id;
    const oldFreelancer = await Freelancer.findByPk(id);

    if (!oldFreelancer) {
      return res.status(404).send({ msg: "Freelancer topilmadi" });
    }

    const { currentPassword, newPassword } = req.body;

    const isMatch = comparePassword(currentPassword, oldFreelancer.password);
    if (!isMatch) {
      return res.status(400).send({ msg: "Joriy parol noto'g'ri" });
    }

    const hashedNewPassword = hashPassword(newPassword);

    await Freelancer.update({ password: hashedNewPassword }, { where: { id } });

    res.status(200).send({ msg: "Parol muvaffaqiyatli o'zgartirildi" });
  } catch (err) {
    errorHandler(err, res);
  }
};

const deleteById = async (req, res) => {
  try {
    const id = req.params.id;
    const oldFreelancer = await Freelancer.findByPk(id, {
      attributes: { exclude: ["refreshToken", "verification", "password"] },
    });
    if (!oldFreelancer) {
      return res.send(404).send({ msg: "Freelancer topilmadi" });
    }

    await Freelancer.destroy({ where: { id } });
    res.status(200).send(oldFreelancer);
  } catch (err) {
    errorHandler(err, res);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const freelancer = await Freelancer.findOne({ where: { email } });
    if (!freelancer) {
      return res.send({ msg: "Email yoki parol noto'g'ri" });
    }

    const isMatch = comparePassword(password, freelancer.password);
    if (!isMatch) {
      return res.send({ msg: "Email yoki parol noto'g'ri" });
    }

    const payload = {
      id: freelancer.id,
      email: freelancer.email,
      name: freelancer.name,
      surname: freelancer.surname,
      phone: freelancer.phone,
    };
    const tokens = jwtService.generateTokens(payload);
    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: config.get("cookieTime"),
      httpOnly: true,
    });

    await Freelancer.update(
      { refreshToken: tokens.refreshToken },
      { where: { id: freelancer.id } }
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

    await Freelancer.update(
      { refreshToken: "" },
      { where: { id: decoded.id } }
    );
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

    const freelancer = await Freelancer.findByPk(decoded.id);
    if (!freelancer) {
      return res.send({ msg: "Noto'g'ri token" });
    }

    const payload = {
      id: freelancer.id,
      email: freelancer.email,
      name: freelancer.name,
      surname: freelancer.surname,
      phone: freelancer.phone,
    };
    const tokens = jwtService.generateTokens(payload);
    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: config.get("cookieTime"),
      httpOnly: true,
    });

    await Freelancer.update(
      { refreshToken: tokens.refreshToken },
      { where: { id: freelancer.id } }
    );

    res.status(200).send({ accessToken: tokens.accessToken });
  } catch (err) {
    errorHandler(err, res);
  }
};

const verify = async (req, res) => {
  try {
    const verification = req.params.id;
    const freelancer = await Freelancer.findOne({ where: { verification } });

    if (!freelancer) {
      return res.status(404).send({ msg: "Freelancer topilmadi" });
    }

    if (freelancer.is_active) {
      return res.status(400).send({ msg: "Freelancer aktiv" });
    }

    await Freelancer.update(
      { is_active: true },
      { where: { id: freelancer.id } }
    );
    return res.status(200).send({ msg: "Freelancer aktivlashtirildi" });
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
