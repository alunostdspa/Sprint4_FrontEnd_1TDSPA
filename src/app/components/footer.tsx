import Link from "next/link";

export default function Footer() {

    return(
        <>
            <footer className="bg-red-900 text-white text-center py-5 mt-auto ">
                <small className="text-sm">
                    <div>
                    &copy;
                    <Link href= "/integrantes" className="text-white no-underline"> 2024 FutureFix </Link>
                    </div>
                </small>
            </footer>
        </>
    )
}