import { User } from "src/modules/user/user.entity";

export interface ITokenData {
    tokenId: string;
    appId: string;
    userId: User['id'],
    userRole: User['role'],
    deviceType: string,
    browser: string,
    tokenTime: string,
}