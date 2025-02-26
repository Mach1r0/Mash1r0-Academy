import type React from "react"
import Link from 'next/link'

export default function Navbar(){
    return (

        <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            <Link href={"/"} className="hover:underline">
                Mash1r0 Study
            </Link>
            </h1>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link href="/" className="hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/subjects" className="hover:underline">
                  Subjects
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:underline">
                  Profile
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    );
}