import React from 'react';
import Image from 'next/image';


const About = () => {
  return (
    <div className="flex flex-col items-center min-h-[100vh]">
      <div className="about-page-container max-w-[80vw] pt-8 flex flex-col items-center space-y-5">
    
        <h1 className="text-3xl text-center my-5">About</h1>
        <div className="flex flex-col space-y-7 lg:flex-row items-center lg:space-x-24">
        <Image src="/headshot.jpg" alt="Mary Lou Sussmeier" width={300} height={300} className="rounded" priority={true}/>
        <div className="space-y-7">
        <p>
          “If you could do anything you wanted, what would it be?” This was the question posed to Mary Lou, a
          working mother of two very young boys, at a New Year&apos;s Eve dinner in the early 2000&apos;s. Her answer: “I&apos;d
          paint all the time.” Twenty years and two grown men later, Mary Lou is living her dream, painting
          watercolors of her beloved Hudson Valley.
        </p>

        <p>
          Mary Lou&apos;s eye for color and design led her to one of the preeminent colleges for interior design, the
          Fashion Institute of Technology in NYC. It is there that Mary Lou polished her innate ability to find the
          beauty of common spaces which led to a successful and fulfilling career where she designed stores across the
          country for well known outfits such as Ethan Allen and The Melville Corporation.
        </p>
        </div>
        </div>
        <p className="pb-10">
          An art lover who is endlessly curious, in the past several years, Mary Lou has turned her talents to her
          true love - watercolor painting, in particular watercolors of the woods, streams, and ponds of her
          hometown, Cold Spring, New York, a river town in the magnificent Hudson Valley. Like a bee or a bird,
          Mary Lou&apos;s eyes return again and again to the colors around her - the shiny green of the pines, the silver
          of the streams, and the oranges, blues, and purples of the dawning and dusking skies. Besides color,
          what does she love most about watercolor painting? “It&apos;s the unexpected - I try a technique and it turns
          out totally different than what I was planning but it opens my mind and leads me to open my mind even
          more. With watercolors, I am constantly discovering and learning. What could be better than that?”
        </p>
      </div>
    </div>
  );
};

export default About