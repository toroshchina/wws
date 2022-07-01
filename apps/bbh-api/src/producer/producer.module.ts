import { Module } from "@nestjs/common";
import { ProducerService } from "./producer.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Producer } from "./producer.model";
import { ProducerController } from "./producer.controller";

@Module({
  imports: [MongooseModule.forFeature([{ name: "Producer", schema: Producer }])],
  providers: [ProducerService],
  exports: [ProducerService],
  controllers: [ProducerController],
})
export class ProducerModule {}