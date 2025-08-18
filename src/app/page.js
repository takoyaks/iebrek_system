import Login from "./login";

export const metadata = {
  title: "iebrek System",
  description: "Minimalist login page for Iebrek System admin dashboard.",
  keywords: "login, admin, iebrek system, authentication",
  robots: "index, follow"
};

export default function Home() {
  return <Login />;
}
