import RequestForm from "./RequestForm";

export function CloseDialogButton() {
  return (
    <button className="close-dialog" aria-label="Close the dialog">
      <span className="sr-only">Close Dialog</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="69.43" height="69.43" viewBox="0 0 69.43 69.43" aria-hidden="true">
        <g transform="translate(18604.207 3591.207)">
          <line x2="68.015" y2="68.015" transform="translate(-18603.5 -3590.5)" stroke="currentColor" strokeWidth="3" />
          <line x1="68.015" y2="68.015" transform="translate(-18603.5 -3590.5)" stroke="currentColor" strokeWidth="3" />
        </g>
      </svg>
    </button>
  );
}

// Global "REQUEST" dialog. Opened by any `.open_modal[data-modal-id="request"]`
// button (header, page CTAs) through the dialog handler in SiteEffects.
export default function RequestDialog() {
  return (
    <dialog id="limeforms" data-modal-id="request">
      <CloseDialogButton />
      <div className="form-scroller my_form_wrapper">
        <div className="my_form">
          <RequestForm />
        </div>
      </div>
    </dialog>
  );
}
