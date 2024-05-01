"use client";

const ScrollToButton = () => {
    const scrollToBottom = () => {
      window.scrollTo({
        top: window.innerHeight*1.05,
        behavior: 'smooth'
      });
    };
  
    return (
      <button onClick={scrollToBottom} className="mt-5 px-4 py-2 text-lg bg-white text-custom-blue drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.5)] border-[0.1px] border-solid border-black rounded">
        View More
      </button>
    );
  };
  
  export default ScrollToButton;