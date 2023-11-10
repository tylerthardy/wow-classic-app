import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const User = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const authHeader: string = request.headers.authorization;
  const jwtString: string = authHeader.split(' ')[1];

  return jwtString;
});
