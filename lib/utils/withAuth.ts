// utils/withAuth.js
import { authCheck } from "../../middleware/auth";
import { NextRequest, NextResponse } from "next/server";

export function withAuth(handler: Function) {
  return async (req: NextRequest, res: NextResponse) => {
    try {
      let authorized = false;

      await new Promise<void>((resolve, reject) => {
        authCheck(
          req,
          () => {
            authorized = true;
            resolve();
          },
          reject
        );
      });

      if (!authorized)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

      return handler(req, res);
    } catch (error) {
      console.log("error", error);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  };
}
