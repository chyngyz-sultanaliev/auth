import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import generatedToken from "../../config/token";
import prisma from "../../config/prisma";

const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Все поля обязательны для заполнения",
      });
    }

    const findUser = await prisma.user.findUnique({
      where: { email },
    });

    if (findUser) {
      return res.status(409).json({
        success: false,
        message: "Пользователь с таким email уже существует",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const token = generatedToken.generateToken(newUser.id, newUser.email);
    const { password: _, ...userData } = newUser;

    res.status(201).json({
      success: true,
      message: "Пользователь успешно зарегистрирован",
      token,
      user: userData,
    });
  } catch (error) {
    console.error("Ошибка в register:", error);
    res.status(500).json({
      success: false,
      message: "Ошибка на сервере, попробуйте позже",
    });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Все поля обязательны для заполнения",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Пользователь не найден",
      });
    }

    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword) {
      return res.status(401).json({
        success: false,
        message: "Неверный пароль",
      });
    }

    const token = generatedToken.generateToken(user.id, user.email);
    const { password: _, ...userData } = user;

    res.status(200).json({
      success: true,
      message: "Вход выполнен успешно",
      token,
      user: userData,
    });
  } catch (error) {
    console.error("Ошибка login:", error);
    res.status(500).json({
      success: false,
      message: "Ошибка входа, попробуйте позже",
    });
  }
};

const profile = async (req: Request, res: Response) => {
  try {
    const userData = req.user;

    if (!userData) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(userData.id) },
      select: { id: true, name: true, email: true, createdAt: true },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Пользователь не найден",
      });
    }

    res.status(200).json({
      success: true,
      message: "Профиль успешно получен",
      user,
    });
  } catch (error) {
    console.error("Ошибка profile:", error);
    res.status(500).json({
      success: false,
      message: "Ошибка на сервере, попробуйте позже",
    });
  }
};
// Absge8HlRCTVhiAL
const update = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const { name, email, password } = req.body;
    if (!name || !email)
      return res
        .status(400)
        .json({ success: false, message: "Name и email обязательны" });

    const emailTaken = await prisma.user.findUnique({ where: { email } });
    if (emailTaken && emailTaken.id !== Number(userId)) {
      return res
        .status(409)
        .json({ success: false, message: "Email уже используется" });
    }

    let hashedPassword: string | undefined;
    if (password) hashedPassword = await bcrypt.hash(password, 10);

    const updateData: any = { name, email };
    if (hashedPassword) updateData.password = hashedPassword;

    const updatedUser = await prisma.user.update({
      where: { id: Number(userId) },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res
      .status(200)
      .json({ success: true, message: "Профиль обновлён", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Ошибка сервера" });
  }
};

const logout = async (req: Request, res: Response) => {
  try {
    res.status(200).json({
      success: true,
      message: "Вы успешно вышли из системы",
    });
  } catch (error) {
    console.error("Ошибка logout:", error);
    res.status(500).json({
      success: false,
      message: "Ошибка на сервере, попробуйте позже",
    });
  }
};

export default { register, login, profile, logout, update };
