import { OrderStatusEnum } from "@core/enums/orderstatus.enum";
import { NotifierOptions } from "angular-notifier";
import * as moment from 'moment';

export class Config {
  public static customNotifierOptions: NotifierOptions = {
    position: {
      horizontal: {
        position: "right",
        distance: 12
      },
      vertical: {
        position: "top",
        distance: 12,
        gap: 10
      }
    },
    theme: "material",
    behaviour: {
      autoHide: 10000,
      onClick: "hide",
      onMouseover: "pauseAutoHide",
      showDismissButton: true,
      stacking: 5
    },
    animations: {
      enabled: true,
      show: {
        preset: "slide",
        speed: 300,
        easing: "ease"
      },
      hide: {
        preset: "fade",
        speed: 300,
        easing: "ease",
        offset: 50
      },
      shift: {
        speed: 300,
        easing: "ease"
      },
      overlap: 150
    }
  };

  public static dateConfig = {
    format: "dd/MM/yyyy",
    MonthDateConfig: "MM/dd/yyyy"
  };

  public static booleanNYStrToBool = {
    N: false,
    Y: true
  };

  public static booleanTFStrToBool = {
    f: false,
    t: true
  };

  public static verticalPos = {
    B: "Bottom",
    T: "Top"
  };

  public static horizontalPos = {
    L: "Left",
    R: "Right"
  };

  public static getNYStrToBool(val: string) {
    return this.booleanNYStrToBool[val];
  }

  public static getTFStrToBool(val: string) {
    return this.booleanTFStrToBool[val];
  }

  public static getTFNumToBool(val: any) {
    if (val == "1") {
      return true;
    }
    return false;
  }

  public static getNYboolTostr(val: boolean) {
    if (val) {
      return "Y";
    }
    return "N";
  }

  public static getTFboolTostr(val: boolean) {
    if (val) {
      return "t";
    }
    return "f";
  }

  public static getTFboolToNum(val: boolean) {
    if (val) {
      return "1";
    }
    return "0";
  }

  public static getVerticalPos(val: string) {
    return this.verticalPos[val];
  }

  public static getHorizontalPos(val: string) {
    return this.horizontalPos[val];
  }

  public static getItemsFile = {
    NumberofFiles: 4, //start with 0
    filesize: 50000000 //50 MB
  }

  public static offervalidupto = {
    days: 10
  }

