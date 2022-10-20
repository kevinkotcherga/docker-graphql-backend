import { Resolver, Query, Mutation, Arg, ID } from "type-graphql";
import { Upvote } from "../entities/Upvote";
import datasource from "../utils";

@Resolver()
export class UpvotesResolver {
  @Mutation(() => Upvote)
  async createUpvote(
    @Arg("wilderId", () => ID) wilderId: number,
    @Arg("skillId", () => ID) skillId: number
  ): Promise<Upvote> {
    const repository = datasource.getRepository(Upvote);

    const exitingUpvote = await repository.findOne({
      where: {
        skill: { id: skillId },
        wilder: { id: wilderId },
      },
    });

    if (exitingUpvote !== null) {
      return exitingUpvote;
    } else {
      return await repository.save({
        wilder: { id: wilderId },
        skill: { id: skillId },
      });
    }
  }

  @Mutation(() => [Upvote])
  async createUpvotes(
    @Arg("wilderId", () => ID) wilderId: number,
    @Arg("skillsIds", () => [ID]) skillsIds: number[]
  ): Promise<Upvote[]> {
    const repository = datasource.getRepository(Upvote);
    const upvotes: Upvote[] = [];
    for (const skillId of skillsIds) {
      const exitingUpvote = await repository.findOne({
        where: {
          skill: { id: skillId },
          wilder: { id: wilderId },
        },
      });

      if (exitingUpvote !== null) {
        upvotes.push(exitingUpvote);
      } else {
        const newUpvote = await repository.save({
          wilder: { id: wilderId },
          skill: { id: skillId },
        });
        upvotes.push(newUpvote);
      }
    }
    return upvotes;
  }

  @Mutation(() => Upvote, { nullable: true })
  async doUpvote(@Arg("upvoteId") upvoteId: number): Promise<Upvote | null> {
    const repository = datasource.getRepository(Upvote);

    const exitingUpvote = await repository.findOne({
      where: {
        id: upvoteId,
      },
    });

    if (exitingUpvote !== null) {
      exitingUpvote.upvotes = exitingUpvote.upvotes + 1;

      return await repository.save(exitingUpvote);
    } else {
      return null;
    }
  }

  @Mutation(() => Upvote, { nullable: true })
  async deleteUpvote(@Arg("id", () => ID) id: number): Promise<Upvote | null> {
    const upvote = await datasource
      .getRepository(Upvote)
      .findOne({ where: { id } });

    if (upvote === null) {
      return null;
    }

    return await datasource.getRepository(Upvote).remove(upvote);
  }

  @Query(() => [Upvote])
  async upvotes(): Promise<Upvote[]> {
    return await datasource
      .getRepository(Upvote)
      .find({ relations: ["skill", "wilder"] });
  }

  @Query(() => Upvote, { nullable: true })
  async upvote(@Arg("id", () => ID) id: number): Promise<Upvote | null> {
    return await datasource
      .getRepository(Upvote)
      .findOne({ where: { id }, relations: ["skill", "wilder"] });
  }
}
