import { Table } from '@strapi/admin/strapi-admin';

export interface RedirectType {
  id: number;
  documentId: string;
  source: string;
  destination: string;
  permanent: boolean;
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
  handleCloseModal: () => void;
  onRedirectSaved: () => void; // Trigger refetch on save
}

export interface RedirectInput {
  source: string;
  destination: string;
  permanent: boolean;
}

export type ImportStatus = 'INVALID' | 'ERROR' | 'UPDATED' | 'CREATED';

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

export interface RedirectTableHeader extends Table.Header<any, any> {
  name: string;
  label: string;
  key: string;
  isSortable: boolean;
}
