"use client";

export default function Header({ title = "Dashboard" }) {
  return (
    <div className="font-semibold text-lg">{title}</div>
  );
}
