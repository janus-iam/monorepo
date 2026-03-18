import { protectedProcedure, publicProcedure, router } from "../index";
import { accountRouter } from "./account";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return "OK";
  }),
  privateData: protectedProcedure.query(({ ctx }) => {
    return {
      message: "This is private",
      user: ctx.session.user,
    };
  }),
  account: accountRouter,
});
export type AppRouter = typeof appRouter;
