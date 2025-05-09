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
}) => {
  const [currentCurrency, setCurrentCurrency] = useState("NGN");
  const [selectedTickets, setSelectedTickets] = useState<SelectedTicket[]>([]);
  const [listedTickets, setListedTickets] = useState<ITicketListed[]>([]);
  const [openCheckout, setOpenCheckout] = useState(false);
  const [openPaymentsModal, setOpenPaymentsModal] = useState(false);
  const [showTicketPurchaseSuccess, setShowTicketPurchaseSuccess] =
    useState(false);

  const questionsIds: string[] =
    eventDetails?.tickets?.map((eachTicket) => eachTicket?.sectionName) || [];

  const questionsToDisplay = questions.filter((eachQuestion) =>
    questionsIds.includes(eachQuestion?.sectionName)
  );

  const handleClose = () => {
    setOpen(false);
    setOpenCheckout(false);
    setSelectedTickets([]);
    setShowTicketPurchaseSuccess(false);
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

  return (
    <Modal
      isOpen={open}
      openCheckout={openCheckout}
      openPaymentsModal={openPaymentsModal}
    >
      {showTicketPurchaseSuccess ? (
        <TicketPurchaseSuccessfulModal
          close={handleClose}
          BASE_URL={GET_BASE_URL(isTest)}
          buttonColor={buttonColor}
          buttonTextColor={buttonColor}
        />
      ) : (
        <>
          {openCheckout ? (
            <>
              <Checkout
                rates={rates}
                coupons={coupons}
                setOpenCheckout={setOpenCheckout}
                setOpenPaymentsModal={setOpenPaymentsModal}
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
              />
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
                  <div className="gruve-echo-event-img-container">
                    <img
                      className="gruve-echo-event-imge max-w-[400px] max-h-[400px] size-[400px] rounded-lg"
                      src={eventDetails?.info?.eventImage}
                      alt=""
                    />
                  </div>
                  <div className="gruve-echo-details">
                    <h3 className=""> {eventDetails?.info?.eventName}</h3>
                    <div className="gruve-echo-date-container">
                      <ScheduleInfo eventData={eventDetails} />
                      <Location
                        location={eventDetails?.info?.eventLocation.label}
                      />
                    </div>
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
                        background: buttonColor,
                        color: buttonTextColor,
                      }}
                      className={`gruve-echo-get-tickets-btn ${
                        !isSelected && "gruve-echo-not-selected"
                      }`}
                      onClick={handleGetTickets}
                    >
                      Get Tickets
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
      <div className="gruve-echo-modal-footer">
        <div className="">
          <span className="">View Full Event Page</span>
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
