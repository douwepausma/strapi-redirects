export type ImportStatus = 'INVALID' | 'ERROR' | 'UPDATED' | 'CREATED';

export interface RedirectType {
  id?: number;
  documentId?: string;
  source: string;
  destination: string;
  permanent: boolean;
}

export interface RedirectImportType {
  source: string;
  destination: string;
  permanent: boolean;
  status: string;
}

export interface PaginationType {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface RedirectModalProps {
  visible: boolean;
  selectedRedirect?: RedirectType | null;
  handleCloseRedirectModal: () => void;
  onRedirectSaved: () => void;
}

export interface ImportModalProps {
  visible: boolean;
  handleCloseImportModal: () => void;
}

export interface RedirectInput {
  source: string;
  destination: string;
  permanent: boolean;
}

export interface ImportResult extends RedirectInput {
  status: ImportStatus;
  reason?: string;
  details?: any;
  error?: string;
}

export interface FindAllParams {
  sort?: string;
  filters?: Record<string, any>;
  pagination?: {
    page?: number;
    pageSize?: number;
  };
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface FindAllResponse {
  redirects: RedirectType[];
  meta: {
    pagination: PaginationMeta;
  };
}

export interface TableHeaders {
  name: string;
  label: string;
  isSortable: boolean;
  key: string;
}

export interface LifecycleSetting {
  uid: string;
  enabled: boolean;
  field: string;
}

export interface ContentType {
  uid: string;
  info: { displayName: string };
  fields: { name: string }[];
}
