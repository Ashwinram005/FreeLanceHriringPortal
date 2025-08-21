// src/components/Footer.js
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-100 text-center py-4 px-2 text-sm font-medium shadow-inner rounded-t-lg">
      &copy; {new Date().getFullYear()} My Freelance Platform. All rights
      reserved.{" "}
      <a className="text-blue-500 hover:underline mx-1">Privacy Policy</a> |{" "}
      <a className="text-blue-500 hover:underline mx-1">Terms of Service</a>
    </footer>
  );
}
