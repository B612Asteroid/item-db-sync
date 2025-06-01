import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { GlobalErrorFilter } from "src/core/GlobalErrorFilter";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // #. swagger 세팅
    const config = new DocumentBuilder()
        .setTitle("Sync API")
        .setDescription("source <-> syncdb 싱크용 API 문서")
        .setVersion("1.0")
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api-docs", app, document); // localhost:3000/api-docs
    app.useGlobalFilters(new GlobalErrorFilter());
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
