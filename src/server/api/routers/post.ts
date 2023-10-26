import { z } from "zod";
import { DynamoDB } from "aws-sdk";

import { createTRPCRouter, publicProcedure } from "~@/server/api/trpc";
import { type AttributeMap } from "aws-sdk/clients/dynamodb";

// let post = {
//   id: 1,
//   name: "Hello World",
// };

export const postRouter = createTRPCRouter({
  // hello: publicProcedure
  //   .input(z.object({ text: z.string() }))
  //   .query(({ input }) => {
  //     return {
  //       greeting: `Hello ${input.text}`,
  //     };
  //   }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(({ input }) => {
      // simulate a slow db call

      const unmarshalledItem = DynamoDB.Converter.unmarshall(JSON.parse(input.name) as AttributeMap);

      //
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      //
      // post = { id: post.id + 1, name: input.name };
      return unmarshalledItem;
    }),

  // getLatest: publicProcedure.query(() => {
  //   return post;
  // }),
});
