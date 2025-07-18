import "./EventDetails.css";
import React, { useState } from "react";
import Modal from "./Modal";
import { IEventData } from "../GruveEventsWidget";
import ScheduleInfo from "../Schedule/Schedule";
import Location from "../Schedule/Location";
import Tickets from "../Tickets/Tickets";
import ArrowRight from "../../asset/ArrowRight";
import PoweredBy from "../../asset/PoweredBy";
import CloseIcon from "../../asset/CloseIcon";
import { SelectedTicket } from "../Tickets/TicketsCounter";
import Checkout from "../Checkout/Checkout";
import { expandTickets, GET_BASE_URL, updatedTickets } from "../../utils/utils";
import {
  IEventType,
  QuestionList,
  TicketDiscountList,
} from "../../../types/echo";
import TicketPurchaseSuccessfulModal from "../Tickets/TicketPurchaseSuccessfulModal";
import { ITicketListed } from "../Checkout/TicketForm";
import Registration from "../Registration/Registration";
import { TruncatedHtmlContent } from "../Tickets/TruncatedText";

interface EventDetailsProps {
  eventDetails: IEventData | null;
  open: boolean;
  setOpen: (val: boolean) => void;
  rates: Record<string, number>;
  questions: QuestionList;
  eventDetailsWithId: IEventType | null;
  coupons: any[];
  ticketBalances: number[];
  couponData: TicketDiscountList;
  isTest: boolean;
  buttonColor: string;
  buttonTextColor: string;
  eventAddress: string;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
}

