const { Tool } = require('langchain/tools');

class InvestmentSimulatorTool extends Tool {
  constructor() {
    super();
    this.name = 'investment_simulator';
    this.description = 'Simulates investment growth based on user-provided principal, rate, and duration.';
  }

  async _call({ input }) {
    try {
      const matchPrincipal = input.match(/\$?(\d+(,\d+)?(\.\d+)?)/);
      const matchRate = input.match(/(\d+(\.\d+)?)\s*%/);
      const matchYears = input.match(/(\d+)\s*(year|years)/i);

      const principal = matchPrincipal ? parseFloat(matchPrincipal[1].replace(/,/g, '')) : 1000;
      const rate = matchRate ? parseFloat(matchRate[1]) / 100 : 0.07;
      const years = matchYears ? parseInt(matchYears[1]) : 5;

      let futureValue = 0;
      for (let i = 1; i <= years; i++) {
        futureValue = (futureValue + principal) * (1 + rate);
      }

      return `If you invest $${principal} every year for ${years} years at ${(rate * 100).toFixed(2)}% annual return, 
your portfolio could grow to approximately $${futureValue.toFixed(2)}. 
This highlights the power of compound growth—starting earlier leads to greater returns over time.`;

    } catch (error) {
      console.error("Investment simulation failed:", error);
      return "I'm unable to process the simulation. Please include values for amount, rate, and duration.";
    }
  }
}

module.exports = InvestmentSimulatorTool;
