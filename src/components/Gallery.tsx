'use client';

import {Card} from '../app/components/Card';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";



type ImageCardProps = {
  url: string;
  title: string;
  tags: string;
};




export default function Gallery({ news, poorRemixedImageIntoCouldron, shareImageToSocket}: { news: ImageCardProps[], poorRemixedImageIntoCouldron: (image: ImageCardProps) => void, shareImageToSocket:  (image: ImageCardProps) => void}) {
  const [showRemixer, setShowRemixer] = useState(false);
  const [text, setText] = useState<string>("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState<ImageCardProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploadLoading] = useState(false);
  const [words, setWords] = useState<string[]>([]);


  const joinWithComma = (words: string[]): string => {
    return words.join(", ");
  };

  const generateImage = async () => {
    setLoading(true);


    if(selectedImages.length > 1 ){
      try {
        let prompts = [];
        let tags = [];
        for (let index = 0; index < selectedImages.length; index++) {
          const element = selectedImages[index];
          prompts.push(element.title);
          for (let index = 0; index < element.tags.length; index++) {
            const tag= element.tags[index];
            tags.push(tag);
          }
          
          
        }
        
    
        const response = await fetch(`/api/generateImage?prompt=${encodeURIComponent(joinWithComma(prompts)||"utopias")}&adjectives=${encodeURIComponent(joinWithComma(tags)||"")}&remixed=yes`);
        const data = await response.json();
      
        console.log("data from gen", data);
        
        setText(data.prompt);
        setWords(tags);
        
        if (!response.ok) throw new Error(data.error || 'Generation failed');
        // setImage(null);
        setGeneratedImage(data.imageUrl);     
        // setText(data.sentence);
  
      } catch (err) {
        // setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
       
      }
    } else {
        setLoading(false);
    }

  };
  const upLoadImage = async (_image: string) =>{
    try {
      setUploadLoading(true);
      console.log("uploads image file", _image, text);
      const response = await fetch(`/api/cloudinary/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: _image,
          sentence: text || "utopias",
          alt: text || "utopias",
          title: text || "utopias",
          tags: joinWithComma(words)
        }),

    
      });
  
  
      if (!response.ok) {
        const data = await response.json();
        console.log("fails upload to cloud", data);
        setUploadLoading(false);
        throw new Error(data.error || 'Upload failed');
  
      } 

      const _imageCardProp: ImageCardProps = {
        title: text,
        url: _image,
        tags: joinWithComma(words)
   
      };
      poorRemixedImageIntoCouldron(_imageCardProp);
      shareImageToSocket(_imageCardProp);
      // let tempnews = news;
      // tempnews.unshift(_imageCardProp);
      // setNews(tempnews);

      // console.log(tempnews);
      



    } catch (err) {
      console.log("fails upload to cloud", err);
      setUploadLoading(false);
    } finally {
      console.log("ends upload to cloud");

      
      setLoading(false);
      setUploadLoading(false);
      setShowRemixer(false);
      // showSucces();
      setSelectedImages([]);
      setGeneratedImage(null);

    }


  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log("tries to submit image", generatedImage);
    
    if(generatedImage) {
      upLoadImage(generatedImage);
    
    } else {
      console.log("make error message");
      
    }

  };

  const toggleSelection = (image: ImageCardProps) => {
    setSelectedImages((prev) =>
      prev.some((img) => img.url === image.url)
        ? prev.filter((img) => img.url !== image.url)
        : [...prev, image]
    );

    console.log(selectedImages);
    
  };

  useEffect(()=>{

    setShowRemixer(false);
  },[])

  return (
    <>
      {news.length > 0 && (
        <>
        {news.map((image, index) => {
          const isSelected = selectedImages.some((img) => img.url === image.url);
          return (
            <div key={index} className={`Card ${isSelected ? "selected" : ""}`}>
                 <Card 
                  url={image.url}
                  title={image.title}
                  tags={image.tags}
                />



                <button
                  onClick={() => toggleSelection(image)}
                  className="mt-2 flex items-center gap-1"
                >
                  {!isSelected ? "remix" : "fjern fra remix"}
                </button>
            </div>
          );
        })}


      <AnimatePresence>
        {showRemixer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="p-4 bg-gray-200 rounded-lg shadow-md"
          >
                  <div className="gooey-container">
           <div className={" gooey"}></div>
        </div>
          </motion.div>
        )}
      </AnimatePresence>


      {showRemixer && 
          <form onSubmit={handleSubmit} className={uploading ? "uploading uploader" : "uploader"}>
              <button className="closebtn" onClick={()=> setShowRemixer(false)}> X </button>
              <div className='selectedImages'>
                {selectedImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => toggleSelection(image)}
                        className="adjBtn"
                      >
                        <img src={image.url}/>
                      </button>
                  
                    ))}
                </div>
                <div className='imageResult'>
                {loading ? 
                  <>
                    <img src="https://res.cloudinary.com/dmwpm8iiw/image/upload/v1742059296/brewing_ruxhpm.gif"/>
      
                  </>
                 
                  :generatedImage ?
                    <div>
                      {/* <button className="closebtn" onClick={()=> setGeneratedImage(null)}> X </button> */}
                      <img src={generatedImage} alt="Generated" className="w-full rounded-lg" />

                    
                    </div>
                  : null
                  }
                </div>
      
                <div className='uploaderButtons'>
        
                  <button disabled={loading} className={!loading ? 'active' : 'passive'} onClick={()=> generateImage()}>{generatedImage ? 'genskab billede' : 'skab billede'}</button>
                  <button
                    type="submit"
                    // disabled={loading || (!text && !image)}
                    className={loading ? "passive" : generatedImage ? 'active' : 'passive'}
                  >
                    {loading ? (
                      'loading content'
                    ) : (
                      <>
                        hæl i kedlen
                      </>
                    )}
                </button>
                </div>
      
               
      
             
          
             
            </form>
      
      }


      {selectedImages.length >= 2  && <button className={`remixButton ${showRemixer ? 'lil' : '' }`} onClick={() => setShowRemixer(!showRemixer)}>Remix Billeder</button>}

        </>
      )}

    </>
  );
}