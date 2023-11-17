import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AirportEntity } from '../airport/airport.entity';

@Entity()
export class AirlineEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  foundationDate: Date;

  @Column()
  webUrl: string;

  @ManyToMany(() => AirportEntity, (airport) => airport.airlines)
  @JoinTable()
  airports: AirportEntity[];
}
