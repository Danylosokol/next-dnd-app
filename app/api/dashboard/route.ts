import { NextRequest, NextResponse } from "next/server";

import { Session } from "@/types/Session";
import { SessionModel } from "@/app/utils/models/Session";
import { TyreSet } from "@/types/TyreSet";
import { TyreSetModel } from "@/app/utils/models/TyreSet";
import connectDB from "@/app/utils/connectDB";
import mongoose from "mongoose";

type DashboardUpdate = {
  sessions: Session[];
  tyreSets: TyreSet[];
};

export async function PUT(request: NextRequest) {
  await connectDB();

  const { sessions, tyreSets } = (await request.json()) as DashboardUpdate;

  if (!sessions.length || !tyreSets.length) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    for (let weekendSession of sessions) {
      if (weekendSession.tyresToReturn) {
        await SessionModel.findByIdAndUpdate(
          weekendSession._id,
          {
            tyresToReturn: weekendSession.tyresToReturn.map(
              // @ts-ignore
              (s: Session) => s._id
            ),
          },
          { session }
        );
      }
    }
    for (let tyreSet of tyreSets) {
      if (tyreSet.sessionsUsedIn) {
        await TyreSetModel.findByIdAndUpdate(
          tyreSet._id,
          {
            state: tyreSet.state,
            // @ts-ignore
            sessionsUsedIn: tyreSet.sessionsUsedIn.map((t: TyreSet) => t._id),
          },
          { session }
        );
      }
    }
    await session.commitTransaction();
    session.endSession();
    return NextResponse.json({ message: "Updated successfully!" });
  } catch (error) {
    await session.abortTransaction();
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update data!" },
      { status: 500 }
    );
  }
}
