export interface FlowCategory {
  value: string;
  label: string;
}

export const FLOW_CATEGORIES: FlowCategory[] = [
  { value: 'OTHER', label: 'Other' },
  { value: 'SIGN_UP', label: 'Sign Up' },
  { value: 'SIGN_IN', label: 'Sign In' },
  { value: 'APPOINTMENT_BOOKING', label: 'Appointment Booking' },
  { value: 'LEAD_GENERATION', label: 'Lead Generation' },
  { value: 'CONTACT_US', label: 'Contact Us' },
  { value: 'CUSTOMER_SUPPORT', label: 'Customer Support' },
  { value: 'SURVEY', label: 'Survey' },
  { value: 'SHOPPING', label: 'Shopping' },
  { value: 'NONE', label: 'None' },
];

export const DEFAULT_FLOW_JSON = {
  version: "7.0",
  screens: [
    {
      id: "WELCOME",
      title: "Welcome",
      terminal: false,
      layout: {
        type: "SingleColumnLayout",
        children: [
          {
            type: "Form",
            name: "flow_path",
            children: [
              {
                type: "TextHeading",
                text: "Welcome to our Flow"
              },
              {
                type: "TextBody",
                text: "Please fill in the details below."
              },
              {
                type: "TextInput",
                label: "Full Name",
                name: "name",
                required: true,
                "input-type": "text"
              },
              {
                type: "TextInput",
                label: "Email",
                name: "email",
                required: true,
                "input-type": "email"
              },
              {
                type: "Footer",
                label: "Continue",
                "on-click-action": {
                  name: "navigate",
                  next: {
                    type: "screen",
                    name: "CONFIRM"
                  },
                  payload: {
                    name: "${form.name}",
                    email: "${form.email}"
                  }
                }
              }
            ]
          }
        ]
      }
    },
    {
      id: "CONFIRM",
      title: "Confirm",
      terminal: true,
      layout: {
        type: "SingleColumnLayout",
        children: [
          {
            type: "Form",
            name: "confirm_path",
            children: [
              {
                type: "TextHeading",
                text: "Confirm Your Details"
              },
              {
                type: "TextBody",
                text: "Name: ${data.name}\nEmail: ${data.email}"
              },
              {
                type: "Footer",
                label: "Submit",
                "on-click-action": {
                  name: "complete",
                  payload: {
                    name: "${data.name}",
                    email: "${data.email}"
                  }
                }
              }
            ]
          }
        ]
      }
    }
  ]
};

export interface CreateFlowPayload {
  name: string;
  categories: string[];
}

export interface CreateFlowResponse {
  id?: string;
  success?: boolean;
  error?: string;
  [key: string]: unknown;
}

export interface FlowValidationError {
  error?: string;
  error_type?: string;
  message?: string;
  line_start?: number;
  line_end?: number;
  column_start?: number;
  column_end?: number;
}

export interface FlowItem {
  id: string;
  name: string;
  status: 'DRAFT' | 'PUBLISHED' | 'DEPRECATED' | 'BLOCKED' | string;
  categories: string[];
  validation_errors?: FlowValidationError[];
}

export interface ListFlowsResponse {
  data: FlowItem[];
  paging?: {
    cursors?: {
      before?: string;
      after?: string;
    };
    next?: string;
  };
}

export interface FlowAssetItem {
  name: string;
  asset_type: string;
  download_url: string;
}

export interface FlowAssetsResponse {
  data?: FlowAssetItem[];
}

export interface UploadFlowJsonResponse {
  success?: boolean;
  validation_errors?: FlowValidationError[];
  [key: string]: unknown;
}

export interface PublishFlowResponse {
  success?: boolean;
  [key: string]: unknown;
}


