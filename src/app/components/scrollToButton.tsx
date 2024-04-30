"use client";

const ScrollToButton = () => {
    const scrollToBottom = () => {
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
      });
    };
  
    return (
      <button onClick={scrollToBottom} className="p-2 text-lg bg-slate-600 text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.4)] border-[0.1px] border-solid border-black rounded">
        Scroll to Gallery
      </button>
    );
  };
  
  export default ScrollToButton;