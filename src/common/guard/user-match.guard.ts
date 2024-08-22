import {CanActivate, ExecutionContext, ForbiddenException, Injectable} from "@nestjs/common";

@Injectable()
export class UserMatchGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const userId = parseInt(request.params.user_id, 10);
        const tokenUserId = request.user.userId; // 수정된 부분

        if (isNaN(userId) || tokenUserId === undefined) {
            throw new ForbiddenException('Invalid user ID');
        }

        if (userId !== tokenUserId) {
            throw new ForbiddenException('Forbidden access');
        }

        return true;
    }
}

