import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BullModule } from "@nestjs/bull";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { ReportsModule } from "./reports/reports.module";
import { UsersModule } from "./users/users.module";
import { OccurrencesModule } from "./occurrences/occurrences.module";
import { PdfGeneratorModule } from "./pdf-generator/pdf-generator.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true, // Don't use in production!
    }),
    BullModule.forRoot({
      redis: {
        host: "redis",
        port: 6379,
      },
    }),
    AuthModule,
    UsersModule,
    OccurrencesModule,
    ReportsModule,
    PdfGeneratorModule,
  ],
})
export class AppModule {}
