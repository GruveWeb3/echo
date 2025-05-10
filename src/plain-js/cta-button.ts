interface GruveCTAOptions {
    eventId: string;
    themeColor?: string;
    text?: string;
    action?: 'checkout';
  }
  
  class GruveCTA {
    private static instance: GruveCTA;
    private initialized = false;
  
    private constructor() {}
  
    static getInstance(): GruveCTA {
      if (!GruveCTA.instance) {
        GruveCTA.instance = new GruveCTA();
      }
      return GruveCTA.instance;
    }
  
    private getOptionsFromElement(element: HTMLElement): GruveCTAOptions {
      return {
        eventId: element.dataset.gruveEventId || '',
        themeColor: element.dataset.gruveThemeColor,
        text: element.dataset.gruveText,
        action: element.dataset.gruveAction as 'checkout' | undefined
      };
    }
  
    private handleClick(event: Event, options: GruveCTAOptions) {
      event.preventDefault();
      // TODO: Implement the actual checkout flow
      console.log('Opening checkout for event:', options.eventId);
    }
  
    private initializeButton(element: HTMLElement) {
      const options = this.getOptionsFromElement(element);
      if (!options.eventId) {
        console.warn('Gruve CTA button missing required data-gruve-event-id attribute');
        return;
      }
  
      element.addEventListener('click', (e) => this.handleClick(e, options));
    }
  
    public initialize() {
      if (this.initialized) return;
      this.initialized = true;
  
      const buttons = document.querySelectorAll<HTMLElement>('[data-gruve-action="checkout"]');
      buttons.forEach(button => this.initializeButton(button));
    }
  }
  
  // Auto-initialize on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    GruveCTA.getInstance().initialize();
  });
  
  // Export for UMD build
export default GruveCTA;