"use client";
import React, { use } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";

export default function Navbar() {
  const { data: session } = useSession();

  const user: User = session?.user;

  return (
    <nav className="p-4 md:p-6 shadow-md">
      <div className="container flex items-center justify-between mx-auto md:flex-row flex-col">
        <a className="md:text-xl text-lg font-bold mb-4 md:mb-0 " href="#">Mystery Message</a>
        {session ? (
          <>
            <span className="mr-4 mb-4 md:mb-0">Welcome, {user.username || user.email}</span>
            <Button className="w-fit md:w-auto" onClick={() => signOut()}>Sign Out</Button>
          </>
        ) : (
          <Link href="/sign-in">
            <Button className="w-fit md:w-auto">Login</Button>
          </Link>
        )}
      </div>
    </nav>
  );
}
