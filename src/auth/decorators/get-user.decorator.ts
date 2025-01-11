import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const GetUserAuthenticated = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;
    if (!user) {
      throw new InternalServerErrorException(
        'User no encontrado en la petición',
      );
    }
    return !data ? user : user[data];
  },
);
