export const ctrlWrapper = (ctrl) => {
  return async (req, res, next) => {
    await ctrl(req, res, next);
    try {
    } catch (error) {
      next(error); // передаємо помилку далі для обробки
    }
  };
};
