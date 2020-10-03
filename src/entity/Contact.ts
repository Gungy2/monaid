import Transaction from "./Transaction";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

@Entity()
export default class Contact {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column()
  phone!: string;

  @Column()
  email!: string;

  @OneToMany(() => Transaction, (transaction) => transaction.contact)
  transactions!: Transaction[];
}