  public static masterfilesheaders = {
    productmaster: ["ARTICLE NO", "DESCRIPTION", "UOM", "INDUSTRY STD TEXT", "LAB TEXT", "HSN CODE", "PG", "PH", "PH TWO", "PH SIX", "SAP ID", "LENGTH", "MDQ"],
    alpmaster: ["ARTICLE NO", "MSQ", "IS FIXED ALP", "ALP", "COST FROM", "ALP CORRECTION FACTOR", "VALID FROM", "VALID TO"],
    releasealp: ["ARTICLE NO", "DESCRIPTION", "ALP", "UOM", "VALID FROM"],
    exportalpmasterlist: ["ARTICLE NO", "MSQ", "IS FIXED ALP", "ALP", "COST FROM", "ALP CORRECTION FACTOR", "VALID FROM", "VALID TO", "FIXED ALP(C)", "FIXED ALP ERROR"],
    costmasterstd: ["ARTICLE NO", "PRIMARY PLANT", "CURRENCY", "STANDARD COST", "COPPER WEIGHT", "COPPER INDEX", "BASE PRICE", "COPPER BASE COST", "OTHER RMC", "VARIABLE OVERHEAD", "FIXED OVERHEAD", "MOQ", "VALID FROM", "VALID TO"],
    costmastertrd: ["ARTICLE NO", "PRIMARY PLANT", "CURRENCY", "LANDING COST", "COPPER INDEX", "CU BASE", "TRANSFER PRICE", "MOQ", "VALID FROM", "VALID TO"],
    exportcostmasterstd: ["ARTICLE NO", "DESCRIPTION", "PRIMARY PLANT", "CURRENCY", "STANDARD COST", "COPPER WEIGHT", "COPPER INDEX", "BASE PRICE", "COPPER BASE COST", "OTHER RM Cost",
      "VARIABLE OVERHEAD", "FIXED OVERHEAD", "MOQ", "VALID FROM", "VALID TO", "SURCHARGE(C)", "COPPER CURRENT COST(C)", "FINAL RMC COST(C)", "STANDARD COST(C)", "FINAL COST(C)", "ALP(C)",
      "OH SURCHARGE(C)", "OH TOTAL RMC(C)", "OH RMC(C)", "OH SALES(C)", "OH TARGET MARGIN(C)", "OH GROSS MARGIN(C)", "OH DISCOUNT(C)"],
    exportcostmastertrd: ["ARTICLE NO", "DESCRIPTION", "PRIMARY PLANT", "CURRENCY", "LANDING COST", "COPPER INDEX", "CU BASE", "TRANSFER PRICE", "MOQ", "VALID FROM", "VALID TO",
      "ADJUSTMENT(C)", "ADJUSTMENT FULL CU(C)", "LANDING COST(C)", "FINAL COST(C)", "ALP(C)", "T. MARGIN"],
    freightmaster: ["ARTICLE NO", "OWF", "ADJ FACTOR ONE", "ADJ FACTOR TWO", "ADJ FACTOR THREE", "ADJ FACTOR FOUR", "ADJ FACTOR FIVE", "ADJ FACTOR SIX"],
    hsnmaster: ["ARTICLE NO", "HSN CODE", "BCD", "FREIGHT AND INSURANCE", "LANDING CHARGES", "CLEARING CHARGES", "IN LAND FREIGHT", "CESS1", "CESS2", "CESS3", "CESS4", "OTHER CHARGES", "FBD"],
    marginmaster: ["PG", "PH", "MAX DISCOUNT", "GROUP MARGIN", "INDUSTRY STD TEXT"],
    importitem: ["SEQ NO", "ARTICLE NO", "QUANTITY", "UNIT PRICE", "DISCOUNT", "LENGTH", "FACTOR", "CUSTOMER PART NO", "REQ DLV DATE", "Import BY"],
    importspritem: ["SEQ NO", "DESCRIPTION", "CUSTOMER PART NO", "LENGTH", "FACTOR", "QUANTITY", "REQ DLV DATE"],
    orderimportitem: ["SEQ NO", "ARTICLE NO", "QUANTITY", "UNIT PRICE", "DISCOUNT", "LENGTH", "FACTOR", "CUSTOMER PART NO", "REQ DLV DATE"],
    exportofferslist: ["OFFER NO", "OFFER CREATED DATE", "LAPP OPPORTUNITY ID", "OPPORTUNITY NAME", "ACCOUNT NAME", "OWNER", "OFFER VALUE", "VALID TO", "STATUS", "ACTION REQUIRED", "SO NO", "SO Created Date", "R. GM(%)", "GM(%)", "T. GM(%)"],
    importSPRItemPE: ["OFFER NO", "ARTICLE NO", "DESCRIPTION", "CUSTOMER PART NO", "ITEM TYPE", "PRIMARY PLANT", "UOM", "LENGTH", "INDUSTRY STD TEXT",
      "PG", "PH", "PH TWO", "PH SIX", "LAB TEXT", "STANDARD COST", "COPPER WEIGHT", "COPPER INDEX", "BASE PRICE", "COPPER BASE COST", "OTHER RMC",
      "VARIABLE OH", "FIXED OH", "ALP", "MSQ", "MOQ", "MDQ", "OWF", "VALID FROM", "VALID TO", "REMARKS"],
    exportFilteredSPRItem: ["OFFER NO", "ARTICLE NO", "DESCRIPTION", "CUSTOMER PART NO", "ITEM TYPE", "PRIMARY PLANT", "CURRENCY", "UOM", "LENGTH", "INDUSTRY STD TEXT",
      "PG", "PH", "PH TWO", "PH SIX", "LAB TEXT", "STANDARD COST", "COPPER WEIGHT", "COPPER INDEX", "BASE PRICE", "COPPER BASE COST", "OTHER RMC",
      "VARIABLE OH", "FIXED OH", "ALP", "MSQ", "MOQ", "MDQ", "OWF", "VALID FROM", "VALID TO", "ENQUIRY CREATED DATE", "ASSIGN TO", "REMARKS", "OFFER SUBMIT DATE", "DETAILED DESCRIPTION"],
    sprreport: ["OFFER NO", "OPPORTUNITY ID", "LAPP OPPORTUNITY ID", "OPPORTUNITY NAME", "ACCOUNT NAME", "OWNER NAME", "CREATED DATE", "ARTICLE NO", "DESCRIPTION", "QTY", "SAP ID", "ASSIGNED TO", "OFFER BY", "CUSTOMER PART NO",
      "OFFER DATE", "ITEM TYPE", "PRIMARY PLANT", "CURRENCY", "UOM", "LENGTH", "INDUSTRAIL STANDARD TEXT", "PG", "PH", "PH TWO", "PH SIX", "LAB TEXT", "STANDARD COST", "COPPER WEIGHT", "COPPER INDEX", "BASE PRICE", "COPPER BASE COST",
      "VARIABLE OH", "FIXED OH", "MSQ", "MOQ", "MDQ", "VALID TO", "SURCHARGE CALCULATED", "CURRENT COPPERCOST CALCULATED", "TOTAL RMC CALCULATED", "STANDARD COST CALCULATED", "FINAL COST CALCULATED", "ALP CALCULATED", "OFFER VALUE", "REMARKS TEXT",
      "ISOFFERACTIVE", "ISITEMDELETE", "OFFER SUBMIT DATE", "DETAILED DESCRIPTION"],
    exportoderslist: ["TYPE", "LAPP OPPORTUNITY ID", "NO", "SO ID", "SO CREATED DATE", "ACCOUNT NAME", "OWNER", "ORDER VALUE", "STATUS", "GM(%)"],
    rcimportitem: ["SEQ NO", "ARTICLE NO", "QUANTITY", "UNIT PRICE", "DISCOUNT", "UNIQUE DOC NUMBER", "VALID FROM", "VALID TO"],
    importsprform: ["ARTICLE NO", "VOLTAGE GRADE", "REFERENCE STANDARD", "RATED TEMPERATURE & AMBIENT TEMPERATURE", "CONSTRUCTION",
      "REQUIRED CORES/PAIRS/TRAID/QUAD", "CROSS SECTION", "CONDUCTOR TYPE", "CONDUCTOR CLASS", "INSULATION MATERIAL", "CORE COLOURS",
      "INDIVIDUAL SHIELDED TYPE", "THICKNESS OF SHIELD", "DRAIN WIRE SIZE", "OVERALL SHIELDED TYPE", "THICKNESS OF SHIELD_1",
      "DRAIN WIRE SIZE_1", "INNER SHEATH1 MATERIAL", "COLOUR OF INNER SHEATH", "PROTECTION1", "INNER SHEATH2 MATERIAL", "COLOUR OF INNER SHEATH_1",
      "PROTECTION2", "OUTER SHEATH MATERIAL", "COLOUR OF OUTER SHEATH", "OTHER PROPERTIES", "RIP CORD", "PACKING LENGTH", "APPLICATION",
      "QUANTITY", "REMARKS"],
    importsprformsave: ["articleno", "voltgrade", "refstandard", "ratedtemp", "construction", "reqcores", "crosssec", "conducttype", "conductlass",
      "insulatiomat", "corecolour", "indishieldtype", "thickofshield", "drainwiresize", "ovshitype", "thickshield", "overalldrainwiresize",
      "innersheath1mat", "colofinnsheal", "protection1", "innersheal2mat", "colofinnshe", "protection2", "outshemat", "colofoutershe",
      "otherprop", "ripcord", "packinglen", "application", "quantity", "remarks", "rowStatus"],
    petmaster: ["NAME", "GST", "EMAIL", "PHONE", "LAPP ARTICLE NO", "QUANTITY", "NET PRICE", "CUSTOMER CREATION DATE", "SO NO", "SO DATE"],
    rcorderimportitem: ["SEQ NO", "ARTICLE NO", "QUANTITY", "LENGTH", "FACTOR", "CUSTOMER PART NO", "REQ DLV DATE"],
    Moqitem: ["ARTICLE NO", "MOQ", "MDQ"]

  }

