import { Module } from "@nestjs/common";
import { ManufacturerService } from "./manufacturer.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Manufacturer } from "./manufacturer.model";
import { ManufacturerController } from "./manufacturer.controller";

@Module({
  imports: [MongooseModule.forFeature([{ name: "Manufacturer", schema: Manufacturer }])],
  providers: [ManufacturerService],
  exports: [ManufacturerService],
  controllers: [ManufacturerController],
})
export class ManufacturerModule {}