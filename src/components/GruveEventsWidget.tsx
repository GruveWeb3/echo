import React, { useEffect, useState } from "react";
import EventDetails from "./EventDetails/EventDetails";
import { IEventType, QuestionList, TicketDiscountList } from "../../types/echo";
import "./index.css";
import "../styles/fonts.module.css";
import "../styles/global.module.css";
import {
  CDN_KEY_FOR_SCRIPT,
  GET_BACKEND_URL,
  GET_BASE_URL,
} from "../utils/utils";
import "../components/Loader/loader.css";
export interface TagsOptions {
  value: string;
  label: string;
}

export interface IEventInfo {
  eventImage: string;
  eventName: string;
  eventOrganizer: string;
  description: string;
  eventType: string;
  eventCategory: string;
  isOnlineEvent: boolean;
  eventLocation: Record<string, string>;
  tags: { value: string; label: string }[];
  _tags: string[];
  _eventName: string;
  eventLink?: any;
}

type QuestionType =
  | "text"
  | "email"
  | "website"
  | "phone"
  | "checkbox"
  | "terms"
  | "multiple"
  | "socials"
  | "single";

export type IRegistrationQuestion = {
  id: string;
  title: string;
  type: QuestionType;
  required: boolean;
  options?: any[];
  termsContent?: string;
  termsLink?: string;
  socials?: string;
  checkbox?: boolean;
};

export interface IEventData {
  numberofRegistrants: number;
  timeZone: any;
  Attendee?: any;
  tags?: TagsOptions[];
  currency?: string;
  info?: IEventInfo;
  schedules: {
    endDate: string | number | Date;
    startTime: any;
    endTime: any;
    timeZoneOffset: any;
    date: string;
    timeSlots: { startTime: string; endTime: string }[];
  }[];
  hosts: {
    name: string;
    image: string;
    bio: string;
  }[];
  guests: any[];
  tickets: IITickets;
  ticketingOption: string;
  registrationQuestions: IRegistrationQuestion[];
}

export type IITickets = {
  _ticketType: string;
  sectionName: string;
  quantity: number;
  cost: number;
  description: string;
  minOrder: number;
  maxOrder: number;
  ticketType: string;
  isDisabled?: boolean;
}[];

export interface GruveEventWidgetsProps {
  eventAddress: string;
  isTest?: boolean;

  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;

  config?: React.CSSProperties & {
    themeColor?: string;
    displayText?: string;
  };
  children?: React.ReactNode;
  triggerOnMountValue?: string;
}

const GruveEventWidgets: React.FC<GruveEventWidgetsProps> = ({
  eventAddress,
  isTest = false,
  config,
  children,
  onSuccess,
  onError,
  triggerOnMountValue = "",
}) => {
  const [eventDetails, setEventDetails] = useState<IEventData | null>(null);
  const [eventDetailsWithId, setEventDetailsWithId] =
    useState<IEventType | null>(null);
  const [questions, setQuestions] = useState<QuestionList>([]);
  const [coupons, setCoupons] = useState<any>([]);
  const [ticketBalances, setTicketBalances] = useState([]);
  const [couponData, setCouponData] = useState<TicketDiscountList>([]);

  const triggerOnMount = triggerOnMountValue === CDN_KEY_FOR_SCRIPT;

  const [rates, setRates] = useState({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);

  const BASE_URL = GET_BASE_URL(isTest);
  const BACKEND_URL = GET_BACKEND_URL(isTest);

  const fetchRates = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/fetch-rates`);

      const result = await response.json();
      setRates(result);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchEventDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${BASE_URL}/api/fetch-event-details?eventAddress=${eventAddress}`
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      setQuestions(result?.questions);
      setTicketBalances(result?.balances);
      setLoading(false);
      setEventDetails(result?.data);
      setEventDetailsWithId(result?.eventDetailsWithId);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const fetchCoupon = async () => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/discount/check/${eventAddress.toLowerCase()}`
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const result = await response.json();
      setCouponData(result?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = () => {
    fetchCoupon();
    setOpen(true);
    if (!eventDetails || eventDetailsWithId?.eventAddress !== eventAddress) {
      fetchEventDetails();
      fetchRates();
    }
  };

  useEffect(() => {
    if (triggerOnMount) {
      handleClick();
    }
  }, [triggerOnMount]);

  const buttonColor = config?.themeColor ? config?.themeColor : "#ea445a";
  const buttonText = config?.displayText ? config?.displayText : "Get ticket";
  const buttonTextColor = config?.color ? config.color : "white";

  return (
    <div className="my-package-container gruve-package-s">
      {!triggerOnMount && (
        <>
          {children ? (
            <div onClick={handleClick}>{children}</div>
          ) : (
            <button
              onClick={handleClick}
              style={{
                border: "none",
                background: buttonColor ? buttonColor : "",
                ...config,
              }}
              className="gruve-event-details-btn"
            >
              {buttonText}
            </button>
          )}
        </>
      )}
      {loading ? (
        <div className="_">
          <span className="gruve-package-echo-home-loader"></span>
        </div>
      ) : (
        <EventDetails
          eventDetails={eventDetails}
          open={open}
          eventDetailsWithId={eventDetailsWithId}
          setOpen={setOpen}
          questions={questions}
          onSuccess={onSuccess}
          onError={onError}
          eventAddress={eventAddress}
          rates={rates}
          coupons={coupons}
          couponData={couponData}
          ticketBalances={ticketBalances}
          isTest={isTest}
          buttonColor={buttonColor === "#ea445a" ? "" : buttonColor}
          buttonTextColor={buttonTextColor}
        />
      )}
    </div>
  );
};

export default GruveEventWidgets;