  public static ReportsHeaders = {
    salesgrowthbyph: ["PH", "Industry Std. Text", "Revenue Previous Year", "Revenue Current Year", "Growth vs PY", "GM Previous Year", "GM Current Year"],
    salesgrowthbysegment: ["Segment", "Revenue Previous Year", "Revenue Current Year", "Growth vs PY", "GM Previous Year", "GM Current Year", "% Contribution", "Vertical"],
    productwiseenquirytrendyoy: ["Type of Cable", "PY No. of Articles", "PY Qty (KM)", "PY Offer Value", "CY No. of Articles", "CY Qty (KM)", "CY Offer Value", "Growth (YoY)"],
    timemeasurementRFOCPOtoSO: ["Offer No", "Order Type", "Article Type", "Offer Value", "Segment", "Vertical", "Offer Created on", "SO Initiated on","OmTeamSubmittedOn", "SO Created on", "Pending Month", "Pending Days",
      "Pending Time (hr)", "Pending Time (m)", "Employee", "Dist Channel", "Means of Trans.", "Doc Type", "SO No.", "Article No.", "Quantity", "Factor & Length", "PO Number", "Under Dlv. Toletance", "Over Dlv. Tolerance", "Laboratory Text", "Industry STD Text"],
    timemeasurementnewtoapproved: ["Offer No", "Order Type", "Offer Value", "Segment", "Vertical", "Region", "Industry Key", "Business Model", "Created On", "Pending Month", "Pending Days",
      "Pending Time (hr)", "Pending Time (m)", "Employee"],
    openopportunity: ["Business/Segment", "Business/Segment1", "Opportunity Owner", "Lapp Opportunity Id", "Opportunity Name", "Nace Code", "Business Model", "Account Name", "Probability % of winning",
      "Business Nature", "Stage", "Close Date", "No. of Lines in Offer", "Days to Make Offer", "Age of Opps. from Offered Date", "Age", "Opportunity Id",
      "Opportunity Value", "Offered Value", "Quotation Level Margin", "Segment Level Target"],
    closedopportunity: ["Business/Segment", "Business/Segment1", "Opportunity Owner", "Lapp Opportunity Id", "Opportunity Name", "Account Name", "Offered Value"],
    openorder: ["Sales Order No", "SO Created Date", "Line Item Create Date", "Cust PO No", "Cust PO Date", "Employee Responsible", "Item No", "Material No",
      "Description", "Order Qty", "Open Qty", "Dlv Qty", "UOM", "Unit Price", "Net Value", "Open Order Value", "Currency", "Cust Req Date",
      "Estimated M.A.D.", "Sold to Party", "Sold State", "Ship to Party", "Ship State", "Import By", "Factor", "Length", "Untol",
      "Ovtol", "WareHouse Name", "Laboratory Text", "Sales Org Text", "OMP No", "Planning Block", "End Customer Name"],
    invoicelist: ["GST Invoice No", "Invoice Date", "Total Amount", "Currency", "Invoice Item", "Material No", "Material Desc", "Quantity", "SO No", "Delivery No", "LR No", "LR Date", "Transport", "Customer PO No", "PO Date", "Invoice No", "Employee Responsible"],
    customeroutstandingitemdetail: ["Customer", "Name", "Bill Doc", "PO No", "Billing Date", "Due Date", "Currency", "Document No", "Fiscal year", "Invoice No", "Document Type", "Posting Date",
      "Sales Org", "Invoice Amount"],
    businessscorecard: ["Pernr", "Ename", "Desc ", "Oct", "Nov ", "Dec", "Jan", "Feb ", "Mar ", "Apr ", "May", "Jun ", "Jul", "Aug", "Sep ", "Ordtot ", "OMP Login"],
    userList: ["User Id (SFDC)", "Full Name", "SAP Id", "Role", "Email", "Phone",  "Status", "On Leave"],
    orderdashboard: ["Type", "Direct / Indirect", "OMP No", "SO No", "SO Created Date", "Sold to Party", "Ship to Party", "Account", "Owner / Emp", "Segment", "Offer Value", "GM(%)", "T. GM(%)", "Delivery Status"],
    //tatReportList:["Offer No","Sales Name","Opportunity Number","Order Type","Article Type","Offer Value","Segment","Vertical","Offer Creation date & time","Article creation date & time","Pending hours","Pending days","Employee Name","Distribution channel","Article No","Description","Factor","Length","Qty"]
    tatReportList: ["SFDC Oppo. ID", "Opp. Created Date", "Offer Created Date", "Offer Number", "OMP Type", "Submitted to PE for Offer", "PE Action Completion Date", "Quotation Created Date", "Purchase Order Date", "SO Creation Date", "Part Number", "SO Number", "T.GM(%)", "R.GM(%)", "GM(%)", "SO Value", "Sales Employee Name", "PE Name", "SCM name"],

    ArticleCostReport: ["lappopportunityid", "offerno", "ArticleNo", "description", "industry_std_text", "ItemType", "Quantity", "Cost", "rmc_cost"],
    sapOrderDashboard: ["Sales Order", "Sales Item", "OMP No", "Order Cr. Dt", "Order Cr. By", "Sold To Party", "Sold To Name", "Order Type", "Ordertypedesc", "Salesorg", "Salesdistribution", "Salesdivision", "Custponumber", "Custpodate", "Ordervaluehdr", "Emprespnumber", "Emprespname", "Endcustname", "Orderstatus", "Plant", "Itemcreatedate", "Materialno", "MaterialDesc", "Quantity", "Unit", "Factor", "Length", "Untol", "Ovtol", "Unitprice", "Currency", "DeliveryDate", "Openquanity", "Matavaldate", "Ordervalue", "Openvalue", "Delvalue", "Itemorderstatus", "City", "Postalcode"]

  }

