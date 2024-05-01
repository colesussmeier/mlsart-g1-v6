import React from 'react';
import Image from 'next/image';


const About = () => {
  return (
    <div className="flex flex-col items-center min-h-[100vh]">
      <div className="about-page-container max-w-[80vw] pt-8 flex flex-col items-center space-y-5">
    
        <h2 className="font-bold text-xl">About</h2>
        <div className="flex flex-col space-y-7 lg:flex-row items-center lg:space-x-24">
        <Image src="/headshot.jpg" alt="Mary Lou Sussmeier" width={300} height={300} className="rounded"/>
        <div className="space-y-7">
        <p>
          “If you could do anything you wanted, what would it be?” This was the question posed to Mary Lou, a
          working mother of two very young boys, at a New Year&apos;s Eve dinner in the early 2000&apos;s. Her answer: “I&apos;d
          paint all the time.” Twenty years and two grown men later, Mary Lou is living her dream, painting
          watercolors of her beloved Hudson Valley.
        </p>

        <p>
          Everyday life hits Mary Lou&apos;s eyes differently than other people. Most people would walk into a family
          den strewn with wooden building blocks, books, and record album covers and think ugh, what a mess!
          Not 10-year-old Mary Lou - she saw a house with multiple layouts and its own unique furniture, and set
          out to build it, right then and there. Throughout middle school and high school, she was constantly
          curating the spaces around her - arranging books on shelves, items on desks, glassware in the cabinets,
          or furniture in the rooms - in ways that showcased their beauty and that invariably caught the eye.
        </p>
        </div>
        </div>
        <p>
          This talent for transforming spaces led her to one of the preeminent colleges for interior design, the
          Fashion Institute of Technology in NYC. It is there that Mary Lou polished her innate ability to find the
          beauty of common spaces and lead to a successful and fulfilling career in interior design, working for
          well known outfits such as Ethan Allen and The Melville Corporation, designing stores across the
          country.
        </p>
        <p>
          But Mary Lou&apos;s talents have never been limited to interior design. She and her engineer husband
          designed and built their one-of-a-kind mountaintop post &amp; beam home that brought the outside in. The
          house sits beside a beautiful pond, that they built themselves, and is surrounded by acres of trees
          and miles of streams that frequently find their way into her paintings. Mary Lou, an avid gardener and
          landscape enthusiast, created a breathtaking arrangement of plants and wild grasses around the pond.
          The stone steps leading to her front door serve as the thrones for her beautifully arranged flowerpots.
          “Painting with nature,” is how she describes it.
        </p>
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