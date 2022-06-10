import { DataSource } from "typeorm";
import { InstitutionModel } from "./model";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "institution.db",
    synchronize: true,
    entities: [InstitutionModel]
})