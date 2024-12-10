import React, { useEffect, useState } from "react";
import DataTable, { defaultThemes, createTheme } from "react-data-table-component";
import IDataTableColumn from "react-data-table-component";

const MainStyle = {
  rows: {
    style: {
      minHeight: '22px', // override the row height
    },
  },
  headRow: {
    style: {
      borderTopStyle: 'solid',
      borderTopWidth: '1px',
      borderTopColor: defaultThemes.default.divider.default,
      backgroundColor: '#0369a1',
      color: '#fff',
      fontSize: '12px'
    },
  },
  headCells: {
    style: {
      paddingLeft: '2px', // override the cell padding for head cells
      paddingRight: '2px',
      paddingTop: '2px',
      paddingBottom: '2px',
    },
  },
  cells: {
    style: {
      paddingLeft: '2px', // override the cell padding for data cells
      paddingRight: '2px',
    },
  },
};

const MainStyle_dark = {
  rows: {
    style: {
      minHeight: '22px', // override the row height
    },
  },
  headRow: {
    style: {
      borderTopStyle: 'solid',
      borderTopWidth: '1px',
      borderTopColor: defaultThemes.default.divider.default,
      backgroundColor: '#454f5c',
      color: '#fff',
      fontSize: '11px'
    },
  },
  headCells: {
    style: {
      paddingLeft: '2px', // override the cell padding for head cells
      paddingRight: '2px',
      paddingTop: '2px',
      paddingBottom: '2px',
    },
  },
  cells: {
    style: {
      paddingLeft: '2px', // override the cell padding for data cells
      paddingRight: '2px',
    },
  },
};

const SubStyle = {
  rows: {
    style: {
      minHeight: '14px', // override the row height
      paddingLeft: '2px'
    },
  },
  headRow: {
    style: {
      borderTopStyle: 'solid',
      borderTopWidth: '1px',
      borderTopColor: defaultThemes.default.divider.default,
      backgroundColor: '#73a3bd',
      color: '#fff',
      fontSize: '12px',
      padding: '1px',
    },
  },
  headCells: {
    style: {
      paddingLeft: '2px', // override the cell padding for head cells
      paddingRight: '1px',
      paddingTop: '1px',
      paddingBottom: '1px',
    },
  },
  cells: {
    style: {
      paddingLeft: '2px', // override the cell padding for data cells
      paddingRight: '0px',
      fontSize: '12px'
    },
  },
};

const SubStyle_dark = {
  rows: {
    style: {
      minHeight: '14px', // override the row height
      paddingLeft: '2px'
    },
  },
  headRow: {
    style: {
      borderTopStyle: 'solid',
      borderTopWidth: '1px',
      borderTopColor: defaultThemes.default.divider.default,
      backgroundColor: '#454f5c',
      color: '#fff',
      fontSize: '12px',
      padding: '1px',
    },
  },
  headCells: {
    style: {
      paddingLeft: '2px', // override the cell padding for head cells
      paddingRight: '1px',
      paddingTop: '1px',
      paddingBottom: '1px',
    },
  },
  cells: {
    style: {
      paddingLeft: '2px', // override the cell padding for data cells
      paddingRight: '0px',
      fontSize: '12px'
    },
  },
};

const SubStyle_1 = {
  rows: {
    style: {
      minHeight: '14px', // override the row height
      paddingLeft: '2px'
    },
  },
  headRow: {
    style: {
      borderTopStyle: 'solid',
      borderTopWidth: '1px',
      borderTopColor: defaultThemes.default.divider.default,
      backgroundColor: '#abcbef',
      color: '#fff',
      fontSize: '12px',
      padding: '1px',
    },
  },
  headCells: {
    style: {
      paddingLeft: '2px', // override the cell padding for head cells
      paddingRight: '1px',
      paddingTop: '1px',
      paddingBottom: '1px',
    },
  },
  cells: {
    style: {
      paddingLeft: '2px', // override the cell padding for data cells
      paddingRight: '0px',
      fontSize: '12px'
    },
  },
};

createTheme(
  'solarized',
  {
    text: {
      primary: '#fff',
      secondary: '#abcbef',
    },
    background: {
      default: '#111826',
    },
    context: {
      background: '#454f5c',
      text: '#FFFFFF',
    },
    divider: {
      default: '#073642',
    },
    button: {
      default: '#2aa198',
      hover: 'rgba(0,0,0,.08)',
      focus: 'rgba(255,255,255,.12)',
      disabled: 'rgba(255, 255, 255, .34)',
    },
    sortFocus: {
      default: '#2aa198',
    },
  },
  'dark',
);

const CustomLoader = () => (
  <div style={{ padding: '24px' }}>
    {/* <RefreshIcon className="animate-spin h-8 w-8 mr-1 text-kmcBG dark:text-gray-400" /> */}RE
  </div>
);


export const Table = (props) => {
  const { data, columns = [] } = props;

  useEffect(() => {
  }, [data]);

  return (
    <DataTable
      noHeader={true}
      columns={columns}
      data={data}
      responsive
      expandableRows={props.isExpandableRowsEnabled}
      expandableRowsComponent={props.ExpandedComponent}
      pagination={props.isPaginationEnabled}
      fixedHeader={props.isFixedHeader}
  		fixedHeaderScrollHeight={props.fixedHeaderScrollHeight}
      highlightOnHover
      //   paginationServer
      //   paginationPerPage={10}
      //   paginationTotalRows={totalRows}
      //   paginationComponentOptions={{ noRowsPerPage: true }}
      customStyles={props.customStylesName == "MainStyle"
        ?
        MainStyle
        :
        (props.customStylesName == "SubStyle_1")
          ?
          SubStyle_1
          :
          (props.customStylesName == "SubStyle_dark")
            ?
            SubStyle_dark
            :
            (props.customStylesName == "MainStyle_dark")
              ?
              MainStyle_dark
              :
              SubStyle}
      // fixedHeader
      // fixedHeaderScrollHeight="500px"
      progressPending={props.progressPending}
      dense
      progressComponent={<CustomLoader />}
      // expandableRowExpanded={props.expandableRowExpanded}
      noDataComponent={props.noMessage}
      title={props.titleMessage}
      conditionalRowStyles={props.conditionalRowStyles}
      theme={"default"}
    />
  );
};
