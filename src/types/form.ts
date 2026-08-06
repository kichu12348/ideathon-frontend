export interface FormItem {
  form_id: string;
}

export interface FormValidity {
  is_valid: boolean;
  close_time?: string;
}

export interface UpdateFormValidityPayload {
  is_valid: boolean;
  close_time: string;
}
