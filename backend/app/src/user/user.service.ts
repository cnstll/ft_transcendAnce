import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {
  constructor(private authService: AuthService) {}

  createUser(): void {
    return;
  }

  logInUser(): void {
    return;
  }
  updateUser(): void {
    return;
  }

  deleteUser(): void {
    return;
  }
}
