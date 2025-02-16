import bcrypt from "bcrypt";

export const hashPassword = async (password: string): Promise<string> => {
  //  a salt is a string random value that is used to hash the password
  const salt = await bcrypt.genSalt(10);

  return await bcrypt.hash(password, salt);
};

export const checkPassword = async (
  entryPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(entryPassword, hashedPassword);
};
