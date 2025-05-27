export const visitorPassFields = [
    {
      name: "visitorName",
      label: "Visitor Name",
      inputType: "text",
      validationType: "string",
      isRequired: true,
      min: 3,
      max: 50,
      errorMessage: {
        required: "Visitor name is required",
        min: "Name must be at least 3 characters",
        max: "Name must be at most 50 characters",
      },
    },
    {
      name: "mobileNo",
      label: "Mobile Number",
      inputType: "contactNo",
      validationType: "contactNo",
      isRequired: true,
    },
    {
        name: "accessCardNumber",
        label: "Access Card Number",
        placeholderText: "Select Card",
        inputType: "select",
        validationType: "string",
        isRequired: true,
        options: [
          { label: "In", value: "in" },
          { label: "Out", value: "out" },
          { label: "In/Out", value: "in/out" }
        ]
      },
      {
        name: "visitorCompany",
        label: "Visitor's Company",
        inputType: "text",
        validationType: "string",
        isRequired: true,
      },
      {
        name: "department",
        label: "Department",
        inputType: "text",
        validationType: "string",
        isRequired: true,
      },
      {
        name: "personToMeet",
        label: "Person To Meet",
        inputType: "select",
        validationType: "string",
        isRequired: true,
        options: [
            { label: "In", value: "in" },
            { label: "Out", value: "out" },
            { label: "In/Out", value: "in/out" }
          ]
      },
    {
        name: "personToMeet",
        label: "Person To Meet",
        inputType: "select",
        validationType: "string",
        isRequired: true,
        options: [
            { label: "In", value: "in" },
            { label: "Out", value: "out" },
            { label: "In/Out", value: "in/out" }
          ]
      },
      {
        name: "visitorCategory",
        label: "Visitor Category",
        inputType: "select",
        validationType: "string",
        isRequired: true,
        options: [
            { label: "In", value: "in" },
            { label: "Out", value: "out" },
            { label: "In/Out", value: "in/out" }
          ]
      },
      {
        name: "selectPassValidity",
        label: "Select Pass Validity",
        inputType: "select",
        validationType: "string",
        isRequired: true,
        options: [
            { label: "In", value: "in" },
            { label: "Out", value: "out" },
            { label: "In/Out", value: "in/out" }
          ]
      },
      {
        name: "nationality",
        label: "Nationality",
        inputType: "select",
        validationType: "string",
        isRequired: true,
        options: [
            { label: "In", value: "in" },
            { label: "Out", value: "out" },
            { label: "In/Out", value: "in/out" }
          ]
      },
    {
      name: "visitPurpose",
      label: "Purpose of Visit",
      inputType: "textarea",
      validationType: "string",
      isRequired: true,
      errorMessage: {
        required: "Purpose is required",
      },
    },
    {
        name: "remarks",
        label: "Remarks",
        inputType: "textarea",
        validationType: "string",
        isRequired: false,
      },
    {
      name: "isApproved",
      label: "Approved",
      inputType: "toggle",
      validationType: "boolean",
    },
  ];
  