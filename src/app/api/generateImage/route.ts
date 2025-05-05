// import { NextResponse } from 'next/server';

// import OpenAI from 'openai';

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// interface GenerationResult {
//   sentence: string;
//   imageUrl: string;
//   trends: string[];
//   geo: string;
// }
// async function uploadToCloudinary ( imageData: GenerationResult) {
//   if (!imageData) return;

//   try {

//     console.log("uploads image", imageData);

//     imageData.trends.push(imageData.geo)
//     const response = await fetch(`${process.env.BASE_URL}/api/cloudinary/upload`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         imageUrl: imageData.imageUrl,
//         sentence: imageData.sentence,
//         alt: imageData.trends.join(', '),
//         title: imageData.sentence,
//         tags: imageData.trends
//       }),
//     });

//     if (!response.ok) {
//       const data = await response.json();
//       console.log("fails upload to cloud", data);

//       throw new Error(data.error || 'Upload failed');

//     }
//   } catch (err) {
//     console.log("fails upload to cloud", err);

//   } finally {
//     console.log("ends upload to cloud");

//   }
// };

// export async function GET(request: Request) {
//   try {
//     const url = new URL(request.url);
//     let prompt = url.searchParams.get('prompt') || '';
//     const adjectives = url.searchParams.get('adjectives') || '';
//     const shouldReturnRemixSentence = url.searchParams.get('remixed') || '';

//     // // Generate sentence using OpenAI
//     const completion = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [{
//         role: "user",
//         content: `We need to make an image depicts following sentence: There is... ${prompt}, it should fit this vibe: ${adjectives}, please output an image prompt`
//       }],
//       max_tokens: 100,
//     });

//     const sentence = completion.choices[0].message.content || '';
//     sentence.replace('"', '');

//     console.log("has openai sentence", sentence);

//     // Generate image using DALL-E
//     const image = await openai.images.generate({
//       model: "dall-e-3",
//       prompt: sentence,
//       n: 1,
//       size: "1024x1024",
//     });

//     console.log("has openai image", image);

//     if(shouldReturnRemixSentence ==="yes"){
//       prompt = sentence;
//     }

//     // trends = chosenTrends;

//     const data = {

//       prompt,
//       imageUrl: image.data[0].url || 'imageurlplaceholder',
//       tags: adjectives

//     };

//     // uploadToCloudinary(data);

//     console.log("has gen image:", data);
//     return NextResponse.json(data);

//   } catch (error) {
//     console.error('Generation error:', error);
//     return NextResponse.json(
//       { error: 'Failed to generate content' },
//       { status: 500 }
//     );
//   }
// }
