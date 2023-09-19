import { NextRequest, NextResponse } from "next/server";

import { SessionModel } from "@/app/utils/models/Session";
import { TyreSetModel } from "@/app/utils/models/TyreSet";
import { WeekendModel } from "@/app/utils/models/Weekend";
import connectDB from "@/app/utils/connectDB";

export async function GET(request: NextRequest) {
  await connectDB();
  const url = request.nextUrl.searchParams;
  console.log(url);
  try {
    const allWeekends = await WeekendModel.find()
      .populate({
        path: "tyreSets",
        model: TyreSetModel,
        populate: {
          path: "sessionsUsedIn",
          model: SessionModel,
        },
      })
      .populate({
        path: "sessions",
        model: SessionModel,
        populate: {
          path: "tyresToReturn",
          model: TyreSetModel,
        },
      })
      .exec();
    return NextResponse.json(allWeekends);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to get all weekends." },
      { status: 500 }
    );
  }
}
