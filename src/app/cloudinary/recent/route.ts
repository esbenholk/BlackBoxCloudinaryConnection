import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

type Image = {
  id: string;
  url: string;
  title: string;
  tags: string[];
  date: string;
};

export async function GET(request: Request) {
  // const {skip, limit} = req.query;
  const url = new URL(request.url);
  const skipNumber = parseInt(url.searchParams.get("skip") as string) || 0;
  const limitNumber = parseInt(url.searchParams.get("limit") as string) || 10;
  const folder = parseInt(url.searchParams.get("folder") as string) || "";
  try {
    const result = await cloudinary.search
      .expression(`folder: ${folder}`)
      .sort_by("created_at", "desc")
      .with_field("context")
      .with_field("tags")
      .max_results(skipNumber + limitNumber)
      .execute();

    console.log("has all recent images", result);

    const images: Image[] = result.resources
      .slice(skipNumber, skipNumber + limitNumber)
      .map((image: any) => ({
        id: image.asset_id,
        url: image.secure_url,
        title: image.context?.alt || "Untitled",
        tags: image.tags,
        date: image.created_at,
      }));

    return NextResponse.json(images);
  } catch (error) {
    console.error("Cloudinary fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent images" },
      { status: 500 }
    );
  }
}
