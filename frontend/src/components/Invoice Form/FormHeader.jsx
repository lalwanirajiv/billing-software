const FormHeader = ({ handleClear }) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
    <div className="flex-grow">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        Create / Edit Invoice
      </h1>
    </div>
    <div className="flex items-center gap-4 mt-4 sm:mt-0">
      <button
        type="button"
        onClick={handleClear}
        className="px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-md hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900"
      >
        Clear Form
      </button>
    </div>
  </div>
);

export default FormHeader;