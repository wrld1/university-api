import bcrypt from 'bcrypt';

export const comparePasswords = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};
