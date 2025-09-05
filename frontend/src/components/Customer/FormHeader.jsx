import { UserPlusIcon } from "../Reusables/Icons";

const FormHeader = () => (
  <div className="flex justify-between items-start mb-8">
    <div className="flex items-center gap-4">
      <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full text-blue-600 dark:text-blue-400">
        <UserPlusIcon />
      </div>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Add New Customer
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Use this form to add a new customer to your database.
        </p>
      </div>
    </div>
  </div>
);
export default FormHeader;
