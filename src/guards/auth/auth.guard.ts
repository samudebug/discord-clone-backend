import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { auth } from 'firebase-admin';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.verifyToken(request);
  }

  private async verifyToken(req: any): Promise<boolean> {
    const token = req.headers?.authorization;
    if (!token) return false;

    const decodedToken = await auth().verifyIdToken(token);

    if (decodedToken) {
      req.userId = decodedToken.uid;
      Logger.debug('Token authenticated', 'AuthGuard');
    }
    return !!decodedToken;
  }
}
