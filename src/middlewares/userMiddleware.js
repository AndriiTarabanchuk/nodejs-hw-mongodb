import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/users.js';

export const userMiddleware = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    // Валідація userId (наприклад, перевірка формату)
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return next(createHttpError(400, 'Invalid user ID'));
    }

    // Завантаження користувача з бази
    const user = await UsersCollection.findById({ userId });

    if (!user) {
      return next(createHttpError(404, 'User not found'));
    }

    // Додаємо користувача в запит, щоб передати його далі
    req.user = user;

    // Продовжуємо виконання наступних middleware або маршрутів
    next();
  } catch (error) {
    next(error);
  }
};
