import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const { imageUrl,  title, tags } = await request.json();
    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: 'utopias',
  
      context: {
        alt: title,
        caption: title,
      },
      tags: tags, // Cloudinary accepts an array of tags
    });


    console.log("uploads img:", result.secure_url );

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}