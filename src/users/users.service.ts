import { Injectable } from '@nestjs/common';

export type User = any;

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      email: 'john@gmail.com',
      password: 'changeme',
    },
    {
      userId: 2,
      email: 'maria@gmail.com',
      password: 'guess',
    },
  ];

  public async create(email: string, password: string) {
    const latestUser = this.users.sort(
      (firstUser, secondUser) => secondUser.userId - firstUser.userId,
    )[0];
    const newUser = {
      userId: Number(latestUser.userId) + 1,
      email,
      password,
    };
    this.users.push(newUser);
    return newUser;
  }

  public async update(id: number, updateObject: { password: string }) {
    const user = this.users.find((user) => user.userId === id);
    user.password = updateObject.password;
  }

  public async findById(id: number): Promise<User | undefined> {
    return this.users.find((user) => user.userId === id);
  }

  public async findOne(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === email);
  }
}
