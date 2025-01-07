export interface Root {
  timeline_view: TimelineView;
  tags: Tags;
  notes: Notes;
  programs: Programs;
  integrations: Integrations;
  object_details: PatientDetails;
  app_config: AppConfig;
  address: Address;
  object_status: PatientStatus;
  cta: CTA;
  custom_tab: CustomTabs;
  iframe_tab: IFrameTabs
}
export interface IFrameTabs{
  iframe_tab_enabled: boolean;
  tabs: {
    key: string;
    name: string;
    url: string;
  }[];
}
export interface IFrameSingleTab{
  key: string;
  name: string;
  url: string;
}
export interface CustomTabs {
  custom_tab_enabled: boolean;
}

export interface TimelineView {
  enabled: boolean;
  components: string[];
}

export interface Tags {
  allow_edit: boolean;
  enabled: boolean;
  options: Option[];
  mutually_exclusive: MutuallyExclusive[];
  form_schema: FormSchema[];
}

export interface Option {
  id: number;
  label: string;
}

export interface MutuallyExclusive {
  exclusive_tag: string;
  id: number;
  label: string;
}

export interface FormSchema {
  legendData: LegendDaum[];
  legend: string;
}

export interface LegendDaum {
  componentName: string;
  placeholder: string;
  validations: Validation[];
  value: string;
  label: string;
  validationType: string;
  isNullable: boolean;
  type: string;
  id: string;
}

export interface Validation {
  params: string[];
  type: string;
}

export interface Notes {
  allow_edit: boolean;
  enabled: boolean;
  allow_create: boolean;
  form_schema: FormSchema2[];
}

export interface FormSchema2 {
  legendData: LegendDaum2[];
  legend: string;
}

export interface LegendDaum2 {
  componentName: string;
  placeholder: string;
  validations: Validation2[];
  value: string;
  label: string;
  validationType: string;
  isNullable: boolean;
  type: string;
  id: string;
}

export interface Validation2 {
  params: string[];
  type: string;
}

export interface Programs {
  can_apply: boolean;
  component_enabled: boolean;
  enabled: boolean;
  components: string[];
}

export interface Integrations {
  telephony: Telephony;
  sms: Sms;
  email: Email;
  video_call: VideoCall;
}

export interface Telephony {
  url: string;
  enabled: boolean;
}

export interface Sms {
  enabled: boolean;
}

export interface Email {
  enabled: boolean;
}

export interface VideoCall {}

export interface PatientDetails {
  allow_edit: boolean;
  profile: Profile;
  enabled: boolean;
  form_schema: FormSchema3[];
}

export interface Profile {
  name_enabled: boolean;
  status_enabled: boolean;
  phone_enabled: boolean;
  gender_enabled: boolean;
  dob_enabled: boolean;
  email_enabled: boolean;
  nationality_enabled: boolean;
  user_id_enabled: boolean;
  treating_physician_enabled: boolean;
  hospital_enabled: boolean;
  age_enabled: boolean;
}

export interface FormSchema3 {
  legendData: LegendDaum3[];
  legend: string;
}

export interface LegendDaum3 {
  componentName: string;
  placeholder: string;
  validations: Validation3[];
  value: string;
  label: string;
  validationType: string;
  isNullable: boolean;
  type: string;
  id: string;
}

export interface Validation3 {
  params: string[];
  type: string;
}

export interface AppConfig {
  app_url: string;
  datetime_format: string;
  date_format: string;
  app_logo_url: string;
  app_name: string;
  language: any;
  app_code: string;
}

export interface Address {
  allow_edit: boolean;
  allow_multiple: boolean;
  enabled: boolean;
  allow_create: boolean;
  address_tab_label: string;
  data_type: string;
  is_primary_label: string;
  form_schema: FormSchema4[];
}

export interface FormSchema4 {
  legendData: LegendDaum4[];
  legend: string;
}

export interface LegendDaum4 {
  componentName: string;
  placeholder: string;
  validations: Validation4[];
  value: string;
  label: string;
  validationType: string;
  isNullable: boolean;
  type: string;
  id: string;
}

export interface Validation4 {
  params: any[];
  type: string;
}

export interface PatientStatus {
  allow_edit: boolean;
  enabled: boolean;
  options: Option2[];
  data_type: string;
  form_schema: FormSchema[];
}

export interface Option2 {
  id: number;
  label: string;
}
export interface FormSchema {
  legendData: LegendDaum[];
  legend: string;
}

export interface LegendDaum {
  componentName: string;
  placeholder: string;
  validations: Validation[];
  value: string;
  label: string;
  validationType: string;
  isNullable: boolean;
  type: string;
  id: string;
}

export interface Validation {
  params: string[];
  type: string;
}
export interface CTA {
  cta_enabled: boolean;
  options: CtaOptionInterface[];
}

export interface CtaOptionInterface {
  button_1_text: string;
  button_2_text: string;
  confirmation_message: string;
  disabled: boolean;
  disabled_message: string;
  id: number;
  label: string;
  roles: string[];
}
