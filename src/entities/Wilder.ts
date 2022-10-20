import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Upvote } from "./Upvote";
import { ObjectType, Field, ID, InputType } from "type-graphql";
import { Length, IsIn } from "class-validator";

@Entity()
@ObjectType()
export class Wilder {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  city: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  age: number;

  @OneToMany(() => Upvote, "wilder")
  @Field(() => [Upvote])
  upvotes: Upvote[];
}

@InputType()
export class WilderInput {
  @Field()
  @Length(2, 50) // don't forget Li
  name: string;

  @Field()
  @IsIn(["Villeurbanne", "Lyon"])
  city: string;

  @Field({ nullable: true })
  age: number;
}
