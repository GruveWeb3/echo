import React from "react";
import "./Payment.css";
import BackArrow from "../../asset/BackArrow";
import CloseIcon from "../../asset/CloseIcon";

interface PaymentProps {
  goBack: () => void;
  themeColor: string;
  currentCurrency: string;
}

const Payment: React.FC<PaymentProps> = ({
  themeColor,
  goBack,
  currentCurrency,
}) => {
  return (
    <div>
      <div className="gruve-echo-modal-top">
        <div className="gruve-echo-back-arrow" onClick={goBack}>
          <BackArrow />
        </div>
        <h3>Payment</h3>
        <div onClick={goBack} className="gruve-echo-close-icon">
          <CloseIcon />
        </div>
      </div>
      <div className="gruve-echo-input-box">
        <div className="gruve-echo-input-left">
          <input
            style={{ accentColor: themeColor }}
            type="radio"
            defaultChecked={true}
            name="payment"
          />
          <span>Bank transfer, Debit Card</span>
        </div>
        <div className="gruve-echo-input-right">
          <div className="gruve-echo-currency-holder">
            {currentCurrency === "NGN" ? "₦" : "$"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
