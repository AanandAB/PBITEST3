import React, { useEffect } from "react";
import { models } from "powerbi-client";

const PowerBIFilter = ({ inputValue, report }) => {
  useEffect(() => {
    if (report) {
      if (inputValue) {
        applyFilters(inputValue);
      } else {
        resetFilters();
      }
    }
  }, [inputValue, report]);

  const applyFilters = (input) => {
    const filters = [
      {
        $schema: "http://powerbi.com/product/schema#basic",
        target: { table: "PERFORMA_BUDGET_VIEW", column: "ACCOUNT_NAME" },
        operator: "In",
        values: [input],
      },
    ];

    report
      .updateFilters(models.FiltersOperations.Replace, filters)
      .then(() => console.log("Filters applied"))
      .catch((errors) => console.error("Error applying filters:", errors));
  };

  const resetFilters = () => {
    report
      .updateFilters(models.FiltersOperations.RemoveAll)
      .then(() => console.log("Filters reset"))
      .catch((errors) => console.error("Error resetting filters:", errors));
  };

  return null; // This component does not render anything
};

export default PowerBIFilter;
