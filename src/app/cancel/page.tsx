import Link from "next/link";

export default function Cancel() { 
    return (
        <div className="h-[100vh] flex flex-col items-center justify-center space-y-4">
            <h1 className="text-3xl font-bold">Uh oh...</h1>
            <p className="text-xl text-center px-5">It looks like something went wrong. The order has been canceled.</p>
            <Link className="text-lg underline" href={'/cart'}> Go back to cart and try again?</Link>
        </div>
    );
}