  public static productcatalogue = {
    url: 'https://lappindia.lappgroup.com/products/catalogue.html'
  }

  public static monthName = {
    0: 'Jan',
    1: 'Feb',
    2: 'Mar',
    3: 'Apr',
    4: 'May',
    5: 'Jun',
    6: 'Jul',
    7: 'Aug',
    8: 'Sep',
    9: 'Oct',
    10: 'Nov',
    11: 'Dec'
  }

  public static getDBdatetimeToDateTime(value: string) {
    if (value) {
      let date = value.split('T')[0].split('-').reverse().join('/');
      let time = value.split('T')[1].substring(0, 8)
      return date + ' ' + time;
    } else {
      return;
    }
  }

  public static isDate(value: any): boolean {
    if (value) {
      let _date: any;
      let isDateValid: boolean = false;

      if (isNaN(value))
        value = value.replace("/", "-");

      if (!isDateValid) {
        _date = moment(value).format('dd/mm/yyyy');
        isDateValid = moment(_date).isValid();
      }

      if (!isDateValid) {
        _date = moment(value).format('mm/dd/yyyy');
        isDateValid = moment(_date).isValid();
      }
      return isDateValid;
    } else {
      return false;
    }
  }

  public static ExcelDateToJSDate(_date, delimiter: string) {
    if (_date) {
      let _format = "YYYY" + delimiter + "MM" + delimiter + "DD";

      if (isNaN(_date))
        return { valid: true, date: moment(_date).format(_format) }
      else
        return { valid: true, date: moment(new Date(Math.round((_date - 25569) * 86400 * 1000))).format(_format) }
    } else
      return { valid: false, date: null };
  }

