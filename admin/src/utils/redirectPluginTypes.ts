export interface Redirect {
  id: number;
  documentId: string;
  source: string;
  destination: string;
  permanent: boolean;
}

export interface RedirectModalProps {
  visible: boolean;
  selectedRedirect?: Redirect | null;
  handleCloseModal: () => void;
  onRedirectSaved: () => void; // Trigger refetch on save
}
