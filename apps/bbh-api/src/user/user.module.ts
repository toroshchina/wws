import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { MongooseModule } from "@nestjs/mongoose";
import { User } from "./user.model";
import { UserController } from "./user.controller";

@Module({
  imports: [MongooseModule.forFeature([{ name: "User", schema: User }])],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}