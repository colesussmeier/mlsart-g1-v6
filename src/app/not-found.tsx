import Link from "next/link";

export default function NotFound() {
    return (
        <div className="h-[100vh] flex flex-col items-center justify-center space-y-4">
            <h1 className="text-3xl font-bold">Not found</h1>
            <p className="text-xl text-center px-5">This page isn&apos;t available. The painting may have already sold.</p>
            <Link className="text-lg underline" href={'/'}>Back to the gallery</Link>
        </div>
    );
}
