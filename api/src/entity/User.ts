import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Point } from "typeorm-geojson";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    password_hash: string;

    @Column({ default: "client" })
    role: string; // 'admin', 'client', 'partner'

    @Column({
        type: "geometry",
        spatialFeatureType: "Point",
        srid: 4326, // SRID for WGS84 (latitude/longitude)
        nullable: true,
    })
    location: Point; // TypeORM Point type

    @Column({ default: true })
    is_active: boolean;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    created_at: Date;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updated_at: Date;
}
