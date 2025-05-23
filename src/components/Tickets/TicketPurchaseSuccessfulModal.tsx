import React from "react";
import "./TicketPurchaseSuccessfulModal.css";
import { SucessfulConnect } from "../../asset/SuccessfulConnect";
import CloseIcon from "../../asset/CloseIcon";

interface Props {
  close: () => void;
  BASE_URL: string;
  buttonColor: string;
  userEmail: string;
  buttonTextColor: string;
  eventType: string | undefined;
}

const TicketPurchaseSuccessfulModal: React.FC<Props> = ({
  close,
  BASE_URL,
  eventType,
  buttonColor,
  buttonTextColor,
  userEmail,
}) => {
  return (
    <div className="gruve-echo-modal-body">
      <div className="gruve-echo-modal-top">
        <h3></h3>
        <div onClick={close} className="gruve-echo-close-icon">
          <CloseIcon />
        </div>
      </div>
      <div className="gruve-echo-modal-flex">
        <SucessfulConnect height="96px" width="96px" />
        {eventType === "registration" ? (
          <>
            <h2 className="gruve-echo-modal-heading">
              Registration successful
            </h2>
            <p className="gruve-echo-modal-text">
              A confirmation email has been sent to{" "}
              <strong>{userEmail}. </strong>
              Please sign in to see more details and manage your registration
            </p>
          </>
        ) : (
          <>
            <h2 className="gruve-echo-modal-heading">
              Ticket acquired successfully
            </h2>
            <p className="gruve-echo-modal-text">
              Your ticket will be sent to the provided email(s) and WhatsApp
              numbers. If you don't receive it immediately, please check your
              spam folder. Sign in to view more details and manage your
              registration.
            </p>
          </>
        )}
        <a
          href={BASE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="gruve-echo-sign-in-button"
        >
          <div className="">Sign in to Gruve</div>
        </a>
      </div>
    </div>
  );
};

export default TicketPurchaseSuccessfulModal;
