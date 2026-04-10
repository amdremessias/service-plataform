import { Request, Response } from "express";
import { ServiceService } from "../service/ServiceService";

export class ServiceController {
    private serviceService = new ServiceService();

    async createService(req: Request, res: Response) {
        const { name, description, price, partnerId } = req.body;
        try {
            const service = await this.serviceService.createService(name, description, price, partnerId);
            res.status(201).json(service);
        } catch (error) {
            res.status(400).json({ message: "Error creating service", error: error.message });
        }
    }

    async getServicesByLocation(req: Request, res: Response) {
        const { latitude, longitude, radiusKm } = req.query;
        if (!latitude || !longitude || !radiusKm) {
            return res.status(400).json({ message: "Missing latitude, longitude, or radiusKm" });
        }
        try {
            const services = await this.serviceService.findServicesByLocation(Number(latitude), Number(longitude), Number(radiusKm));
            res.status(200).json(services);
        } catch (error) {
            res.status(500).json({ message: "Error fetching services by location", error: error.message });
        }
    }

    async getServiceById(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const service = await this.serviceService.getServiceById(Number(id));
            if (service) {
                res.status(200).json(service);
            } else {
                res.status(404).json({ message: "Service not found" });
            }
        } catch (error) {
            res.status(500).json({ message: "Error fetching service", error: error.message });
        }
    }
}
