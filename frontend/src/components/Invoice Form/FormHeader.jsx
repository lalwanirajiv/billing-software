import { MoonIcon, SunIcon } from "../Icons/Icons";
export const FormHeader = ({ toggleTheme, theme }) => (
  <div className="flex justify-between items-start mb-8">
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        Create / Edit Invoice
      </h1>
    </div>
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
    >
      {theme === "light" ? <MoonIcon /> : <SunIcon />}
    </button>
  </div>
);
