import UserPlusIcon from "./UserPlusIcon";

const FormHeader = () => (
  <div className="flex items-center gap-4 mb-8">
    <div className="bg-blue-100 p-3 rounded-full text-blue-600">
      <UserPlusIcon />
    </div>
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Add New Customer</h1>
      <p className="text-gray-600">
        Use this form to add a new customer to your database.
      </p>
    </div>
  </div>
);
export default FormHeader;
