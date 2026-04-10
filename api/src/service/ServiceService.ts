import { AppDataSource } from "../data-source";
import { Service } from "../entity/Service";
import { User } from "../entity/User";
import { Point } from "typeorm-geojson";

export class ServiceService {
    private serviceRepository = AppDataSource.getRepository(Service);
    private userRepository = AppDataSource.getRepository(User);

    async createService(name: string, description: string, price: number, partnerId: number): Promise<Service> {
        const partner = await this.userRepository.findOne({ where: { id: partnerId, role: "partner" } });
        if (!partner) {
            throw new Error("Partner not found or not authorized.");
        }
        const service = this.serviceRepository.create({ name, description, price, partner });
        return this.serviceRepository.save(service);
    }

    async findServicesByLocation(latitude: number, longitude: number, radiusKm: number): Promise<Service[]> {
        // Using PostGIS ST_DWithin function for geospatial queries
        // The distance is in meters, so convert radiusKm to meters
        const services = await this.serviceRepository
            .createQueryBuilder("service")
            .innerJoinAndSelect("service.partner", "partner")
            .where("ST_DWithin(partner.location, ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography, :radius)", {
                longitude,
                latitude,
                radius: radiusKm * 1000, // Convert km to meters
            })
            .getMany();

        return services;
    }

    async getServiceById(id: number): Promise<Service | null> {
        return this.serviceRepository.findOne({ where: { id }, relations: ["partner"] });
    }
}
