import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle("PDF Generator API")
    .setDescription("API for generating PDF reports from occurrences")
    .setVersion("1.0")
    .addBearerAuth(
      { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      "Authorization"
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(3000);
  console.log("Application is running on: http://localhost:3000");
  console.log("Swagger documentation: http://localhost:3000/api");
}
bootstrap();
