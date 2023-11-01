// import React from "react";
// import { HotTable } from "@handsontable/react";
// import { renderDiff } from "../utils/RenderDiffTable";

// interface DiffResult {
//   hotTableComponentDiffResult: React.RefObject<any>;
// }

// const DiffResultHooks = (props: DiffResult) => {
//   const hotDiffResultSettings = {
//     minRows: 10,
//     minCols: 10,
//     minSpareCols: 0,
//     minSpareRows: 0,
//     colHeaders: false,
//     contextMenu: false,
//     rowHeaders: false,
//     readOnly: true,
//     renderAllRows: true,
//     licenseKey: "non-commercial-and-evaluation",
//     filters: true, // Enable filters
//     dropdownMenu: true,
//     height: 'auto',
//   };

//   return (
//     <>
//       <span style={{ fontSize: 24 }}>{"comp"}</span>
//       <HotTable
//         ref={props.hotTableComponentDiffResult}
//         data={[[""]]}
//         style={{ width: "100%", padding: 15 }}
//         id={"tableresult"}
//         settings={hotDiffResultSettings}
//         renderer={renderDiff}
//         className="diffhandsontable"
//         stretchH={"all"}
//       />
//     </>
//   );
// };

// export default DiffResultHooks;



import React from "react";
import { HotTable } from "@handsontable/react";
import { renderDiff } from "../utils/RenderDiffTable";
import * as XLSX from "xlsx"; // Import the xlsx library for Excel export

interface DiffResult {
  hotTableComponentDiffResult: React.RefObject<any>;
}

const DiffResultHooks = (props: DiffResult) => {
  const hotDiffResultSettings = {
    minRows: 10,
    minCols: 10,
    minSpareCols: 0,
    minSpareRows: 0,
    colHeaders: false,
    contextMenu: false,
    rowHeaders: false,
    readOnly: true,
    renderAllRows: true,
    licenseKey: "non-commercial-and-evaluation",
    filters: true, // Enable filters
    dropdownMenu: true,
    height: 'auto',
  };
  
    // Function to preprocess the data and remove the signs
    const preprocessData = (data: string[][]): string[][] => {
      return data.map((row) => {
        return row.map((cell) => {
          if (cell !== null && cell !== undefined) {
            // Remove "+++" signs
            cell = cell.replace(/\+\+\+/g, "");
  
            // Remove "---" signs
            cell = cell.replace(/---/g, "");
  
            // Replace "a->b" with "b"
            cell = cell.replace(/(.*)->(.*)/g, "$2");
  
            // Remove "@@", "A:A", and "1:1"
            cell = cell.replace(/@@|A:A|1:1/g, "");
          }
          return cell;
        });
      });
    };
  
    const handleDownloadExcel = () => {
      const hotInstance = props.hotTableComponentDiffResult.current.hotInstance;
  
      if (hotInstance) {
        // Get the data from the Handsontable instance
        const originalData = hotInstance.getData();
  
        // Preprocess the data to remove the signs
        const cleanedData = preprocessData(originalData);
  
        // Create a worksheet
        const ws = XLSX.utils.aoa_to_sheet(cleanedData);
  
        // Create a workbook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  
        // Save the workbook to a file
        XLSX.writeFile(wb, "tableData.xlsx");
      }
    };
  
    return (
      <>
        <span style={{ fontSize: 24 }}>{"comp"}</span>
         
        <HotTable
          ref={props.hotTableComponentDiffResult}
          data={[["1:1"]]} // Start with "1:1"
          style={{ width: "100%", padding: 15 }}
          id={"tableresult"}
          settings={hotDiffResultSettings}
          renderer={renderDiff}
          className="diffhandsontable"
          stretchH={"all"}
        />
      </>
    );
  };
  
  export default DiffResultHooks;
  
