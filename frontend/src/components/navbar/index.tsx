'use client';
import { useEffect } from 'react'; 
import Link from 'next/link'
import { useAuth } from "@/app/auth/Context" 

export default function Navbar() {
  const { logout, token } = useAuth();

  useEffect(() => {
  }, [token]); // O efeito será executado sempre que o token mudar

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
              {token ? (
                <Link href="/profile" className="hover:underline">
                  Profile
                </Link>
              ) : (
                <Link href="/sign-in" className="hover:underline">
                  Login
                </Link>
              )}
            </li>
            {token && (
              <li>
                <button onClick={logout} className="hover:underline">
                  Logout
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}