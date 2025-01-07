export const formData = [
  {
    id: 'name',
    label: 'Full Name',
    placeholder: '',
    type: 'text',
    validationType: 'string',
    value: '',
    validations: [
      {
        type: 'required',
        params: ['This field is required'],
      },
    ],
  },
  {
    id: 'description',
    label: 'Description',
    placeholder: '',
    type: 'text',
    validationType: 'string',
    value: '',
    validations: [
      {
        type: 'required',
        params: ['This field is required'],
      },
    ],
  },
];

export const formData2 = [
  {
    legend: 'New Address',
    legendData: [
      {
        componentName: 'TextField',
        id: 'name',
        label: 'Full Name',
        placeholder: '',
        type: 'text',
        validationType: 'string',
        value: '',
        validations: [
          {
            type: 'required',
            params: ['This field is required'],
          },
          {
            type: 'min',
            params: [8, 'This field is 8 required'],
          },
        ],
      },
      {
        componentName: 'TextField',
        id: 'Address_Line_1',
        label: 'Address Line 1',
        placeholder: '',
        type: 'text',
        validationType: 'string',
        value: '',
        validations: [
          {
            type: 'required',
            params: ['This field is required'],
          },
        ],
      },
      {
        componentName: 'TextField',
        id: 'Address_Line_2',
        label: 'Address Line 2',
        placeholder: '',
        type: 'text',
        validationType: 'string',
        value: '',
        validations: [
          {
            type: 'required',
            params: ['This field is required'],
          },
        ],
      },

      {
        componentName: 'SelectField',
        id: 'City/District/Town',
        label: 'City/District/Town',
        placeholder: '',
        type: 'select',
        validationType: 'string',
        value: '',
        optionsData: [
          { value: '', label: 'Select', unavailable: true },
          { value: '%d %b %Y', label: '04 Oct 2017' },
          { value: '%d %B %Y', label: '04 October 2017' },
          { value: '%d/%m/%Y', label: '04/10/2017' },
          { value: '%d/%m/%y', label: '04/10/17' },
          { value: '%m/%d/%y', label: '10/04/17' },
          { value: '%d/%m/%Y', label: '04/10/2017' },
        ],
        validations: [
          {
            type: 'required',
            params: ['This field is required'],
          },
        ],
      },
      {
        componentName: 'SelectField',
        id: 'State',
        label: 'State',
        placeholder: '',
        type: 'select',
        optionsData: [
          { value: '', label: 'Select', unavailable: true },
          { value: '%d %b %Y', label: '04 Oct 2017' },
          { value: '%d %B %Y', label: '04 October 2017' },
          { value: '%d/%m/%Y', label: '04/10/2017' },
          { value: '%d/%m/%y', label: '04/10/17' },
          { value: '%m/%d/%y', label: '10/04/17' },
          { value: '%d/%m/%Y', label: '04/10/2017' },
        ],
        validationType: 'string',
        value: '',
        validations: [
          {
            type: 'required',
            params: ['This field is required'],
          },
        ],
      },
      {
        componentName: 'TextField',
        id: 'Pincode',
        label: 'Pincode',
        placeholder: '',
        type: 'number',
        validationType: 'string',
        value: '',
        validations: [
          {
            type: 'required',
            params: ['This field is required'],
          },
        ],
      },
      {
        componentName: 'SelectField',
        id: 'date_format',
        label: 'Date Format',
        placeholder: '',
        type: 'select',
        validationType: 'string',
        value: '',
        optionsData: [
          { value: '', label: 'Select', unavailable: true },
          { value: '%d %b %Y', label: '04 Oct 2017' },
          { value: '%d %B %Y', label: '04 October 2017' },
          { value: '%d/%m/%Y', label: '04/10/2017' },
          { value: '%d/%m/%y', label: '04/10/17' },
          { value: '%m/%d/%y', label: '10/04/17' },
          { value: '%d/%m/%Y', label: '04/10/2017' },
        ],
        validations: [
          {
            type: 'required',
            params: ['This field is required'],
          },
        ],
      },
      // {
      //   componentName: 'FileUpload',
      //   id: 'logo',
      //   label: 'Logo',
      //   placeholder: 'Enter',
      //   type: 'file',
      //   validationType: 'mixed',
      //   value: '',
      //   validations: [
      //     {
      //       type: 'required',
      //       params: ['This field is required'],
      //     },
      //   ],
      // },
    ],
  },
];
