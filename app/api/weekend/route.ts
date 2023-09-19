import { NextRequest, NextResponse } from "next/server";

import { Session } from "@/types/Session";
import { SessionModel } from "@/app/utils/models/Session";
import { SortSessions } from "@/app/utils/sessionService";
import { TyreSet } from "@/types/TyreSet";
import { TyreSetModel } from "@/app/utils/models/TyreSet";
import { WeekendModel } from "@/app/utils/models/Weekend";
import connectDB from "@/app/utils/connectDB";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
  await connectDB();

  const weekendId = request.nextUrl.searchParams.get("id");
  if (!weekendId) {
    return NextResponse.json(
      { error: "Weekend ID is required." },
      { status: 400 }
    );
  }

  try {
    const weekend = await WeekendModel.findById(weekendId)
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
      .exec()
      .catch((e) => {
        throw e;
      });
    return NextResponse.json(weekend);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to find weekend by id." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  await connectDB();

  const body = await request.json();
  const tyreSets: TyreSet[] = body.tyreSets;
  const sessions: Session[] = body.sessions;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const createdTyreSets = await TyreSetModel.insertMany(tyreSets, {
      session,
    });
    const createdSessions = await SessionModel.insertMany(sessions, {
      session,
    });
    const createdWeekend = await WeekendModel.create(
      [
        {
          name: body.name,
          tyreSets: createdTyreSets.map((tyreSet) => tyreSet._id),
          sessions: createdSessions.map((session) => session._id),
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    const populatedWeekend = await WeekendModel.findById(createdWeekend[0]._id)
      .populate({ path: "tyreSets", model: TyreSetModel })
      .populate({ path: "sessions", model: SessionModel })
      .exec();
    return NextResponse.json(populatedWeekend);
  } catch (error) {
    await session.abortTransaction();
    console.error("Error while creating weekend: ", error);
    session.endSession();
    return NextResponse.json(
      { error: "Failed to create the weekend." },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  await connectDB();
  const body = await request.json();
  const weekendId = body._id;
  if (!weekendId) {
    return NextResponse.json(
      { error: "Weekend ID is required." },
      { status: 400 }
    );
  }
  const { name, tyreSets, sessions, oldTyreSetsIds, oldSessionsIds } = body;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await TyreSetModel.deleteMany(
      { _id: { $in: oldTyreSetsIds } },
      { session }
    );
    const createdTyreSets = await TyreSetModel.insertMany(tyreSets, {
      session,
    });
    await SessionModel.deleteMany(
      { _id: { $in: oldSessionsIds } },
      { session }
    );
    const existingSessions = sessions.filter(
      (session: Session) => session._id !== undefined
    );
    for (let weekendSession of existingSessions) {
      await SessionModel.findByIdAndUpdate(
        weekendSession._id,
        {
          tyresToReturn: [],
        },
        { session }
      );
    }
    const newSessions = sessions.filter(
      (session: Session) => session._id === undefined
    );
    const createdSessions = await SessionModel.insertMany(newSessions, {
      session,
    });

    const updatedSessions: Session[] = existingSessions
      .concat(createdSessions)
      .sort(SortSessions);

    await WeekendModel.findByIdAndUpdate(
      { _id: weekendId },
      {
        name: name,
        tyreSets: createdTyreSets.map((tyreSet) => tyreSet._id),
        sessions: updatedSessions.map((session) => session._id),
      },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    const updatedWeekend = await WeekendModel.findById(weekendId)
      .populate({ path: "tyreSets", model: TyreSetModel })
      .populate({ path: "sessions", model: SessionModel })
      .exec();
    return NextResponse.json(updatedWeekend);
  } catch (error) {
    await session.abortTransaction();
    console.error("Error while updating weekend: ", error);
    session.endSession();
    return NextResponse.json(
      { error: "Failed to update the weekend" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  await connectDB();
  const weekendId = request.nextUrl.searchParams.get("id");
  if (!weekendId) {
    return NextResponse.json(
      { error: "Weekend ID is required." },
      { status: 400 }
    );
  }
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const weekend = await WeekendModel.findById(weekendId);

    if (!weekend) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json(
        { error: "Weekend not found." },
        { status: 404 }
      );
    }

    await TyreSetModel.deleteMany(
      { _id: { $in: weekend.tyreSets } },
      { session }
    );
    await SessionModel.deleteMany(
      { _id: { $in: weekend.sessions } },
      { session }
    );

    await WeekendModel.deleteOne({ _id: weekendId }, { session });
    await session.commitTransaction();
    session.endSession();

    return NextResponse.json({ message: "Weekend deleted successfully." });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error while deleting weekend: ", error);
    session.endSession();
    return NextResponse.json(
      { error: "Failed to delete weekend." },
      { status: 500 }
    );
  }
}
