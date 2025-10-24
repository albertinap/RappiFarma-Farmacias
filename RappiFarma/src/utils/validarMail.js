export const validarMail = (email) => {
  const regex = /\S+@\S+\.\S+/;
  return regex.test(email);
};