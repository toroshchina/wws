import { Module } from "@nestjs/common";
import { LineService } from "./line.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Line } from "./line.model";
import { LineController } from "./line.controller";

@Module({
  imports: [MongooseModule.forFeature([{ name: "Line", schema: Line }])],
  providers: [LineService],
  exports: [LineService],
  controllers: [LineController],
})
export class LineModule {}