import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import Contact from "./Contact";

@Entity()
export default class Transaction {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  type!: string;

  @Column("float")
  sum!: number;

  @Column("date")
  date!: Date;

  @ManyToOne(() => Contact, (contact) => contact.transactions)
  contact!: Contact;
}
