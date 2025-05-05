import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const skipNumber = parseInt(url.searchParams.get("skip") as string) || 0;
    const limitNumber =
      parseInt(url.searchParams.get("limit") as string) || 100;
    const folder = url.searchParams.get("folder") || "";

    console.log("gets images from", url);
    console.log("has folder", folder);

    const recentImagesResponse = await fetch(
      `${process.env.BASE_URL}/api/cloudinary/recent?limit=${encodeURIComponent(
        limitNumber
      )}&skip=${encodeURIComponent(skipNumber)}&folder=${encodeURIComponent(
        folder
      )}`
    );
    const data = await recentImagesResponse.json();

    console.log("CALLS 100 IMAGES", recentImagesResponse);

    if (!recentImagesResponse.ok)
      throw new Error(data.error || "Generation failed");

    return NextResponse.json(data);
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    );
  }
}
