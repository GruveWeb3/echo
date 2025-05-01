import { GruveEventWidgetsProps } from "../components/GruveEventsWidget";
import { GET_BASE_URL, GET_BACKEND_URL } from "../utils/utils";

interface GruveCTAOptions extends Omit<GruveEventWidgetsProps, "children"> {
  targetElement: HTMLElement;
}

class GruveCTA {
  private options: GruveCTAOptions;
  private modalContainer: HTMLDivElement | null = null;
  private eventDetails: any = null;
  private eventDetailsWithId: any = null;
  private questions: any[] = [];
  private rates: any = {};
  private coupons: any[] = [];
  private couponData: any[] = [];
  private ticketBalances: any[] = [];
  private loadingEl: HTMLDivElement | null = null;
  private modalEl: HTMLDivElement | null = null;

  constructor(options: GruveCTAOptions) {
    this.options = options;
    this.init();
  }

  private init() {
    // Create modal and loading containers if they don't exist
    if (!this.modalContainer) {
      this.modalContainer = document.createElement("div");
      this.modalContainer.id = "gruve-modal-container";
      this.modalContainer.style.position = "fixed";
      this.modalContainer.style.top = "0";
      this.modalContainer.style.left = "0";
      this.modalContainer.style.width = "100%";
      this.modalContainer.style.height = "100%";
      this.modalContainer.style.display = "none";
      this.modalContainer.style.justifyContent = "center";
      this.modalContainer.style.alignItems = "center";
      this.modalContainer.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
      this.modalContainer.style.zIndex = "9999";
      document.body.appendChild(this.modalContainer);

      // Create loading element
      this.loadingEl = document.createElement("div");
      this.loadingEl.className = "gruve-loading";
      this.loadingEl.style.display = "none";
      this.loadingEl.innerHTML = `
        <div style="width: 50px; height: 50px; border: 5px solid #f3f3f3; 
                    border-top: 5px solid ${
                      this.options.config?.themeColor || "#ea445a"
                    }; 
                    border-radius: 50%; animation: gruve-spin 1s linear infinite;"></div>
      `;

      // Add CSS for animation
      const style = document.createElement("style");
      style.innerHTML = `
        @keyframes gruve-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);

      this.modalContainer.appendChild(this.loadingEl);

      // Create modal dialog
      this.modalEl = document.createElement("div");
      this.modalEl.className = "gruve-modal";
      this.modalEl.style.display = "none";
      this.modalEl.style.backgroundColor = "white";
      this.modalEl.style.borderRadius = "8px";
      this.modalEl.style.maxWidth = "90%";
      this.modalEl.style.width = "600px";
      this.modalEl.style.maxHeight = "90vh";
      this.modalEl.style.overflow = "auto";
      this.modalEl.style.position = "relative";
      this.modalEl.style.fontFamily =
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif";

      // Close button
      const closeButton = document.createElement("button");
      closeButton.innerHTML = "×";
      closeButton.style.position = "absolute";
      closeButton.style.top = "10px";
      closeButton.style.right = "10px";
      closeButton.style.background = "none";
      closeButton.style.border = "none";
      closeButton.style.fontSize = "24px";
      closeButton.style.cursor = "pointer";
      closeButton.style.color = "#666";
      closeButton.onclick = () => this.closeModal();

      this.modalEl.appendChild(closeButton);
      this.modalContainer.appendChild(this.modalEl);

      // Close modal when clicking outside
      this.modalContainer.addEventListener("click", (e) => {
        if (e.target === this.modalContainer) {
          this.closeModal();
        }
      });
    }

    // Add click handler to target element
    this.options.targetElement.addEventListener("click", (e) => {
      e.preventDefault();
      this.handleClick();
    });
  }

  private async handleClick() {
    // Open the modal
    this.openModal();
    this.showLoading(true);

    // Fetch event data
    await Promise.all([
      this.fetchCoupon(),
      this.fetchEventDetails(),
      this.fetchRates(),
    ]);

    this.showLoading(false);
    this.renderEventDetails();
  }

  private openModal() {
    if (this.modalContainer) {
      this.modalContainer.style.display = "flex";
    }
  }

  private closeModal() {
    if (this.modalContainer) {
      this.modalContainer.style.display = "none";
    }

    if (this.modalEl) {
      this.modalEl.style.display = "none";
    }
  }

  private showLoading(show: boolean) {
    if (this.loadingEl) {
      this.loadingEl.style.display = show ? "flex" : "none";
    }

    if (this.modalEl) {
      this.modalEl.style.display = show ? "none" : "block";
    }
  }

  private async fetchEventDetails() {
    try {
      const baseUrl = GET_BASE_URL(this.options.isTest || false);
      const response = await fetch(
        `${baseUrl}/api/fetch-event-details?eventAddress=${this.options.eventAddress}`
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      this.questions = result?.questions || [];
      this.ticketBalances = result?.balances || [];
      this.eventDetails = result?.data;
      this.eventDetailsWithId = result?.eventDetailsWithId;
    } catch (err: any) {
      console.error("Failed to fetch event details:", err);
      this.showError("Failed to load event details. Please try again later.");
    }
  }

  private async fetchRates() {
    try {
      const baseUrl = GET_BASE_URL(this.options.isTest || false);
      const response = await fetch(`${baseUrl}/api/fetch-rates`);

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      this.rates = result;
    } catch (err) {
      console.error("Failed to fetch rates:", err);
    }
  }

  private async fetchCoupon() {
    try {
      const backendUrl = GET_BACKEND_URL(this.options.isTest || false);
      const response = await fetch(
        `${backendUrl}/api/discount/check/${this.options.eventAddress.toLowerCase()}`
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      this.couponData = result?.data || [];
    } catch (err) {
      console.error("Failed to fetch coupons:", err);
    }
  }

  private showError(message: string) {
    if (this.modalEl) {
      this.showLoading(false);
      this.modalEl.innerHTML = `
        <div style="padding: 20px; text-align: center;">
          <h3 style="color: #ea445a;">Error</h3>
          <p>${message}</p>
          <button 
            style="padding: 8px 16px; background-color: ${
              this.options.config?.themeColor || "#ea445a"
            }; 
                   color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 10px;"
            onclick="this.closeModal()">
            Close
          </button>
        </div>
      `;
    }
  }

  private renderEventDetails() {
    if (!this.modalEl || !this.eventDetails) {
      this.showError("No event details available");
      return;
    }

    // Get base URL for redirection
    const baseUrl = GET_BASE_URL(this.options.isTest || false);

    // Add event info
    const eventInfo = this.eventDetails.info || {};
    const eventImage = eventInfo.eventImage || "";
    const eventName = eventInfo.eventName || "Unnamed Event";
    const currency = this.eventDetails.currency || "NGN";

    // Get date information
    const schedules = this.eventDetails.schedules || [];
    let dateRange = "Date TBD";
    let timeDisplay = "";
    let monthDisplay = "";
    let dayRangeDisplay = "";

    if (schedules.length > 0) {
      try {
        const startDate = new Date(schedules[0].date);
        const endDate =
          schedules.length > 1
            ? new Date(schedules[schedules.length - 1].date)
            : startDate;

        // Format for month display (Apr)
        monthDisplay = startDate.toLocaleDateString("en-US", {
          month: "short",
        });

        // Format for day range (25 - 30)
        const startDay = startDate.getDate();
        const endDay = endDate.getDate();
        dayRangeDisplay =
          schedules.length > 1 ? `${startDay} - ${endDay}` : `${startDay}`;

        // Full date range display
        const startDateStr = startDate.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        });
        const endDateStr = endDate.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        });
        dateRange =
          schedules.length > 1
            ? `${startDateStr} - ${endDateStr}`
            : startDateStr;

        // Time display
        const startTime = schedules[0].startTime || "00:00";
        const endTime = schedules[0].endTime || "23:59";
        timeDisplay = `${startTime} - ${endTime} GMT ${
          schedules[0].timezone || "+0"
        } WAT: West Africa Time`;
      } catch (e) {
        console.error("Error formatting date:", e);
      }
    }

    // Location info
    const locationName = eventInfo.eventLocation || "Location TBD";

    // Ticket info
    const tickets = this.eventDetails.tickets || [];
    let ticketOptions = "";

    if (tickets.length > 0) {
      // Just take the first ticket for simplicity in this example
      const ticket = tickets[0];
      const price = parseFloat(ticket.price) || 0;
      const formattedPrice = price.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      ticketOptions = `
        <div style="margin-top: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <h3 style="margin: 0;">Choose your ticket</h3>
            <div style="position: relative; min-width: 80px;">
              <div style="border: 1px solid #eee; border-radius: 4px; padding: 5px 10px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; font-size: 14px;">
                ${currency}
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
          <div style="border: 1px solid #eee; border-radius: 8px; padding: 15px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-weight: bold;">${
                ticket.ticketName || "vip"
              }</div>
              <div style="font-size: 16px;">${currency} ${formattedPrice}</div>
            </div>
            <div style="display: flex; align-items: center; gap: 10px;">
              <button class="gruve-ticket-minus" style="width: 30px; height: 30px; border-radius: 50%; border: 1px solid #ddd; background: white; cursor: pointer; display: flex; align-items: center; justify-content: center;">−</button>
              <span style="min-width: 30px; text-align: center;">Going</span>
              <button class="gruve-ticket-plus" style="width: 30px; height: 30px; border-radius: 50%; border: 1px solid #ddd; background: white; cursor: pointer; display: flex; align-items: center; justify-content: center;">+</button>
            </div>
          </div>
        </div>
      `;
    }

    this.modalEl.innerHTML = `
      <button id="gruve-close-btn" style="position: absolute; top: 10px; right: 10px; background: none; border: none; font-size: 24px; cursor: pointer; color: #666; z-index: 10;">×</button>
      <div style="max-height: 90vh; overflow-y: auto;">
        <div style="position: relative;">
          ${
            eventImage
              ? `<img src="${eventImage}" alt="${eventName}" style="width: 100%; height: auto; max-height: 300px; object-fit: cover;">`
              : '<div style="width: 100%; height: 150px; background-color: #f5f5f5;"></div>'
          }
        </div>
        
        <div style="padding: 20px;">
          <h2 style="margin: 0 0 15px 0; font-size: 24px;">${eventName}</h2>
          
          <div style="display: flex; gap: 15px; margin-bottom: 15px;">
            <div style="background-color: #f5f5f5; padding: 5px 10px; border-radius: 5px; text-align: center; min-width: 50px;">
              <div style="font-size: 12px;">${monthDisplay}</div>
              <div style="font-weight: bold;">${dayRangeDisplay}</div>
            </div>
            
            <div style="flex-grow: 1;">
              <div style="font-size: 14px;">${dateRange}</div>
              <div style="font-size: 12px; color: #666;">${timeDisplay}</div>
            </div>
          </div>
          
          <div style="display: flex; align-items: center; margin-bottom: 20px;">
            <div style="width: 20px; margin-right: 10px;">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 13.5C13.3807 13.5 14.5 12.3807 14.5 11C14.5 9.61929 13.3807 8.5 12 8.5C10.6193 8.5 9.5 9.61929 9.5 11C9.5 12.3807 10.6193 13.5 12 13.5Z" fill="currentColor"/>
                <path d="M12 22C14.5 18 20 15.5 20 11C20 6.58172 16.4183 3 12 3C7.58172 3 4 6.58172 4 11C4 15.5 9.5 18 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div>${locationName}</div>
          </div>
          
          ${ticketOptions}
          
          <div style="margin-top: 20px;">
            <a href="${baseUrl}/newEventDetails/${
      this.options.eventAddress
    }" target="_blank" 
               style="display: block; width: 100%; text-align: center; padding: 12px; background-color: ${
                 this.options.config?.themeColor || "#ea445a"
               }; color: white; border: none; border-radius: 4px; cursor: pointer; text-decoration: none; box-sizing: border-box; font-weight: bold;">
              ${this.options.config?.displayText || "Get Tickets"}
            </a>
          </div>
          
          <div style="margin-top: 15px; text-align: center;">
            <a href="${baseUrl}/newEventDetails/${
      this.options.eventAddress
    }" target="_blank" style="color: #666; font-size: 14px; text-decoration: none; display: flex; align-items: center; justify-content: center;">
              View Full Event Page
              <svg style="margin-left: 5px; width: 16px; height: 16px;" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 17L17 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M7 7H17V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    `;

    // Add click handlers for the ticket quantity buttons
    const minusButtons = this.modalEl.querySelectorAll(".gruve-ticket-minus");
    const plusButtons = this.modalEl.querySelectorAll(".gruve-ticket-plus");

    minusButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        // You would implement ticket quantity decrease logic here
      });
    });

    plusButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        // You would implement ticket quantity increase logic here
      });
    });

    // Add close button functionality
    const closeBtn = document.getElementById("gruve-close-btn");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.closeModal());
    }
  }

  private getEventDateString(): string {
    if (
      !this.eventDetails ||
      !this.eventDetails.schedules ||
      this.eventDetails.schedules.length === 0
    ) {
      return "Date TBD";
    }

    const schedule = this.eventDetails.schedules[0];
    try {
      const date = new Date(schedule.date);
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return date.toLocaleDateString(undefined, options);
    } catch (e) {
      return "Date TBD";
    }
  }

  // Static method to initialize from DOM elements
  static autoInitialize() {
    const elements = document.querySelectorAll(
      '[data-gruve-action="checkout"]'
    );

    elements.forEach((element) => {
      if (element instanceof HTMLElement) {
        const eventId = element.getAttribute("data-gruve-event-id");
        const themeColor = element.getAttribute("data-gruve-theme-color");
        const displayText = element.getAttribute("data-gruve-display-text");
        const isTest = element.getAttribute("data-gruve-test") === "true";

        if (eventId) {
          new GruveCTA({
            targetElement: element,
            eventAddress: eventId,
            isTest,
            config: {
              themeColor: themeColor || undefined,
              displayText: displayText || undefined,
            },
          });
        }
      }
    });
  }
}

// Auto-initialize on DOM content loaded
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () =>
      GruveCTA.autoInitialize()
    );
  } else {
    GruveCTA.autoInitialize();
  }
}

// Export for manual initialization
export default GruveCTA;

// Expose to window for UMD build
if (typeof window !== "undefined") {
  (window as any).GruveCTA = GruveCTA;
}
