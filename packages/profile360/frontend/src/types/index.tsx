export interface startUpDataType {
  brandLogo: string;
  brandTitle: string;
  brandRedirectUrl: string;
  tags: tagsInterface;
  object_status: statusInterface;
  object_details: patientDetailsInterface;
  address?: addressInterface;
  timeline_view?: timeline_viewInterface;
  notes?: notesInterface;
  programs?: programsInterface;
  profile_programs?: profile_program;
  order_table: orderData;
  integrations?: integrationsInterface;
}

interface patientDetailsInterface {
  enabled?: boolean;
  allow_edit?: boolean;

  profile: {
    name_enabled?: boolean;
    gender_enabled?: boolean;
    age_enabled?: boolean;
    user_id_enabled?: boolean;
    status_enabled?: boolean;
    phone_enabled?: boolean;
    dob_enabled?: boolean;
    nationality_enabled?: boolean;
    hospital_enabled?: boolean;
    treating_physician_enabled?: boolean;
    email_enabled?: boolean;
    name: string;
    gender?: string;
    age?: string | number;
    user_id?: string | number;
    status?: string;
    phone?: string;
    dob?: string;
    nationality?: string;
    hospital?: string;
    treating_physician?: string;
    email?: string;
  };
  // primary_address: {
  //   isPrimary?: boolean;
  //   name?: string;
  //   address?: string;
  // };
  // secondary_address: {
  //   isPrimary?: boolean;
  //   name?: string;
  //   address?: string;
  // };
}
interface tagsInterface {
  enabled?: boolean;
  options?: string[];
  allow_edit?: boolean;
  show_on_timeline?: boolean;
  schema: {
    note: {
      show?: boolean;
      is_mandatory?: boolean;
      label?: string;
    };
    file: {
      show?: boolean;
      is_mandatory?: boolean;
      label?: string;
    };
  };
}

interface statusInterface {
  enabled?: boolean;
  options?: string[];
  allow_edit?: boolean;
  show_on_timeline?: boolean;
  schema?: {
    note?: {
      show?: boolean;
      is_mandatory?: boolean;
      label: string;
    };
    file: {
      show?: boolean;
      is_mandatory?: boolean;
      label: string;
    };
  };
}
interface addressInterface {
  enabled?: boolean;
  allow_multiple?: boolean;
  schema?: {
    address_line_1?: {
      show?: boolean;
      is_primary?: boolean;
      is_mandatory?: boolean;
      label?: string;
      name?: string;
      address?: string;
    };
    address_line_2?: {
      show?: boolean;
      is_primary?: boolean;
      is_mandatory?: boolean;
      label?: string;
      name?: string;
      address?: string;
    };
    landmark?: {
      show?: boolean;
      is_mandatory?: boolean;
      label?: string;
    };
    city?: {
      show?: boolean;
      'is_mandatory?': boolean;
      label?: string;
      type?: string;
      countries?: string[];
      options?: [];
    };
    state?: {
      show?: boolean;
      is_mandatory?: boolean;
      label?: string;
      type?: string;
      countries?: string[];
      options?: [];
    };
    pincode?: {
      show?: boolean;
      is_mandatory?: boolean;
      label?: string;
    };
    country?: {
      show?: boolean;
      is_mandatory?: boolean;
      label?: string;
      type?: string;
      options?: string[];
    };
  };
  allow_edit?: boolean;
  allow_create?: boolean;
}
interface timeline_viewInterface {
  enabled?: boolean;
  components?: string[];
  view?: {
    date?: string;
    content: {
      time?: string;
      id?: string;
      type: string;
      description?: string;
      sender?: string;
    }[];
  }[];
}
interface notesInterface {
  enabled?: boolean;
  allow_edit?: boolean;
  allow_create?: boolean;
  schema?: {
    note?: {
      show?: boolean;
      is_mandatory?: boolean;
      label?: string;
    };
    file?: {
      show?: boolean;
      is_mandatory?: boolean;
      label?: string;
    };
  };
  saved_notes?: {
    content?: string;
    written_by?: string;
    date?: string;
    time?: string;
    documents?: string[];
  }[];
}
interface programsInterface {
  enabled?: boolean;
  components?: string[];
  data: {
    type?: string;
    label?: 'Enrolled Programs';
    components?: string[];
    total_programs?: {
      program_id?: string;
      program_name?: string;
      program_describtion?: string;
      status: string;
      date_enrolled?: string;
      enrolled_by?: string;
      dosage?: string;
    }[];
  }[];
}
export interface profile_program {
  pap_program_1_1?: {
    program_id?: string;
    label?: string;
    description?: string;
    status?: string;
    eligibility?: {};
    documents?: [
      {
        id_card?: {
          label?: string;
          schema?: {};
        };
      }
    ];
    benefits?: [];
  };
  pap_program_1_2?: {
    label?: string;
    description?: string;
    status?: string;
    eligibility?: {};
    documents?: [
      {
        id_card?: {
          label?: string;
          schema?: {};
        };
      }
    ];
    benefits?: [];
  };
}

export interface orderData {
  Data?: {
    orderId: number;
    orderCode: string;
    orderGenerationDate: string;
    orderStatus: string;
    Benifit: string;
  }[];
}

interface integrationsInterface {
  email: Email;
  sms: Sms;
  telephony: Telephony;
  video_call: VideoCall;
}
export interface Email {
  enabled: boolean;
}

export interface Sms {
  enabled: boolean;
}

export interface Telephony {
  enabled: boolean;
  url: string;
}

export interface VideoCall {}
