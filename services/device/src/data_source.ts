import { DataSource } from "typeorm";
import { DeviceOverviewModel, DeviceConcreteModel, DeviceGroupModel, TimeSlotModel, DeviceReferenceModel, PeerconnectionOverviewModel, PeerconnectionModel, ConfiguredDeviceReferenceModel, ServiceConfigModel } from "./model";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "device.db",
    synchronize: true,
    entities: [
        DeviceOverviewModel, 
        DeviceConcreteModel, 
        DeviceGroupModel, 
        TimeSlotModel, 
        DeviceReferenceModel,
        PeerconnectionOverviewModel,
        PeerconnectionModel,
        ConfiguredDeviceReferenceModel,
        ServiceConfigModel
    ]
})