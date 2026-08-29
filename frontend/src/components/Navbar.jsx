import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/problem", label: "Problem Statement" },
  { to: "/demo", label: "Try the Assistant" },
  { to: "/dashboard", label: "Dashboard" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-indigo/95 backdrop-blur border-b border-indigo-light">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <NavLink to="/" className="font-display text-lg text-paper font-semibold tracking-tight">
          Tarini
        </NavLink>
        <ul className="flex gap-6 font-body text-sm">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `transition-colors ${
                    isActive ? "text-gold" : "text-paper/80 hover:text-paper"
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
