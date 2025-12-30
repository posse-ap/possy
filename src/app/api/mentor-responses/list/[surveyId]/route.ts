import { NextResponse } from "next/server";
import { listMentorResponses } from "@/usecases/mentorResponse";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ surveyId: string }> },
) {
  try {
    const { surveyId } = await params;
    const responses = await listMentorResponses(surveyId);

    return NextResponse.json(responses);
  } catch (error) {
    console.error("Error fetching mentor responses:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
