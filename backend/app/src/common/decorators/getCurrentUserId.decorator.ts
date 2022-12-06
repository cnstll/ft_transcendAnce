import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../../auth/types';

export const GetCurrentUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext): string => {
    interface UserRequest extends Request {
      user: JwtPayload;
    }
    const request = context.switchToHttp().getRequest<UserRequest>();
    const user = request.user;
    return user.id;
  },
);
