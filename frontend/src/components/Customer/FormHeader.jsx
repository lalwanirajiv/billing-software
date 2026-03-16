import { UserPlusIcon } from "../Reusables/Icons";

const FormHeader = ({ title = "Add New Customer" }) => (
  <div className="flex justify-between items-start mb-8">
    <div className="flex items-center gap-4">
      <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full text-blue-600 dark:text-blue-400">
        <UserPlusIcon />
      </div>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Complete the information below to update your customer database.
        </p>
      </div>
    </div>
  </div>
);
export default FormHeader;
