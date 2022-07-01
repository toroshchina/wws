import { Module } from "@nestjs/common";
import { BrandService } from "./brand.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Brand } from "./brand.model";
import { BrandController } from "./brand.controller";

@Module({
  imports: [MongooseModule.forFeature([{ name: "Brand", schema: Brand }])],
  providers: [BrandService],
  exports: [BrandService],
  controllers: [BrandController],
})
export class BrandModule {}