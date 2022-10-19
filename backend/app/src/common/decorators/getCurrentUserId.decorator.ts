import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Payload } from '../../auth/types/';

export const GetCurrentUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as Payload;
    return user.id;
  },
);
