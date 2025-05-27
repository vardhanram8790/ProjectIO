import React from 'react';



const DynamicForm = ({ schema, onSubmit }) => {

  const [formData, setFormData] = React.useState({});

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

  };

  const handleSubmit = (e) => {

    e.preventDefault();

    onSubmit(formData);

  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {schema.map((field) => (
        <div key={field.name} className="flex flex-col">
          <label className="font-medium">{field.label}</label>
          <input

            type={field.type}

            name={field.name}

            value={formData[field.name] || ''}

            onChange={handleChange}

            className="p-2 border rounded"

            placeholder={field.placeholder}

          />
        </div>

      ))}
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
    </form>

  );

};

export default DynamicForm;



