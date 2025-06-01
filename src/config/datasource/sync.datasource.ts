import { DataSource } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { join } from "path";

export const SyncDataSourceProvider = {
    provide: "SYNC_DATASOURCE",
    inject: [ConfigService],
    useFactory: async (configService: ConfigService): Promise<DataSource> => {
        const dataSource = new DataSource({
            type: "mysql",
            host: configService.get("DB_SYNC_HOST"),
            port: parseInt(configService.get("DB_SYNC_PORT") || "3306"),
            username: configService.get("DB_SYNC_USERNAME"),
            password: configService.get("DB_SYNC_PASSWORD"),
            database: configService.get("DB_SYNC_DATABASE"),
            entities: [join(__dirname, "../../app/**/sync/*.entity.{ts,js}")],
            synchronize: false,
        });

        return dataSource.initialize(); // initialize()로 연결
    },
};
