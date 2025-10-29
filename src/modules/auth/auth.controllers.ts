import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import generatedToken from "../../config/token";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

    res.status(201).json({
      success: true,
      message: "Пользователь успешно зарегистрирован",
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Ошибка регистрации: ${error}`,
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

    res.status(200).json({
      success: true,
      message: "Вход выполнен успешно",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Ошибка входа: ${error}`,
    });
  }
};

export default { register, login };
