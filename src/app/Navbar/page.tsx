import Link from "next/link";
export default function Navbar() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/login">Login</Link>
      <Link href="/Register">Register</Link>
      <Link href="/profile" legacyBehavior>
        <a>Profile</a>
      </Link>
    </nav>
  );
}
