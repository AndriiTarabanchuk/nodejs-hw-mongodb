export const serializeUser = (user) => {
  return {
    name: user.name,
    email: user.email,
    id: user._id,
    createAt: user.createAt,
    updateAt: user.updateAt,
  };
};
