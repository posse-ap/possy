import { NextResponse } from "next/server";
import { listSurveys } from "@/usecases/survey";

export async function GET() {
  try {
    const surveys = await listSurveys();
    return NextResponse.json(surveys);
  } catch (error) {
    console.error("Error fetching surveys:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
