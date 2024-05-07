"use client";

const ScrollToButton = () => {
  const scrollToGallery = () => {
    let scrollAmount = window.innerHeight * 1.08;
  
    if (window.matchMedia("(max-width: 600px)").matches) {
      scrollAmount = window.innerHeight * 1.35;
    }
  
    window.scrollTo({
      top: scrollAmount,
      behavior: 'smooth'
    });
  };
  
    return (
      <button onClick={scrollToGallery} className="mt-5 px-4 py-2 text-lg bg-white text-custom-blue drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.5)] border-[0.1px] border-solid border-black rounded">
        take a look around
      </button>
    );
  };
  
  export default ScrollToButton;