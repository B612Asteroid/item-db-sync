import { Module } from "@nestjs/common";
import { FileService } from "src/app/file/file.service";
import { DatabaseModule } from "src/core/database.module";

@Module({
    providers: [FileService],
    exports: [FileService],
    imports: [DatabaseModule],
})
export class FileModule {}
