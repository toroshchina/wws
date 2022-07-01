import { Module } from "@nestjs/common";
import { ProductService } from "./product.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Product } from "./product.model";
import { ProductController } from "./product.controller";

@Module({
  imports: [MongooseModule.forFeature([{ name: "Product", schema: Product }])],
  providers: [ProductService],
  exports: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}