import { NextResponse } from "next/server";

export const handleError = (error: any) => {
  console.error(error);
  return NextResponse.json(
    {
      model: error.meta.modelName,
      message: error.meta.cause,
    },
    { status: 500 }
  );
};