  public static fmapproval = {
    amount: 10000000 // 1 cr
  }

  public static getCurrentFinancialYear() {
    var fiscalyear = "";
    var today = new Date();
    if ((today.getMonth() + 1) <= 9) {
      fiscalyear = (today.getFullYear() - 1) + "-" + today.getFullYear()
    } else {
      fiscalyear = today.getFullYear() + "-" + (today.getFullYear() + 1)
    }
    return fiscalyear
  }

  public static getCurrentMonthinCurrentFinancialYearorNot(fiscalyear: number) {
    var today = new Date();

    if ((today.getMonth() + 1) <= 9 && fiscalyear == today.getFullYear())
      return true;
    else
      return false;
  }

  public static isValidMOQ(item: any) {
    // if (item.uom && item.uom.toUpperCase() == "PC") {
    if (Number(item.quantity) < Number(item.moq)) {
      return false;
    }
    // }
    // else if (item.uom.toUpperCase() == "M") {
    //   if (Number(item.quantity) < Number(item.moq) && item.lengthandfactor.filter(x => x.isother == 1).length > 0) {
    //     return false;
    //   }
    // }

    return true;
  }

  public static fn_Arr_trim(_arr: any) {
    return JSON.parse(JSON.stringify(_arr).replace(/"\s+|\s+"/g, '"'));
  }

