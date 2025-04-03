export class CSVRecord {
	public id:any;
	public Material_No: any;
	public Description: any;
	public Copper_Index: number;
	public status: any;
	public Remarks: any;
} 
export class StatusData {
	public fileName:string;
	public fileId:number;
	public StatusDetail:any[];
	public HeaderFields:any;
	public type:string

} 

export class StandardItemRecords {
	public id:any;
	public material_no: any;
	public description: any;
	public alp_price: number;
	public validity_from_date: any;
	public validity_to_date: any;
	public msq: any;
	public status:boolean;
	public rowStatus: any;
	public Remarks: any;
} 

export class RateContractRecords {
	public id:number;
	public contract_code: string;
	public client_code: string;
	public item_code: string;
	public contract_type: string;
	public description: string;
	public min_qty: number;
	public price:number;
	public fullDesc:any;
	public status: any;
	public Remarks: any;
	
} 
