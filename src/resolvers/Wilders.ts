import { Resolver, Query, Mutation, Arg, ID } from "type-graphql";
import { Wilder, WilderInput } from "../entities/Wilder";
import datasource from "../utils";

@Resolver()
export class WildersResolver {
  @Mutation(() => Wilder)
  async createWilder(@Arg("data") data: WilderInput): Promise<Wilder> {
    return await datasource.getRepository(Wilder).save(data);
  }

  @Mutation(() => Wilder, { nullable: true })
  async updateWilder(
    @Arg("id", () => ID) id: number,
    @Arg("name", { nullable: true }) name: string | null,
    @Arg("city", { nullable: true }) city: string | null
  ): Promise<Wilder | null> {
    const wilder = await datasource
      .getRepository(Wilder)
      .findOne({ where: { id } });

    if (wilder === null) {
      return null;
    }

    if (name != null) {
      wilder.name = name;
    }

    if (city !== null) {
      wilder.city = city;
    }

    return await datasource.getRepository(Wilder).save(wilder);
  }

  @Mutation(() => Wilder, { nullable: true })
  async deleteWilder(@Arg("id", () => ID) id: number): Promise<Wilder | null> {
    const wilder = await datasource
      .getRepository(Wilder)
      .findOne({ where: { id } });

    if (wilder === null) {
      return null;
    }

    return await datasource.getRepository(Wilder).remove(wilder);
  }

  @Query(() => [Wilder])
  async wilders(): Promise<Wilder[]> {
    return await datasource
      .getRepository(Wilder)
      .find({ relations: ["upvotes", "upvotes.skill"] });
  }

  @Query(() => Wilder, { nullable: true })
  async wilder(@Arg("id", () => ID) id: number): Promise<Wilder | null> {
    return await datasource
      .getRepository(Wilder)
      .findOne({ where: { id }, relations: ["upvotes", "upvotes.skill"] });
  }
}