const EventDetails: React.FC<EventDetailsProps> = ({
  eventDetails,
  open,
  setOpen,
  rates,
  questions,
  eventDetailsWithId,
  coupons,
  couponData,
  ticketBalances,
  isTest,
  buttonColor,
  buttonTextColor,
  onSuccess,
  onError,
  eventAddress,
}) => {
  const [currentCurrency, setCurrentCurrency] = useState("NGN");
  const [selectedTickets, setSelectedTickets] = useState<SelectedTicket[]>([]);
  const [listedTickets, setListedTickets] = useState<ITicketListed[]>([]);
  const [openCheckout, setOpenCheckout] = useState(false);
  const [openRegistration, setOpenRegistration] = useState(false);
  const [openPaymentsModal, setOpenPaymentsModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const [showTicketPurchaseSuccess, setShowTicketPurchaseSuccess] =
    useState(false);
  const [showRegistrationSuccess, setShowRegistrationSuccess] = useState(false);

  const questionsIds: string[] =
    eventDetails?.tickets?.map((eachTicket) => eachTicket?.sectionName) || [];

  const questionsToDisplay = questions.filter((eachQuestion) =>
    questionsIds.includes(eachQuestion?.sectionName)
  );

  const [isListening, setIsListening] = useState<Boolean>(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [onSuccessPurchase, setOnSuccessPurchase] = useState(false);
  const [isFree, setIsFree] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setIsFree(false);
    setOpenCheckout(false);
    setSelectedTickets([]);
    setIsListening(false);
    setOnSuccessPurchase(false);
    setOpenConfirmationModal(false);
    setOpenRegistration(false);
    setShowTicketPurchaseSuccess(false);
    setShowRegistrationSuccess(false);
  };

  const isSelected = selectedTickets.length > 0;

  const handleGetTickets = () => {
    if (isSelected) {
      setListedTickets(expandTickets(selectedTickets) as ITicketListed[]);
      setOpenCheckout(true);
    }
  };
  const updatedTicketsData = updatedTickets(
    listedTickets,
    eventDetails?.tickets
  );

  const isRegistrationClosed =
    (eventDetailsWithId &&
      eventDetails?.ticketingOption === "registration" &&
      eventDetails?.numberofRegistrants <= eventDetailsWithId?.ticketsCount) ||
    false;

  return (
    <Modal
      isOpen={open}
      openCheckout={openCheckout}
      openPaymentsModal={openPaymentsModal}
      openRegistration={openRegistration}
    >
      {showTicketPurchaseSuccess || showRegistrationSuccess || isListening ? (
        <TicketPurchaseSuccessfulModal
          close={handleClose}
          BASE_URL={GET_BASE_URL(isTest)}
          buttonColor={buttonColor}
          userEmail={userEmail}
          eventType={eventDetails?.ticketingOption}
          buttonTextColor={buttonTextColor}
          paymentDetails={paymentDetails}
          onSuccessPurchase={onSuccessPurchase}
          onSuccess={onSuccess}
          isFree={isFree}
          isTest={isTest}
          registrationLoading={isListening}
          setOnSuccessPurchase={setOnSuccessPurchase}
          openConfirmation={openConfirmationModal}
        />
      ) : (
        <>
          {openCheckout || openRegistration ? (
            <>
              {openCheckout && (
                <>
                  <Checkout
                    rates={rates}
                    coupons={coupons}
                    setOpenCheckout={setOpenCheckout}
                    setOpenPaymentsModal={setOpenPaymentsModal}
                    setIsFree={setIsFree}
                    setOnSuccessPurchase={setOnSuccessPurchase}
                    openPaymentsModal={openPaymentsModal}
                    listedTickets={listedTickets}
                    currentCurrency={currentCurrency}
                    setListedTickets={setListedTickets}
                    selectedTickets={selectedTickets}
                    eventDetailsWithId={eventDetailsWithId}
                    setShowTicketPurchaseSuccess={setShowTicketPurchaseSuccess}
                    setSelectedTickets={setSelectedTickets}
                    questionsToDisplay={questionsToDisplay}
                    updatedTicketsData={updatedTicketsData}
                    buttonColor={buttonColor}
                    buttonTextColor={buttonTextColor}
                    handleCloseModal={handleClose}
                    isTest={isTest}
                    setPaymentDetails={setPaymentDetails}
                    setIsListening={setIsListening}
                    onSuccess={onSuccess}
                    onError={onError}
                    setOpenConfirmationModal={setOpenConfirmationModal}
                  />
                </>
              )}
              {openRegistration && (
                <Registration
                  handleCloseModal={handleClose}
                  setOpenRegistration={setOpenRegistration}
                  eventData={eventDetails}
                  creator={eventDetailsWithId?.creator}
                  isTest={isTest}
                  setUserEmail={setUserEmail}
                  address={eventDetailsWithId?.eventAddress}
                  setShowRegistrationSuccess={setShowRegistrationSuccess}
                  setIsFree={setIsFree}
                  onSuccess={onSuccess}
                  setIsListening={setIsListening}
                  onError={onError}
                  buttonColor={buttonColor}
                  buttonTextColor={buttonTextColor}
                />
              )}
            </>
          ) : (
            <>
              <div className="gruve-echo-modal-top">
                <h3>Details</h3>
                <div onClick={handleClose} className="gruve-echo-close-icon">
                  <CloseIcon />
                </div>
              </div>
              {eventDetails && Object.keys(eventDetails).length > 0 && (
                <div className="gruve-echo-event-details-container">
                  {isRegistrationClosed && (
                    <div className="gruve-echo-registration-closed">
                      <strong>Registration has closed,</strong> follow creator
                      for future updates
                    </div>
                  )}
                  <div className="gruve-echo-event-img-container">
                    <img
                      className="gruve-echo-event-imge max-w-[400px] max-h-[400px] size-[400px] rounded-lg"
                      src={eventDetails?.info?.eventImage.replace(
                        "gateway.lighthouse.storage",
                        "backend.gruve.events"
                      )}
                      alt=""
                    />
                  </div>
                  <div className="gruve-echo-details">
                    <h3 className=""> {eventDetails?.info?.eventName}</h3>
                    <div className="gruve-echo-date-container">
                      <ScheduleInfo
                        themeColor={buttonColor}
                        eventData={eventDetails}
                      />
                      <Location
                        location={eventDetails?.info?.eventLocation.label}
                      />
                    </div>
                    {eventDetails?.ticketingOption === "registration" ? (
                      <div className="gruve-echo-registration__">
                        <h2 className="gruve-echo-registration-header">
                          Registration
                        </h2>
                        <div className="gruve-echo-registration-div">
                          <TruncatedHtmlContent
                            htmlContent={eventDetails?.info?.description}
                          />
                          <button
                            style={{
                              background: buttonColor,
                              color: buttonTextColor,
                              border: "none",
                              cursor: `${
                                isRegistrationClosed && "not-allowed"
                              }`,
                            }}
                            disabled={isRegistrationClosed}
                            className={`gruve-echo-get-tickets-btn`}
                            onClick={() => setOpenRegistration(true)}
                          >
                            Register
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="">
                          <Tickets
                            currentCurrency={currentCurrency}
                            setCurrentCurrency={setCurrentCurrency}
                            tickets={updatedTicketsData}
                            eventDetails={eventDetails}
                            selectedTickets={selectedTickets}
                            rates={rates}
                            ticketBalances={ticketBalances}
                            setSelectedTickets={setSelectedTickets}
                          />
                        </div>
                        <button
                          disabled={!isSelected}
                          style={{
                            background: buttonColor ? buttonColor : "#ea445a",
                            color: buttonTextColor,
                            border: "none",
                          }}
                          className={`gruve-echo-get-tickets-btn ${
                            !isSelected && "gruve-echo-not-selected"
                          }`}
                          onClick={handleGetTickets}
                        >
                          Get Tickets
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
      <div className="gruve-echo-modal-footer">
        <div className="">
          <a
            href={`${GET_BASE_URL(isTest)}/newEventDetails/${eventAddress}`}
            target="_blank"
            className="gruve-echo-event-view-full"
          >
            View Full Event Page
          </a>
          <ArrowRight />
        </div>
        <div className="">
          <PoweredBy />
        </div>
      </div>
    </Modal>
  );
};

export default EventDetails;
