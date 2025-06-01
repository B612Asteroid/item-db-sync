import { DataSource } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { join } from "path";

export const SourceDataSourceProvider = {
    provide: "SOURCE_DATASOURCE",
    inject: [ConfigService],
    useFactory: async (configService: ConfigService): Promise<DataSource> => {
        const dataSource = new DataSource({
            type: "mysql",
            host: configService.get("DB_SOURCE_HOST"),
            port: parseInt(configService.get("DB_SOURCE_PORT") || "3306"),
            username: configService.get("DB_SOURCE_USERNAME"),
            password: configService.get("DB_SOURCE_PASSWORD"),
            database: configService.get("DB_SOURCE_DATABASE"),
            entities: [join(__dirname, "../../app/**/source/*.entity.{ts,js}")],
            synchronize: false,
        });

        return dataSource.initialize(); // #. initialize()로 연결
    },
};