  public static SetDetailStatus(list: any, columnname: string, setproperty: string) {
    list.forEach(element => {
      if (element[columnname] == '')
        element[setproperty] = OrderStatusEnum.blank;
      else if (element[columnname] == 'A')
        element[setproperty] = OrderStatusEnum.A;
      else if (element[columnname] == 'B')
        element[setproperty] = OrderStatusEnum.B;
      else if (element[columnname] == 'C')
        element[setproperty] = OrderStatusEnum.C;
    });

    return list;
  }

  public static setApprovaldatastatus(approvaldatalist: any) {
    approvaldatalist.forEach(element => {
      if (element.status == 10)
        element.showstatus = 'Pending';
      else if (element.status == 30)
        element.showstatus = 'Rejected';
      else if (element.status == 50)
        element.showstatus = 'Approved';
      else
        element.showstatus = '';
    });

    return approvaldatalist;
  }

  public static ObjecttoString(data: any, separator: string): String {
    data = data === null || data === undefined ? undefined : JSON.parse(atob(data));
    if (data) //${k}: 
      return Object.entries(data).map(([k, v]) => `${v}`).join(` ${separator} `);
    else
      return "";
  }

  public static NulltoStringConversion(value) {
    return (value == null || value == undefined) ? "" : value;
  }

  public static ReplaceKeys(object) {
    Object.keys(object).forEach(function (key) {
      var newKey = key.replace(/\s+/g, '');
      if (object[key] && typeof object[key] === 'object') {
        this.ReplaceKeys(object[key]);
      }
      if (key !== newKey) {
        object[newKey] = object[key];
        delete object[key];
      }
    });
  }

  public static dateisGreaterThanEqualtoTodayDate(date: any): boolean {
    let result: boolean = false;
    let convertedDate = Config.ExcelDateToJSDate(date, "-");
    if (convertedDate.valid) {
      return moment(convertedDate.date.split("-")[0] + "-" + convertedDate.date.split("-")[1] + "-" + convertedDate.date.split("-")[2]).diff(moment(), 'days') >= 0;
    }

    return result;
  }

  public static StatusList =
    [
      { code: 2, description: 'All' },
      { code: 1, description: 'Active' },
      { code: 0, description: 'Inactive' }
    ];
}
