import { rest } from 'msw';

let startUpData = {
  brandLogo: 'brandLogo',
  brandTitle: 'Title',
  brandRedirectUrl: '',
  patient_details: {
    enabled: true,
    allow_edit: true,
    profile: {
      name_enabled: true,
      name: 'Cameron Cilliamson',

      gender_enabled: true,
      gender: 'female',
      age_enabled: true,
      age: '38',
      user_id_enabled: true,
      user_id: '10153',
      status_enabled: true,
      status: 'Active',
      phone_enabled: true,
      phone: '+66 789990300',
      dob_enabled: true,
      dob: '2 December 1983',
      nationality_enabled: true,
      nationality: 'Thailand',
      hospital_enabled: true,
      hospital: 'Thai Test Hospital, Phra Borom Maha Ratchawang-10200 (10052)',
      email_enabled: true,
      email: 'thpsp@dksh.com',
      treating_physician_enabled: true,
      treating_physician: 'John Doe',
    },
  },
  // primary_address: {
  //   isPrimary: true,
  //   name: 'Leslie Alexander',
  //   address: '4517 Washington Ave. Manchester, Kentucky 39495',
  // },
  // secondary_address: {
  //   isPrimary: false,
  //   name: 'Wade Warren',
  //   address: '3517 W. Gray St. Utica, Pennsylvania 57867',
  // },
  tags: {
    enabled: true,
    options: ['Physically Validated', 'Doctor Verified', 'Phone Verified', 'EKYC Verified'],
    allow_edit: true,
    show_on_timeline: true,
    schema: {
      note: {
        show: true,
        is_mandatory: true,
        label: 'Notes',
      },
      file: {
        show: true,
        is_mandatory: true,
        label: 'Attachment',
      },
    },
    mutually_exclusive: ['Physically Validated', 'Doctor Verified'],
  },
  patient_status: {
    enabled: true,
    options: ['Active', 'Inactive'],
    allow_edit: true,
    show_on_timeline: true,
    schema: {
      note: {
        show: true,
        is_mandatory: true,
        label: 'Notes',
      },
      file: {
        show: true,
        is_mandatory: true,
        label: 'Attachment',
      },
    },
  },
  address: {
    enabled: true,
    allow_multiple: true,
    schema: {
      address_line_1: {
        show: true,
        is_primary: true,
        is_mandatory: true,
        label: 'Address Line 1 *',
        name: 'Leslie Alexander',
        address: '4517 Washington Ave. Manchester, Kentucky 39495',
      },
      address_line_2: {
        show: true,
        is_primary: false,
        is_mandatory: false,
        label: 'Address Line 2',
        name: 'Wade Warren',
        address: '3517 W. Gray St. Utica, Pennsylvania 57867',
      },
      landmark: {
        show: true,
        is_mandatory: false,
        label: 'Landmark',
      },
      city: {
        show: true,
        is_mandatory: true,
        label: 'City',
        type: 'select',
        countries: ['IN'],
        options: [],
      },
      state: {
        show: true,
        is_mandatory: true,
        label: 'State',
        type: 'select',
        countries: ['IN'],
        options: [],
      },
      pincode: {
        show: true,
        is_mandatory: true,
        label: 'Pincode',
      },
      country: {
        show: true,
        is_mandatory: false,
        label: 'Country',
        type: 'select',
        options: ['IN'],
      },
    },
    allow_edit: true,
    allow_create: true,
  },
  timeline_view: {
    enabled: true,
    components: ['Email', 'SMS', 'Status', 'Tags'],
    view: [
      {
        date: '11/11/2021',
        content: [
          {
            time: '11:46 AM',
            id: '13405',
            type: 'SMS',
            description:
              'ยาสนับสนุนโครงการ RibBON PAP ของผู้ป่วย fedrkjasid จำนวน 1 กล่อง จะส่งถึงภายในวันที่ 28 Nov 2021 เลข...',
            sender: 'IPS-PSP',
          },
          {
            time: '11:46 AM',
            id: '13401',
            type: 'Email',
            description: 'Approval Request for FOC Order RibBON PAP, 10152',
            sender: 'Dr.Cody Fisher',
          },
          {
            time: '11:46 AM',
            id: '13402',
            type: 'Status',
            description: 'Approval Request for FOC Order RibBON PAP, 10152',
            sender: 'Dr.Cody Fisher',
          },
          {
            time: '11:46 AM',
            id: '13403',
            type: 'Tags',
            description: 'Approval Request for FOC Order RibBON PAP, 10152',
            sender: 'Dr.Cody Fisher',
          },
        ],
      },
      {
        date: '08/05/2021',
        content: [
          {
            time: '11:46 AM',
            id: '13406',
            type: 'SMS',
            description:
              'ยาสนับสนุนโครงการ RibBON PAP ของผู้ป่วย fedrkjasid จำนวน 1 กล่อง จะส่งถึงภายในวันที่ 28 Nov 2021 เลข...',
            sender: 'IPS-PSP',
          },
          {
            time: '11:46 AM',
            id: '1340',
            type: 'Email',
            description: 'Approval Request for FOC Order RibBON PAP, 10152',
            sender: 'Dr.Cody Fisher',
          },
        ],
      },
    ],
  },
  notes: {
    enabled: true,
    allow_edit: true,
    allow_create: true,
    schema: {
      note: {
        show: true,
        is_mandatory: true,
        label: 'Notes',
      },
      file: {
        show: true,
        is_mandatory: true,
        label: 'Attachment',
      },
    },
    saved_notes: [
      {
        content: 'This is a note written earlier about the selected patient.',
        written_by: 'Dr. Cody Fisher',
        date: '11/11/2022',
        time: '11:55 AM',
        documents: ['Document1'],
      },
      {
        content: 'This is a note written earlier about the selected patient.',
        written_by: 'Dr. Cody Fisher',
        date: '11/11/2022',
        time: '11:55 AM',
        documents: [],
      },
    ],
  },
  programs: {
    enabled: true,
    data: [
      {
        type: 'Enrolled',
        label: 'Enrolled Programs',
        components: ['All', 'Active', 'On-Hold', 'Suspended'],
        total_programs: [
          {
            program_id: '1',
            program_name: 'RibBon PAP 1',
            program_describtion: 'Kisqali Metastatic Breast Cancer Patient Access Program',
            status: 'Active',
            date_enrolled: '21/10/2021',
            enrolled_by: 'Dr. Cody Fisher',
            dosage: 'Twice a day',
          },
          {
            program_id: '2',
            program_name: 'RibBon PAP 2',
            program_describtion: 'Kisqali Metastatic Breast Cancer Patient Access Program',
            status: 'Active',
            date_enrolled: '22/10/2021',
            enrolled_by: 'Dr. Cody Fisher',
            dosage: 'Twice a day',
          },
          {
            program_id: '3',
            program_name: 'RibBon PAP 3',
            program_describtion: 'Kisqali Metastatic Breast Cancer Patient Access Program',
            status: 'Active',
            date_enrolled: '23/10/2021',
            enrolled_by: 'Dr. Cody Fisher',
            dosage: 'Twice a day',
          },
          {
            program_id: '4',
            program_name: 'RibBon PAP 4',
            program_describtion: 'Kisqali Metastatic Breast Cancer Patient Access Program',
            status: 'Active',
            date_enrolled: '24/10/2021',
            enrolled_by: 'Dr. Cody Fisher',
            dosage: 'Twice a day',
          },
          {
            program_id: '5',
            program_name: 'RibBon PAP 5',
            program_describtion: 'Kisqali Metastatic Breast Cancer Patient Access Program',
            status: 'On-Hold',
            date_enrolled: '25/10/2021',
            enrolled_by: 'Dr. Cody Fisher',
            dosage: 'Twice a day',
          },
        ],
      },
      {
        type: 'Eligible',
        label: 'Eligible Programs',
        total_programs: [
          {
            program_id: '1',
            program_name: 'RibBon PAP',
            program_describtion: 'Kisqali Metastatic Breast Cancer Patient Access Program',
          },
          {
            program_id: '2',

            program_name: 'RibBon PAP',
            program_describtion: 'Kisqali Metastatic Breast Cancer Patient Access Program',
          },
          {
            program_id: '3',

            program_name: 'RibBon PAP',
            program_describtion: 'Kisqali Metastatic Breast Cancer Patient Access Program',
          },
        ],
      },
    ],
  },
  profile_programs: {
    pap_program_1_1: {
      label: 'Kisqali Mestatic Breast Cancer Patient Access Program',
      description: 'This is 1+1 Patient Assistance Program',
      status: 'Active',
      eligibility: {},
      documents: [
        {
          id_card: {
            label: 'Identity Card',
            schema: {},
          },
        },
      ],
      benefits: [],
    },
    pap_program_1_2: {
      label: 'Kisqali Mestatic Breast Cancer Patient Access Program',
      description: 'This is 1+1 Patient Assistance Program',
      eligibility: {},
      status: 'Onhold',
      documents: [
        {
          id_card: {
            label: 'Identity Card',
            schema: {},
          },
        },
      ],
      benefits: [],
    },
  },
  order_table: {
    Data: [
      {
        orderId: 1,
        orderCode: '5psHxC',
        orderGenerationDate: '21 Sep, 2020 8:55pm',
        orderStatus: 'Active',
        orderBenifit: 'heuristic',
      },
      {
        orderId: 2,
        orderCode: 'TA15Pkqr4yy',
        orderGenerationDate: '21 Sep, 2020 11:45pm',
        orderStatus: 'Active',
        orderBenifit: 'Profit-focused',
      },
      {
        orderId: 3,
        orderCode: 'XJTgNm',
        orderGenerationDate: '21 Sep, 2020 11:47pm',
        orderStatus: 'Multi-lateral',
        orderBenifit: 'Synergistic',
      },
      {
        orderId: 4,
        orderCode: 'z0sqsGP6o',
        orderGenerationDate: '21 Sep, 2020 3:19pm',
        orderStatus: 'actuating',
        orderBenifit: 'matrices',
      },
      {
        orderId: 5,
        orderCode: 'neel',
        orderGenerationDate: '21 Sep, 2020 11:06pm',
        orderStatus: 'definition',
        orderBenifit: 'Customizable',
      },
      {
        orderId: 6,
        orderCode: 'xcFYdH',
        orderGenerationDate: '21 Sep, 2020 9:52pm',
        orderStatus: 'intranet',
        orderBenifit: '4th generation',
      },
      {
        orderId: 7,
        orderCode: 'jepKSAmQNY5',
        orderGenerationDate: '21 Sep, 2020 1:28pm',
        orderStatus: 'radical',
        orderBenifit: 'leverage',
      },
      {
        orderId: 8,
        orderCode: 'ODL87Sw7',
        orderGenerationDate: '21 Sep, 2020 8:51pm',
        orderStatus: 'needs-based',
        orderBenifit: 'Ameliorated',
      },
      {
        orderId: 9,
        orderCode: '7siJXAzVoEU',
        orderGenerationDate: '21 Sep, 2020 10:06pm',
        orderStatus: 'human-resource',
        orderBenifit: 'Polarised',
      },
      {
        orderId: 10,
        orderCode: 'Lz2aDi2f7NP',
        orderGenerationDate: '21 Sep, 2020 2:34pm',
        orderStatus: 'multimedia',
        orderBenifit: 'user-facing',
      },
      {
        orderId: 11,
        orderCode: 'rQKKjCiQsPSm',
        orderGenerationDate: '21 Sep, 2020 12:29pm',
        orderStatus: 'process improvement',
        orderBenifit: 'Up-sized',
      },
      {
        orderId: 12,
        orderCode: 'tTNWIW2aVkd',
        orderGenerationDate: '21 Sep, 2020 3:34pm',
        orderStatus: 'leverage',
        orderBenifit: 'complexity',
      },
      {
        orderId: 13,
        orderCode: 'TBlpApSYxQ',
        orderGenerationDate: '21 Sep, 2020 6:43pm',
        orderStatus: 'approach',
        orderBenifit: 'encoding',
      },
      {
        orderId: 14,
        orderCode: 'QQ6ayJCPRzR8',
        orderGenerationDate: '21 Sep, 2020 3:25pm',
        orderStatus: 'content-based',
        orderBenifit: 'actuating',
      },
      {
        orderId: 15,
        orderCode: 'pYg3648fhT5r',
        orderGenerationDate: '21 Sep, 2020 10:23pm',
        orderStatus: 'Implemented',
        orderBenifit: 'extranet',
      },
      {
        orderId: 16,
        orderCode: 'WKJgheNHnjX',
        orderGenerationDate: '21 Sep, 2020 3:06pm',
        orderStatus: 'Synergistic',
        orderBenifit: 'focus group',
      },
      {
        orderId: 17,
        orderCode: 'wtHvfCu1m',
        orderGenerationDate: '21 Sep, 2020 4:07pm',
        orderStatus: 'directional',
        orderBenifit: 'hardware',
      },
      {
        orderId: 18,
        orderCode: 'zlXoAtGOb',
        orderGenerationDate: '21 Sep, 2020 8:06pm',
        orderStatus: 'Synchronised',
        orderBenifit: 'budgetary management',
      },
      {
        orderId: 19,
        orderCode: 'kuFY5sZO',
        orderGenerationDate: '21 Sep, 2020 2:29pm',
        orderStatus: 'Decentralized',
        orderBenifit: 'Right-sized',
      },
      {
        orderId: 20,
        orderCode: 'bOYxVeJK',
        orderGenerationDate: '21 Sep, 2020 7:12pm',
        orderStatus: 'asynchronous',
        orderBenifit: 'Configurable',
      },
    ],
  },
  integrations: {
    telephony: {
      enabled: true,
      abc: 'xyz',
    },
    video_call: {},
    email: {},
    sms: {},
  },
};

export const handlers = [
  //GET STARTUP API
  rest.get('/getStartupData', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(startUpData));
  }),
];
