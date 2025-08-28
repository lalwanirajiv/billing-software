const AddressSection = ({ customerData, handleChange }) => (
  <div className="bg-gray-50 p-5 rounded-lg border space-y-4">
    <h2 className="text-xl font-semibold text-gray-800">Address</h2>
    <div>
      <label
        htmlFor="address_line1"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Address Line 1
      </label>
      <input
        id="address_line1"
        type="text"
        name="address_line1"
        placeholder="e.g., 123 Business Rd"
        value={customerData.address_line1}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
      />
    </div>
    <div>
      <label
        htmlFor="address_line2"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Address Line 2
      </label>
      <input
        id="address_line2"
        type="text"
        name="address_line2"
        placeholder="e.g., Suite 456"
        value={customerData.address_line2}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
      />
    </div>
  </div>
);
export default AddressSection;
